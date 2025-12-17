import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface CarDetailingCinematicProps {
  height?: number;
  onInteract?: () => void;
}

/**
 * Car detailing-specific cinematic experience
 * Showcases: paint shine, protective coatings, light reflections, polishing effects
 * Interactive: tap to trigger application animation
 */
export function CarDetailingCinematic({
  height = 380,
  onInteract,
}: CarDetailingCinematicProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Continuous animations
  const shinePulse = useSharedValue(0);
  const reflectionX = useSharedValue(0);
  const coatingOpacity = useSharedValue(0.3);

  // Interactive animations
  const polishMotion = useSharedValue(0);
  const waterBeadScale = useSharedValue(0);
  const protectionGlow = useSharedValue(0.2);

  // Continuous shine effect
  useEffect(() => {
    shinePulse.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, [shinePulse]);

  // Continuous reflection
  useEffect(() => {
    reflectionX.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );
  }, [reflectionX]);

  // Continuous coating glow
  useEffect(() => {
    coatingOpacity.value = withRepeat(
      withTiming(0.6, { duration: 2500 }),
      -1,
      true
    );
  }, [coatingOpacity]);

  const handlePress = () => {
    setIsInteracting(true);

    // Polish motion - simulate buffing
    polishMotion.value = withTiming(1, { duration: 1200 });

    // Water bead effect - like hydrophobic coating
    waterBeadScale.value = withSpring(1.2, {
      damping: 6,
      stiffness: 100,
    });

    // Protection glow intensifies
    protectionGlow.value = withTiming(0.9, { duration: 800 });

    setTimeout(() => {
      polishMotion.value = withTiming(0, { duration: 600 });
      waterBeadScale.value = withTiming(0, { duration: 500 });
      protectionGlow.value = withTiming(0.2, { duration: 600 });
      setIsInteracting(false);
    }, 1200);

    onInteract?.();
  };

  // Shine wave effect (like light on paint)
  const shineWaveStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shinePulse.value,
      [0, 1],
      [-width, width],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
    };
  });

  // Light reflection across car surface
  const reflectionStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      reflectionX.value,
      [0, 1],
      [-300, width + 300],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
      opacity: interpolate(
        reflectionX.value,
        [0, 0.3, 0.7, 1],
        [0, 0.6, 0.6, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  // Protective coating layer animation
  const coatingStyle = useAnimatedStyle(() => ({
    opacity: coatingOpacity.value,
  }));

  // Polishing motion (side-to-side buffing)
  const polishStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      polishMotion.value,
      [0, 0.5, 1],
      [-40, 40, -40],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
      opacity: interpolate(
        polishMotion.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  // Water bead effect (hydrophobic coating)
  const waterBeadStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: waterBeadScale.value },
      {
        translateY: interpolate(
          waterBeadScale.value,
          [0, 1.2],
          [0, -50],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      waterBeadScale.value,
      [0, 0.5, 1.2],
      [0, 1, 0],
      Extrapolate.CLAMP
    ),
  }));

  // Protection glow
  const protectionGlowStyle = useAnimatedStyle(() => ({
    opacity: protectionGlow.value,
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.container, { height }]}
      >
        {/* Dark luxury gradient base - polished car appearance */}
        <LinearGradient
          colors={["#0A0E1A", "#1a2332", "#0D1120"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Paint surface base layer */}
        <View style={[styles.paintSurface, StyleSheet.absoluteFill]} />

        {/* Protective coating visualization */}
        <Animated.View
          style={[
            styles.coatingLayer,
            coatingStyle,
            StyleSheet.absoluteFill,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(30, 144, 255, 0.15)",
              "rgba(212, 175, 55, 0.08)",
              "rgba(30, 144, 255, 0.1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Light reflection - sunlight on polished paint */}
        <Animated.View
          style={[
            styles.lightReflection,
            reflectionStyle,
            StyleSheet.absoluteFill,
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.3)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Shine wave - polish motion effect */}
        <Animated.View style={[styles.shineWave, shineWaveStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.2)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 200, height: "100%" }}
          />
        </Animated.View>

        {/* Polishing motion indicator */}
        {isInteracting && (
          <Animated.View
            style={[styles.polishIndicator, polishStyle]}
          >
            <LinearGradient
              colors={[
                "rgba(212, 175, 55, 0)",
                "rgba(212, 175, 55, 0.4)",
                "rgba(212, 175, 55, 0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: 80,
                height: 6,
                borderRadius: 3,
              }}
            />
          </Animated.View>
        )}

        {/* Interactive detail button - represents detailing pad */}
        <Pressable
          style={styles.detailingPadContainer}
          onPress={handlePress}
        >
          <Animated.View style={[styles.detailingPad]}>
            <LinearGradient
              colors={["#1E90FF", "#1B7ACC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.detailingPadTexture,
                StyleSheet.absoluteFill,
              ]}
            />
          </Animated.View>

          {/* Detailing pad glow effect */}
          <Animated.View
            style={[
              styles.padGlow,
              protectionGlowStyle,
            ]}
          />
        </Pressable>

        {/* Water beads - hydrophobic coating effect */}
        <Animated.View
          style={[styles.waterBeadContainer, waterBeadStyle]}
        >
          <View style={styles.waterBead} />
          <View
            style={[
              styles.waterBead,
              { marginLeft: 12, opacity: 0.7 },
            ]}
          />
          <View
            style={[
              styles.waterBead,
              { marginLeft: 12, opacity: 0.5 },
            ]}
          />
        </Animated.View>

        {/* Shimmer overlay for depth and luxury feel */}
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.04)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Interactive hint */}
        {!isInteracting && (
          <Animated.View style={styles.hint}>
            <View style={styles.hintRing} />
            <View
              style={[
                styles.hintRing,
                styles.hintRingOuter,
              ]}
            />
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
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  paintSurface: {
    backgroundColor: "rgba(13, 27, 42, 0.8)",
  },
  coatingLayer: {
    pointerEvents: "none",
  },
  lightReflection: {
    width: "100%",
    height: "60%",
    pointerEvents: "none",
  },
  shineWave: {
    position: "absolute",
    width: 200,
    height: "100%",
    pointerEvents: "none",
  },
  polishIndicator: {
    position: "absolute",
    top: "35%",
    alignSelf: "center",
    zIndex: 20,
  },
  detailingPadContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
  },
  detailingPad: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(30, 144, 255, 0.5)",
  },
  detailingPadTexture: {
    backgroundColor: "rgba(212, 175, 55, 0.1)",
  },
  padGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1E90FF",
    top: -20,
    left: -20,
    zIndex: -1,
  },
  waterBeadContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    zIndex: 12,
  },
  waterBead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(30, 144, 255, 0.8)",
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  hint: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    zIndex: 5,
  },
  hintRing: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(30, 144, 255, 0.6)",
  },
  hintRingOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    top: -3,
    left: -3,
    borderColor: "rgba(30, 144, 255, 0.3)",
  },
});
