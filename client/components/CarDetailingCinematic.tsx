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
 * Premium car detailing cinematic showcase
 * Features: shiny exhaust, flashing headlights, chrome wheels, paint shine, odometer
 * Interactive handcrafted animations with parallax and smooth transitions
 */
export function CarDetailingCinematic({
  height = 380,
  onInteract,
}: CarDetailingCinematicProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Continuous animations
  const paintShine = useSharedValue(0);
  const exhaustGlow = useSharedValue(0);
  const headlightFlash = useSharedValue(0);
  const odometerSpin = useSharedValue(0);
  const wheelRotation = useSharedValue(0);
  const chromeReflection = useSharedValue(0);

  // Interactive animations
  const polishMotion = useSharedValue(0);
  const detailingIntensity = useSharedValue(0);

  // Paint shine animation (continuous)
  useEffect(() => {
    paintShine.value = withRepeat(
      withTiming(1, { duration: 3500 }),
      -1,
      true
    );
  }, [paintShine]);

  // Exhaust shimmer effect
  useEffect(() => {
    exhaustGlow.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, [exhaustGlow]);

  // Headlight flashing
  useEffect(() => {
    headlightFlash.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      true
    );
  }, [headlightFlash]);

  // Odometer needle animation
  useEffect(() => {
    odometerSpin.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );
  }, [odometerSpin]);

  // Wheel rotation
  useEffect(() => {
    wheelRotation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, [wheelRotation]);

  // Chrome reflection sweep
  useEffect(() => {
    chromeReflection.value = withRepeat(
      withTiming(1, { duration: 2800 }),
      -1,
      true
    );
  }, [chromeReflection]);

  const handlePress = () => {
    setIsInteracting(true);

    // Polish motion
    polishMotion.value = withTiming(1, { duration: 1200 });
    detailingIntensity.value = withTiming(1, { duration: 800 });

    setTimeout(() => {
      polishMotion.value = withTiming(0, { duration: 600 });
      detailingIntensity.value = withTiming(0, { duration: 600 });
      setIsInteracting(false);
    }, 1200);

    onInteract?.();
  };

  // Paint shine wave
  const paintShineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      paintShine.value,
      [0, 1],
      [-width, width],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
    };
  });

  // Exhaust glow effect
  const exhaustStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      exhaustGlow.value,
      [0, 0.5, 1],
      [0.3, 0.8, 0.3],
      Extrapolate.CLAMP
    ),
  }));

  // Headlight flashing
  const headlightLeftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      headlightFlash.value,
      [0, 0.3, 0.7, 1],
      [0.4, 1, 0.4, 0.4],
      Extrapolate.CLAMP
    ),
  }));

  const headlightRightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      headlightFlash.value,
      [0, 0.3, 0.7, 1],
      [0.4, 0.4, 1, 0.4],
      Extrapolate.CLAMP
    ),
  }));

  // Odometer needle spin
  const odometerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          odometerSpin.value,
          [0, 1],
          [0, 360],
          Extrapolate.CLAMP
        )}deg`,
      },
    ],
  }));

  // Wheel rotation
  const wheelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          wheelRotation.value,
          [0, 1],
          [0, 360],
          Extrapolate.CLAMP
        )}deg`,
      },
    ],
  }));

  // Chrome reflection
  const chromeReflectionStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      chromeReflection.value,
      [0, 1],
      [-300, width + 300],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
      opacity: interpolate(
        chromeReflection.value,
        [0, 0.3, 0.7, 1],
        [0, 0.6, 0.6, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  // Detailing intensity overlay
  const detailingStyle = useAnimatedStyle(() => ({
    opacity: detailingIntensity.value,
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.container, { height }]}
      >
        {/* Dark luxury gradient base */}
        <LinearGradient
          colors={["#0A0E1A", "#1a2332", "#0D1120"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Paint surface */}
        <View style={[styles.paintSurface, StyleSheet.absoluteFill]} />

        {/* Protective coating layer */}
        <View
          style={[
            styles.coatingLayer,
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
        </View>

        {/* Paint shine wave */}
        <Animated.View style={[styles.shineWave, paintShineStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.25)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 200, height: "100%" }}
          />
        </Animated.View>

        {/* Chrome wheels - left and right */}
        <Animated.View
          style={[
            styles.wheelLeft,
            wheelStyle,
          ]}
        >
          <LinearGradient
            colors={["#E8E8E8", "#C0C0C0", "#A9A9A9", "#C0C0C0", "#E8E8E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.wheelTread} />
        </Animated.View>

        <Animated.View
          style={[
            styles.wheelRight,
            wheelStyle,
          ]}
        >
          <LinearGradient
            colors={["#E8E8E8", "#C0C0C0", "#A9A9A9", "#C0C0C0", "#E8E8E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.wheelTread} />
        </Animated.View>

        {/* Chrome reflection sweep */}
        <Animated.View
          style={[
            styles.chromeReflection,
            chromeReflectionStyle,
            StyleSheet.absoluteFill,
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.4)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Headlights - left and right with flashing */}
        <Animated.View
          style={[
            styles.headlightLeft,
            headlightLeftStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255, 220, 100, 0)",
              "rgba(255, 220, 100, 0.8)",
              "rgba(255, 200, 50, 0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.headlightRight,
            headlightRightStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255, 220, 100, 0)",
              "rgba(255, 220, 100, 0.8)",
              "rgba(255, 200, 50, 0)",
            ]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Exhaust shimmer - lower area */}
        <Animated.View
          style={[
            styles.exhaustArea,
            exhaustStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 140, 60, 0.3)",
              "rgba(255, 180, 100, 0.2)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Odometer display - center with spinning needle */}
        <View style={styles.odometerContainer}>
          <View style={styles.odometerFace}>
            <LinearGradient
              colors={["#1a1a1a", "#2a2a2a", "#1a1a1a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.odometerBorder} />

            {/* Spinning needle */}
            <Animated.View
              style={[
                styles.odometerNeedle,
                odometerStyle,
              ]}
            >
              <LinearGradient
                colors={["rgba(212, 175, 55, 0.8)", "rgba(255, 220, 100, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            {/* Center cap */}
            <View style={styles.odometerCenter} />
          </View>
        </View>

        {/* Interactive detailing pad */}
        <Pressable
          style={styles.detailingPadContainer}
          onPress={handlePress}
        >
          <View style={styles.detailingPad}>
            <LinearGradient
              colors={["#1E90FF", "#1B7ACC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </Pressable>

        {/* Detailing intensity flash */}
        {isInteracting && (
          <Animated.View
            style={[
              styles.detailingFlash,
              detailingStyle,
              StyleSheet.absoluteFill,
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(212, 175, 55, 0.3)",
                "rgba(255, 220, 100, 0.1)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}

        {/* Shimmer overlay */}
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
  shineWave: {
    position: "absolute",
    width: 200,
    height: "100%",
    pointerEvents: "none",
  },
  wheelLeft: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    bottom: 30,
    left: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(192, 192, 192, 0.5)",
  },
  wheelRight: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    bottom: 30,
    right: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(192, 192, 192, 0.5)",
  },
  wheelTread: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  chromeReflection: {
    width: "100%",
    height: "60%",
    pointerEvents: "none",
  },
  headlightLeft: {
    position: "absolute",
    width: 50,
    height: 30,
    top: 50,
    left: 30,
    borderRadius: 4,
    overflow: "hidden",
  },
  headlightRight: {
    position: "absolute",
    width: 50,
    height: 30,
    top: 50,
    right: 30,
    borderRadius: 4,
    overflow: "hidden",
  },
  exhaustArea: {
    position: "absolute",
    width: 60,
    height: 40,
    bottom: 35,
    alignSelf: "center",
    marginLeft: 20,
  },
  odometerContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
  },
  odometerFace: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  odometerBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  odometerNeedle: {
    position: "absolute",
    width: 3,
    height: 28,
    backgroundColor: "rgba(212, 175, 55, 0.8)",
    borderRadius: 2,
  },
  odometerCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(212, 175, 55, 1)",
    position: "absolute",
    zIndex: 2,
  },
  detailingPadContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
  },
  detailingPad: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(30, 144, 255, 0.5)",
  },
  detailingFlash: {
    pointerEvents: "none",
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
