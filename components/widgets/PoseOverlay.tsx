//MOBILE AND WEB COMPONENT
import { View, Text, StyleSheet } from "react-native";
import * as PoseDetection from "@tensorflow-models/pose-detection";
import { DeviceTypes, SkeletonMap } from "@/lib/PoseEngine";
import { useEffect, useRef } from "react";
//

interface PoseOverlayProps {
  source?: HTMLVideoElement;
  device?: DeviceTypes;
  detector?: PoseDetection.PoseDetector;
}

export default function PoseOverlay(props: PoseOverlayProps) {
  //MOBILE AND WEB COMPONENT
  let Overlay = OverlayPending;
  if (props.source) {
    Overlay = ActivePoseOverlay;
  }
  return <Overlay source={props.source} detector={props.detector} />;
}

//MOBILE AND WEB COMPONENT
function OverlayPending(props: PoseOverlayProps) {
  return (
    <View style={styles.PendingOverlay}>
           {" "}
      <Text style={{ color: "white", fontSize: 16 }}>
                Waiting for Camera Feed      {" "}
      </Text>
         {" "}
    </View>
  );
}

//WEB ONLY COMPONENT
const drawCanvas = (
  poses: PoseDetection.Pose[],
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
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

      for (const [start, end] of Object.values(SkeletonMap)) {
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
};

//WEB ONLY COMPONENT
function ActivePoseOverlay(props: PoseOverlayProps) {
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
        drawCanvas(poses, source, canvas);
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

//MOBILE AND WEB COMPONENT
const styles = StyleSheet.create({
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
  ActiveOverlay: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    objectFit: "contain",
  },
});
