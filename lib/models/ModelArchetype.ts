import { DeviceTypes } from "../PoseEngine";

export interface PoseModel {
  config: any;
  model: string;

  initialize(): Promise<any>;
  getDeviceType(): string;
  getDetector(): Promise<any>;
  getModelClass(): any;
}
export interface PoseOverlayProps {
  CameraRef?: React.RefObject<null>;
  device?: DeviceTypes;
  detector?: any;
  source?: HTMLVideoElement;
}
