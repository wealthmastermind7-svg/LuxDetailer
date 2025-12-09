import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookingsScreen from "@/screens/BookingsScreen";
import BookingDetailsScreen from "@/screens/BookingDetailsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type BookingsStackParamList = {
  Bookings: undefined;
  BookingDetails: { bookingId: string };
};

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export default function BookingsStackNavigator() {
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
        name="Bookings"
        component={BookingsScreen}
        options={{ headerTitle: "My Bookings" }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ headerTitle: "Booking Details" }}
      />
    </Stack.Navigator>
  );
}
