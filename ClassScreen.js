import { Pressable, StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import theme from "./theme";
import { useEffect, useState } from "react";
import { Button } from "@rneui/themed";
import Flashcard from "./Flashcard";
import { MaterialIcons } from "@expo/vector-icons";
import FlashcardControl from "./utils/FlashcardControl";
import { TouchableOpacity } from "react-native-gesture-handler";

const db = SQLite.openDatabase("db.db");

function ClassScreen({ navigation, route }) {
  const [frontVisible, setFrontVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardData, setCardData] = useState([]);
  const [originalCardData, setOriginalCardData] = useState([]);
  const [ready, setReady] = useState(false);
  //TODO
  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "SELECT * FROM cards WHERE class_id = ?",
  //       [route.params.id],
  //       (txObj, resultSet) => {
  //         if (resultSet.rows.length === 0) {
  //           console.log("empty class!");
  //           // navigation.navigate("Edit", { id: route.params.id });
  //         }
  //       },
  //       (txObj, error) => console.log(error)
  //     );
  //   });
  // }, []);

  useEffect(() => {
    let cardData = [
      {
        question_text: `question 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
        answer_text: "answer 5",
      },
      {
        question_text: "question 1",
        question_image:
          "https://static.remove.bg/remove-bg-web/5cc729f2c60683544f035949b665ce17223fd2ec/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png",
        answer_text: "answer 1",
      },
      {
        question_text: "question 1",
        answer_text: "answer 1",
        answer_image:
          "https://d5nunyagcicgy.cloudfront.net/external_assets/hero_examples/hair_beach_v391182663/original.jpeg",
      },
      {
        question_text: "question 1",
        question_image:
          "https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg",
        answer_text: "answer 1",
        answer_image:
          "https://assets-global.website-files.com/5a016d51240da900013d2ea2/5fc8e1f4bc8a02aecf06f035_eyeem-23716958-121079333-(1)%20(1).png",
      },
      {
        question_text: "question 12",
        answer_text: "answer 2",
      },
      {
        question_text: "question 3",
        answer_text: "answer 3",
      },
      {
        question_text: "question 4",
        answer_text: "answer 4",
      },
    ];
    setOriginalCardData([...cardData]);
    setCardData(cardData);
    setReady(true);
  }, []);

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
      <Pressable style={{ flex: 1, maxHeight: 50 }}>
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
    // backgroundColor: theme.PRIMARY_COLOR,
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
