import React, { useState } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface CinematicHeroProps {
  height?: number;
  onInteract?: () => void;
  gradient?: [string, string, string];
  accentColor?: string;
}

/**
 * Handcrafted cinematic hero with parallax, smooth transitions, and interactive moments
 * Replaces video-based approach with organic, animated experience
 */
export function CinematicHero({
  height = 380,
  onInteract,
  gradient = ["#0D1B2A", "#1A1A1D", "#0D1B2A"],
  accentColor = "#1E90FF",
}: CinematicHeroProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Parallax and animation values
  const scrollProgress = useSharedValue(0);
  const tapScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const particleY = useSharedValue(0);
  const particleRotation = useSharedValue(0);

  const handlePress = () => {
    setIsInteracting(true);

    // Interactive moment - spring animation
    tapScale.value = withSpring(1.08, {
      damping: 8,
      stiffness: 150,
    });

    glowOpacity.value = withSpring(0.8, {
      damping: 10,
      stiffness: 120,
    });

    particleY.value = withTiming(60, { duration: 600 });
    particleRotation.value = withTiming(360, { duration: 800 });

    setTimeout(() => {
      tapScale.value = withSpring(1, { damping: 10, stiffness: 150 });
      glowOpacity.value = withTiming(0.3, { duration: 600 });
      setIsInteracting(false);
    }, 400);

    onInteract?.();
  };

  // Parallax effect for background layers
  const layer1Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollProgress.value,
          [0, 1],
          [0, -30],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const layer2Style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollProgress.value,
          [0, 1],
          [0, -15],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const tapScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tapScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: particleY.value },
      { rotate: `${particleRotation.value}deg` },
    ],
    opacity: interpolate(
      particleY.value,
      [0, 60],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.container, { height }]}
      >
        {/* Base gradient background */}
        <LinearGradient
          colors={gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Parallax layer 1 - Far background */}
        <Animated.View
          style={[
            styles.parallaxLayer,
            styles.layer1,
            layer1Style,
            StyleSheet.absoluteFill,
          ]}
        >
          <View style={styles.shapeBlob1} />
        </Animated.View>

        {/* Parallax layer 2 - Mid background */}
        <Animated.View
          style={[
            styles.parallaxLayer,
            styles.layer2,
            layer2Style,
            StyleSheet.absoluteFill,
          ]}
        >
          <View style={[styles.shapeBlob2, { borderColor: accentColor }]} />
        </Animated.View>

        {/* Interactive center glow */}
        <Animated.View
          style={[
            styles.centerGlow,
            glowStyle,
            {
              backgroundColor: accentColor,
            },
          ]}
        />

        {/* Main interactive element */}
        <Animated.View
          style={[
            styles.centerElement,
            tapScaleStyle,
            {
              borderColor: accentColor,
            },
          ]}
        >
          <LinearGradient
            colors={[`${accentColor}33`, `${accentColor}11`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.centerDot,
              {
                backgroundColor: accentColor,
              },
            ]}
          />
        </Animated.View>

        {/* Animated particles on interaction */}
        <Animated.View style={[styles.particle, particleStyle]}>
          <View
            style={[
              styles.particleCore,
              {
                backgroundColor: accentColor,
              },
            ]}
          />
        </Animated.View>

        {/* Floating accent elements */}
        <Animated.View
          style={[
            styles.floatingElement,
            {
              opacity: 0.15,
            },
          ]}
        >
          <View
            style={[
              styles.floatingBar,
              {
                backgroundColor: accentColor,
              },
            ]}
          />
        </Animated.View>

        {/* Shimmer overlay for depth */}
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.05)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Interactive hint indicator */}
        {!isInteracting && (
          <Animated.View
            style={[
              styles.interactiveHint,
              {
                opacity: interpolate(
                  glowOpacity.value,
                  [0.3, 0.8],
                  [0.4, 0],
                  Extrapolate.CLAMP
                ),
              },
            ]}
          >
            <View style={styles.hintDot} />
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  parallaxLayer: {
    opacity: 0.6,
  },
  layer1: {
    opacity: 0.3,
  },
  layer2: {
    opacity: 0.4,
  },
  shapeBlob1: {
    width: 200,
    height: 200,
    borderRadius: 9999,
    backgroundColor: "rgba(30, 144, 255, 0.1)",
    position: "absolute",
    top: -50,
    right: -50,
  },
  shapeBlob2: {
    width: 150,
    height: 150,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#1E90FF",
    position: "absolute",
    bottom: -30,
    left: -30,
    opacity: 0.3,
  },
  centerGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.2,
    position: "absolute",
  },
  centerElement: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 10,
  },
  centerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  particle: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  particleCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  floatingElement: {
    position: "absolute",
    top: "20%",
    right: "15%",
  },
  floatingBar: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  interactiveHint: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E90FF",
  },
});
