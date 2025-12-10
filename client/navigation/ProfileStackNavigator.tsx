import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "@/screens/ProfileScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import HelpScreen from "@/screens/HelpScreen";
import ContactScreen from "@/screens/ContactScreen";
import PrivacyScreen from "@/screens/PrivacyScreen";
import TermsScreen from "@/screens/TermsScreen";
import ChangePasswordScreen from "@/screens/ChangePasswordScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Help: undefined;
  Contact: undefined;
  Privacy: undefined;
  Terms: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          backgroundColor: Colors.dark.backgroundRoot,
        },
        headerTintColor: Colors.dark.text,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: "Profile" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{ headerTitle: "Help Center" }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ headerTitle: "Contact Us" }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ headerTitle: "Privacy Policy" }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ headerTitle: "Terms of Service" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerTitle: "Change Password" }}
      />
    </Stack.Navigator>
  );
}
