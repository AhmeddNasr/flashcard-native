import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useRef, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import theme from "./theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { render } from "react-dom";

export default function Flashcard(props) {
  const question = props.data.question_text;
  const questionImage = props.data.question_image;
  const answer = props.data.answer_text;
  const answerImage = props.data.answer_image;
  const [renderFront, setRenderFront] = useState(true);
  //STOP HERE
  // TODO
  Animated.addWhitelistedNativeProps({ display: true });
  const flipAnimation = useSharedValue(0);

  useEffect(() => {
    if (props.frontVisible) {
      flipToBack();
    } else {
      flipToFront();
    }
  }, [props.frontVisible]);

  const springConfig = {
    stiffness: 70,
    damping: 10,
  };

  const flipToFront = () => {
    flipAnimation.value = withSpring(180, springConfig);
  };

  const flipToBack = () => {
    flipAnimation.value = withSpring(0, springConfig);
  };

  const flipToFrontStyle = useAnimatedStyle(() => {
    const interpolated = interpolate(flipAnimation.value, [0, 180], [0, 180]);
    return {
      transform: [
        {
          rotateY: `${interpolated}deg`,
        },
      ],
    };
  });

  const flipToBackStyle = useAnimatedStyle(() => {
    const interpolated = interpolate(flipAnimation.value, [0, 180], [180, 360]);
    return {
      transform: [
        {
          rotateY: `${interpolated}deg`,
        },
      ],
    };
  });

  const hideFrontStyle = useAnimatedStyle(() => {
    return {
      display: props.frontVisible
        ? `${flipAnimation.value >= 90 ? "flex" : "none"}`
        : `${flipAnimation.value < 90 ? "none" : "flex"}`,
    };
  }, [props.frontVisible]);

  const hideBackStyle = useAnimatedStyle(() => {
    return {
      display: props.frontVisible
        ? `${flipAnimation.value > 90 ? "none" : "flex"}`
        : `${flipAnimation.value <= 90 ? "flex" : "none"}`,
    };
  }, [props.frontVisible]);

  // const hideBackStyle = !props.frontVisible
  //   ? // if the back is visible (starts at 180 deg)
  //     flipAnimation.interpolate({
  //       inputRange: [0, 90, 91, 180],
  //       outputRange: [1, 1, 0, 0],
  //     })
  //   : // if the front is visible (starts at 0deg)
  //     flipAnimation.interpolate({
  //       inputRange: [0, 90, 180],
  //       outputRange: [0, 0, 1],
  //     });

  return (
    <View style={styles.cardWrapper}>
      <Animated.View
        collapsable={false}
        style={[styles.card, styles.cardFront, flipToBackStyle, hideFrontStyle]}
      >
        <KeyboardAwareScrollView>
          <View style={styles.innerCard}>
            {/* Front side */}
            <View>
              <View>
                {questionImage && (
                  <Image
                    source={{
                      uri: questionImage,
                    }}
                    style={styles.image}
                  />
                )}
                <Text style={styles.text}>{question ? question : ""}</Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Animated.View>

      <Animated.View
        collapsable={false}
        style={[styles.card, styles.cardFront, flipToFrontStyle, hideBackStyle]}
      >
        <KeyboardAwareScrollView>
          <View style={styles.innerCard}>
            <View>
              {/* Back side */}
              <View>
                {answerImage && (
                  <Image
                    source={{
                      uri: answerImage,
                    }}
                    style={styles.image}
                  />
                )}
                <Text style={styles.text}>{answer ? answer : ""}</Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    maxHeight: 400,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    padding: 20,
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 15,
    maxHeight: 400,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  cardFront: {
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backfaceVisibility: "hidden",
  },
  innerCard: {
    flex: 1,
    minHeight: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
  },
  text: {
    margin: 10,
    color: theme.TEXT_COLOR,
    textAlign: "center",
  },
});
