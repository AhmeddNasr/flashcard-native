import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import theme from "../theme";

export default function FlashcardControl(props) {
  const animated = new Animated.Value(1);

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={() => props.action()}
      onPressIn={fadeIn}
      onPressOut={fadeOut}
    >
      <Animated.View style={{ opacity: animated }}>
        <View style={styles.container}>
          <Text style={styles.title}>{props.title}</Text>
          {props.children}
        </View>
      </Animated.View>
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
