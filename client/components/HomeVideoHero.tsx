import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Animated, { FadeIn, withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { BorderRadius, Spacing } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

interface HomeVideoHeroProps {
  onPress?: () => void;
}

const HERO_VIDEOS = [
  {
    id: 1,
    videoPath: "/videos/red_luxury_sports_car_being_detailed.mp4",
    accent: "#FF6B6B",
  },
  {
    id: 2,
    videoPath: "/videos/black_luxury_car_ceramic_coating.mp4",
    accent: "#4ECDC4",
  },
  {
    id: 3,
    videoPath: "/videos/white_luxury_car_interior_detailing.mp4",
    accent: "#45B7D1",
  },
  {
    id: 4,
    videoPath: "/videos/silver_luxury_car_polishing_finish.mp4",
    accent: "#F9CA24",
  },
];

export function HomeVideoHero({ onPress }: HomeVideoHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoOpacity = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      videoOpacity.value = withTiming(0, { duration: 600 });
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
        videoOpacity.value = withTiming(1, { duration: 600 });
      }, 600);
    }, 8000);
    return () => clearInterval(interval);
  }, [videoOpacity]);

  const active = HERO_VIDEOS[activeIndex];

  const videoUrl = (() => {
    try {
      const baseUrl = getApiUrl();
      return new URL(active.videoPath, baseUrl).href;
    } catch {
      return active.videoPath;
    }
  })();

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const videoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: videoOpacity.value,
  }));

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
      <Animated.View style={[styles.videoWrapper, videoAnimatedStyle]}>
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

      <View style={styles.indicators}>
        {HERO_VIDEOS.map((video, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              index === activeIndex && [
                styles.indicatorActive,
                { backgroundColor: video.accent },
              ],
            ]}
            entering={FadeIn.duration(300)}
          />
        ))}
      </View>
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
  videoWrapper: {
    width: "100%",
    height: "100%",
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
  indicators: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    flexDirection: "row",
    gap: Spacing.sm,
    zIndex: 2,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  indicatorActive: {
    width: 28,
  },
});
