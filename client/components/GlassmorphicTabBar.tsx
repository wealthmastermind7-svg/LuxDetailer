import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  ViewStyle,
  StyleProp,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassmorphicTabBar({
  state,
  descriptors,
  navigation,
}: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              preventDefault: false,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Skip the center button (BookNowTab)
          if (route.name === "BookNowTab") {
            return (
              <View key={route.key} style={styles.centerButtonSpacer} />
            );
          }

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              options={options}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabButtonProps {
  isFocused: boolean;
  onPress: () => void;
  options: any;
}

function TabButton({ isFocused, onPress, options }: TabButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.93, {
      damping: 12,
      mass: 0.25,
      stiffness: 180,
    });
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 12,
      mass: 0.25,
      stiffness: 180,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = isFocused
    ? Colors.dark.accent
    : Colors.dark.tabIconDefault;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.tabButton,
        animatedStyle,
        isFocused && styles.tabButtonFocused,
      ]}
    >
      <View
        style={[
          styles.tabButtonInner,
          isFocused && styles.tabButtonInnerFocused,
        ]}
      >
        {options.tabBarIcon ? (
          options.tabBarIcon({
            color: iconColor,
            size: 24,
            focused: isFocused,
          })
        ) : null}
      </View>
      {options.title && (
        <View style={styles.labelContainer}>
          {typeof options.title === "string" && (
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: iconColor,
                  fontSize: 10,
                  fontWeight: isFocused ? "600" : "500",
                },
              ]}
            >
              {options.title}
            </Text>
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: Platform.select({
      ios: "transparent",
      android: Colors.dark.backgroundRoot,
    }),
    borderTopWidth: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    height: 64,
  },
  tabButton: {
    flex: 1,
    maxWidth: 75,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonFocused: {},
  tabButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.dark.glassSurface,
    borderWidth: 1.5,
    borderColor: Colors.dark.glassBorder,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  tabButtonInnerFocused: {
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    borderColor: "rgba(10, 132, 255, 0.4)",
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 0,
  },
  labelContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 2,
  },
  label: {
    textAlign: "center",
  },
  centerButtonSpacer: {
    width: 70,
    height: "100%",
  },
});
