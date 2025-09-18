//WEB ONLY COMPONENT
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-converter";
//

//MOBILE AND WEB COMPONENT
import * as tf from "@tensorflow/tfjs-core";
import * as poseDetection from "@tensorflow-models/pose-detection";
//

export type DeviceTypes = "webgpu" | "cpu" | "wasm" | "webgl";
export interface PoseModel {
  device: DeviceTypes;
  model?: poseDetection.SupportedModels;
  detector?: poseDetection.PoseDetector;
  source?: HTMLVideoElement;
}

export const SkeletonMap = {
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

//WEB ONLY COMPONENT
export async function initializeModel(source: HTMLVideoElement) {
  //Check Accessible Hardware
  try {
    await tf.setBackend("webgl");
  } catch {
    await tf.setBackend("cpu");
  }
  await tf.ready();
  const device = tf.getBackend() as DeviceTypes;
  console.log(device);
  //Configure Model

  const model = poseDetection.SupportedModels.MoveNet; //Configure Detector

  const detectorConfig = {
    runtime: "tfjs",
    modelType: "lite",
    enableSmoothing: true,
  };

  const detector = await poseDetection.createDetector(model);
  if (!detector) throw Error("Cannot inititialize detector.");
  return {
    device: device,
    model: model,
    detector: detector,
    source: source,
  } as PoseModel;
}
interface Camera {
  video: HTMLVideoElement;
}
//WEB ONLY COMPONENT
export async function getCameraFeed(CameraRef: React.RefObject<null>) {
  if (!CameraRef.current) return;

  const Camera = CameraRef.current as Camera; //Platform Specific
  const source = (await new Promise((res) => {
    Camera.video.onloadeddata = () => {
      console.log("Camera Active");
      res(Camera.video);
    };
  })) as HTMLVideoElement;
  console.log(source);
  return source;
}
//
