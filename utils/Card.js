import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme";

function Card(props) {
  return (
    <TouchableOpacity>
      <View style={cardStyle.container}>
        <Text>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const cardStyle = StyleSheet.create({
  container: {
    backgroundColor: theme.PRIMARY_COLOR,
    // maxWidth: 250,
    // maxHeight: 200,
    borderRadius: 15,
    flex: 1,
    // alignItems: "center",
  },
});

export default Card;
