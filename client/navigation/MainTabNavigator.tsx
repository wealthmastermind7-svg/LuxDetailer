import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Platform, StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import ServicesStackNavigator from "@/navigation/ServicesStackNavigator";
import BookingsStackNavigator from "@/navigation/BookingsStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { GlassmorphicTabBar } from "@/components/GlassmorphicTabBar";

export type MainTabParamList = {
  HomeTab: undefined;
  ServicesTab: undefined;
  BookNowTab: undefined;
  BookingsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function BookNowPlaceholder() {
  return <View />;
}

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.accent,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        headerShown: false,
      }}
      tabBar={(props) => <GlassmorphicTabBar {...props} />}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStackNavigator}
        options={{
          title: "Services",
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BookNowTab"
        component={BookNowPlaceholder}
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => {
            const { style, ...restProps } = props as any;
            return (
              <Pressable
                {...restProps}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (props.onPress) {
                    props.onPress(undefined as any);
                  }
                }}
                style={({ pressed }) => [
                  styles.bookNowButton,
                  pressed && styles.bookNowButtonPressed,
                ]}
              >
                <View style={styles.bookNowInner}>
                  <Feather name="plus" size={28} color="#FFFFFF" />
                </View>
              </Pressable>
            );
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            (navigation as any).navigate("HomeTab", {
              screen: "BookingFlow",
            });
          },
        })}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsStackNavigator}
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bookNowButton: {
    position: "relative",
    top: -20,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
  },
  bookNowButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  bookNowInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.accent,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.glow,
  },
});
