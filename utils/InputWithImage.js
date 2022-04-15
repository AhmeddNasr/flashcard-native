import { View, StyleSheet, TextInput, Image } from "react-native";
import { FastField } from "formik";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme";

export default function InputWithImage(props) {
  const formik = props.formik;
  const item = props.item;
  const card = props.card;
  const index = props.index;
  const type = props.type;
  const image = type === "question" ? item.question_image : item.answer_image;
  const cardValue = formik.values.cards[index];
  const value =
    type === "question" ? cardValue.question_text : cardValue.answer_text;

  return (
    <View>
      {image && (
        <Image
          style={styles.card_image}
          source={{
            uri: image,
          }}
        />
      )}
      <View
        style={{
          ...styles.input_block,
          borderColor:
            index % 2 !== 0 ? theme.TEXT_COLOR_OPACITY : theme.PRIMARY_COLOR,
        }}
      >
        <FastField
          component={TextInput}
          onChangeText={formik.handleChange(`${card}.${type}_text`)}
          onBlur={formik.handleBlur(`${card}.${type}_text`)}
          value={value}
          style={{
            ...styles.input,
            ...styles.input_noborder,
            flex: 1,
          }}
          multiline
          placeholder={type === "question" ? "Question" : "Answer"}
          placeholderTextColor={theme.TEXT_COLOR_OPACITY}
        />
        <MaterialIcons name="image" style={{ ...styles.icon }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card_image: {
    maxHeight: 400,
    width: undefined,
  },
  input_block: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: theme.PRIMARY_COLOR,
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
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
  icon: {
    color: theme.TEXT_COLOR_OPACITY,
    fontSize: theme.FONT_SIZE_ICON,
    padding: 20,
  },
});
