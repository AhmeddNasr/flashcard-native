import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { FastField } from "formik";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme";
import * as ImagePicker from "expo-image-picker";
import { useMemo } from "react";

export default function InputWithImage(props) {
  const formik = props.formik;
  const item = props.item;
  const card = props.card;
  const index = props.index;
  const type = props.type;
  const cardValue = formik.values.cards[index];
  const cardError = formik.errors.cards ? formik.errors.cards[index] : null;
  const value =
    type === "question" ? cardValue.question_text : cardValue.answer_text;
  const imageValue =
    type === "question" ? cardValue.question_image : cardValue.answer_image;
  const error = !cardError
    ? null
    : type === "question"
    ? cardError.question_text
    : cardError.answer_text;

  //   setActive(false);
  //   formik.handleBlur(`${card}.${type}_text`);
  // };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.1,
    });
    // console.log(result);
    if (!result.cancelled) {
      formik.setFieldValue(`${card}.${type}_image`, result.uri, false);
    }
  };

  //TODO
  const captureImage = async () => {};

  // const handleImageIconPress = () => {
  //   setModalActive(true);
  // };

  const borderColor = error
    ? theme.SECONDARY_COLOR
    : index % 2 !== 0
    ? theme.TEXT_COLOR_OPACITY
    : theme.PRIMARY_COLOR;

  return useMemo(() => {
    return (
      <View style={{ opacity: 1 }}>
        <View
          style={{
            ...styles.input_block,
            borderColor: borderColor,
          }}
        >
          {imageValue && (
            <Image
              style={styles.card_image}
              source={{
                uri: imageValue,
              }}
            />
          )}

          <View
            style={{
              ...styles.text_input_block,
              borderColor: error ? theme.SECONDARY_COLOR : borderColor,
            }}
          >
            <FastField
              component={TextInput}
              onChangeText={formik.handleChange(`${card}.${type}_text`)}
              onBlur={formik.handleBlur(`${card}.${type}_text`)}
              value={value}
              style={{
                ...styles.input,
                flex: 1,
              }}
              multiline
              placeholder={type === "question" ? "Question" : "Answer"}
              placeholderTextColor={theme.TEXT_COLOR_OPACITY}
            />
            <TouchableOpacity>
              <MaterialIcons
                name="image"
                style={{
                  ...styles.icon,
                }}
                onPress={uploadImage}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: error ? theme.SECONDARY_COLOR : theme.TEXT_COLOR_OPACITY,
              padding: 5,
              alignSelf: "flex-start",
            }}
          >
            {error ? error : type}
          </Text>
        </View>
      </View>
    );
  }, [item, error]);
}

const styles = StyleSheet.create({
  card_image: {
    width: "100%",
    height: 200,
    marginBottom: 0,
  },
  input_block: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    // marginTop: 10,
  },
  input: {
    color: theme.TEXT_COLOR,
    borderRadius: 10,
    width: "100%",
    backgroundColor: theme.BACKGROUND_COLOR,
    padding: 10,
  },
  text_input_block: {
    flexDirection: "row",
    padding: 0,
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: theme.TEXT_COLOR_OPACITY,
    fontSize: theme.FONT_SIZE_ICON,
    padding: 20,
    borderRadius: 40,
  },
  // modal
  // centeredView: {
  //   flex: 1,
  //   justifyContent: "flex-end",
  //   alignItems: "stretch",
  //   marginTop: "auto",
  // },
  // modalView: {
  //   backgroundColor: theme.PRIMARY_COLOR,
  //   padding: 35,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  // buttonOpen: {
  //   backgroundColor: "#F194FF",
  // },
  // buttonClose: {
  //   backgroundColor: "#2196F3",
  // },
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: "center",
  // },
});
