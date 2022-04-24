import React, { useEffect, useState, useRef } from "react";
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

  const latestId = useRef(-2);
  const fieldArrayRef = useRef(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cards WHERE class_id = ?",
        [route.params.id],
        (_, resultSet) => {
          if (resultSet.rows._array.length === 0) {
            return;
          }
          setCardsData(resultSet.rows._array);
        },
        (_, error) => console.log(error)
      );
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

  const handleSubmit = (values) => {
    let insertArray = [];
    let updateArray = [];
    values.cards.forEach((item) => {
      if (item.id < 0) {
        insertArray.push(item);
      } else {
        updateArray.push(item);
      }
    });
    handleSubmitDb(insertArray, updateArray);
  };

  const handleSubmitDb = (insertArray, updateArray) => {
    db.transaction((tx) => {
      insertArray.forEach((card) => {
        tx.executeSql(
          "INSERT INTO cards (question_text, question_image, answer_text, answer_image, class_id) values (?, ?, ?, ?, ?)",
          [
            card.question_text ? card.question_text : null,
            card.question_image ? card.question_image : null,
            card.answer_text ? card.answer_text : null,
            card.answer_image ? card.answer_image : null,
            route.params.id,
          ]
          // (txObj, resultSet) => console.log("insert resultset: ", resultSet),
          // (txObj, error) => console.log("insert error", error)
        );
      });
      updateArray.forEach((card) => {
        tx.executeSql(
          "UPDATE cards SET question_text = ?, question_image = ?, answer_text = ?, answer_image = ? WHERE id = ?",
          [
            card.question_text ? card.question_text : null,
            card.question_image ? card.question_image : null,
            card.answer_text ? card.answer_text : null,
            card.answer_image ? card.answer_image : null,
            card.id,
          ]
          // (txObj, resultSet) => console.log("update resultset: ", resultSet),
          // (txObj, error) => console.log("update error", error)
        );
      });
    });
  };

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      name: classData.name,
      description: classData.description,
      cards: cardsData,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  if (!listReady) {
    return null;
  }

  return (
    <KeyboardAwareScrollView
      extraHeight={25}
      extraScrollHeight={25}
      scrollEnabled
      enableAutomaticScroll
      enableOnAndroid
    >
      <View style={styles.container}>
        {/* form */}
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
              fieldArrayRef.current = arrayHelpers;
              return formik.values.cards.map((item, index) => {
                let card = `cards.${index}`;
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

          {/* submit and add card buttons */}
          <View style={styles.button_group}>
            <Button
              onPress={() => {
                fieldArrayRef.current.push({ id: latestId.current });
                latestId.current = latestId.current - 1;
              }}
              title="Add Card"
              buttonStyle={{
                backgroundColor: theme.PRIMARY_COLOR,
                borderRadius: 10,
                marginRight: 5,
                flex: 1,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
            <Button
              onPress={submitting ? null : formik.handleSubmit}
              title="Submit"
              loading={submitting}
              buttonStyle={{
                backgroundColor: theme.PRIMARY_COLOR,
                borderRadius: 10,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            />
          </View>

          {/* debugging */}
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
    marginBottom: 30,
    // backgroundColor: theme.PRIMARY_COLOR,
  },
  button_group: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
});
