import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookingsScreen from "@/screens/BookingsScreen";
import BookingDetailsScreen from "@/screens/BookingDetailsScreen";
import BookingFlowScreen from "@/screens/BookingFlowScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { Colors } from "@/constants/theme";

export type BookingsStackParamList = {
  Bookings: undefined;
  BookingDetails: { bookingId: string };
  BookingFlow: { serviceId?: string; promoCode?: string } | undefined;
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
      <Stack.Screen
        name="BookingFlow"
        component={BookingFlowScreen}
        options={{ headerTitle: "Book Appointment" }}
      />
    </Stack.Navigator>
  );
}
