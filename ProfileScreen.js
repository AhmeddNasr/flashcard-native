import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
function ProfileScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text>this is Test's profile</Text>
    </View>
  );
}

export default ProfileScreen;
