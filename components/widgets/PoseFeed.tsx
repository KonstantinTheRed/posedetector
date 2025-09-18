//Platform Agnostic Libraries
import { View, Text, StyleSheet } from "react-native";
import * as PoseDetection from "@tensorflow-models/pose-detection";
import { DeviceTypes, SkeletonMap } from "@/lib/PoseEngine";
import CameraFeed from "./CameraFeed";
import { useEffect, useRef } from "react";

//

interface PoseFeedProps {
  CameraRef: React.RefObject<null>;
  device: DeviceTypes;
  detector?: PoseDetection.PoseDetector;
}

export default function PoseFeed(props: PoseFeedProps) {
  return (
    <View style={styles.Container}>
      <PoseOverlay
        device={props.device}
        detector={props?.detector}
        CameraRef={props.CameraRef}
      />
      <CameraFeed CameraRef={props.CameraRef} />
    </View>
  );
}

interface PoseOverlayProps {
  CameraRef?: React.RefObject<null>;
  device?: DeviceTypes;
  detector?: PoseDetection.PoseDetector;
}

function PoseOverlay(props: PoseOverlayProps) {
  //PLATFORM DEPENDENT
  //Pose Overlay Switch
  let Overlay = OverlayPending;
  if (props.CameraRef?.current) {
    Overlay = ActivePoseOverlay;
  }

  return <Overlay CameraRef={props.CameraRef} detector={props.detector} />;
}

//PLATFORM DEPENDENT
function OverlayPending(props: PoseOverlayProps) {
  return (
    <View style={styles.PendingOverlay}>
      <Text style={{ color: "white", fontSize: 16 }}>
        Waiting for Camera Feed
      </Text>
    </View>
  );
}

const drawCanvas = (
  poses: PoseDetection.Pose[],
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("Cannot locate canvas context");

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // This line is commented out again to make the canvas transparent
  // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw poses if detected
  if (poses && poses.length > 0) {
    poses.forEach((pose) => {
      pose.keypoints.forEach((keypoint) => {
        if (keypoint?.score && keypoint.score > 0.5) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });

      // Draw skeleton lines using the imported SkeletonMap
      for (const [start, end] of Object.values(SkeletonMap)) {
        const startPoint = pose.keypoints[start];
        const endPoint = pose.keypoints[end];

        if (startPoint?.score > 0.5 && endPoint?.score > 0.5) {
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
};

function ActivePoseOverlay(props: PoseOverlayProps) {
  const CanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = CanvasRef.current;
    const CameraRef = props.CameraRef;
    console.log(props.CameraRef);
    if (!props.CameraRef) {
      return;
    }
    if (!props.CameraRef.current) return;

    const detector = props.detector;

    if (!canvas || !detector) {
      return;
    }

    canvas.width = CameraRef.current.video.videoWidth;
    canvas.height = CameraRef.current.video.videoHeight;

    let animationFrameId: number;

    const renderLoop = async () => {
      // FIX: Add check for videoWidth to ensure the frame is fully loaded
      const v = CameraRef.current?.video as HTMLVideoElement | null;
      if (!v || v.readyState < 2 || v.videoWidth === 0 || v.videoHeight === 0) {
        // skip this frame
      } else {
        const poses = await detector.estimatePoses(v);
        console.log("Raw pose output:", poses.length);
        drawCanvas(poses, CameraRef.current?.video, canvas);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [props.detector, props.CameraRef]);

  return (
    <canvas
      ref={CanvasRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 1,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

//

const styles = StyleSheet.create({
  Container: {
    position: "relative",
    flex: 1,
    width: "100%",
  },
  PendingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(7px)",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
