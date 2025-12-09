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
  const [nextIndex, setNextIndex] = useState(1);
  const nextVideoOpacity = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextVideoOpacity.value = withTiming(1, { duration: 800 });
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
        setNextIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
        nextVideoOpacity.value = 0;
      }, 800);
    }, 8000);
    return () => clearInterval(interval);
  }, [nextVideoOpacity]);

  const active = HERO_VIDEOS[activeIndex];
  const next = HERO_VIDEOS[nextIndex];

  const activeVideoUrl = (() => {
    try {
      const baseUrl = getApiUrl();
      return new URL(active.videoPath, baseUrl).href;
    } catch {
      return active.videoPath;
    }
  })();

  const nextVideoUrl = (() => {
    try {
      const baseUrl = getApiUrl();
      return new URL(next.videoPath, baseUrl).href;
    } catch {
      return next.videoPath;
    }
  })();

  const activePlayer = useVideoPlayer(activeVideoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const nextPlayer = useVideoPlayer(nextVideoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const nextVideoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: nextVideoOpacity.value,
  }));

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
      {Platform.OS === "web" ? (
        <>
          <video
            src={activeVideoUrl}
            style={styles.videoWeb as any}
            autoPlay
            loop
            muted
            playsInline
          />
          <Animated.View style={[styles.videoOverlay, nextVideoAnimatedStyle]}>
            <video
              src={nextVideoUrl}
              style={styles.videoWeb as any}
              autoPlay
              loop
              muted
              playsInline
            />
          </Animated.View>
        </>
      ) : (
        <>
          <VideoView
            style={styles.videoNative}
            player={activePlayer}
            nativeControls={false}
            contentFit="cover"
            pointerEvents="none"
          />
          <Animated.View style={[styles.videoOverlay, nextVideoAnimatedStyle]}>
            <VideoView
              style={styles.videoNative}
              player={nextPlayer}
              nativeControls={false}
              contentFit="cover"
              pointerEvents="none"
            />
          </Animated.View>
        </>
      )}

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
  videoNative: {
    width: "100%",
    height: "100%",
  },
  videoWeb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } as any,
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
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
