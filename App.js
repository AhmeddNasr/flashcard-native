import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import MyAppBar from "./MyAppBar";
// import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import HomeScreen from "./HomeScreen";
import styles from "./styles";
// import Class from "./ClassScreen";
import theme from "./theme";
import CreateClass from "./CreateClass";
import CameraScreen from "./CameraScreen";
import Test from "./Test";
import CropView from "./CropView";
import ClassScreen from "./ClassScreen";
import * as SQLite from "expo-sqlite";
import EditClass from "./EditClass";

const db = SQLite.openDatabase("db.db");

const Stack = createStackNavigator();
export default function App() {
  //initialize db tables
  useEffect(() => {
    console.log("App.js useEffect ran :)");
    db.exec(
      [{ sql: "PRAGMA foreign_keys = ON;", args: [] }],
      false,
      (error, resultSet) => {}
    );
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)",
        [],
        (txObj, resultSet) => {
          // console.log(resultSet);
        },
        (txObj, error) => {
          console.log(error);
        }
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER REFERENCES classes(id), question_text TEXT, question_image TEXT, answer_text TEXT, answer_image TEXT)",
        [],
        (txObj, resultSet) => {
          // console.log(resultSet);
        },
        (txObj, error) => {
          console.log("error :", error);
        }
      );
    });
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.BACKGROUND_COLOR,
    },
  };

  // return null;
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        // theme={MyTheme}
        screenOptions={{
          header: (props) => <MyAppBar {...props} />,
          // ...TransitionPresets.SlideFromRightIOS,
          headerMode: "screen",
        }}
      >
        <Stack.Screen name="Create" component={CreateClass} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Edit" component={EditClass} />
        <Stack.Screen name="Crop" component={CropView} />
        <Stack.Screen name="Class" component={ClassScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
