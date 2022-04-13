import styles from "./styles";
import { Text, View, Button, StyleSheet, FlatList } from "react-native";
import Card from "./utils/Card";

const renderCard = ({ item }, navigation) => (
  <View style={{ margin: 10 }}>
    <Card
      // onPress={() => {
      //   console.log(navigation);
      //   navigation.navigate("Profile", { id: item.key });
      // }}
      id={item.id}
      navigation={navigation}
      title="hi"
    >
      {item.name}
    </Card>
  </View>
);

const data = [
  { name: "card 1", key: 1, id: 1 },
  { name: "card 2", key: 2, id: 2 },
  { name: "card 3", key: 3, id: 3 },
  { name: "card 4", key: 4, id: 4 },
  { name: "card 5", key: 5, id: 5 },
];

function HomeScreen({ navigation }) {
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
        renderItem={(item) => renderCard(item, navigation)}
        // showsVerticalScrollIndicator={false}
      />
      {/* <Button title="Go to profile" onPress={() => console.log("hi")} /> */}
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
    // backgroundColor: "pink",
    padding: 5,
  },
});

export default HomeScreen;
