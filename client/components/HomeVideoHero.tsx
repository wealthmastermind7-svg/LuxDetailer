import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

interface HomeVideoHeroProps {
  onPress?: () => void;
}

export function HomeVideoHero({ onPress }: HomeVideoHeroProps) {
  const videoUrl = (() => {
    try {
      const baseUrl = getApiUrl();
      return new URL("/videos/red_luxury_sports_car_being_detailed.mp4", baseUrl).href;
    } catch {
      return "/videos/red_luxury_sports_car_being_detailed.mp4";
    }
  })();

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
      {Platform.OS === "web" ? (
        <video
          src={videoUrl}
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
        colors={[
          "rgba(0, 0, 0, 0.3)",
          "rgba(0, 0, 0, 0.5)",
          "rgba(0, 0, 0, 0.7)",
        ]}
        style={styles.overlay}
      />

      <Animated.View style={styles.content} entering={FadeIn.delay(300).duration(800)}>
        <ThemedText type="h1" style={styles.heroTitle}>
          Premium Car
        </ThemedText>
        <ThemedText type="h1" style={styles.heroTitleAccent}>
          Detailing
        </ThemedText>
        <ThemedText type="body" style={styles.heroSubtitle}>
          Experience the art of automotive perfection
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 380,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: "#1a1a1a",
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: Spacing.xs,
  },
  heroTitleAccent: {
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
    color: Colors.dark.accent,
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    opacity: 0.8,
    fontSize: 16,
  },
});
