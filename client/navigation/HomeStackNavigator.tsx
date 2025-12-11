import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import ServiceDetailsScreen from "@/screens/ServiceDetailsScreen";
import BookingFlowScreen from "@/screens/BookingFlowScreen";
import MyVehicleScreen from "@/screens/MyVehicleScreen";
import ServicesScreen from "@/screens/ServicesScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import MembershipsScreen from "@/screens/MembershipsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type HomeStackParamList = {
  Home: undefined;
  ServiceDetails: { serviceId: string };
  BookingFlow: { serviceId?: string; promoCode?: string } | undefined;
  MyVehicle: undefined;
  Services: undefined;
  Settings: undefined;
  Memberships: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
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
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{ headerTitle: "Service Details" }}
      />
      <Stack.Screen
        name="BookingFlow"
        component={BookingFlowScreen}
        options={{ headerTitle: "Book Appointment" }}
      />
      <Stack.Screen
        name="MyVehicle"
        component={MyVehicleScreen}
        options={{ headerTitle: "My Vehicle" }}
      />
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{ headerTitle: "All Services" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
      <Stack.Screen
        name="Memberships"
        component={MembershipsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
