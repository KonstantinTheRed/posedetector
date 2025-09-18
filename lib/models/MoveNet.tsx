//WEB ONLY COMPONENT
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-converter";
//

//MOBILE AND WEB COMPONENT
import * as tf from "@tensorflow/tfjs-core";
import * as PoseDetection from "@tensorflow-models/pose-detection";
import { DeviceTypes } from "../PoseEngine";
import { PoseModel, PoseOverlayProps } from "./ModelArchetype";
import { StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
//
const DEFAULT_CONFIG = {
  modelType: PoseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  enableSmoothing: true,
};
const ModelType = {
  SINGLEPOSE_LIGHTNING: PoseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  SINGLEPOSE_THUNDER: PoseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  MULTIPOSE_LIGHTNING: PoseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
};

export class MoveNet implements PoseModel {
  config: PoseDetection.ModelConfig;
  model: PoseDetection.SupportedModels;

  static ModelType = ModelType;
  static SkeletonMap = {
    // Face connections
    leftEye_to_leftEar: [1, 3],
    rightEye_to_rightEar: [2, 4],
    nose_to_leftEye: [0, 1],
    nose_to_rightEye: [0, 2], // Torso connections

    leftShoulder_to_rightShoulder: [5, 6],
    leftShoulder_to_leftHip: [5, 11],
    rightShoulder_to_rightHip: [6, 12],
    leftHip_to_rightHip: [11, 12], // Arm connections

    leftShoulder_to_leftElbow: [5, 7],
    leftElbow_to_leftWrist: [7, 9],
    rightShoulder_to_rightElbow: [6, 8],
    rightElbow_to_rightWrist: [8, 10], // Leg connections

    leftHip_to_leftKnee: [11, 13],
    leftKnee_to_leftAnkle: [13, 15],
    rightHip_to_rightKnee: [12, 14],
    rightKnee_to_rightAnkle: [14, 16],
  };

  constructor(config: PoseDetection.MoveNetModelConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.model = PoseDetection.SupportedModels.MoveNet; //Configure Detector
  }

  async initialize() {
    try {
      await tf.setBackend("webgl");
    } catch {
      await tf.setBackend("cpu");
    }
    await tf.ready();
  }
  getDeviceType() {
    const device = tf.getBackend() as DeviceTypes;
    return device;
  }
  getModelType() {
    return this.model;
  }
  getModelClass() {
    return MoveNet;
  }
  async getDetector() {
    const detector = await PoseDetection.createDetector(this.model);
    if (!detector) throw Error("Cannot inititialize detector.");
    return detector;
  }
  static Overlay = Overlay;
}

function drawCanvas(poses: PoseDetection.Pose[], canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Cannot locate canvas context"); // Clear previous drawings

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (poses && poses.length > 0) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint?.score && keypoint.score > 0.5) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }); // Draw skeleton lines using the imported SkeletonMap

      for (const [start, end] of Object.values(MoveNet.SkeletonMap)) {
        const startPoint = pose.keypoints[start];
        const endPoint = pose.keypoints[end];

        if (
          startPoint?.score &&
          startPoint?.score > 0.5 &&
          endPoint?.score &&
          endPoint?.score > 0.5
        ) {
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.strokeStyle = "lime";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });
  }
}

function Overlay(props: PoseOverlayProps) {
  const CanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = CanvasRef.current;

    const source = props.source;
    if (!source) {
      return;
    }

    const detector = props.detector;

    if (!canvas || !detector) {
      return;
    }

    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;

    let animationFrameId: number;

    const renderLoop = async () => {
      const video = source as HTMLVideoElement | null;
      if (
        video &&
        video.readyState >= 3 &&
        video.videoWidth &&
        video.videoWidth
      ) {
        const poses = await detector.estimatePoses(video);
        drawCanvas(poses, canvas);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [props.detector, props.source]);

  return <canvas ref={CanvasRef} style={styles.ActiveOverlay} />;
}
const styles = StyleSheet.create({
  ActiveOverlay: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    objectFit: "contain",
  },
});
