import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme";

function Card(props) {
  // console.log(props);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        props.navigation.navigate("Profile", { id: props.id });
      }}
    >
      <View style={cardStyle.container}>
        <View>
          <Text style={{ ...cardStyle.text, fontSize: theme.FONT_SIZE_LARGE }}>
            {props.title}
          </Text>
        </View>
        <Text style={{ ...cardStyle.text, fontStyle: "italic" }}>
          {props.children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const cardStyle = StyleSheet.create({
  container: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 6,
    maxWidth: 400,
    padding: 20,
    // margin: 5,
    height: 150,
  },
  text: {
    color: theme.TEXT_COLOR,
  },
});

export default Card;
