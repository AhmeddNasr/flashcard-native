import styles from "./styles";
import { Text, View, Button, StyleSheet, FlatList } from "react-native";
import Card from "./utils/Card";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

const renderCard = ({ item }, navigation) => (
  <View style={{ margin: 10 }}>
    <Card id={item.id} navigation={navigation} title="hi">
      {item.name}
    </Card>
  </View>
);

function HomeScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [ready, setReady] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM classes",
        [],
        (_, resultSet) => {
          if (resultSet.rows._array.length === 0) {
            return navigation.navigate("Create");
          }
          setClasses(resultSet.rows._array);
          // console.log(resultSet);
          setReady(true);
        },
        (_, error) => {
          console.log("error", error);
        }
      );
    });
  }, [isFocused]);

  return (
    <View
      style={{
        ...styles.darkBackground,
        ...classStyle.container,
      }}
    >
      <FlatList
        style={classStyle.cardContainer}
        data={classes}
        renderItem={(item) => renderCard(item, navigation)}
      />
    </View>
  );
}

const classStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    padding: 5,
  },
});

export default HomeScreen;
