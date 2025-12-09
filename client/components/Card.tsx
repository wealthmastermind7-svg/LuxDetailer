import React from "react";
import { StyleSheet, Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Animation } from "@/constants/theme";

interface CardProps {
  elevation?: number;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const springConfig: WithSpringConfig = {
  damping: Animation.spring.damping,
  stiffness: Animation.spring.stiffness,
};

const getBackgroundColorForElevation = (elevation: number): string => {
  switch (elevation) {
    case 1:
      return Colors.dark.backgroundDefault;
    case 2:
      return Colors.dark.backgroundSecondary;
    case 3:
      return Colors.dark.backgroundTertiary;
    default:
      return Colors.dark.backgroundRoot;
  }
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  elevation = 1,
  title,
  description,
  children,
  onPress,
  style,
}: CardProps) {
  const scale = useSharedValue(1);

  const cardBackgroundColor = getBackgroundColorForElevation(elevation);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
        },
        animatedStyle,
        style,
      ]}
    >
      {title ? (
        <ThemedText type="h4" style={styles.cardTitle}>
          {title}
        </ThemedText>
      ) : null}
      {description ? (
        <ThemedText type="small" style={styles.cardDescription}>
          {description}
        </ThemedText>
      ) : null}
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  cardTitle: {
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    opacity: 0.7,
  },
});
