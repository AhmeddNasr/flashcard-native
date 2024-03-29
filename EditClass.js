import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import theme from "./theme";
import * as SQLite from "expo-sqlite";
import { useFormik, FormikProvider, FieldArray, FastField } from "formik";
import {
  KeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "react-native-vector-icons";
import InputWithImage from "./utils/InputWithImage";
import * as Yup from "yup";
import FloatingActionButton from "./utils/FloatingActionButton";
import debounce from "./utils/debounce";
import Animated, { SlideOutLeft } from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";

export default function EditClass({ route, navigation }) {
  const [cardsData, setCardsData] = useState([
    { id: -1, question_text: "", answer_text: "" },
  ]);
  const [classData, setClassData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [listReady, setListReady] = useState(false);
  const [deleting, setDeleting] = useState(true);
  const [query, setQuery] = useState("");
  const db = SQLite.openDatabase("db.db");

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
    db.transaction(
      (tx) => {
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
            ],
            (txObj, resultSet) => {
              return;
            },
            (txObj, error) => console.log("update error", error)
          );
        });
      },
      (err) => {
        console.log("error: ", err);
      },
      () => {
        setSubmitting(false);
        navigation.navigate("Class", { id: route.params.id });
      }
    );
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(3, "Too Short! (Min 3 Characters)")
      .max(30, "Too Long! (Max 30 Characters)")
      .required("Name Can Not Be Empty"),
    description: Yup.string()
      .nullable(true)
      .max(200, "Too Long! (Max 200 Characters)"),
    cards: Yup.array().of(
      Yup.object()
        .shape({
          question_text: Yup.string()
            .nullable(true)
            .when("question_image", {
              is: (question_image) => !question_image,
              then: Yup.string().required(
                "Question Must Contain Text or Image"
              ),
            }),
        })
        .shape({
          answer_text: Yup.string()
            .nullable(true)
            .when("answer_image", {
              is: (answer_image) => !answer_image,
              then: Yup.string().required("Answer Must Contain Text or Image"),
            }),
        })
    ),
  });

  const debounceQuery = useCallback(debounce(setQuery, 300), []);

  const formik = useFormik({
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      name: classData.name,
      description: classData.description,
      cards: cardsData,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setSubmitting(true);
      handleSubmit(values);
    },
  });

  if (!listReady) {
    return null;
  }

  const renderItems = ({ item, index }) => {
    return <></>;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <KeyboardAwareScrollView
        extraHeight={60}
        extraScrollHeight={60}
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll={false}
        keyboardShouldPersistTaps="handled"
      > */}
      <View style={styles.container}>
        {/* form */}
        <FormikProvider value={formik}>
          {/* class info section */}
          {/* Class Name */}

          <FlatList
            data={formik.values.cards}
            renderItem={({ item, index }) => {
              let card = `cards.${index}`;
              return (
                <>
                  {index === 0 && (
                    <View>
                      <View style={styles.header}>
                        <Text style={styles.header_text}>Class Info</Text>
                      </View>
                      <FastField
                        component={TextInput}
                        style={
                          formik.errors.name
                            ? {
                                ...styles.input,
                                borderColor: theme.SECONDARY_COLOR,
                              }
                            : styles.input
                        }
                        onChangeText={formik.handleChange("name")}
                        onBlur={formik.handleBlur("name")}
                        value={formik.values.name}
                        placeholder="Class Name"
                        placeholderTextColor={theme.TEXT_COLOR_OPACITY}
                      />
                      <Text
                        style={
                          formik.errors.name
                            ? {
                                ...styles.input_hint,
                                color: theme.SECONDARY_COLOR,
                              }
                            : styles.input_hint
                        }
                      >
                        {formik.errors.name ?? "Class Name"}
                      </Text>
                      {/* Class Description */}
                      <FastField
                        component={TextInput}
                        style={styles.input}
                        onChangeText={formik.handleChange("description")}
                        onBlur={formik.handleBlur("description")}
                        value={formik.values.description}
                        placeholder="Class Description"
                        placeholderTextColor={theme.TEXT_COLOR_OPACITY}
                        multiline
                      />
                      <Text
                        style={
                          formik.errors.description
                            ? {
                                ...styles.input_hint,
                                color: theme.SECONDARY_COLOR,
                              }
                            : styles.input_hint
                        }
                      >
                        {formik.errors.description ?? "Class Description"}
                      </Text>
                      {/* Cards section */}
                      <View style={{ ...styles.header, marginBottom: 0 }}>
                        <Text style={styles.header_text}>
                          Cards ({formik.values.cards.length})
                        </Text>
                      </View>

                      {/* QUERY */}
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: theme.BACKGROUND_COLOR_ELEVATED,
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 10,
                          marginBottom: 30,
                        }}
                      >
                        <TextInput
                          placeholder="Search"
                          placeholderTextColor={theme.TEXT_COLOR_OPACITY}
                          style={{
                            padding: 10,
                            paddingLeft: 0,
                            flex: 1,
                            color: theme.TEXT_COLOR,
                          }}
                          onChangeText={(val) => debounceQuery(val)}
                        />
                        <MaterialIcons
                          name="search"
                          style={{
                            color: theme.TEXT_COLOR_OPACITY,
                            fontSize: theme.FONT_SIZE_ICON,
                          }}
                        />
                      </View>
                    </View>
                  )}

                  {(query.length === 0 ||
                    item.question_text.includes(query) ||
                    item.answer_text.includes(query)) && (
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
                      {deleting && (
                        <Button
                          title="Delete"
                          color={theme.SECONDARY_COLOR}
                          style={{ padding: 10 }}
                          onPress={() => arrayHelpers.remove(index)}
                        />
                      )}
                    </View>
                  )}
                </>
              );
            }}
          />

          {/* CARDS */}
          {/* <FieldArray
              name="cards"
              render={(arrayHelpers) => {
                fieldArrayRef.current = arrayHelpers;
                return formik.values.cards
                  .filter(
                    (card) =>
                      card.question_text.includes(query) ||
                      card.answer_text.includes(query)
                  )
                  .map((item, index) => {
                    let card = `cards.${index}`;
                    return (
                      <Animated.View style={styles.card_block} key={item.id}>
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
                        {deleting && (
                          <Button
                            title="Delete"
                            color={theme.SECONDARY_COLOR}
                            style={{ padding: 10 }}
                            onPress={() => arrayHelpers.remove(index)}
                          />
                        )}
                      </Animated.View>
                    );
                  });
              }}
            /> */}

          {/* submit and add card buttons */}
          <View style={styles.button_group}>
            <TouchableOpacity
              disabled={submitting}
              style={{
                ...styles.button,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                flex: 1,
                marginRight: 10,
              }}
              onPress={submitting ? null : formik.handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color={theme.TEXT_COLOR} />
              ) : (
                <Text style={styles.button_text}>Submit</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.button,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                flex: 3,
              }}
              onPress={() => {
                fieldArrayRef.current.push({
                  id: latestId.current,
                  question_text: "",
                  answer_text: "",
                });
                latestId.current = latestId.current - 1;
              }}
            >
              <Text style={styles.button_text}>Add Card</Text>
            </TouchableOpacity>
          </View>

          {/* debugging */}
          {/* <Text style={{ color: theme.TEXT_COLOR }}>
            {JSON.stringify(formik.values, null, 2, 0)}
          </Text> */}
        </FormikProvider>
        {/* <Text style={styles.text}>Class id: {route.params.id}</Text> */}
      </View>
      {/* </KeyboardAwareScrollView> */}
      <FloatingActionButton setDeleting={setDeleting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    padding: 15,
    // height: "100%",
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
    // borderWidth: 0,
    // borderRadius: 10,
    marginTop: 8,
    width: "100%",
    backgroundColor: theme.BACKGROUND_COLOR_ELEVATED,
    borderRadius: 10,
  },
  input_hint: {
    color: theme.TEXT_COLOR_OPACITY,
    padding: 5,
    marginBottom: 8,
  },
  header: {
    // backgroundColor: theme.PRIMARY_COLOR,
    marginTop: 8,
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: theme.TEXT_COLOR,
  },
  card_block: {
    marginBottom: 50,
    backgroundColor: theme.BACKGROUND_COLOR_ELEVATED,
  },
  button_group: {
    flexDirection: "row",
    // flex: 1,
    paddingTop: 15,
    justifyContent: "center",
    // alignItems: "stretch",
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  button_text: {
    color: theme.TEXT_COLOR,
    textAlign: "center",
  },
});
