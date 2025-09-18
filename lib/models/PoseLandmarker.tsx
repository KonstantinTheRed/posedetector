import "@mediapipe/pose";

import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { PoseModel, PoseOverlayProps } from "./ModelArchetype";
import { StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

const DEFAULTCONFIG = {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
    delegate: "GPU",
  },
  runningMode: "VIDEO",
  numPoses: 1,
};
export class GoogleLandmarker implements PoseModel {
  config: any;
  model: any;
  vision: any;
  constructor(config: any = DEFAULTCONFIG) {
    this.config = config;
  }

  async initialize() {
    this.vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
  }
  getDeviceType() {
    return "mediapipe";
  }
  getModelType() {
    return this.model;
  }
  getModelClass() {
    return GoogleLandmarker;
  }
  async getDetector() {
    if (!this.vision) new Error("Cannot find vision model.");
    const detector = await PoseLandmarker.createFromOptions(
      this.vision,
      this.config
    );
    return detector;
  }
  static Overlay = Overlay;
}

function drawCanvas(results: any, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Cannot locate canvas context");

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create an instance of DrawingUtils from the global scope
  const drawingUtils = new DrawingUtils(ctx);

  // Draw poses if detected
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);
      drawingUtils.drawLandmarks(landmarks, {
        radius: (landmark: any) =>
          PoseLandmarker.POSE_CONNECTIONS[
            landmarks.indexOf(landmark)
          ] as unknown as number,
      });
    }
  }
}

function Overlay(props: PoseOverlayProps) {
  const CanvasRef = useRef<HTMLCanvasElement>(null);
  const isProcessing = useRef(false);
  const lastVideoTime = useRef(-1); // Make sure this is a useRef

  useEffect(() => {
    const canvas = CanvasRef.current;
    const CameraRef = props.CameraRef;
    const detector = props.detector;

    if (!canvas || !props.source || !detector) {
      return;
    }

    const video = props.source as HTMLVideoElement;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const renderLoop = () => {
      if (!video) {
        return;
      }

      // Check if the video frame has changed and the model is not busy.
      // Using .current on lastVideoTime
      if (
        video.currentTime !== lastVideoTime.current &&
        !isProcessing.current
      ) {
        isProcessing.current = true;
        lastVideoTime.current = video.currentTime;

        // Use performance.now() as the timestamp
        props.detector.detectForVideo(
          video,
          performance.now(),
          (results: any) => {
            if (!CanvasRef.current) return;
            drawCanvas(results, CanvasRef.current);
            isProcessing.current = false;
          }
        );
      }

      // Continue the loop regardless of whether a frame was processed.
      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }, [props.detector, props.CameraRef]);

  return (
    <canvas
      ref={CanvasRef}
      style={{
        position: "absolute",
        zIndex: 1,
        height: "100%",
      }}
    />
  );
}

//

const styles = StyleSheet.create({});
