import styles from "./styles";
import { Text, View, Button, StyleSheet, FlatList } from "react-native";
import Card from "./utils/Card";

const renderCard = ({ item }) => <Card>{item.name}</Card>;

const data = [
  { name: "card 1", key: 1 },
  { name: "card 2", key: 2 },
  { name: "card 3", key: 3 },
  { name: "card 4", key: 4 },
  { name: "card 5", key: 5 },
];

function ClassScreen({ navigation }) {
  return (
    <View
      style={{
        ...styles.darkBackground,
        ...classStyle.container,
      }}
    >
      <FlatList
        style={classStyle.cardContainer}
        data={data}
        renderItem={renderCard}
      />
      {/* <Button title="Go to profile" onPress={() => console.log("hi")} /> */}
    </View>
  );
}

const classStyle = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    // backgroundColor: "pink",
    padding: 5,
  },
});

export default ClassScreen;
