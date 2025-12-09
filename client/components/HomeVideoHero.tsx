import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeOut, SlideInDown, withTiming, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

interface HomeVideoHeroProps {
  onPress?: () => void;
}

const HERO_VIDEOS = [
  {
    id: 1,
    title: "Full Exterior Detail",
    subtitle: "Premium Red Ferrari",
    videoPath: "/videos/red_luxury_sports_car_being_detailed.mp4",
    accent: "#FF6B6B",
  },
  {
    id: 2,
    title: "Ceramic Coating",
    subtitle: "Luxury Black Mercedes",
    videoPath: "/videos/black_luxury_car_ceramic_coating.mp4",
    accent: "#4ECDC4",
  },
  {
    id: 3,
    title: "Interior Detailing",
    subtitle: "Premium White Tesla",
    videoPath: "/videos/white_luxury_car_interior_detailing.mp4",
    accent: "#45B7D1",
  },
  {
    id: 4,
    title: "Paint Correction",
    subtitle: "Metallic Silver BMW",
    videoPath: "/videos/silver_luxury_car_polishing_finish.mp4",
    accent: "#F9CA24",
  },
];

export function HomeVideoHero({ onPress }: HomeVideoHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentOpacity = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      contentOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
        contentOpacity.value = withTiming(1, { duration: 500 });
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, [contentOpacity]);

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

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

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

      <Animated.View
        style={[styles.content, contentAnimatedStyle]}
        entering={FadeIn.delay(300).duration(800)}
        key={`content-${activeIndex}`}
      >
        <Animated.View
          entering={SlideInDown.duration(600).springify()}
          key={`title-${activeIndex}`}
        >
          <ThemedText type="h1" style={[styles.heroTitle, { color: active.accent }]}>
            {active.title}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={SlideInDown.delay(100).duration(600).springify()}
          key={`subtitle-${activeIndex}`}
        >
          <ThemedText type="h3" style={styles.heroSubtitle}>
            {active.subtitle}
          </ThemedText>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={styles.indicators}
        entering={FadeIn.duration(400)}
        key={`indicators-${activeIndex}`}
      >
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
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    opacity: 0.8,
    fontSize: 18,
    fontWeight: "500",
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
