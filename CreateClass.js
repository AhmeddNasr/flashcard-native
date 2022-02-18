import {
  Text,
  View,
  Button,
  TouchableHighlight,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
// import styles from "./styles";
import theme from "./theme";
// import IconButton from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useState } from "react";

function CreateClass({ navigation }) {
  const [startCamera, setStartCamera] = useState(false);

  const __startCamera = () => {
    Camera.requestCameraPermissionsAsync().then((result) => {
      // console.log(result.status);
      if (result.status == "granted") {
        navigation.navigate("Camera");
        setStartCamera(true);
        return;
      }
      Alert.alert("Access denied");
    });
  };

  return (
    <View style={CreateStyles.container}>
      {/* {startCamera && <Camera style={{ flex: 1, width: "100%" }} />} */}
      <TouchableHighlight
        style={CreateStyles.iconButton}
        underlayColor="rgba(155,155,155,0.5)"
        activeOpacity={0.5}
        onPress={() => __startCamera()}
      >
        <MaterialIcons
          name="insert-photo"
          underlayColor="#042417"
          style={{ ...CreateStyles.text, ...CreateStyles.icon }}
        />
      </TouchableHighlight>
      {/* <TouchableHighlight onPress={() => setStartCamera(false)}>
        <Text style={{ color: theme.TEXT_COLOR }}>close camera</Text>
      </TouchableHighlight> */}
      <Text style={CreateStyles.text}>create class</Text>
    </View>
  );
}

const CreateStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.BACKGROUND_COLOR,
    flex: 1,
  },
  text: {
    color: theme.TEXT_COLOR,
    fontSize: theme.FONT_SIZE_LARGE,
  },
  iconButton: {
    padding: 8,
    borderRadius: 5,
  },
  icon: {
    fontSize: theme.FONT_SIZE_ICON,
    color: "rgba(155,155,155,0.8)",
  },
});

export default CreateClass;
