import { View, StyleSheet } from "react-native";
import Webcam from "react-webcam";
export default function PoseFeed() {
  return (
    <View style={styles.Container}>
      <Webcam audio={false} style={styles.webcam} />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: "100%",
  },
  webcam: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
