import React, { useState, useEffect } from "react";
import { PanResponder, View, Animated, Text } from "react-native";
import Resize from "./Resize";
import theme from "./theme";
import { BoxShadow } from "react-native-shadow";

export default function Test() {
  // const [dragging, setDragging] = React.useState(false);
  // const [topOffSet, setTopOffSet] = React.useState(0);
  // console.log(topOffSet);
  const [picture, setPicture] = useState({});
  const [height, setHeight] = useState(300);
  const [width, setWidth] = useState(200);
  // const [cropBox, setCropBox] = useState({});
  const [maxCoordinates, setMaxCoordinates] = useState({ x: 0, y: 0 });
  const [maxDimensions, setMaxDimensions] = useState({});

  const panX = React.useRef(new Animated.Value(0)).current;
  const panY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setMaxDimensions({
      maxHeight: picture.height,
      maxWidth: picture.width,
    });
    // console.log(picture.height - height);
    // setMaxCoordinates({
    //   x: picture.width - width,
    //   y: picture.height - height,
    // });
  }, [picture]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
          // pan.setOffset(pan.__getValue());
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
        onPanResponderRelease: () => {
          let x = panX.__getValue();
          let y = panY.__getValue();
          if (x > maxCoordinates.x) {
            x = maxCoordinates.x;
          } else if (x < 0) {
            x = 0;
          }
          if (y > maxCoordinates.y) {
            y = maxCoordinates.y;
          } else if (y < 0) {
            y = 0;
          }
          panX.setOffset(x);
          panY.setOffset(y);
          panX.setValue(0);
          panY.setValue(0);
          setMaxDimensions({
            maxWidth: picture.width - panX.__getValue(),
            maxHeight: picture.height - panY.__getValue(),
          });
        },
        // onPanResponderTerminationRequest: (evt, gestureState) => true,
      }),
    [maxCoordinates, picture]
  );

  const boundX = panX.interpolate({
    inputRange: [0, maxCoordinates.x, Infinity],
    outputRange: [0, maxCoordinates.x, maxCoordinates.x],
    extrapolate: "clamp",
  });

  const boundY = panY.interpolate({
    inputRange: [0, maxCoordinates.y, Infinity],
    outputRange: [0, maxCoordinates.y, maxCoordinates.y],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 50 }}>
      <View
        style={{
          backgroundColor: "yellow",
          flex: 1,
          width: 290,
          height: 600,
          // overflow: "hidden",
        }}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          // setMaxDimensions({
          //   maxWidth: layout.width,
          //   maxHeight: layout.height,
          //   // pictureX: layout.x,
          //   // pictureY: layout.y,
          // });
          setPicture({
            height: layout.height,
            width: layout.width,
          });
        }}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            backgroundColor: "rgba(255,255,255,0.6)",
            borderColor: theme.TEXT_COLOR,
            borderWidth: 2,
            left: boundX,
            top: boundY,
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
            setMaxCoordinates={setMaxCoordinates}
            picture={picture}
          />
        </Animated.View>
      </View>
      {/* <Text>hi</Text> */}
    </View>
  );
}
