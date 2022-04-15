import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import theme from "./theme";
import * as SQLite from "expo-sqlite";
import { useFormik, FormikProvider, FieldArray, FastField } from "formik";
import { Button } from "@rneui/themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";
import InputWithImage from "./utils/InputWithImage";

export default function EditClass({ route }) {
  const [cardsData, setCardsData] = useState([{ id: -1 }]);
  const [classData, setClassData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [listReady, setListReady] = useState(false);
  const [listArray, setListArray] = useState([]);
  const db = SQLite.openDatabase("db.db");

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "INSERT INTO cards (question_text, answer_text, class_id) values ('first question', 'first answer', (?))",
  //       [route.params.id],
  //       (txObj, resultSet) => {
  //         console.log(resultSet);
  //       },
  //       (txObj, error) => {
  //         console.log(error);
  //       }
  //     );
  //   });
  // }, []);

  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql(
      //   "SELECT * FROM cards WHERE class_id = ?",
      //   [route.params.id],
      //   (_, resultSet) => {
      //     setCardsData(resultSet.rows._array);
      //   },
      //   (_, error) => console.log(error)
      // );
      tx.executeSql(
        "SELECT * FROM classes WHERE id = ?",
        [route.params.id],
        (_, resultSet) => {
          setClassData(resultSet.rows.item(0));
          // console.log(resultSet);
          // setInitialValuesArray(classDataArray.concat(cardsData));
          setListReady(true);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  }, []);

  //
  useEffect(() => {
    setCardsData([
      {
        question_text: "question 1",
        answer_text: "answer 1",
        id: "1",
      },
      {
        question_text: "question 1",
        answer_text: "answer 1",
        id: "2",
      },
      {
        question_text: "question 1",
        answer_text: "answer 1",
        id: "3",
      },
      {
        question_text: "question 1",
        answer_text: "answer 1",
        id: "4",
      },
    ]);
  }, []);

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      // name: classData.name,
      // description: classData.description,
      cards: cardsData,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      return;
    },
  });

  if (!listReady) {
    return null;
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <FormikProvider value={formik}>
          {/* class info section */}
          <View style={styles.header}>
            <Text style={styles.header_text}>Class Info</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            placeholder="Class Name"
            placeholderTextColor={theme.TEXT_COLOR_OPACITY}
          />
          <TextInput
            style={styles.input}
            onChangeText={formik.handleChange("description")}
            onBlur={formik.handleBlur("description")}
            value={formik.values.description}
            placeholder="Class Description"
            placeholderTextColor={theme.TEXT_COLOR_OPACITY}
            multiline
          />

          {/* Cards section */}
          <View style={styles.header}>
            <Text style={styles.header_text}>Cards (41)</Text>
          </View>

          <FieldArray
            name="cards"
            render={(arrayHelpers) => {
              // if (formik.values.cards.length === 0) {
              //   arrayHelpers.push({});
              // }
              return formik.values.cards.map((item, index) => {
                let card = `cards.${index}`;
                //TODO DRY
                return (
                  <View style={styles.card_block} key={item.id}>
                    <InputWithImage
                      type="question"
                      index={index}
                      formik={formik}
                      item={item}
                      card={card}
                    />
                    <InputWithImage
                      type="answer"
                      index={index}
                      formik={formik}
                      item={item}
                      card={card}
                    />
                  </View>
                );
              });
            }}
          />
          {/* {cardsData.length > 0 && renderCards(formik.values.cards)} */}

          <Button
            onPress={submitting ? handleSubmit : formik.handleSubmit}
            title="Submit"
            loading={submitting}
            buttonStyle={{
              backgroundColor: theme.PRIMARY_COLOR,
              borderRadius: 10,
              padding: 10,
              marginTop: 15,
            }}
          />
          <Text style={{ color: theme.TEXT_COLOR }}>
            {JSON.stringify(formik.values, null, 2, 0)}
          </Text>
        </FormikProvider>
        <Text style={styles.text}>Class id: {route.params.id}</Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    padding: 15,
  },
  text: {
    color: theme.TEXT_COLOR,
  },
  header_text: {
    color: theme.TEXT_COLOR,
    fontSize: theme.FONT_SIZE_VERYLARGE,
    padding: 10,
  },
  input: {
    color: theme.TEXT_COLOR,
    padding: 10,
    borderColor: theme.PRIMARY_COLOR,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    width: "100%",
    backgroundColor: theme.BACKGROUND_COLOR,
  },
  input_noborder: {
    borderWidth: 0,
  },
  header: {
    backgroundColor: theme.PRIMARY_COLOR,
    marginTop: 8,
    marginBottom: 8,
  },
  card_block: {
    // borderColor: theme.PRIMARY_COLOR,
    // borderWidth: 2,
    // borderRadius: 15,
    // paddingRight: 5,
    // paddingLeft: 5,
    // marginTop: 15,
    marginBottom: 20,
    // backgroundColor: theme.PRIMARY_COLOR,
  },
});
