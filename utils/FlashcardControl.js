import { Pressable, StyleSheet, Text, View } from "react-native";
import theme from "../theme";

export default function FlashcardControl(props) {
  return (
    <Pressable
      onPress={() => props.action()}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.3 : 1,
          padding: 20,
        },
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        {props.children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: theme.TEXT_COLOR,
    marginBottom: 10,
  },
});
