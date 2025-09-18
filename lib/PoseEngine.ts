//WEB ONLY COMPONENT
import { MoveNet } from "./models/MoveNet";
//

export type DeviceTypes = "webgpu" | "cpu" | "wasm" | "webgl";
export interface PoseModel {
  device: DeviceTypes;
  model?: string;
  detector?: any;
  source?: HTMLVideoElement;
}

//WEB ONLY COMPONENT
export async function initializeModel(source: HTMLVideoElement) {
  const model = new MoveNet({
    modelType: MoveNet.ModelType.SINGLEPOSE_THUNDER,
    enableSmoothing: true,
  });
  await model.initialize();
  const PoseModel = {
    device: model.getDeviceType(),
    model: model.getModelType(),
    detector: await model.getDetector(),
    source: source,
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
