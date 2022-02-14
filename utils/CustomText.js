import { Text } from "react-native";

export default function CustomText(props) {
  return <Text style={{ fontSize: 20, color: "#F5F6F7" }}>{props.text}</Text>;
}
