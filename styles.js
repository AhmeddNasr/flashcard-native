import { StyleSheet } from "react-native";
import theme from "./theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.TEXT_COLOR,
  },
  darkBackground: {
    backgroundColor: theme.BACKGROUND_COLOR,
  },
});

export default styles;
