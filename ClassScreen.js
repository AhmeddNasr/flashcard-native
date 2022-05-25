import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import theme from "./theme";
import { useEffect, useState } from "react";
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
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
const db = SQLite.openDatabase("db.db");

function ClassScreen({ navigation, route }) {
  const [frontVisible, setFrontVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardData, setCardData] = useState([]);
  const [originalCardData, setOriginalCardData] = useState([]);
  const [ready, setReady] = useState(false);
  const [isEmptyClass, setIsEmptyClass] = useState(false);
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

  const slideAnimationSpringConfig = {
    stiffness: 200,
    damping: 17,
  };

  // card slide animation
  useEffect(() => {
    slideAnimation.value = withSpring(currentIndex, slideAnimationSpringConfig);
  }, [currentIndex]);

  //Go to next card or the beginning if its the last card
  const incrementFlashcardIndex = (correct) => {
    setFrontVisible(true);
    // push current card to the end of array if user didn't answer correctly
    if (!correct) {
      let tempArr = cardData;
      tempArr.push(cardData[currentIndex]);
      setCardData(tempArr);
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

  // Go to the previous card
  const decrementFlashcardIndex = () => {
    if (currentIndex == 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
    setFrontVisible(true);
  };

  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart: (_, ctx) => {
        if (slideAnimation.value < 0) {
          slideAnimation.value = 0;
        } else if (slideAnimation.value >= cardData.length - 1) {
          slideAnimation.value = cardData.length - 1;
        }
        ctx.startX = slideAnimation.value;
      },
      onActive: (event, ctx) => {
        slideAnimation.value = ctx.startX - event.translationX / screenWidth;
      },
      onEnd: (_, ctx) => {
        if (slideAnimation.value - ctx.startX > 0.15) {
          slideAnimation.value = withSpring(
            Math.floor(ctx.startX + 1),
            slideAnimationSpringConfig
          );
          if (currentIndex < cardData.length - 1) {
            runOnJS(incrementFlashcardIndex)(true);
          }
        } else if (slideAnimation.value - ctx.startX < -0.15) {
          slideAnimation.value = withSpring(
            Math.floor(ctx.startX - 1),
            slideAnimationSpringConfig
          );
          runOnJS(decrementFlashcardIndex)();
        } else {
          slideAnimation.value = withSpring(
            Math.floor(ctx.startX),
            slideAnimationSpringConfig
          );
        }
      },
    },
    [slideAnimation, cardData]
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
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                flexDirection: "row",
                flex: 1,
              },
              slideAnimationStyle,
            ]}
          >
            {cardData.map((card, index) => (
              <View style={{ marginRight: 20 }} key={index}>
                <Flashcard
                  data={card}
                  setCurrentIndex={setCurrentIndex}
                  frontVisible={frontVisible}
                  setFrontVisible={setFrontVisible}
                  currentIndex={currentIndex}
                  index={index}
                />
              </View>
            ))}
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
      <View style={styles.controlContainer}>
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
      </View>
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
