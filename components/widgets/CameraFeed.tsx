import { DimensionValue, StyleSheet, View } from "react-native";
import Video from "react-native-video";
type Props = {
  height: DimensionValue;
  width: DimensionValue;
  flex?: number;
  borderColor?: string;
};
export function CameraFeed(props: Props) {
  const handleLoad = () => {
    console.log("Video loaded successfully!");
  };

  const handleError = (error: any) => {
    console.log("Video failed to load!", error);
    // Log the error details to see what's wrong
    console.log("Error details:", error.error);
    console.log("Error text:", error.errorText);
  };

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
        source={{ uri: "/videos/bicepcurl.mp4" }}
        style={styles.VideoPlayer}
        resizeMode="contain"
        onLoad={handleLoad}
        onError={handleError}
        volume={0}
        paused={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  Viewport: {
    backgroundColor: "black",
    borderRadius: 10,
    borderWidth: 3,
    overflow: "hidden",
  },
  VideoPlayer: {
    flex: 1,
  },
});
