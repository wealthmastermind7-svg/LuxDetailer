import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const FEATURED_VIDEOS = [
  {
    id: 1,
    title: "Full Exterior Detail",
    subtitle: "Premium Red Ferrari",
    description: "Complete wash, polish & protection",
    icon: "droplet",
    accent: "#FF6B6B",
  },
  {
    id: 2,
    title: "Ceramic Coating",
    subtitle: "Luxury Black Mercedes",
    description: "Premium paint protection",
    icon: "shield",
    accent: "#4ECDC4",
  },
  {
    id: 3,
    title: "Interior Detailing",
    subtitle: "Premium White Tesla",
    description: "Deep clean & conditioning",
    icon: "wind",
    accent: "#45B7D1",
  },
  {
    id: 4,
    title: "Paint Correction",
    subtitle: "Metallic Silver BMW",
    description: "Restore shine & clarity",
    icon: "zap",
    accent: "#F9CA24",
  },
];

export function FeaturedVideoReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_VIDEOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const active = FEATURED_VIDEOS[activeIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          `${active.accent}50`,
          `${active.accent}20`,
          "rgba(10, 132, 255, 0.1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={[styles.videoPlaceholder, { borderColor: active.accent }]}>
          <Feather name={active.icon as any} size={80} color={active.accent} />
          <ThemedText type="caption" style={styles.videoLabel}>
            HD Video Loop
          </ThemedText>
        </View>

        <View style={styles.textContent}>
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
    minHeight: 380,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: Colors.dark.glassBorder,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  videoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 10, 0.6)",
    flexShrink: 0,
  },
  videoLabel: {
    marginTop: Spacing.sm,
    opacity: 0.7,
    fontSize: 10,
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: Spacing.xs,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.sm,
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    opacity: 0.8,
    fontSize: 15,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  indicatorActive: {
    width: 28,
  },
});
