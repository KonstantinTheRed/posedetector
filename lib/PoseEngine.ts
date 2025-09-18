//WEB ONLY COMPONENT
import { MoveNet } from "./models/MoveNet";
import { GoogleLandmarker } from "./models/PoseLandmarker";
//

export type DeviceTypes = "webgpu" | "cpu" | "wasm" | "webgl";
export interface PoseModel {
  device: string;
  model?: string;
  detector?: any;
  source?: HTMLVideoElement;
  modelClass: any;
}

//WEB ONLY COMPONENT
export async function initializeModel(source: HTMLVideoElement) {
  const model = new GoogleLandmarker();
  await model.initialize();
  const PoseModel: PoseModel = {
    device: model.getDeviceType(),
    model: model.getModelType(),
    detector: await model.getDetector(),
    source: source,
    modelClass: model.getModelClass(),
  };
  return PoseModel;
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
