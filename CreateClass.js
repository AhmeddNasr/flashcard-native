import { Text, View, Button, StyleSheet, Alert, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
// import styles from "./styles";
import theme from "./theme";
// import IconButton from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
// import * as SQLite from 'expo-sqlite'

// const db = SQLite.openDatabase('db.classes')

function CreateClass({ navigation, route }) {
  const __startCamera = () => {
    Camera.requestCameraPermissionsAsync().then((result) => {
      // console.log(result.status);
      if (result.status == "granted") {
        navigation.navigate("Camera");
        return;
      }
      Alert.alert("Access denied");
    });
  };

  // db.transaction(tx => {
  //   tx.executeSql(
  //     'CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)'
  //   )
  // })

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ name: "", description: "" }}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              placeholder="Class Name"
              placeholderTextColor={theme.TEXT_COLOR_OPACITY}
            />
            <TextInput
              style={styles.input}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              value={values.description}
              placeholder="Class Description"
              placeholderTextColor={theme.TEXT_COLOR_OPACITY}
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
      {/* {console.log(route.params)} */}
      {/* <TouchableHighlight
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
      </TouchableHighlight> */}
      {/* <TouchableHighlight onPress={() => setStartCamera(false)}>
        <Text style={{ color: theme.TEXT_COLOR }}>close camera</Text>
      </TouchableHighlight> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
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
  input: {
    color: theme.TEXT_COLOR,
    padding: 10,
    borderColor: theme.ACCENT_COLOR,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 200,
  },
});

export default CreateClass;
