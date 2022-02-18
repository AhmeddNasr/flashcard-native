import { Camera } from "expo-camera";
import { View, Text, StyleSheet } from "react-native";
import theme from "./theme";

function CameraScreen() {
  return (
    <View style={CameraStyles.container}>
      <Camera style={CameraStyles.camera} />
      {/* <View stlye={CameraStyles.cameraControls}>
        <Text>Close camera</Text>
      </View> */}
    </View>
  );
}

const CameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  // cameraControls: {
  //   flex: 1,
  //   height: 100,
  //   width: "100%",
  //   backgroundColor: theme.PRIMARY_COLOR,
  //   padding: 10,
  // },
});
export default CameraScreen;
