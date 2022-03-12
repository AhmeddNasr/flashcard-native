import React, { useRef, useState, useMemo } from "react";
import { PanResponder, View, Animated, Text } from "react-native";
import theme from "./theme";

export default function Resize(props) {
  // const [dragging, setDragging] = useState(false);
  // const [topOffSet, setTopOffSet] = useState(0);
  // console.log(topOffSet);
  // let { maxHeight, maxWidth } = props.maxDimensions;
  console.log(props.maxDimensions);
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
              : props.height + gestureState.dy > props.maxDimensions.maxHeight
              ? props.maxDimensions.maxHeight
              : props.height + gestureState.dy
          );
          props.setWidth(
            props.width + gestureState.dx < 100
              ? 100
              : props.width + gestureState.dx > props.maxDimensions.maxWidth
              ? props.maxDimensions.maxWidth
              : props.width + gestureState.dx
          );
        },
        onPanResponderRelease: () => {
          let maxX = props.picture.width - props.width;
          let maxY = props.picture.height - props.height;
          console.log({ maxX, maxY });
          props.setMaxCoordinates({
            x: maxX,
            y: maxY,
          });
        },
        // onPanResponderTerminationRequest: (evt, gestureState) => true,
      }),
    [props.height, props.width, props.maxDimensions]
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        padding: 10,
        backgroundColor: "rgba(0,0,0,0)",
        width: 50,
        height: 60,
        top: 10,
        left: 10,
        zIndex: 3,
        opacity: 1,
      }}
    >
      <View
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
