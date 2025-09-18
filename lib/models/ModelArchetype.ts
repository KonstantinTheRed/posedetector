export interface PoseModel {
  config: any;
  model: string;

  initialize(): Promise<any>;
  getDeviceType(): string;
  getDetector(): Promise<any>;
}
