import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface CarDetailingCinematicProps {
  height?: number;
  onInteract?: () => void;
}

type ProcessStage = "wash" | "coat" | "polish";

/**
 * Realistic car detailing cinematic showing three stages:
 * 1. Washing - water spray and foam effects
 * 2. Coating - protective ceramic coating application
 * 3. Polishing - buffing and shine effects
 */
export function CarDetailingCinematic({
  height = 380,
  onInteract,
}: CarDetailingCinematicProps) {
  const [stage, setStage] = useState<ProcessStage>("wash");
  const [isAnimating, setIsAnimating] = useState(false);

  // Wash stage animations
  const waterDrops = useSharedValue(0);
  const foamLayer = useSharedValue(0);

  // Coat stage animations
  const coatingFlow = useSharedValue(0);
  const glossShine = useSharedValue(0);

  // Polish stage animations
  const polishMotion = useSharedValue(0);
  const bufferRotation = useSharedValue(0);

  // Shared animations
  const carGlow = useSharedValue(0);
  const reflectionShimmer = useSharedValue(0);

  // Auto-cycle through stages
  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((prev) => {
        if (prev === "wash") return "coat";
        if (prev === "coat") return "polish";
        return "wash";
      });
    }, 5000);
    return () => clearInterval(stageTimer);
  }, []);

  // Wash stage effects
  useEffect(() => {
    if (stage === "wash") {
      waterDrops.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 500 }),
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );

      foamLayer.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 300 }),
          withTiming(0.7, { duration: 1500 }),
          withTiming(0, { duration: 700 })
        ),
        -1,
        false
      );
    }
  }, [stage]);

  // Coat stage effects
  useEffect(() => {
    if (stage === "coat") {
      coatingFlow.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 600 }),
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        false
      );

      glossShine.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(0.9, { duration: 1500 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [stage]);

  // Polish stage effects
  useEffect(() => {
    if (stage === "polish") {
      polishMotion.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 400 }),
          withTiming(1, { duration: 1200 }),
          withTiming(0.5, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      );

      bufferRotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [stage]);

  // Continuous car glow
  useEffect(() => {
    carGlow.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000 }),
        withTiming(0.8, { duration: 2000 })
      ),
      -1,
      false
    );

    reflectionShimmer.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );
  }, []);

  const handlePress = () => {
    setIsAnimating(true);
    setStage((prev) => {
      if (prev === "wash") return "coat";
      if (prev === "coat") return "polish";
      return "wash";
    });
    setTimeout(() => setIsAnimating(false), 500);
    onInteract?.();
  };

  // Water droplet animation
  const waterDropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(waterDrops.value, [0, 0.5, 1], [0, 1, 0]),
    transform: [
      {
        translateY: interpolate(
          waterDrops.value,
          [0, 1],
          [-20, 80],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  // Foam layer animation
  const foamStyle = useAnimatedStyle(() => ({
    opacity: foamLayer.value,
  }));

  // Coating flow animation
  const coatingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(coatingFlow.value, [0, 0.5, 1], [0, 0.8, 0]),
    transform: [
      {
        translateX: interpolate(
          coatingFlow.value,
          [0, 1],
          [-width / 2, width / 2],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  // Gloss shine animation
  const glossStyle = useAnimatedStyle(() => ({
    opacity: glossShine.value,
  }));

  // Polish motion animation
  const polishStyle = useAnimatedStyle(() => ({
    opacity: interpolate(polishMotion.value, [0, 0.5, 1], [0, 1, 0.5]),
    transform: [
      {
        translateX: interpolate(
          polishMotion.value,
          [0, 0.5, 1],
          [-40, 40, -40],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  // Buffer rotation
  const bufferStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bufferRotation.value}deg` }],
  }));

  // Car glow effect
  const carGlowStyle = useAnimatedStyle(() => ({
    opacity: carGlow.value,
  }));

  // Reflection shimmer
  const reflectionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      reflectionShimmer.value,
      [0, 0.5, 1],
      [0.1, 0.4, 0.1],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.container, { height }]}
      >
        {/* Dark luxury gradient - polished car paint */}
        <LinearGradient
          colors={["#050814", "#0F1419", "#050814"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Paint base layer with depth */}
        <View style={[styles.paintSurface, StyleSheet.absoluteFill]} />

        {/* Car silhouette representation */}
        <View style={[styles.carBody, StyleSheet.absoluteFill]}>
          <View style={styles.carShape} />
        </View>

        {/* WASH STAGE */}
        {stage === "wash" && (
          <>
            {/* Water droplets falling */}
            <Animated.View style={[styles.waterDropletLeft, waterDropStyle]}>
              <View style={styles.waterDrop} />
            </Animated.View>
            <Animated.View
              style={[
                styles.waterDropletCenter,
                waterDropStyle,
                { animationDelay: "0.2s" },
              ]}
            >
              <View style={styles.waterDrop} />
            </Animated.View>
            <Animated.View
              style={[
                styles.waterDropletRight,
                waterDropStyle,
                { animationDelay: "0.4s" },
              ]}
            >
              <View style={styles.waterDrop} />
            </Animated.View>

            {/* Foam/soap effect */}
            <Animated.View style={[styles.foamLayer, foamStyle]}>
              <LinearGradient
                colors={[
                  "rgba(200, 220, 240, 0.4)",
                  "rgba(150, 180, 220, 0.2)",
                  "rgba(200, 220, 240, 0.3)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </>
        )}

        {/* COAT STAGE */}
        {stage === "coat" && (
          <>
            {/* Ceramic coating application flow */}
            <Animated.View style={[styles.coatingFlow, coatingStyle]}>
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(212, 175, 55, 0.4)",
                  "transparent",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 150, height: "100%" }}
              />
            </Animated.View>

            {/* Gloss shine from coating */}
            <Animated.View style={[styles.glossLayer, glossStyle]}>
              <LinearGradient
                colors={[
                  "rgba(30, 144, 255, 0.2)",
                  "rgba(255, 255, 255, 0.25)",
                  "rgba(30, 144, 255, 0.15)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </>
        )}

        {/* POLISH STAGE */}
        {stage === "polish" && (
          <>
            {/* Polishing pad motion */}
            <Animated.View style={[styles.polishPad, polishStyle]}>
              <Animated.View style={bufferStyle}>
                <View style={styles.bufferPad} />
              </Animated.View>
            </Animated.View>

            {/* Polish highlight effect */}
            <Animated.View style={[styles.polishHighlight, polishStyle]}>
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(212, 175, 55, 0.5)",
                  "transparent",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ width: "100%", height: 60 }}
              />
            </Animated.View>
          </>
        )}

        {/* Car glow - always present */}
        <Animated.View style={[styles.carGlow, carGlowStyle]} />

        {/* Reflection shimmer - always present */}
        <Animated.View style={[styles.reflectionShimmer, reflectionStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.2)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>

        {/* Luxury shimmer overlay */}
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

        {/* Interactive tap indicator */}
        <View style={styles.tapIndicator}>
          <View style={styles.tapDot} />
          <Animated.Text style={styles.tapText}>
            Tap to advance
          </Animated.Text>
        </View>
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
    backgroundColor: "rgba(10, 14, 26, 0.8)",
  },
  carBody: {
    justifyContent: "center",
    alignItems: "center",
  },
  carShape: {
    width: 220,
    height: 110,
    borderRadius: 20,
    backgroundColor: "rgba(30, 30, 40, 0.6)",
    borderWidth: 2,
    borderColor: "rgba(100, 100, 120, 0.4)",
    shadowColor: "rgba(0, 0, 0, 0.8)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  waterDropletLeft: {
    position: "absolute",
    top: "20%",
    left: "25%",
    zIndex: 5,
  },
  waterDropletCenter: {
    position: "absolute",
    top: "25%",
    left: "50%",
    zIndex: 5,
  },
  waterDropletRight: {
    position: "absolute",
    top: "20%",
    right: "25%",
    zIndex: 5,
  },
  waterDrop: {
    width: 12,
    height: 16,
    borderRadius: 6,
    backgroundColor: "rgba(100, 180, 255, 0.6)",
    shadowColor: "#64B4FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  foamLayer: {
    position: "absolute",
    width: "100%",
    height: "50%",
    top: "30%",
  },
  coatingFlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  glossLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 3,
  },
  polishPad: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    top: "35%",
    left: "50%",
    marginLeft: -35,
    zIndex: 6,
  },
  bufferPad: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(212, 175, 55, 0.3)",
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.6)",
  },
  polishHighlight: {
    position: "absolute",
    width: "100%",
    height: 80,
    top: "45%",
    zIndex: 5,
  },
  carGlow: {
    position: "absolute",
    width: 280,
    height: 160,
    borderRadius: 40,
    top: "50%",
    left: "50%",
    marginLeft: -140,
    marginTop: -80,
    backgroundColor: "rgba(30, 144, 255, 0.1)",
    zIndex: 1,
  },
  reflectionShimmer: {
    position: "absolute",
    width: "100%",
    height: "60%",
    top: "20%",
    zIndex: 2,
  },
  stageLabel: {
    position: "absolute",
    top: Spacing.lg,
    left: Spacing.lg,
    zIndex: 20,
  },
  stageLabelBg: {
    backgroundColor: "rgba(30, 144, 255, 0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(30, 144, 255, 0.4)",
  },
  stageLabelText: {
    color: "#1E90FF",
    fontSize: 12,
    fontWeight: "600",
  },
  tapIndicator: {
    position: "absolute",
    bottom: Spacing.lg,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 15,
  },
  tapDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(30, 144, 255, 0.6)",
    marginBottom: Spacing.xs,
  },
  tapText: {
    fontSize: 11,
    color: "rgba(30, 144, 255, 0.5)",
    fontWeight: "500",
  },
});
