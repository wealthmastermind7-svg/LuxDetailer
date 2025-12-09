import React from "react";
import { StyleSheet, Pressable, ViewStyle, View, Platform, StyleProp } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Spacing, BorderRadius, Glass, Animation } from "@/constants/theme";

interface GlassCardProps {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  glowColor?: string;
  hasGlow?: boolean;
}

const springConfig: WithSpringConfig = {
  damping: Animation.spring.damping,
  stiffness: Animation.spring.stiffness,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  onPress,
  style,
  contentStyle,
  disabled = false,
  glowColor,
  hasGlow = false,
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, springConfig);
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const glowStyle = hasGlow && glowColor ? {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  } : {};

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={[
        styles.card,
        glowStyle,
        animatedStyle,
        style,
      ]}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={Glass.blur}
          tint="dark"
          style={[styles.blurContainer, contentStyle]}
        >
          {children}
        </BlurView>
      ) : (
        <View style={[styles.androidContainer, contentStyle]}>
          {children}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Glass.border,
  },
  blurContainer: {
    padding: Spacing.lg,
  },
  androidContainer: {
    padding: Spacing.lg,
    backgroundColor: Glass.surface,
  },
});
