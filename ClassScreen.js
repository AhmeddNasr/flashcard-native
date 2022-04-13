import { StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import theme from "./theme";
import { useEffect } from "react";

const db = SQLite.openDatabase("db.db");

function ClassScreen({ navigation, route }) {
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cards WHERE class_id = ?",
        [route.params.id],
        (txObj, resultSet) => {
          if (resultSet.rows.length === 0) {
            console.log("empty class!");
            navigation.navigate("Edit", { id: route.params.id });
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>this is {route.params.id} profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.BACKGROUND_COLOR,
    flex: 1,
  },
  text: {
    color: theme.TEXT_COLOR,
  },
});

export default ClassScreen;
