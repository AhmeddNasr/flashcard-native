import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import theme from "./theme";
import { State, TapGestureHandler } from "react-native-gesture-handler";

function InnerFlashcard(props) {
  return (
    <Animated.View
      collapsable={false}
      style={[
        styles.card,
        styles.cardFront,
        props.flipToStyle,
        props.hideStyle,
        // props.borderStyle,
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
  const [isFrontVisible, setIsFrontVisible] = useState(true);
  // const slideAnimation = props.slideAnimation;
  // const slideBorderColorAnimation = props.slideBorderColorAnimation;

  // const slideBorderColorStyle = useAnimatedStyle(() => {
  //   // if (Math.floor(slideAnimation.value) != props.index) {
  //   //   return { borderColor: theme.PRIMARY_COLOR };
  //   // }
  //   return {
  //     borderColor: interpolateColor(
  //       props.slideBorderColorAnimation.value,
  //       [-1, -0.1, 0, 1, 2, 2.9, 3, 3.1],
  //       [
  //         theme.GREEN_COLOR,
  //         theme.GREEN_COLOR,
  //         theme.PRIMARY_COLOR,
  //         theme.PRIMARY_COLOR,
  //         theme.SECONDARY_COLOR,
  //         theme.SECONDARY_COLOR,
  //         theme.PRIMARY_COLOR,
  //         theme.PRIMARY_COLOR,
  //       ]
  //     ),
  //   };
  // });

  useEffect(() => {
    if (isFrontVisible) {
      flipToFront();
    } else {
      flipToBack();
    }
  }, [isFrontVisible]);

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
      display: !isFrontVisible
        ? `${flipAnimation.value >= 90 ? "flex" : "none"}`
        : `${flipAnimation.value < 90 ? "none" : "flex"}`,
    };
  }, [isFrontVisible]);

  const hideBackStyle = useAnimatedStyle(() => {
    return {
      display: !isFrontVisible
        ? `${flipAnimation.value > 90 ? "none" : "flex"}`
        : `${flipAnimation.value <= 90 ? "flex" : "none"}`,
    };
  }, [isFrontVisible]);

  const tapHandler = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setIsFrontVisible(!isFrontVisible);
    }
  };

  return (
    <TapGestureHandler
      onHandlerStateChange={tapHandler}
      maxDeltaX={9}
      maxDeltaY={9}
      maxDurationMs={250}
    >
      <View style={styles.cardWrapper}>
        <InnerFlashcard
          hideStyle={hideBackStyle}
          flipToStyle={flipToFrontStyle}
          text={question}
          image={questionImage}
          // borderStyle={
          //   props.index <= props.currentIndex ? props.borderStyle : null
          // }
          // borderStyle={slideBorderColorStyle}
        />
        <InnerFlashcard
          hideStyle={hideFrontStyle}
          flipToStyle={flipToBackStyle}
          text={answer}
          image={answerImage}
          // borderStyle={
          //   props.index <= props.currentIndex ? props.borderStyle : null
          // }
          // borderStyle={slideBorderColorStyle}
        />
      </View>
    </TapGestureHandler>
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
