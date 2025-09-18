//MOBILE AND WEB COMPONENT
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//

import { VideoFeed } from "@/components/widgets/VideoFeed";
import PoseFeed from "@/components/widgets/PoseFeed";
import {
  getCameraFeed,
  initializeModel,
  PoseModel,
} from "../../lib/PoseEngine";
import { useEffect, useRef, useState } from "react";

//WEB ONLY COMPONENT
import "@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.js";
//

export default function HomeScreen() {
  const CameraRef = useRef(null);
  const [PoseModel, setModel] = useState({
    device: "cpu",
  } as PoseModel);
  const [PoseState, setPoseState] = useState(null);

  useEffect(() => {
    if (PoseModel?.detector) return;
    getCameraFeed(CameraRef).then(async (source) => {
      console.log(source);
      if (!source) throw Error("Cannot access Camera feed.");

      const pose_model = await initializeModel(source);

      const { device, model } = pose_model;
      console.log(pose_model);
      setModel(pose_model);
    });
  }, []);

  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.Header}>
        <View style={styles.WorkoutStatus}>
          <Text style={styles.WorkoutTitle}>Bicep Curls</Text>
          <VideoFeed height="auto" width="100%" flex={8} />
        </View>
        <View style={styles.PerformanceStatus}></View>
      </View>
      <View style={styles.Viewport}>
        <PoseFeed
          CameraRef={CameraRef}
          source={PoseModel?.source}
          device={PoseModel.device}
          detector={PoseModel?.detector}
        />
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
