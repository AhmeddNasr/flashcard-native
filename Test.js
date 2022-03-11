import React, { useState, useEffect } from "react";
import { PanResponder, View, Animated, Text } from "react-native";
import Resize from "./Resize";

export default function Test() {
  // const [dragging, setDragging] = React.useState(false);
  // const [topOffSet, setTopOffSet] = React.useState(0);
  // console.log(topOffSet);
  const [picture, setPicture] = useState({});
  const [height, setHeight] = useState(300);
  const [width, setWidth] = useState(200);
  // const [cropBox, setCropBox] = useState({});
  const [maxCoordinates, setMaxCoordinates] = useState({ x: 0, y: 0 });
  const [maxDimensions, setMaxDimensions] = useState({
    maxHeight: picture.pictureHeight,
    maxWidth: picture.pictureWidth,
  });

  const panX = React.useRef(new Animated.Value(0)).current;
  const panY = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
          // pan.setOffset(pan.__getValue());
          let x = panX.__getValue();
          let y = panY.__getValue();
          panX.setOffset(x);
          panY.setOffset(y);
          panX.setValue(0);
          panY.setValue(0);
        },
        onPanResponderMove: (e, gesutreState) => {
          return Animated.event(
            [
              null,
              {
                dx: panX, // x,y are Animated.Value
                dy: panY,
              },
            ],
            {
              useNativeDriver: false,
            }
          )(e, gesutreState);
        },
        onPanResponderRelease: () => {},
        // onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
          // The user has released all touches while this view is the
          // responder. This typically means a gesture has succeeded
          // pan.flattenOffset();
        },
      }),
    [maxCoordinates]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 50 }}>
      <View
        style={{
          backgroundColor: "yellow",
          flex: 1,
          width: 290,
          height: 600,
          overflow: "hidden",
        }}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setPicture({
            pictureWidth: layout.width,
            pictureHeight: layout.height,
            pictureX: layout.x,
            pictureY: layout.y,
          });
        }}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            left: panX.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 30],
              extrapolate: "clamp",
            }),
            top: panY.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50],
              extrapolate: "clamp",
            }),
            height: height,
            width: width,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          // ref={cropView}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
          }}
        >
          <Resize
            height={height}
            setHeight={setHeight}
            setWidth={setWidth}
            width={width}
            maxDimensions={maxDimensions}
          />
        </Animated.View>
      </View>
      {/* <Text>hi</Text> */}
    </View>
  );
}
