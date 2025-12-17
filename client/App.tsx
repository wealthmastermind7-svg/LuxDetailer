import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/contexts/AuthContext";
import { MascotProvider } from "@/contexts/MascotContext";

import RootStackNavigator, { linkingConfig } from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MascotDisplay } from "@/components/MascotDisplay";
import { Colors } from "@/constants/theme";

export default function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <GestureHandlerRootView style={styles.root}>
              <KeyboardProvider>
                <MascotProvider>
                  <NavigationContainer
                  linking={linkingConfig}
                  theme={{
                    dark: true,
                    colors: {
                      primary: Colors.dark.accent,
                      background: Colors.dark.backgroundRoot,
                      card: Colors.dark.backgroundDefault,
                      text: Colors.dark.text,
                      border: Colors.dark.glassBorder,
                      notification: Colors.dark.accent,
                    },
                    fonts: {
                      regular: { fontFamily: "System", fontWeight: "400" },
                      medium: { fontFamily: "System", fontWeight: "500" },
                      bold: { fontFamily: "System", fontWeight: "700" },
                      heavy: { fontFamily: "System", fontWeight: "900" },
                    },
                  }}
                  >
                    <RootStackNavigator />
                  </NavigationContainer>
                  <MascotDisplay bottomOffset={120} />
                  <StatusBar style="light" />
                </MascotProvider>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
});
