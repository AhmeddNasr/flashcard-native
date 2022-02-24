import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import theme from "./theme";
import styles from "./styles";

function MyAppBar({ navigation, back, route }) {
  //only show nav buttons in these screens
  const showNavigationButtonsScreens = ["Home", "Create"];

  return (
    <SafeAreaView style={Styles.AppBarContainer}>
      <View style={Styles.AppBarLogoContainer}>
        {back && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.Touchable}
          >
            <Ionicons
              name="arrow-back"
              size={theme.FONT_SIZE_ICON}
              color={theme.TEXT_COLOR}
            />
          </TouchableOpacity>
        )}
        <Text style={Styles.AppBarLogo}>KosomCards</Text>
        <TouchableOpacity>
          <Ionicons
            name="menu"
            size={theme.FONT_SIZE_ICON}
            color={theme.TEXT_COLOR}
            style={styles.touchable}
          />
        </TouchableOpacity>
      </View>
      {showNavigationButtonsScreens.includes(route.name) && (
        <View style={Styles.AppBarNavContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={route.name === "Home" ? Styles.activeTab : Styles.Tab}
          >
            <Text style={Styles.Text}>Classes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Create")}
            style={route.name === "Create" ? Styles.activeTab : Styles.Tab}
          >
            <Text style={Styles.Text}>Create</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  AppBarContainer: {
    backgroundColor: theme.ACCENT_COLOR,
    padding: 15,
    paddingBottom: 0,
  },
  AppBarLogoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 0,
    marginBottom: 8,
  },
  AppBarLogo: {
    color: "#F5F6F7",
    fontSize: theme.FONT_SIZE_VERYLARGE,
  },
  Text: {
    color: "#F5F6F7",
    fontSize: theme.FONT_SIZE_LARGE,
    marginBottom: 5,
  },
  Logo: {
    margin: 20,
    fontSize: theme.FONT_SIZE_VERYLARGE,
  },
  AppBarNavContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexGrow: 1,
    padding: 10,
    paddingTop: 14,
    paddingBottom: 0,
  },
  Touchable: {
    padding: 5,
  },
  activeTab: {
    borderBottomColor: theme.TEXT_COLOR,
    borderBottomWidth: 2,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    flex: 1,
    alignItems: "center",
  },
  Tab: {
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    flex: 1,
    alignItems: "center",
    opacity: 0.7,
  },
});

export default MyAppBar;
