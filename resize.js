import React, { useRef, useState, useMemo } from "react";
import { PanResponder, View, Animated, Text } from "react-native";

export default function Test() {
  // const [dragging, setDragging] = useState(false);
  // const [topOffSet, setTopOffSet] = useState(0);
  // console.log(topOffSet);
  const pan = useRef(new Animated.ValueXY()).current;

  const [height, setHeight] = useState(300);
  const [width, setWidth] = useState(200);

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
          // console.log(height - gestureState.dy);
          setHeight(
            height + gestureState.dy < 90
              ? 90
              : height + gestureState.dy > 600
              ? 600
              : height + gestureState.dy
          );
          setWidth(
            width + gestureState.dx < 100
              ? 100
              : width + gestureState.dx > 300
              ? 300
              : width + gestureState.dx
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
    [height, width]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 50 }}>
      <View style={{ backgroundColor: "yellow", flex: 1 }}>
        <Animated.View
          style={{
            backgroundColor: "pink",
            ...pan.getLayout(),
            height: height,
            width: width,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          // ref={cropView}
          onLayout={(event) => {
            // console.log(event);
            const layout = event.nativeEvent.layout;
            // console.log("height:", layout.height);
            // console.log("width:", layout.width);
            // console.log("x:", layout.x);
            // console.log("y:", layout.y);
          }}
        >
          <View
            {...panResponder.panHandlers}
            style={{
              padding: 10,
              backgroundColor: "cyan",
              width: 50,
              height: 60,
              top: 10,
              left: 10,
            }}
          ></View>
        </Animated.View>
      </View>
      {/* <Text>hi</Text> */}
    </View>
  );
}
