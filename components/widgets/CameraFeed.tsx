//Web Libraries
import Webcam from "react-webcam";
//

import { StyleSheet } from "react-native";
interface CameraFeedProps {
  CameraRef: React.RefObject<null>;
}
export default function CameraFeed(props: CameraFeedProps) {
  return (
    <Webcam
      ref={props.CameraRef}
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode: "user" }}
      style={styles.webcam}
    />
  );
}
const styles = StyleSheet.create({
  //PLATFORM DEPENDENT
  webcam: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  //
});
