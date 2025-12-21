import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import BusinessProfileScreen from "@/screens/BusinessProfileScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type RootStackParamList = {
  Main: undefined;
  BusinessProfile: { slug: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const linkingConfig = {
  prefixes: ["luxdetailer://", "https://myapp.com"],
  config: {
    screens: {
      BusinessProfile: "business/:slug",
      Main: "",
    },
  },
};

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator 
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
        },
        headerTintColor: Colors.dark.text,
        contentStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessProfile"
        component={BusinessProfileScreen}
        options={{ headerTitle: "Business" }}
      />
    </Stack.Navigator>
  );
}
