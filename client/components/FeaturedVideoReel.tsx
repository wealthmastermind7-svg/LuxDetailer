import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";

const FEATURED_VIDEOS = [
  {
    id: 1,
    title: "Full Exterior Detail",
    subtitle: "Complete wash, polish & protection",
    description: "Premium exterior detailing service",
    videoPath: "/videos/red_luxury_sports_car_being_detailed.mp4",
    accent: "#FF6B6B",
  },
  {
    id: 2,
    title: "Ceramic Coating",
    subtitle: "Premium paint protection",
    description: "Long-lasting protective coating",
    videoPath: "/videos/black_luxury_car_ceramic_coating.mp4",
    accent: "#4ECDC4",
  },
  {
    id: 3,
    title: "Interior Detailing",
    subtitle: "Deep clean & conditioning",
    description: "Professional interior restoration",
    videoPath: "/videos/white_luxury_car_interior_detailing.mp4",
    accent: "#45B7D1",
  },
  {
    id: 4,
    title: "Paint Correction",
    subtitle: "Restore shine & clarity",
    description: "Expert paint correction service",
    videoPath: "/videos/silver_luxury_car_polishing_finish.mp4",
    accent: "#F9CA24",
  },
];

export function FeaturedVideoReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorProgress = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_VIDEOS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    indicatorProgress.value = withTiming(1, { duration: 300 });
  }, [activeIndex, indicatorProgress]);

  const active = FEATURED_VIDEOS[activeIndex];
  
  let videoUrl = "";
  try {
    const baseUrl = getApiUrl();
    videoUrl = new URL(active.videoPath, baseUrl).href;
  } catch {
    videoUrl = active.videoPath;
  }

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: indicatorProgress.value,
  }));

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
        colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
        style={styles.overlay}
      />

      <Animated.View
        style={[styles.content, contentAnimatedStyle]}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        key={`content-${activeIndex}`}
      >
        <Animated.View key={`title-${activeIndex}`}>
          <ThemedText type="h2" style={[styles.title, { color: active.accent }]}>
            {active.title}
          </ThemedText>
        </Animated.View>

        <Animated.View key={`subtitle-${activeIndex}`}>
          <ThemedText type="h4" style={styles.subtitle}>
            {active.subtitle}
          </ThemedText>
        </Animated.View>

        <Animated.View key={`desc-${activeIndex}`}>
          <ThemedText type="body" style={styles.description}>
            {active.description}
          </ThemedText>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={styles.indicators}
        key={`indicators-${activeIndex}`}
      >
        {FEATURED_VIDEOS.map((service, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              index === activeIndex && [
                styles.indicatorActive,
                { backgroundColor: service.accent },
              ],
            ]}
          />
        ))}
      </Animated.View>
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
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.sm,
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    opacity: 0.85,
    fontSize: 15,
  },
  indicators: {
    position: "absolute",
    bottom: Spacing.lg,
    right: Spacing.lg,
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
