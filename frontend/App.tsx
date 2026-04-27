import "react-native-gesture-handler";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { AppTheme } from "./src/theme/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppTheme.navigationTheme}>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
