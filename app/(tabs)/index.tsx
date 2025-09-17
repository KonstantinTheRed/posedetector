import { CameraFeed } from "@/components/widgets/CameraFeed";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.Header}>
        <View style={styles.WorkoutStatus}>
          <Text style={styles.WorkoutTitle}>Bicep Curls</Text>
          <CameraFeed height="auto" width="100%" flex={8} />
        </View>
        <View style={styles.PerformanceStatus}></View>
      </View>
      <View style={styles.Viewport}>
        <Text style={styles.text}>This view fills the remaining height.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
  WorkoutTitle: {
    fontWeight: "700",
    color: "white",
    paddingTop: 0,
    paddingBottom: 6,
  },
  Header: {
    flex: 3,
    backgroundColor: "#031429ff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  WorkoutStatus: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "50%",
    padding: 8,
  },
  PerformanceStatus: {
    height: "100%",
    width: "50%",
  },
  Viewport: {
    flex: 6,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
