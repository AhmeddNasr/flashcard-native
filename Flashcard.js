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
        {/* Front side */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              <Text style={{ color: theme.TEXT_COLOR }}>{question}</Text>
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
              <Text style={{ color: theme.TEXT_COLOR }}>{answer}</Text>
            </View>
          )}
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
  },
  image: {
    width: 300,
    height: 200,
  },
});
