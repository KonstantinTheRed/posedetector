//MOBILE AND WEB COMPONENT
import { View, StyleSheet } from "react-native";
import * as PoseDetection from "@tensorflow-models/pose-detection";
import { DeviceTypes } from "@/lib/PoseEngine";
import CameraFeed from "./CameraFeed";
import PoseOverlay from "./PoseOverlay";
//

interface PoseFeedProps {
  CameraRef: React.RefObject<null>;
  source?: HTMLVideoElement;
  detector?: PoseDetection.PoseDetector;
  modelClass?: any;
}

export default function PoseFeed(props: PoseFeedProps) {
  return (
    <View style={styles.Container}>
      <PoseOverlay
        detector={props?.detector}
        source={props.source}
        modelClass={props?.modelClass}
      />
      <CameraFeed CameraRef={props.CameraRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    position: "relative",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
