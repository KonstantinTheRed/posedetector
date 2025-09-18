//MOBILE AND WEB COMPONENT
import { View, Text, StyleSheet } from "react-native";
import * as PoseDetection from "@tensorflow-models/pose-detection";
//

interface PoseOverlayProps {
  source?: HTMLVideoElement;
  detector?: PoseDetection.PoseDetector;
  modelClass?: any;
}

export default function PoseOverlay(props: PoseOverlayProps) {
  //MOBILE AND WEB COMPONENT
  let Overlay = OverlayPending;
  if (props.source) {
    console.log(props.modelClass.Overlay);
    Overlay = props.modelClass.Overlay;
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
});
