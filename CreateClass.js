import { Text, View, StyleSheet, Alert, TextInput } from "react-native";
import { Button } from "@rneui/themed";
import { MaterialIcons } from "@expo/vector-icons";
// import styles from "./styles";
import theme from "./theme";
// import IconButton from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

function CreateClass({ navigation, route }) {
  // const __startCamera = () => {
  //   Camera.requestCameraPermissionsAsync().then((result) => {
  //     // console.log(result.status);
  //     if (result.status == "granted") {
  //       navigation.navigate("Camera");
  //       return;
  //     }
  //     Alert.alert("Access denied");
  //   });
  // };
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState({});
  // useEffect(() => {
  //   db.transaction((tx) => {

  //   });
  // }, []);

  // for testing
  const clearDb = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE cards",
        (txObj, resultSet) => {
          console.log(resultSet);
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const addClass = ({ name, description }) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO classes (name, description) values (?, ?)",
        [name, description],
        (txObj, resultSet) => {
          setSubmitting(false);
          navigation.navigate("Class", { id: resultSet.insertId });
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ name: "", description: "" }}
        onSubmit={(values) => addClass(values)}
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
            <Button
              onPress={submitting ? handleSubmit : handleSubmit}
              title="Next"
              loading={submitting}
              buttonStyle={{
                backgroundColor: theme.PRIMARY_COLOR,
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        )}
      </Formik>
      <Button title="Clear" onPress={clearDb} />
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
      <Text style={{ color: theme.TEXT_COLOR }}>
        {JSON.stringify(results, null, 2, 0)}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    borderColor: theme.PRIMARY_COLOR,
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
    borderColor: theme.PRIMARY_COLOR,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 16,
    minWidth: 200,
  },
});

export default CreateClass;
