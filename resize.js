import React, { useRef, useState, useMemo } from "react";
import { PanResponder, View, Animated, Text } from "react-native";
import theme from "./theme";

export default function Resize(props) {
  // const [dragging, setDragging] = useState(false);
  // const [topOffSet, setTopOffSet] = useState(0);
  // console.log(topOffSet);
  let { maxHeight, maxWidth } = props.maxDimensions;
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
          // pan.setOffset(pan.__getValue());
          // pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (evt, gestureState) => {
          // console.log(gestureState);
          // console.log(props.height - gestureState.dy);
          props.setHeight(
            props.height + gestureState.dy < 90
              ? 90
              : props.height + gestureState.dy > maxHeight
              ? maxHeight
              : props.height + gestureState.dy
          );
          props.setWidth(
            props.width + gestureState.dx < 100
              ? 100
              : props.width + gestureState.dx > maxWidth
              ? maxWidth
              : props.width + gestureState.dx
          );
        },
        onPanResponderRelease: () => {
          // Animated.flattenOffset();
        },
        // onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
          // pan.flattenOffset();
        },
      }),
    [props.height, props.width, props.maxDimensions]
  );

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        width: 50,
        height: 60,
        top: 10,
        left: 10,
        zIndex: 3,
        opacity: 1,
      }}
    >
      <View
        {...panResponder.panHandlers}
        style={{
          width: 35,
          height: 35,
          top: 15,
          left: 10,
          backgroundColor: theme.ACCENT_COLOR,
          borderRadius: 25,
        }}
      />
    </View>
  );
}
