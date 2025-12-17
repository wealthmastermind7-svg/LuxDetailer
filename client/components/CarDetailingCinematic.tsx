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
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Spacing } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface CarDetailingCinematicProps {
  height?: number;
  onInteract?: () => void;
}

/**
 * Realistic car detailing cinematic showcase
 * Features: chrome wheels, flashing headlights, exhaust glow, odometer, paint shine
 * Sharp, crisp animations - no blur, handcrafted details
 */
export function CarDetailingCinematic({
  height = 380,
  onInteract,
}: CarDetailingCinematicProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Continuous animations
  const paintShine = useSharedValue(0);
  const exhaustPulse = useSharedValue(0);
  const headlightFlash = useSharedValue(0);
  const odometerSpin = useSharedValue(0);
  const wheelRotation = useSharedValue(0);
  const chromeShine = useSharedValue(0);

  // Interactive animations
  const polishMotion = useSharedValue(0);
  const detailingGlow = useSharedValue(0);

  // Paint shine
  useEffect(() => {
    paintShine.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      true
    );
  }, [paintShine]);

  // Exhaust pulse
  useEffect(() => {
    exhaustPulse.value = withRepeat(
      withTiming(1, { duration: 2200 }),
      -1,
      true
    );
  }, [exhaustPulse]);

  // Headlight flashing
  useEffect(() => {
    headlightFlash.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, [headlightFlash]);

  // Odometer
  useEffect(() => {
    odometerSpin.value = withRepeat(
      withTiming(1, { duration: 5000 }),
      -1,
      true
    );
  }, [odometerSpin]);

  // Wheel rotation
  useEffect(() => {
    wheelRotation.value = withRepeat(
      withTiming(1, { duration: 2500 }),
      -1,
      true
    );
  }, [wheelRotation]);

  // Chrome shine
  useEffect(() => {
    chromeShine.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, [chromeShine]);

  const handlePress = () => {
    setIsInteracting(true);
    polishMotion.value = withTiming(1, { duration: 1200 });
    detailingGlow.value = withTiming(1, { duration: 800 });

    setTimeout(() => {
      polishMotion.value = withTiming(0, { duration: 600 });
      detailingGlow.value = withTiming(0, { duration: 600 });
      setIsInteracting(false);
    }, 1200);

    onInteract?.();
  };

  // Paint shine sweep
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

  // Headlight flash
  const headlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      headlightFlash.value,
      [0, 0.4, 0.6, 1],
      [0.3, 1, 0.3, 0.3],
      Extrapolate.CLAMP
    ),
  }));

  // Exhaust glow
  const exhaustStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      exhaustPulse.value,
      [0, 0.5, 1],
      [0.2, 0.7, 0.2],
      Extrapolate.CLAMP
    ),
  }));

  // Odometer needle
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
  const chromeStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      chromeShine.value,
      [0, 1],
      [-150, width + 150],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
      opacity: interpolate(
        chromeShine.value,
        [0, 0.3, 0.7, 1],
        [0, 0.7, 0.7, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  // Detailing glow
  const detailingStyle = useAnimatedStyle(() => ({
    opacity: detailingGlow.value,
  }));

  return (
    <Pressable onPress={handlePress} style={{ height }}>
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.container, { height }]}
      >
        {/* Dark luxury base */}
        <LinearGradient
          colors={["#0A0E1A", "#1a2332", "#0D1120"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Car body - polished paint */}
        <View style={[styles.carBody, StyleSheet.absoluteFill]} />

        {/* Paint shine - sharp sweep */}
        <Animated.View
          style={[
            styles.paintShine,
            paintShineStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.3)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 120, height: "100%" }}
          />
        </Animated.View>

        {/* Chrome wheels - left */}
        <View style={styles.wheelLeftContainer}>
          <Animated.View
            style={[
              styles.wheelBase,
              wheelStyle,
            ]}
          >
            <LinearGradient
              colors={["#F5F5F5", "#D3D3D3", "#A9A9A9", "#D3D3D3", "#F5F5F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Wheel spokes */}
            <View style={styles.wheelSpokes}>
              <View style={styles.spoke} />
              <View style={[styles.spoke, { transform: [{ rotate: "90deg" }] }]} />
              <View style={[styles.spoke, { transform: [{ rotate: "45deg" }] }]} />
              <View style={[styles.spoke, { transform: [{ rotate: "135deg" }] }]} />
            </View>
            <View style={styles.wheelCenter} />
          </Animated.View>
        </View>

        {/* Chrome wheels - right */}
        <View style={styles.wheelRightContainer}>
          <Animated.View
            style={[
              styles.wheelBase,
              wheelStyle,
            ]}
          >
            <LinearGradient
              colors={["#F5F5F5", "#D3D3D3", "#A9A9A9", "#D3D3D3", "#F5F5F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Wheel spokes */}
            <View style={styles.wheelSpokes}>
              <View style={styles.spoke} />
              <View style={[styles.spoke, { transform: [{ rotate: "90deg" }] }]} />
              <View style={[styles.spoke, { transform: [{ rotate: "45deg" }] }]} />
              <View style={[styles.spoke, { transform: [{ rotate: "135deg" }] }]} />
            </View>
            <View style={styles.wheelCenter} />
          </Animated.View>
        </View>

        {/* Chrome reflection sweep */}
        <Animated.View
          style={[
            styles.chromeReflection,
            chromeStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.5)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ width: 80, height: "100%" }}
          />
        </Animated.View>

        {/* Headlights - left and right */}
        <Animated.View
          style={[
            styles.headlightLeft,
            headlightStyle,
          ]}
        >
          <LinearGradient
            colors={["#FFE066", "#FFD700", "#FFA500"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.headlightRight,
            headlightStyle,
          ]}
        >
          <LinearGradient
            colors={["#FFE066", "#FFD700", "#FFA500"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Exhaust pipes - bottom center */}
        <Animated.View style={[styles.exhaustContainer, exhaustStyle]}>
          {/* Left exhaust */}
          <LinearGradient
            colors={["#3a3a3a", "#5a5a5a", "#4a4a4a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.exhaustPipe}
          />
          {/* Right exhaust */}
          <LinearGradient
            colors={["#3a3a3a", "#5a5a5a", "#4a4a4a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.exhaustPipe}
          />
        </Animated.View>

        {/* Odometer display - center top */}
        <View style={styles.odometerContainer}>
          <View style={styles.odometerFace}>
            <LinearGradient
              colors={["#1a1a1a", "#2a2a2a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.odometerRing} />

            {/* Odometer needle */}
            <Animated.View
              style={[
                styles.odometerNeedle,
                odometerStyle,
              ]}
            >
              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            {/* Center point */}
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
            <View style={styles.padBorder} />
          </View>
        </Pressable>

        {/* Detailing intensity glow */}
        {isInteracting && (
          <Animated.View
            style={[
              styles.detailingGlowOverlay,
              detailingStyle,
              StyleSheet.absoluteFill,
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(212, 175, 55, 0.2)",
                "rgba(255, 220, 100, 0.1)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}

        {/* Top shimmer for depth */}
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.08)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.3 }}
          style={[styles.shimmerTop, StyleSheet.absoluteFill]}
          pointerEvents="none"
        />

        {/* Tap indicator */}
        {!isInteracting && (
          <View style={styles.tapIndicator}>
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
  carBody: {
    backgroundColor: "rgba(20, 35, 55, 0.9)",
  },
  paintShine: {
    position: "absolute",
    width: 120,
    height: "100%",
    pointerEvents: "none",
  },

  // Wheels
  wheelLeftContainer: {
    position: "absolute",
    width: 75,
    height: 75,
    bottom: 25,
    left: 35,
    borderRadius: 37.5,
    overflow: "hidden",
  },
  wheelRightContainer: {
    position: "absolute",
    width: 75,
    height: 75,
    bottom: 25,
    right: 35,
    borderRadius: 37.5,
    overflow: "hidden",
  },
  wheelBase: {
    width: "100%",
    height: "100%",
    borderRadius: 37.5,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(160, 160, 160, 0.8)",
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
    width: 2,
    height: "50%",
    backgroundColor: "rgba(100, 100, 100, 0.6)",
  },
  wheelCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3a3a3a",
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.8)",
    zIndex: 10,
  },

  // Chrome reflection
  chromeReflection: {
    position: "absolute",
    width: 80,
    height: "100%",
    pointerEvents: "none",
  },

  // Headlights
  headlightLeft: {
    position: "absolute",
    width: 45,
    height: 28,
    top: 45,
    left: 25,
    borderRadius: 3,
    overflow: "hidden",
  },
  headlightRight: {
    position: "absolute",
    width: 45,
    height: 28,
    top: 45,
    right: 25,
    borderRadius: 3,
    overflow: "hidden",
  },

  // Exhaust
  exhaustContainer: {
    position: "absolute",
    width: 70,
    height: 35,
    bottom: 28,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  exhaustPipe: {
    width: 18,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(80, 80, 80, 0.8)",
  },

  // Odometer
  odometerContainer: {
    position: "absolute",
    width: 85,
    height: 85,
    top: 35,
    alignSelf: "center",
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
    borderColor: "rgba(212, 175, 55, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  odometerRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  odometerNeedle: {
    position: "absolute",
    width: 2.5,
    height: 26,
    borderRadius: 1.25,
  },
  odometerCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(212, 175, 55, 1)",
    position: "absolute",
    zIndex: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 220, 100, 0.8)",
  },

  // Detailing pad
  detailingPadContainer: {
    position: "absolute",
    width: 75,
    height: 75,
    bottom: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
  },
  detailingPad: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(30, 144, 255, 0.6)",
  },
  padBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 32.5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  // Effects
  detailingGlowOverlay: {
    pointerEvents: "none",
  },
  shimmerTop: {
    pointerEvents: "none",
  },

  // Indicator
  tapIndicator: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    zIndex: 5,
  },
  tapDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(30, 144, 255, 0.7)",
  },
});
