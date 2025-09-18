//MOBILE AND WEB COMPONENT
import { View, StyleSheet } from "react-native";
import * as PoseDetection from "@tensorflow-models/pose-detection";
import { DeviceTypes, SkeletonMap } from "@/lib/PoseEngine";
import CameraFeed from "./CameraFeed";
import PoseOverlay from "./PoseOverlay";
//

interface PoseFeedProps {
  CameraRef: React.RefObject<null>;
  source?: HTMLVideoElement;
  device: DeviceTypes;
  detector?: PoseDetection.PoseDetector;
}

export default function PoseFeed(props: PoseFeedProps) {
  return (
    <View style={styles.Container}>
           {" "}
      <PoseOverlay
        device={props.device}
        detector={props?.detector}
        source={props.source}
      />
            <CameraFeed CameraRef={props.CameraRef} />   {" "}
    </View>
  );
}

interface PoseOverlayProps {
  source?: HTMLVideoElement;
  device?: DeviceTypes;
  detector?: PoseDetection.PoseDetector;
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
