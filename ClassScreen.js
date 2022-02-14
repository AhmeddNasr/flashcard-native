import styles from "./styles";
import { Text, View, Button } from "react-native";

function ClassScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <View> */}
      <Text>home</Text>
      <Button
        title="Go to profile"
        // onPress={() => navigation.navigate("Profile", { name: "Jahne" })}
        onPress={() => console.log("hi")}
      />
    </View>
  );
}

export default ClassScreen;
