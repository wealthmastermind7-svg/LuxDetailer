import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const FEATURED_VIDEOS = [
  {
    id: 1,
    title: "Full Exterior Detail",
    subtitle: "Premium Red Ferrari",
    description: "Complete wash, polish & protection",
    videoUrl: "/videos/red_luxury_sports_car_being_detailed.mp4",
    accent: "#FF6B6B",
  },
  {
    id: 2,
    title: "Ceramic Coating",
    subtitle: "Luxury Black Mercedes",
    description: "Premium paint protection",
    videoUrl: "/videos/black_luxury_car_ceramic_coating.mp4",
    accent: "#4ECDC4",
  },
  {
    id: 3,
    title: "Interior Detailing",
    subtitle: "Premium White Tesla",
    description: "Deep clean & conditioning",
    videoUrl: "/videos/white_luxury_car_interior_detailing.mp4",
    accent: "#45B7D1",
  },
  {
    id: 4,
    title: "Paint Correction",
    subtitle: "Metallic Silver BMW",
    description: "Restore shine & clarity",
    videoUrl: "/videos/silver_luxury_car_polishing_finish.mp4",
    accent: "#F9CA24",
  },
];

export function FeaturedVideoReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_VIDEOS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const active = FEATURED_VIDEOS[activeIndex];
  const videoUrl = `${active.videoUrl}`;

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <video
          src={videoUrl}
          style={styles.videoWeb as any}
          autoPlay
          loop
          muted
        />
      ) : (
        <View style={styles.videoPlaceholder}>
          <ThemedText type="body">Premium Video</ThemedText>
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
        style={styles.overlay}
      />

      <View style={styles.content}>
        <ThemedText type="h2" style={[styles.title, { color: active.accent }]}>
          {active.title}
        </ThemedText>

        <ThemedText type="h4" style={styles.subtitle}>
          {active.subtitle}
        </ThemedText>

        <ThemedText type="body" style={styles.description}>
          {active.description}
        </ThemedText>
      </View>

      <View style={styles.indicators}>
        {FEATURED_VIDEOS.map((service, index) => (
          <View
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
  videoWeb: {
    width: "100%",
    height: "100%",
    position: "absolute",
  } as any,
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
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
