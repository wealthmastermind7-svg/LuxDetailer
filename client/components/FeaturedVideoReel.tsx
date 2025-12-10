import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

const SHOWCASE_VIDEO = "/videos/services_cinematic_montage.mp4";

export function FeaturedVideoReel() {
  let videoUrl = "";
  try {
    const baseUrl = getApiUrl();
    videoUrl = new URL(SHOWCASE_VIDEO, baseUrl).href;
  } catch {
    videoUrl = SHOWCASE_VIDEO;
  }

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View style={styles.container}>
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
        colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
        style={styles.overlay}
      />

      <View style={styles.content}>
        <ThemedText type="h2" style={styles.title}>
          Premium Car Detailing
        </ThemedText>
        <ThemedText type="h4" style={styles.subtitle}>
          Experience luxury care for your vehicle
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
  title: {
    marginBottom: Spacing.xs,
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.accent,
  },
  subtitle: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: "500",
  },
});
