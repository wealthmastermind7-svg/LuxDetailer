import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, BorderRadius, Spacing } from "@/constants/theme";

interface CinematicVideoFallbackProps {
  height?: number;
  colors?: string[];
}

/**
 * Cinematic fallback when video fails to load
 * Uses light sweep animation for premium feel
 * Based on recommended cinematic alternative from iOS guidelines
 */
export function CinematicVideoFallback({
  height = 380,
  colors = ["#0D1B2A", "#1A1A1D", "#0D1B2A"],
}: CinematicVideoFallbackProps) {
  const lightPosition = useSharedValue(0);

  React.useEffect(() => {
    lightPosition.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, [lightPosition]);

  const lightAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      lightPosition.value,
      [0, 1],
      [-100, 100],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Light sweep effect */}
      <Animated.View
        style={[
          styles.lightSweep,
          lightAnimatedStyle,
          { height: "100%", width: "30%" },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.15)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Shimmer particles for depth */}
      <Animated.View style={[styles.particle, styles.particle1]} />
      <Animated.View style={[styles.particle, styles.particle2]} />
      <Animated.View style={[styles.particle, styles.particle3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: "#1a1a1a",
  },
  lightSweep: {
    position: "absolute",
    left: 0,
  },
  particle: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.2,
  },
  particle1: {
    width: 60,
    height: 60,
    backgroundColor: Colors.dark.accent,
    top: "20%",
    left: "15%",
  },
  particle2: {
    width: 40,
    height: 40,
    backgroundColor: Colors.dark.accent,
    top: "60%",
    right: "10%",
  },
  particle3: {
    width: 50,
    height: 50,
    backgroundColor: Colors.dark.accent,
    bottom: "15%",
    left: "30%",
  },
});
