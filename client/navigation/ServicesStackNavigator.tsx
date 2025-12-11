import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServicesScreen from "@/screens/ServicesScreen";
import ServiceDetailsScreen from "@/screens/ServiceDetailsScreen";
import BookingFlowScreen from "@/screens/BookingFlowScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type ServicesStackParamList = {
  Services: undefined;
  ServiceDetails: { serviceId: string };
  BookingFlow: { serviceId?: string; addOns?: string[]; totalPrice?: number };
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export default function ServicesStackNavigator() {
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
        name="Services"
        component={ServicesScreen}
        options={{ headerTitle: "Our Services" }}
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
    </Stack.Navigator>
  );
}
