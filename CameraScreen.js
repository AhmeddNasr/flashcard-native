import { Camera } from "expo-camera";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import theme from "./theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";

function CameraScreen() {
  const camera = useRef(null);
  const snap = () => {
    const options = { quality: 0.5, base64: true, skipProcessing: true };
    if (camera.current) {
      camera.current
        .takePictureAsync(options)
        .then((result) => console.log(result.uri))
        .catch((err) => console.log(err));
      console.log("success");
    }
  };
  return (
    <View style={CameraStyles.container}>
      <View style={CameraStyles.container}>
        <Camera style={CameraStyles.camera} ref={camera} />
      </View>
      <View stlye={CameraStyles.controlsContainer}>
        <TouchableOpacity onPress={() => snap()}>
          <Ionicons
            style={{
              fontSize: theme.FONT_SIZE_LARGE_ICON,
              color: theme.TEXT_COLOR,
            }}
            name="camera"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CameraStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.BACKGROUND_COLOR,
    flex: 1,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
    // flexGrow: 1,
    // flexBasis: 50,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexGrow: 1,
    paddingBottom: 5,
  },
});
export default CameraScreen;
