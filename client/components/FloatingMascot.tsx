import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Pressable, Platform } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Glass } from "@/constants/theme";

interface FloatingMascotProps {
  message?: string;
  onPress?: () => void;
  bottomOffset?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingMascot({ 
  message, 
  onPress,
  bottomOffset = 100,
}: FloatingMascotProps) {
  const [showMessage, setShowMessage] = useState(!!message);
  const floatAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnim.value, [0, 1], [0, -8]);
    return {
      transform: [{ translateY }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(glowAnim.value, [0.5, 1], [0.3, 0.6]),
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    } else {
      setShowMessage(!showMessage);
    }
  };

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      {showMessage && message ? (
        <View style={styles.messageContainer}>
          {Platform.OS === "ios" ? (
            <BlurView intensity={20} tint="dark" style={styles.messageBubble}>
              <ThemedText type="small" style={styles.messageText}>
                {message}
              </ThemedText>
            </BlurView>
          ) : (
            <View style={[styles.messageBubble, styles.androidBubble]}>
              <ThemedText type="small" style={styles.messageText}>
                {message}
              </ThemedText>
            </View>
          )}
        </View>
      ) : null}
      
      <AnimatedPressable
        onPress={handlePress}
        style={[styles.mascotButton, animatedStyle, glowStyle]}
      >
        <View style={styles.mascotGlow}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: Spacing.lg,
    alignItems: "flex-end",
    zIndex: 1000,
  },
  messageContainer: {
    marginBottom: Spacing.sm,
    maxWidth: 200,
  },
  messageBubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Glass.border,
    overflow: "hidden",
  },
  androidBubble: {
    backgroundColor: Glass.surface,
  },
  messageText: {
    color: Colors.dark.text,
  },
  mascotButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
  },
  mascotGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderWidth: 2,
    borderColor: Glass.borderLight,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  mascotImage: {
    width: 48,
    height: 48,
  },
});
