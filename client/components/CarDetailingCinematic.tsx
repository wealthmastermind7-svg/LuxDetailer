import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolate,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface CarDetailingCinematicProps {
  height?: number;
  onInteract?: () => void;
}

/**
 * Realistic car detailing showcase with real tire patterns and neon headlights
 */
export function CarDetailingCinematic({
  height = 380,
  onInteract,
}: CarDetailingCinematicProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Animations
  const paintShine = useSharedValue(0);
  const headlightFlash = useSharedValue(0);
  const wheelRotation = useSharedValue(0);
  const exhaustGlow = useSharedValue(0);
  const neonGlow = useSharedValue(0);
  const polishPulse = useSharedValue(0);

  useEffect(() => {
    paintShine.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );
  }, [paintShine]);

  useEffect(() => {
    headlightFlash.value = withRepeat(
      withTiming(1, { duration: 1600 }),
      -1,
      true
    );
  }, [headlightFlash]);

  useEffect(() => {
    neonGlow.value = withRepeat(
      withTiming(1, { duration: 1800 }),
      -1,
      true
    );
  }, [neonGlow]);

  useEffect(() => {
    wheelRotation.value = withRepeat(
      withTiming(1, { duration: 2800 }),
      -1,
      true
    );
  }, [wheelRotation]);

  useEffect(() => {
    exhaustGlow.value = withRepeat(
      withTiming(1, { duration: 2200 }),
      -1,
      true
    );
  }, [exhaustGlow]);

  const handlePress = () => {
    setIsInteracting(true);
    polishPulse.value = withTiming(1, { duration: 600 });
    setTimeout(() => {
      polishPulse.value = withTiming(0, { duration: 600 });
      setIsInteracting(false);
    }, 600);
    onInteract?.();
  };

  const paintShineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(paintShine.value, [0, 1], [-width, width], Extrapolate.CLAMP);
    return { transform: [{ translateX }] };
  });

  const headlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(headlightFlash.value, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3], Extrapolate.CLAMP),
  }));

  const neonGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(neonGlow.value, [0, 0.5, 1], [0.5, 1, 0.5], Extrapolate.CLAMP),
    shadowOpacity: interpolate(neonGlow.value, [0, 0.5, 1], [0.4, 0.8, 0.4], Extrapolate.CLAMP),
  }));

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(wheelRotation.value, [0, 1], [0, 360], Extrapolate.CLAMP)}deg` }],
  }));

  const exhaustStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exhaustGlow.value, [0, 0.5, 1], [0.25, 0.75, 0.25], Extrapolate.CLAMP),
  }));

  const polishStyle = useAnimatedStyle(() => ({
    opacity: polishPulse.value,
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View entering={FadeIn.duration(600)} style={[styles.container, { height }]}>
        {/* Garage background */}
        <LinearGradient
          colors={["#1a1a1a", "#252525", "#1a1a1a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Car container */}
        <View style={styles.carContainer}>
          {/* Car body */}
          <View style={styles.carBody}>
            <LinearGradient
              colors={["#CC1A2E", "#E8273A", "#B71428"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.hoodReflection} />
            <View style={styles.windshield}>
              <LinearGradient
                colors={["rgba(100, 150, 200, 0.3)", "rgba(80, 120, 180, 0.2)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
            <View style={styles.sideWindow}>
              <LinearGradient
                colors={["rgba(100, 150, 200, 0.25)", "rgba(80, 120, 180, 0.15)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
            <View style={styles.doorLine} />
          </View>

          {/* LED Headlights - Left */}
          <Animated.View style={[styles.ledHeadlightLeft, headlightStyle]}>
            <View style={styles.ledHousingLeft}>
              <LinearGradient
                colors={["#1a1a1a", "#2a2a2a", "#1a1a1a"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Top LED strip */}
              <View style={styles.ledStripTop} />
              {/* Middle LED strip - left diagonal */}
              <View style={styles.ledStripMiddleLeft} />
              {/* Middle LED strip - right diagonal */}
              <View style={styles.ledStripMiddleRight} />
              {/* Bottom LED strip */}
              <View style={styles.ledStripBottom} />
            </View>
          </Animated.View>

          {/* LED Headlights - Right */}
          <Animated.View style={[styles.ledHeadlightRight, headlightStyle]}>
            <View style={styles.ledHousingRight}>
              <LinearGradient
                colors={["#1a1a1a", "#2a2a2a", "#1a1a1a"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Top LED strip */}
              <View style={styles.ledStripTop} />
              {/* Middle LED strip - left diagonal */}
              <View style={styles.ledStripMiddleLeft} />
              {/* Middle LED strip - right diagonal */}
              <View style={styles.ledStripMiddleRight} />
              {/* Bottom LED strip */}
              <View style={styles.ledStripBottom} />
            </View>
          </Animated.View>

          {/* Chrome Wheels with tire tread - Front */}
          <View style={styles.wheelFrontContainer}>
            <Animated.View style={[styles.wheel, wheelStyle]}>
              <LinearGradient
                colors={["#F5F5F5", "#D8D8D8", "#A0A0A0", "#D8D8D8", "#F5F5F5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Tire tread */}
              <View style={styles.tireTread} />
              {/* Wheel spokes */}
              <View style={styles.wheelSpokes}>
                <View style={styles.spoke} />
                <View style={[styles.spoke, { transform: [{ rotate: "60deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "120deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "180deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "240deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "300deg" }] }]} />
              </View>
              <View style={styles.wheelCenter} />
              <View style={styles.wheelTireBorder} />
            </Animated.View>
          </View>

          {/* Chrome Wheels with tire tread - Rear */}
          <View style={styles.wheelRearContainer}>
            <Animated.View style={[styles.wheel, wheelStyle]}>
              <LinearGradient
                colors={["#F5F5F5", "#D8D8D8", "#A0A0A0", "#D8D8D8", "#F5F5F5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Tire tread */}
              <View style={styles.tireTread} />
              {/* Wheel spokes */}
              <View style={styles.wheelSpokes}>
                <View style={styles.spoke} />
                <View style={[styles.spoke, { transform: [{ rotate: "60deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "120deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "180deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "240deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "300deg" }] }]} />
              </View>
              <View style={styles.wheelCenter} />
              <View style={styles.wheelTireBorder} />
            </Animated.View>
          </View>

          {/* Exhaust pipes */}
          <Animated.View style={[styles.exhaustContainer, exhaustStyle]}>
            <LinearGradient
              colors={["#2a2a2a", "#5a5a5a", "#3a3a3a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.exhaustPipe}
            />
            <LinearGradient
              colors={["#2a2a2a", "#5a5a5a", "#3a3a3a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.exhaustPipe}
            />
          </Animated.View>
        </View>

        {/* Paint shine sweep */}
        <Animated.View style={[styles.paintShine, paintShineStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.35)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 100, height: "100%" }}
          />
        </Animated.View>

        {/* Polish glow */}
        {isInteracting && (
          <Animated.View style={[styles.polishGlow, polishStyle, StyleSheet.absoluteFill]}>
            <LinearGradient
              colors={["rgba(255, 215, 0, 0.15)", "rgba(212, 175, 55, 0.08)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}

        {/* Top light */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
          style={[styles.topLight, StyleSheet.absoluteFill]}
          pointerEvents="none"
        />

        {/* Tap indicator */}
        {!isInteracting && (
          <View style={styles.tapHint}>
            <View style={styles.tapDot} />
          </View>
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

  carContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  carBody: {
    width: 220,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  hoodReflection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  windshield: {
    position: "absolute",
    top: 18,
    left: 35,
    width: 65,
    height: 30,
    borderRadius: 4,
    overflow: "hidden",
  },

  sideWindow: {
    position: "absolute",
    top: 28,
    left: 110,
    width: 45,
    height: 25,
    borderRadius: 3,
    overflow: "hidden",
  },

  doorLine: {
    position: "absolute",
    left: 105,
    top: 20,
    width: 1,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  ledHeadlightLeft: {
    position: "absolute",
    width: 56,
    height: 24,
    top: 73,
    left: 17,
    borderRadius: 12,
  },

  ledHeadlightRight: {
    position: "absolute",
    width: 56,
    height: 24,
    top: 73,
    right: 17,
    borderRadius: 12,
  },

  ledHousingLeft: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.8)",
  },

  ledHousingRight: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.8)",
  },

  ledStripTop: {
    position: "absolute",
    width: 48,
    height: 2,
    backgroundColor: "rgba(255, 240, 150, 0.85)",
    top: 3,
    left: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 2,
  },

  ledStripMiddleLeft: {
    position: "absolute",
    width: 22,
    height: 2,
    backgroundColor: "rgba(255, 240, 150, 0.85)",
    top: 10,
    left: 4,
    transform: [{ rotate: "-25deg" }],
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 2,
  },

  ledStripMiddleRight: {
    position: "absolute",
    width: 22,
    height: 2,
    backgroundColor: "rgba(255, 240, 150, 0.85)",
    top: 10,
    right: 4,
    transform: [{ rotate: "25deg" }],
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 2,
  },

  ledStripBottom: {
    position: "absolute",
    width: 48,
    height: 2,
    backgroundColor: "rgba(255, 240, 150, 0.85)",
    bottom: 3,
    left: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 2,
  },

  wheelFrontContainer: {
    position: "absolute",
    width: 72,
    height: 72,
    bottom: 2,
    left: 35,
    borderRadius: 36,
    overflow: "hidden",
  },

  wheelRearContainer: {
    position: "absolute",
    width: 72,
    height: 72,
    bottom: 2,
    right: 35,
    borderRadius: 36,
    overflow: "hidden",
  },

  wheel: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(140, 140, 140, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  tireTread: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 36,
    borderWidth: 6,
    borderColor: "rgba(30, 30, 30, 0.9)",
  },

  wheelSpokes: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  spoke: {
    position: "absolute",
    width: 1,
    height: "48%",
    backgroundColor: "rgba(80, 80, 80, 0.8)",
  },

  wheelCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1a1a1a",
    borderWidth: 1.5,
    borderColor: "rgba(200, 200, 200, 0.9)",
    zIndex: 5,
  },

  wheelTireBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(50, 50, 50, 0.6)",
  },

  exhaustContainer: {
    position: "absolute",
    width: 60,
    height: 32,
    bottom: 18,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: 6,
  },

  exhaustPipe: {
    width: 14,
    height: 24,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.7)",
  },

  paintShine: {
    position: "absolute",
    width: 100,
    height: "100%",
    pointerEvents: "none",
  },

  polishGlow: {
    pointerEvents: "none",
  },

  topLight: {
    pointerEvents: "none",
  },

  tapHint: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    zIndex: 5,
  },

  tapDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(30, 144, 255, 0.7)",
  },
});
