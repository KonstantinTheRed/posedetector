//MOBILE AND WEB COMPONENT
import { View, Text, StyleSheet } from "react-native";
import * as PoseDetection from "@tensorflow-models/pose-detection";
import { DeviceTypes } from "@/lib/PoseEngine";
import { useEffect, useRef } from "react";
import { MoveNet } from "@/lib/models/MoveNet";
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
      <Text style={{ color: "white", fontSize: 16 }}>
        Waiting for Camera Feed
      </Text>
    </View>
  );
}

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
        MoveNet.drawCanvas(poses, canvas);
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
