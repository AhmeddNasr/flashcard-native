import React, { useState, useEffect } from "react";
import {
  PanResponder,
  View,
  Animated,
  Text,
  ImageBackground,
  Image,
  Button,
} from "react-native";
import Resize from "./Resize";
import theme from "./theme";
// import { BoxShadow } from "react-native-shadow";

export default function Test() {
  // const [dragging, setDragging] = React.useState(false);
  // const [topOffSet, setTopOffSet] = React.useState(0);
  // console.log(topOffSet);
  const [picture, setPicture] = useState({});
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  // const [cropBox, setCropBox] = useState({});
  const [maxCoordinates, setMaxCoordinates] = useState({ x: 0, y: 0 });
  const [maxDimensions, setMaxDimensions] = useState({});
  const [cropActive, setCropActive] = useState(false);
  const [cropReady, setCropReady] = useState(false);

  const panX =
    // : React.useRef(new Animated.Value(picture.x)).current;
    React.useRef(new Animated.Value(0)).current;

  const panY =
    // : React.useRef(new Animated.Value(picture.y)).current;
    React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setMaxDimensions({
      maxHeight: picture.height,
      maxWidth: picture.width,
    });
    // setMaxCoordinates({
    //   x: picture.x,
    //   y: picture.y,
    // });
    (picture && setWidth(picture.width)) || setHeight(picture.height);
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

  console.log(picture.height);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          // backgroundColor: theme.BACKGROUND_COLOR,
          backgroundColor: "yellow",
          padding: 20,
          // width: 290,
          // height: 600,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          resizeMode="contain"
          style={{
            width: "100%",
            backgroundColor: "pink",
            height: undefined,
            width: "100%",
            aspectRatio: 567 / 342,
          }}
          source={{
            uri: "https://i0.wp.com/performdigi.com/wp-content/uploads/2019/10/Paragraph-writing-in-english-min.jpg?resize=567%2C342",
          }}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setPicture({
              height: layout.height,
              width: layout.width,
              x: layout.x,
              y: layout.y,
            });
            setCropReady(true);
          }}
        >
          {cropActive && cropReady && (
            <Animated.View
              {...panResponder.panHandlers}
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                borderColor: theme.ACCENT_COLOR,
                borderWidth: 2,
                left: boundX,
                top: boundY,
                height: height,
                width: width,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
              // ref={cropView}
              // onLayout={(event) => {
              //   const layout = event.nativeEvent.layout;
              // }}
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
          )}
        </ImageBackground>

        {/* <Text>hi</Text> */}
      </View>
      <View
        style={{
          height: 150,
          width: "100%",
          padding: 30,
          backgroundColor: theme.ACCENT_COLOR,
        }}
      >
        <Text style={{ color: theme.TEXT_COLOR }}>
          AAAAAAAAAAAAAAAAAAAAAAAA
        </Text>
        <Button
          title="crop"
          onPress={() => setCropActive(!cropActive)}
        ></Button>
      </View>
    </View>
  );
}
