import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import MyAppBar from "./MyAppBar";
// import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import ClassScreen from "./ClassScreen";
import styles from "./styles";
import ProfileScreen from "./ProfileScreen";
import theme from "./theme";
import CreateClass from "./CreateClass";
import CameraScreen from "./CameraScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // return null;
  return (
    <NavigationContainer style={{ backgroundColor: theme.BACKGROUND_COLOR }}>
      <Stack.Navigator
        // theme={MyTheme}
        screenOptions={{
          header: (props) => <MyAppBar {...props} />,
        }}
        defaultNavigationOptions={{ gestureEnabled: false }}
      >
        <Stack.Screen name="Create" component={CreateClass} />
        <Stack.Screen name="Home" component={ClassScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
