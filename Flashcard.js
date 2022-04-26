import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import theme from "./theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Flashcard(props) {
  const question = props.data.question_text;
  const questionImage = props.data.question_image;
  const answer = props.data.answer_text;
  const answerImage = props.data.answer_image;
  //STOP HERE
  // TODO
  const flipAnimation = useRef(new Animated.Value(0)).current;
  let flipRotation = 0;
  flipAnimation.addListener(({ value }) => (flipRotation = value));

  useEffect(() => {
    if (props.frontVisible) {
      flipToFront();
    } else {
      flipToBack();
    }
  }, [props.frontVisible]);

  const flipToFront = () => {
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const flipToBack = () => {
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const flipToBackStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.cardWrapper}>
      <Animated.View
        style={{ ...styles.card, ...styles.cardFront, ...flipToBackStyle }}
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
        style={{ ...styles.card, ...styles.cardBack, ...flipToFrontStyle }}
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
    position: "absolute",
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
