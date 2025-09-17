import { DimensionValue, StyleSheet, View } from "react-native";
import Video from "react-native-video";
type Props = {
  height: DimensionValue;
  width: DimensionValue;
  flex?: number;
  borderColor?: string;
};
export function CameraFeed(props: Props) {
  return (
    <View
      style={[
        styles.Viewport,
        {
          height: props.height,
          width: props.width,
          flex: props.flex,
          borderColor: props.borderColor || "#005ddeff",
        },
      ]}
    >
      <Video
        source={require("./my-video.mp4")} // Your local video file
        style={styles.VideoPlayer}
        resizeMode="contain" // Adjust how the video fits its container
        controls={true} // Display playback controls (play/pause, seek bar)
      />
    </View>
  );
}
const styles = StyleSheet.create({
  Viewport: {
    backgroundColor: "black",
    borderRadius: "10px",

    borderWidth: 3,
  },
  VideoPlayer: {
    flex: 1,
    width: "100%",
  },
});
