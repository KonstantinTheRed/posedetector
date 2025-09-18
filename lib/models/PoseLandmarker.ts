import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { PoseModel } from "./ModelArchetype";
export class GoogleLandmarker implements PoseModel {
  config: any;
  model: any;
  vision: any;
  constructor(config: any) {
    this.config = config;
  }

  static drawCanvas(poses: any, canvas: HTMLCanvasElement) {}

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
  async getDetector() {
    if (!this.vision) new Error("Cannot find vision model.");
    const detector = await PoseLandmarker.createFromOptions(
      this.vision,
      this.config
    );
    return detector;
  }
}
