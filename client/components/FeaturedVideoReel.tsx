import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const FEATURED_SERVICES = [
  {
    id: 1,
    title: "Full Exterior Detail",
    description: "Complete wash, polish & protection",
    icon: "droplet",
    duration: "4-5 hours",
    accent: "#FF6B6B",
  },
  {
    id: 2,
    title: "Ceramic Coating",
    description: "Premium paint protection",
    icon: "shield",
    duration: "2-3 hours",
    accent: "#4ECDC4",
  },
  {
    id: 3,
    title: "Interior Detailing",
    description: "Deep clean & conditioning",
    icon: "wind",
    duration: "2 hours",
    accent: "#45B7D1",
  },
  {
    id: 4,
    title: "Paint Correction",
    description: "Restore shine & clarity",
    icon: "zap",
    duration: "3-4 hours",
    accent: "#F9CA24",
  },
];

export function FeaturedVideoReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_SERVICES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const active = FEATURED_SERVICES[activeIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          `${active.accent}40`,
          `${active.accent}20`,
          "rgba(10, 132, 255, 0.1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={[styles.iconContainer, { borderColor: active.accent }]}>
          <Feather name={active.icon as any} size={72} color={active.accent} />
        </View>

        <ThemedText type="h2" style={styles.title}>
          {active.title}
        </ThemedText>

        <ThemedText type="body" style={styles.description}>
          {active.description}
        </ThemedText>

        <View style={styles.meta}>
          <Feather name="clock" size={14} color={Colors.dark.textSecondary} />
          <ThemedText type="small" style={styles.duration}>
            {active.duration}
          </ThemedText>
        </View>
      </View>

      <View style={styles.indicators}>
        {FEATURED_SERVICES.map((service, index) => (
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
    minHeight: 360,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: Colors.dark.glassBorder,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    backgroundColor: "rgba(10, 10, 10, 0.5)",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: "700",
  },
  description: {
    textAlign: "center",
    opacity: 0.8,
    marginBottom: Spacing.lg,
    fontSize: 16,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  duration: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    zIndex: 2,
    marginTop: Spacing.md,
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
