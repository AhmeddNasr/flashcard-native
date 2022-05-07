import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import theme from "../theme";

function ExtraFloatingAction(props) {
  return (
    <Animated.View
      entering={FadeIn.duration(props.enteringDuration)}
      exiting={FadeOut.duration(props.exitingDuration)}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          ...styles.button,
          backgroundColor: props.backgroundColor,
        }}
      >
        <MaterialIcons
          name={props.name}
          style={{ ...styles.icon, color: props.color }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FloatingActionButton() {
  const [expanded, setExpanded] = useState(false);
  const duration = 160;

  const extraActions = [
    {
      backgroundColor: theme.SECONDARY_COLOR,
      name: "delete",
      color: theme.TEXT_COLOR,
    },
    {
      backgroundColor: theme.TEXT_COLOR,
      name: "search",
      color: theme.BACKGROUND_COLOR,
    },
    {
      backgroundColor: theme.TEXT_COLOR,
      name: "keyboard-arrow-down",
      color: theme.BACKGROUND_COLOR,
    },
  ];

  const renderExtraAction = () => {
    return extraActions.map((item, index) => {
      return (
        <ExtraFloatingAction
          name={item.name}
          color={item.color}
          backgroundColor={item.backgroundColor}
          enteringDuration={duration * (extraActions.length - index)}
          exitingDuration={duration * index}
          key={index}
        />
      );
    });
  };

  return (
    <View style={styles.wrapper}>
      {expanded && renderExtraAction()}
      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.button, backgroundColor: theme.PRIMARY_COLOR }}
        onPress={() => setExpanded(!expanded)}
      >
        <MaterialIcons
          name={expanded ? "close" : "more-horiz"}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    color: theme.TEXT_COLOR,
    fontSize: theme.FONT_SIZE_ICON,
  },
});
