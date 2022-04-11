import React, { useState, useEffect } from "react";
import {
  PanResponder,
  View,
  Animated,
  Text,
  ImageBackground,
  Button,
} from "react-native";
import Resize from "./Resize";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import theme from "./theme";
import { Asset } from "expo-asset";
// import { BoxShadow } from "react-native-shadow";

export default function Test() {
  //the resize image
  const [picture, setPicture] = useState(null);
  //height and width of crop window
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  //max x,y,height,width of crop window
  const [maxCoordinates, setMaxCoordinates] = useState({ x: 0, y: 0 });
  const [maxDimensions, setMaxDimensions] = useState({});
  //crop window displayed?
  const [cropActive, setCropActive] = useState(false);
  //image loaded?
  const [cropReady, setCropReady] = useState(false);

  const [image, setImage] = useState({
    uri: "https://i0.wp.com/performdigi.com/wp-content/uploads/2019/10/Paragraph-writing-in-english-min.jpg?resize=567%2C342",
    height: 342,
    width: 576,
  });

  // const [imageUri, setImageUri] = useState(
  //   "https://i0.wp.com/performdigi.com/wp-content/uploads/2019/10/Paragraph-writing-in-english-min.jpg?resize=567%2C342"
  // );

  const [aspectRatio, setAspectRatio] = useState(567 / 342);

  //initialize animated values for crop window
  const panX = React.useRef(new Animated.Value(0)).current;
  const panY = React.useRef(new Animated.Value(0)).current;

  //TODO fix this mess
  useEffect(() => {
    if (!picture) {
      return;
    }
    setMaxDimensions({
      maxHeight: picture.height,
      maxWidth: picture.width,
    });
    setMaxCoordinates({
      x: 0,
      y: 0,
    });
    panX.setOffset(0);
    panX.setValue(0);
    panY.setOffset(0);
    panY.setValue(0);
    setWidth(picture.width);
    setHeight(picture.height);
  }, [picture]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
          // pan.setOffset(pan.__getValue());
        },
        onPanResponderMove: (e, gesutreState) => {
          //map crop window x, y to the movement of gesure
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
          //limit offset of crop window x to max x and min x
          if (x > maxCoordinates.x) {
            x = maxCoordinates.x;
          } else if (x < 0) {
            x = 0;
          }
          //limit offset of crop window y to max y, and min y
          if (y > maxCoordinates.y) {
            y = maxCoordinates.y;
          } else if (y < 0) {
            y = 0;
          }
          //setOffset to stop crop window from rubber banding to original location
          panX.setOffset(x);
          panY.setOffset(y);
          panX.setValue(0);
          panY.setValue(0);
          //update max dimensions to correspond with new x, y
          setMaxDimensions({
            maxWidth: picture.width - panX.__getValue(),
            maxHeight: picture.height - panY.__getValue(),
          });
        },
        // onPanResponderTerminationRequest: (evt, gestureState) => true,
      }),
    [maxCoordinates, picture]
  );

  //limited x, y to be used in movement of crop window
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

  //rotate image and reset crop view
  const _rotate = async () => {
    const manipResult = await manipulateAsync(image.uri, [{ rotate: 90 }], {
      compress: 1,
      format: SaveFormat.PNG,
    });
    setAspectRatio(Math.pow(aspectRatio, -1));
    // setImageUri(manipResult.uri);
    setImage(manipResult);
  };

  const _crop = async () => {
    const resizeRatio = image.height / picture.height;
    let adjustedToResizeX = Math.floor(boundX.__getValue() * resizeRatio);
    let adjustedtoResizeY = Math.floor(boundY.__getValue() * resizeRatio);
    let adjustedToResizeWidth = Math.floor(width * resizeRatio);
    let adjustedToResizeHeight = Math.floor(height * resizeRatio);

    let cropConfig = {
      originX: adjustedToResizeX,
      originY: adjustedtoResizeY,
      width: adjustedToResizeWidth,
      height: adjustedToResizeHeight,
    };

    const manipResult = await manipulateAsync(
      image.uri,
      [
        {
          crop: cropConfig,
        },
      ],
      {
        compress: 1,
        format: SaveFormat.PNG,
      }
    );
    setImage(manipResult);
  };

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
            maxHeight: "100%",
            maxWidth: image.width,
            aspectRatio: aspectRatio,
          }}
          source={{
            uri: image.uri,
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
          flexDirection: "row",
        }}
      >
        {/* <Text style={{ color: theme.TEXT_COLOR }}>
          AAAAAAAAAAAAAAAAAAAAAAAA
        </Text> */}
        <Button title="crop" onPress={() => setCropActive(!cropActive)} />
        <Button title="rotate" onPress={() => _rotate()} />
        <Button title="Finish" onPress={() => _crop()} />
      </View>
    </View>
  );
}
