import React from "react";
import { PanResponder, View, Animated, Text } from "react-native";

export default function Test() {
  // const [dragging, setDragging] = React.useState(false);
  // const [topOffSet, setTopOffSet] = React.useState(0);
  // console.log(topOffSet);
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        pan.setOffset(pan.__getValue());
        // pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x, // x,y are Animated.Value
            dy: pan.y,
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
      onPanResponderRelease: () => {
        // Animated.flattenOffset();
      },
      // onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // pan.flattenOffset();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 50 }}>
      <View style={{ backgroundColor: "yellow", flex: 1 }}>
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            backgroundColor: "pink",
            ...pan.getLayout(),
            height: "50%",
            width: "50%",
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
        ></Animated.View>
      </View>
      {/* <Text>hi</Text> */}
    </View>
  );
}
