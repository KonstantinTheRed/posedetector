import { DimensionValue, StyleSheet, View } from "react-native";

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
    ></View>
  );
}
const styles = StyleSheet.create({
  Viewport: {
    backgroundColor: "black",
    borderRadius: "10px",

    borderWidth: 3,
  },
});
