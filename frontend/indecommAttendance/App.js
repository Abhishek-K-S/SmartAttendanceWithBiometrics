import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AdminEachUserScreen from "./src/screens/AdminEachUserScreen";
import AdminHomeScreen from "./src/screens/AdminHomeScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import MainScreen from "./src/screens/MainScreen";
import RegisterCameraScreen from "./src/screens/RegisterCameraScreen";
import ViewFinalVideoScreen from "./src/screens/ViewFinalVideoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterCameraScreen}
          options={{
            headerStyle: { backgroundColor: "#1E254D" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: { backgroundColor: "#1E254D" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="ViewScreen"
          component={ViewFinalVideoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserView"
          component={AdminEachUserScreen}
          options={{
            headerStyle: { backgroundColor: "#1E254D" },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//main app component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
