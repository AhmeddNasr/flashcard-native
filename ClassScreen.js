import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import theme from "./theme";
import { useEffect, useReducer, useState } from "react";
import Flashcard from "./Flashcard";
import { MaterialIcons } from "@expo/vector-icons";
import FlashcardControl from "./utils/FlashcardControl";
import { useIsFocused } from "@react-navigation/native";

const db = SQLite.openDatabase("db.db");

function ClassScreen({ navigation, route }) {
  const [frontVisible, setFrontVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardData, setCardData] = useState([]);
  const [originalCardData, setOriginalCardData] = useState([]);
  const [ready, setReady] = useState(false);
  const [isEmptyClass, setIsEmptyClass] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const isFocused = useIsFocused();
  // fetch cards from database
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cards WHERE class_id = ?",
        [route.params.id],
        (txObj, resultSet) => {
          if (resultSet.rows._array.length === 0) {
            setIsEmptyClass(true);
            setReady(true);
          } else {
            let cardData = resultSet.rows._array;
            setOriginalCardData([...cardData]);
            setCardData(cardData);
            setReady(true);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  }, [isFocused]);

  //TODO repeatcards?
  const incrementFlashcardIndex = (correct) => {
    setFrontVisible(true);
    if (!correct) {
      let tempArr = cardData;
      tempArr.push(cardData[currentIndex]);
      setCardData(tempArr);
    }
    if (currentIndex === cardData.length - 1) {
      setCardData([...originalCardData]);
      return setCurrentIndex(0);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const decrementFlashcardIndex = () => {
    if (currentIndex == 0) {
      return;
    }
    setCurrentIndex(currentIndex - 1);
    setFrontVisible(true);
  };

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
        <Flashcard
          data={cardData[currentIndex]}
          setCurrentIndex={setCurrentIndex}
          frontVisible={frontVisible}
          setFrontVisible={setFrontVisible}
        />
        <Text style={{ textAlign: "center", padding: 10, ...styles.text }}>
          {currentIndex + 1} / {cardData.length}
        </Text>
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
