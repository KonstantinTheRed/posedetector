//Web Libraries
import "@tensorflow/tfjs-backend-webgl";
import * as tfwebgpu from "@tensorflow/tfjs-backend-webgpu";
//

//Platform Agnostic Libraries
import * as tf from "@tensorflow/tfjs-core";
import * as poseDetection from "@tensorflow-models/pose-detection";
import Webcam from "react-webcam";
//
export type DeviceTypes = "webgpu" | "cpu" | "wasm";
export interface PoseModel {
  device: DeviceTypes;
  model?: poseDetection.SupportedModels;
  detector?: poseDetection.PoseDetector;
  source?: HTMLVideoElement;
}

export const SkeletonMap = {
  // Head and torso connections
  leftShoulder_to_rightShoulder: [11, 12],
  leftShoulder_to_leftHip: [11, 23],
  rightShoulder_to_rightHip: [12, 24],
  leftHip_to_rightHip: [23, 24],

  // Arm connections
  leftShoulder_to_leftElbow: [11, 13],
  leftElbow_to_leftWrist: [13, 15],
  rightShoulder_to_rightElbow: [12, 14],
  rightElbow_to_rightWrist: [14, 16],

  // Leg connections
  leftHip_to_leftKnee: [23, 25],
  leftKnee_to_leftAnkle: [25, 27],
  rightHip_to_rightKnee: [24, 26],
  rightKnee_to_rightAnkle: [26, 28],

  // Feet connections
  leftAnkle_to_leftHeel: [27, 29],
  leftAnkle_to_leftToe: [27, 31],
  rightAnkle_to_rightHeel: [28, 30],
  rightAnkle_to_rightToe: [28, 32],

  // Hand connections (a few examples)
  leftWrist_to_leftPinky: [15, 17],
  leftWrist_to_leftIndex: [15, 19],
  rightWrist_to_rightPinky: [16, 18],
  rightWrist_to_rightIndex: [16, 20],
};

export async function initializeModel(source: HTMLVideoElement) {
  //Check Accessible Hardware
  await tf.ready();
  const device = tf.getBackend() as DeviceTypes;
  console.log(device);

  //Configure Model
  const model = poseDetection.SupportedModels.BlazePose;

  //Configure Detector
  const detectorConfig = {
    runtime: "tfjs",
    enableSmoothing: true,
    modelType: "full",
  };

  const detector = await poseDetection.createDetector(model, detectorConfig);
  if (!detector) throw Error("Cannot inititialize detector.");
  return {
    device: device,
    model: model,
    detector: detector,
    source: source,
  };
}
//Platform Specific
interface Camera {
  video: HTMLVideoElement;
}
//
export async function getCameraFeed(CameraRef: React.RefObject<null>) {
  if (!CameraRef.current) return;

  const Camera = CameraRef.current as Camera;
  //Platform Specific

  const source = (await new Promise((res) => {
    Camera.video.onloadeddata = () => {
      console.log("Camera Active");
      res(Camera.video);
    };
  })) as HTMLVideoElement;

  return source;
  //
}
