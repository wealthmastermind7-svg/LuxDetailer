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
 * Realistic car detailing showcase
 * Shows actual car with detailing effects: paint shine, headlight flash, wheel rotation, exhaust glow
 */
export function CarDetailingCinematic({
  height = 380,
  onInteract,
}: CarDetailingCinematicProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Continuous animations
  const paintShine = useSharedValue(0);
  const headlightFlash = useSharedValue(0);
  const wheelRotation = useSharedValue(0);
  const exhaustGlow = useSharedValue(0);

  // Interactive
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
      withTiming(1, { duration: 1800 }),
      -1,
      true
    );
  }, [headlightFlash]);

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

  // Paint shine
  const paintShineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(paintShine.value, [0, 1], [-width, width], Extrapolate.CLAMP);
    return { transform: [{ translateX }] };
  });

  // Headlight flash
  const headlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(headlightFlash.value, [0, 0.3, 0.7, 1], [0.4, 1, 0.4, 0.4], Extrapolate.CLAMP),
  }));

  // Wheel rotation
  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(wheelRotation.value, [0, 1], [0, 360], Extrapolate.CLAMP)}deg` }],
  }));

  // Exhaust glow
  const exhaustStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exhaustGlow.value, [0, 0.5, 1], [0.25, 0.75, 0.25], Extrapolate.CLAMP),
  }));

  // Polish pulse
  const polishStyle = useAnimatedStyle(() => ({
    opacity: polishPulse.value,
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View entering={FadeIn.duration(600)} style={[styles.container, { height }]}>
        {/* Dark garage background */}
        <LinearGradient
          colors={["#1a1a1a", "#252525", "#1a1a1a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Car body - red finish */}
        <View style={styles.carContainer}>
          {/* Car main body */}
          <View style={styles.carBody}>
            <LinearGradient
              colors={["#CC1A2E", "#E8273A", "#B71428"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Hood reflection */}
            <View style={styles.hoodReflection} />

            {/* Windshield */}
            <View style={styles.windshield}>
              <LinearGradient
                colors={["rgba(100, 150, 200, 0.3)", "rgba(80, 120, 180, 0.2)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* Side window */}
            <View style={styles.sideWindow}>
              <LinearGradient
                colors={["rgba(100, 150, 200, 0.25)", "rgba(80, 120, 180, 0.15)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* Door line */}
            <View style={styles.doorLine} />
          </View>

          {/* Headlights - left */}
          <Animated.View style={[styles.headlightLeftContainer, headlightStyle]}>
            <LinearGradient
              colors={["#FFF8DC", "#FFD700", "#FFA500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Headlights - right */}
          <Animated.View style={[styles.headlightRightContainer, headlightStyle]}>
            <LinearGradient
              colors={["#FFF8DC", "#FFD700", "#FFA500"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Chrome wheels - front */}
          <View style={styles.wheelFrontContainer}>
            <Animated.View style={[styles.wheel, wheelStyle]}>
              <LinearGradient
                colors={["#F0F0F0", "#D0D0D0", "#A0A0A0", "#D0D0D0", "#F0F0F0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Wheel spokes */}
              <View style={styles.wheelSpokes}>
                <View style={styles.spoke} />
                <View style={[styles.spoke, { transform: [{ rotate: "72deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "144deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "216deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "288deg" }] }]} />
              </View>
              <View style={styles.wheelCenter} />
            </Animated.View>
          </View>

          {/* Chrome wheels - rear */}
          <View style={styles.wheelRearContainer}>
            <Animated.View style={[styles.wheel, wheelStyle]}>
              <LinearGradient
                colors={["#F0F0F0", "#D0D0D0", "#A0A0A0", "#D0D0D0", "#F0F0F0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Wheel spokes */}
              <View style={styles.wheelSpokes}>
                <View style={styles.spoke} />
                <View style={[styles.spoke, { transform: [{ rotate: "72deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "144deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "216deg" }] }]} />
                <View style={[styles.spoke, { transform: [{ rotate: "288deg" }] }]} />
              </View>
              <View style={styles.wheelCenter} />
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

        {/* Paint shine sweep - over top */}
        <Animated.View style={[styles.paintShine, paintShineStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.35)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 100, height: "100%" }}
          />
        </Animated.View>

        {/* Polish glow effect */}
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

  headlightLeftContainer: {
    position: "absolute",
    width: 40,
    height: 22,
    top: 75,
    left: 25,
    borderRadius: 2,
    overflow: "hidden",
  },

  headlightRightContainer: {
    position: "absolute",
    width: 40,
    height: 22,
    top: 75,
    right: 25,
    borderRadius: 2,
    overflow: "hidden",
  },

  wheelFrontContainer: {
    position: "absolute",
    width: 65,
    height: 65,
    bottom: 5,
    left: 40,
    borderRadius: 32.5,
    overflow: "hidden",
  },

  wheelRearContainer: {
    position: "absolute",
    width: 65,
    height: 65,
    bottom: 5,
    right: 40,
    borderRadius: 32.5,
    overflow: "hidden",
  },

  wheel: {
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(140, 140, 140, 0.7)",
    justifyContent: "center",
    alignItems: "center",
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
    width: 1.5,
    height: "45%",
    backgroundColor: "rgba(80, 80, 80, 0.7)",
  },

  wheelCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.8)",
    zIndex: 5,
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
