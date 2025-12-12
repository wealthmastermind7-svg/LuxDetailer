import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Animated, { FadeIn } from "react-native-reanimated";
import { BorderRadius, Spacing } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

interface HomeVideoHeroProps {
  onPress?: () => void;
}

export function HomeVideoHero({ onPress }: HomeVideoHeroProps) {
  const videoUrl = (() => {
    try {
      const baseUrl = getApiUrl();
      return new URL("/videos/luxury_car_detailing_showcase.mp4", baseUrl).href;
    } catch {
      return "/videos/luxury_car_detailing_showcase.mp4";
    }
  })();

  const player = useVideoPlayer(videoUrl, (player) => {
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
  },
  videoWeb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } as any,
});
