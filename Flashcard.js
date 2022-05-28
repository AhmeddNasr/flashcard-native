import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import theme from "./theme";

function InnerFlashcard(props) {
  return (
    <Animated.View
      collapsable={false}
      style={[
        styles.card,
        styles.cardFront,
        props.flipToStyle,
        props.hideStyle,
        props.borderStyle,
      ]}
    >
      <ScrollView
        alwaysBounceVertical={false}
        // contentContainerStyle={styles.scrollView}
        centerContent={true}
        persistentScrollbar={true}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.innerCard}>
          {/* Front side */}
          {props.image && (
            <Image
              source={{
                uri: props.image,
              }}
              style={styles.image}
            />
          )}
          <Text style={styles.text}>{props.text ? props.text : ""}</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

export default function Flashcard(props) {
  const question = props.data.question_text;
  const questionImage = props.data.question_image;
  const answer = props.data.answer_text;
  const answerImage = props.data.answer_image;
  Animated.addWhitelistedNativeProps({ display: true });
  const flipAnimation = useSharedValue(0);

  useEffect(() => {
    flipAnimation.value = 0;
  }, [props.currentIndex]);

  useEffect(() => {
    if (props.currentIndex != props.index) {
      return;
    }
    if (props.frontVisible) {
      flipToFront();
    } else {
      flipToBack();
    }
  }, [props.frontVisible]);

  const springConfig = {
    stiffness: 80,
    damping: 11,
  };

  const flipToBack = () => {
    flipAnimation.value = withSpring(180, springConfig);
  };

  const flipToFront = () => {
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
      display: !props.frontVisible
        ? `${flipAnimation.value >= 90 ? "flex" : "none"}`
        : `${flipAnimation.value < 90 ? "none" : "flex"}`,
    };
  }, [props.frontVisible]);

  const hideBackStyle = useAnimatedStyle(() => {
    return {
      display: !props.frontVisible
        ? `${flipAnimation.value > 90 ? "none" : "flex"}`
        : `${flipAnimation.value <= 90 ? "flex" : "none"}`,
    };
  }, [props.frontVisible]);

  return (
    <View style={styles.cardWrapper}>
      <InnerFlashcard
        hideStyle={hideBackStyle}
        flipToStyle={flipToFrontStyle}
        text={question}
        image={questionImage}
        borderStyle={
          props.index <= props.currentIndex ? props.borderStyle : null
        }
      />
      <InnerFlashcard
        hideStyle={hideFrontStyle}
        flipToStyle={flipToBackStyle}
        text={answer}
        image={answerImage}
        borderStyle={
          props.index <= props.currentIndex ? props.borderStyle : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    width: Dimensions.get("screen").width - 40,
  },
  card: {
    padding: 20,
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 15,
    flex: 1,
    borderWidth: 4,
    borderColor: theme.PRIMARY_COLOR,
  },
  scrollView: {
    // backgroundColor: "pink",
  },
  cardFront: {
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backfaceVisibility: "hidden",
  },
  innerCard: {
    flex: 1,
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
