import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

// Hardcoded local video source - luxury car detailing showcase
// Bundled with app for reliable TestFlight and App Store deployment
const PREMIUM_SHOWCASE_VIDEO = require("../../assets/videos/premium_showcase.mp4");

export function PremiumVideoMontage() {
  const player = useVideoPlayer(PREMIUM_SHOWCASE_VIDEO, (player) => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    const startPlayback = async () => {
      try {
        await player.play();
      } catch (e) {
        // Play may fail if player not ready - will retry
      }
    };
    startPlayback();
  }, [player]);

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <video
          style={styles.videoWeb as any}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <VideoView
          style={styles.videoNative}
          player={player}
          nativeControls={false}
          contentFit="cover"
          pointerEvents="none"
        />
      )}

      <LinearGradient
        colors={["rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.85)"]}
        style={styles.overlay}
      />

      <View style={styles.content}>
        <View style={styles.badge}>
          <ThemedText type="caption" style={styles.badgeText}>
            LUXURY COLLECTION
          </ThemedText>
        </View>
        <ThemedText type="h2" style={styles.title}>
          Precision Perfection
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          Elevate your vehicle with our award-winning detailing expertise
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 420,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: Colors.dark.glassBorder,
  },
  videoNative: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  videoWeb: {
    width: "100%",
    height: "100%",
    position: "absolute",
    objectFit: "cover",
  } as any,
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: `${Colors.dark.accent}30`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.dark.accent}50`,
  },
  badgeText: {
    color: Colors.dark.accent,
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: Spacing.sm,
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    opacity: 0.85,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
  },
});
