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
      const url = new URL("/videos/red_luxury_sports_car_being_detailed.mp4", baseUrl);
      return url.href;
    } catch {
      return "/videos/red_luxury_sports_car_being_detailed.mp4";
    }
  })();

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.playbackRate = 1;
  });

  useEffect(() => {
    const playTimer = setTimeout(async () => {
      try {
        await player.play();
      } catch (e) {
        console.log("Video playback initiated");
      }
    }, 100);
    return () => clearTimeout(playTimer);
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
