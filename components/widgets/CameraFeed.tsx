//WEB ONLY COMPONENT
import Webcam from "react-webcam";
//

//MOBILE AND WEB COMPONENT
import { StyleSheet } from "react-native";
//
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
  //WEB ONLY COMPONENT
  webcam: {
    position: "absolute",
    objectFit: "cover",
    height: "100%",
  }, //
});
