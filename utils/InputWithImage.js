import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { FastField } from "formik";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function InputWithImage(props) {
  const formik = props.formik;
  const item = props.item;
  const card = props.card;
  const index = props.index;
  const type = props.type;
  const cardValue = formik.values.cards[index];
  const value =
    type === "question" ? cardValue.question_text : cardValue.answer_text;
  const imageValue =
    type === "question" ? cardValue.question_image : cardValue.answer_image;

  const [active, setActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const handleBlur = () => {
    setActive(false);
    formik.handleBlur(`${card}.${type}_text`);
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    console.log(result);
    if (!result.cancelled) {
      formik.setFieldValue(`${card}.${type}_image`, result.uri, false);
    }
  };

  // const handleImageIconPress = () => {
  //   setModalActive(true);
  // };

  return (
    <View style={{ opacity: active ? 1 : 0.8 }}>
      <View
        style={{
          ...styles.input_block,
          borderColor:
            index % 2 !== 0 ? theme.TEXT_COLOR_OPACITY : theme.PRIMARY_COLOR,
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

        <View style={styles.text_input_block}>
          <FastField
            component={TextInput}
            onChangeText={formik.handleChange(`${card}.${type}_text`)}
            onBlur={handleBlur}
            value={value}
            style={{
              ...styles.input,
              ...styles.input_noborder,
              flex: 1,
            }}
            multiline
            placeholder={type === "question" ? "Question" : "Answer"}
            placeholderTextColor={theme.TEXT_COLOR_OPACITY}
            onFocus={() => setActive(true)}
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
      </View>
      {/* <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalActive}
          onRequestClose={() => {
            setModalActive(!modalActive);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ color: theme.TEXT_COLOR }}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalActive(!modalActive)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  card_image: {
    width: 250,
    height: 200,
  },
  input_block: {
    borderWidth: 2,
    borderColor: theme.PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 10,
  },
  input: {
    color: theme.TEXT_COLOR,
    paddingLeft: 10,
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
  text_input_block: {
    flexDirection: "row",
    padding: 0,
    margin: 0,
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
