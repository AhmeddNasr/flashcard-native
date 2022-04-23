import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import theme from "./theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Flashcard(props) {
  const question = props.data.question_text;
  const questionImage = props.data.question_image;
  const answer = props.data.answer_text;
  const answerImage = props.data.answer_image;

  return (
    <View style={styles.card}>
      <KeyboardAwareScrollView>
        <View style={styles.innerCard}>
          {/* Front side */}
          <View>
            {props.frontVisible && (
              <View>
                {questionImage && (
                  <Image
                    source={{
                      uri: questionImage,
                    }}
                    style={styles.image}
                  />
                )}
                <Text style={styles.text}>{question}</Text>
              </View>
            )}
            {/* Back side */}
            {!props.frontVisible && (
              <View>
                {answerImage && (
                  <Image
                    source={{
                      uri: answerImage,
                    }}
                    style={styles.image}
                  />
                )}
                <Text style={styles.text}>{answer}</Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 15,
    maxHeight: 400,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
