import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import theme from "./theme";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Flashcard from "./Flashcard";
import { MaterialIcons } from "@expo/vector-icons";
import FlashcardControl from "./utils/FlashcardControl";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  Extrapolate,
  interpolate,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import { Gesture, PanGestureHandler } from "react-native-gesture-handler";
const db = SQLite.openDatabase("db.db");

function GenerateFlashcards(props) {
  return (
    <React.Fragment>
      {props.cardData.map((card, index) => (
        <View style={{ marginRight: 20 }} key={index}>
          <Flashcard
            data={card}
            slideAnimation={props.slideAnimation}
            slideBorderColorAnimation={props.slideBorderColorAnimatiom}
            index={index}
          />
        </View>
      ))}
    </React.Fragment>
  );
}

const MemoizedGenerateFlashcards = React.memo(GenerateFlashcards);

function ClassScreen({ navigation, route }) {
  const [frontVisible, setFrontVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardData, setCardData] = useState([]);
  const [originalCardData, setOriginalCardData] = useState([]);
  const [ready, setReady] = useState(false);
  const [isEmptyClass, setIsEmptyClass] = useState(false);
  const [flashcardHeight, setFlashcardHeight] = useState(0);
  const isFocused = useIsFocused();
  const screenWidth = Dimensions.get("screen").width;
  // fetch cards from database
  useEffect(() => {
    // prevent fetching when out of focus
    if (!isFocused) {
      return;
    }
    db.transaction((tx) => {
      // setCurrentIndex(0);
      tx.executeSql(
        "SELECT * FROM cards WHERE class_id = ?",
        [route.params.id],
        (txObj, resultSet) => {
          if (resultSet.rows._array.length === 0) {
            setIsEmptyClass(true);
            setReady(true);
          } else {
            let cardData = resultSet.rows._array;
            setCurrentIndex(0);
            setOriginalCardData([...cardData]);
            setCardData(cardData);
            setReady(true);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  }, [isFocused]);

  // fade in and out animation for +1 number
  const fadeAnimation = useSharedValue(0);
  const slideAnimation = useSharedValue(0);
  const slideBorderColorAnimation = useSharedValue(0);

  const fadeInOut = () => {
    "worklet";
    fadeAnimation.value = withSequence(
      withTiming(1, { duration: 250 }),
      withTiming(0, { duration: 2000 })
    );
  };

  const fadeInOutStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnimation.value,
    };
  });

  // card slide animation

  const slideAnimationSpringConfig = {
    stiffness: 130,
    damping: 11,
    mass: 0.35,
  };

  useEffect(() => {
    slideAnimation.value = withSpring(currentIndex, slideAnimationSpringConfig);
    setFrontVisible(true);
  }, [currentIndex]);

  //Go to next card or the beginning if its the last card
  const incrementFlashcardIndex = (correct) => {
    setFrontVisible(true);
    // push current card to the end of array if user didn't answer correctly
    if (!correct) {
      setCardData([...cardData, cardData[currentIndex]]);
      fadeInOut();
    }
    // Go to the begninning and clear cards added when user answer incorrectly
    if (currentIndex === cardData.length - 1) {
      setCurrentIndex(0);
      return setCardData([...originalCardData]);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const slideAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            (-screenWidth + 20) *
            interpolate(
              slideAnimation.value,
              [0, cardData.length - 1],
              [0, cardData.length - 1],
              Extrapolate.CLAMP
            ),
        },
      ],
    };
  });

  // the starting value of slideBorderColorAnimation is always 0,
  // if the user swiped from the bottom half of the card the value will decrease down to -1 (translate to a green color)
  // if the user swiped from the upper half of the card 3 will be added to the value and it will decrease down to 2 (translate to red color)
  // swiping to a previous card will increase the value either from 3 to +3 or from 0 to 1 (translate to primary color i.e. no color)
  const slideBorderColorAnimationStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        slideBorderColorAnimation.value,
        [-1, -0.1, 0, 1, 2, 2.9, 3, 3.1],
        [
          theme.GREEN_COLOR,
          theme.GREEN_COLOR,
          theme.PRIMARY_COLOR,
          theme.PRIMARY_COLOR,
          theme.SECONDARY_COLOR,
          theme.SECONDARY_COLOR,
          theme.PRIMARY_COLOR,
          theme.PRIMARY_COLOR,
        ]
      ),
    };
  });

  // Go to the previous card
  const decrementFlashcardIndex = () => {
    if (currentIndex == 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
    // setFrontVisible(true);
  };

  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart: (event, ctx) => {
        // reset value to 0 if it's lower
        if (slideAnimation.value < 0) {
          slideAnimation.value = 0;
        }
        // reset value to maximum if it's more
        else if (slideAnimation.value >= cardData.length - 1) {
          slideAnimation.value = cardData.length - 1;
        }
        // if user scrolled upper half set correct to 0 (answer was correct)
        // if user scrolled lower half set correct to 3 (answer was incorrect)
        if (event.y / flashcardHeight <= 0.5) {
          ctx.correct = 3;
        } else {
          ctx.correct = 0;
        }
        ctx.startX = slideAnimation.value;
      },
      onActive: (event, ctx) => {
        // set slideAnimation to ratio of screen swiped + original position
        slideAnimation.value = ctx.startX - event.translationX / screenWidth;
        // set set slideBorderColorAnimation to ratio of screen swiped
        slideBorderColorAnimation.value =
          event.translationX / screenWidth + ctx.correct;
      },
      onEnd: (_, ctx) => {
        // next card if ratio swiped was more than 0.15
        if (slideAnimation.value - ctx.startX > 0.1) {
          slideAnimation.value = withSpring(
            Math.floor(ctx.startX + 1),
            slideAnimationSpringConfig,
            // reset border color to primary after swipe animation is complete
            () => {
              slideBorderColorAnimation.value = 0;
              // call incrementFlashcardIndex with true if user swiped from lower half (correct answer), false if not
              if (currentIndex < cardData.length - 1) {
                runOnJS(incrementFlashcardIndex)(ctx.correct !== 3);
              }
            }
          );
          // previous card if ratio swiped was more than 0.15 in negative direction
        } else if (slideAnimation.value - ctx.startX < -0.1) {
          slideAnimation.value = withSpring(
            Math.floor(ctx.startX - 1),
            slideAnimationSpringConfig,
            () => {
              runOnJS(decrementFlashcardIndex)();
            }
          );
        } else {
          // reset card position if swipe was not large enough in either direction
          slideAnimation.value = withSpring(
            Math.floor(ctx.startX),
            slideAnimationSpringConfig
          );
          slideBorderColorAnimation.value = 0;
        }
      },
    },
    [
      slideAnimation,
      cardData,
      incrementFlashcardIndex,
      decrementFlashcardIndex,
      flashcardHeight,
    ]
  );

  if (!ready) {
    return null;
  }

  if (isEmptyClass) {
    return (
      <Button
        style={{ backgroundColor: theme.PRIMARY_COLOR, padding: 50 }}
        title="Add cards"
        onPress={() => navigation.navigate("Edit", { id: route.params.id })}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={gestureHandler}
          activeOffsetX={[-10, 10]}
          failOffsetY={[-10, 10]}
        >
          <Animated.View
            style={[
              {
                flexDirection: "row",
                flex: 1,
              },
              slideAnimationStyle,
            ]}
            onLayout={(event) => {
              if (!!!flashcardHeight) {
                setFlashcardHeight(event.nativeEvent.layout.height);
              }
            }}
          >
            <MemoizedGenerateFlashcards
              cardData={cardData}
              slideAnimation={slideAnimation}
              slideBorderColorAnimatiom={slideBorderColorAnimation}
            />
          </Animated.View>
        </PanGestureHandler>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text style={{ textAlign: "center", padding: 10, ...styles.text }}>
            {currentIndex + 1} / {cardData.length}
          </Text>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: Dimensions.get("window").width / 2 + 14,
                backgroundColor: theme.PRIMARY_COLOR,
                padding: 5,
                borderRadius: 5,
              },
              fadeInOutStyle,
            ]}
          >
            <Text style={styles.text}>+1</Text>
          </Animated.View>
        </View>
      </View>
      {/* <View style={styles.controlContainer}>
        <FlashcardControl title="Back" action={() => decrementFlashcardIndex()}>
          <MaterialIcons
            name="keyboard-arrow-left"
            color={theme.TEXT_COLOR}
            size={theme.FONT_SIZE_FLASHCARD_CONTROL}
            style={styles.controlButton}
          />
        </FlashcardControl>
        <FlashcardControl
          title="Flip"
          action={() => setFrontVisible(!frontVisible)}
        >
          <MaterialIcons
            name="flip"
            color={theme.TEXT_COLOR}
            size={theme.FONT_SIZE_FLASHCARD_CONTROL - 5}
            style={{ ...styles.controlButton, paddingTop: 5 }}
          />
        </FlashcardControl>
        <FlashcardControl
          title="Wrong"
          action={() => incrementFlashcardIndex(false)}
        >
          <MaterialIcons
            name="close"
            color={theme.TEXT_COLOR}
            size={theme.FONT_SIZE_FLASHCARD_CONTROL}
            style={styles.controlButton}
          />
        </FlashcardControl>
        <FlashcardControl
          title="Correct"
          action={() => incrementFlashcardIndex(true)}
        >
          <MaterialIcons
            name="check"
            color={theme.TEXT_COLOR}
            size={theme.FONT_SIZE_FLASHCARD_CONTROL}
            style={styles.controlButton}
          />
        </FlashcardControl>
      </View> */}
      <Pressable
        style={{ flex: 1, maxHeight: 50 }}
        onPress={() => navigation.navigate("Edit", { id: route.params.id })}
      >
        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>Customize Flashcard playlist</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    color: theme.TEXT_COLOR,
  },
  controlContainer: {
    flex: 1,
    maxHeight: 140,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  controlButton: {
    borderRadius: 45,
  },
  viewMoreContainer: {
    backgroundColor: theme.PRIMARY_COLOR,
    flex: 1,
    maxHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  viewMoreText: {
    color: theme.TEXT_COLOR,
  },
  repeatCards: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 10,
    padding: 5,
    color: theme.TEXT_COLOR,
  },
});

export default ClassScreen;
