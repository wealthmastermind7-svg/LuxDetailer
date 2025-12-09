import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing, Colors } from "@/constants/theme";

const FEATURED_SERVICES = [
  {
    id: 1,
    title: "Full Exterior Detail",
    description: "Complete wash, polish & protection",
    icon: "droplet",
    duration: "4-5 hours",
  },
  {
    id: 2,
    title: "Ceramic Coating",
    description: "Premium paint protection",
    icon: "shield",
    duration: "2-3 hours",
  },
  {
    id: 3,
    title: "Interior Detailing",
    description: "Deep clean & conditioning",
    icon: "wind",
    duration: "2 hours",
  },
  {
    id: 4,
    title: "Paint Correction",
    description: "Restore shine & clarity",
    icon: "zap",
    duration: "3-4 hours",
  },
];

export function FeaturedVideoReel() {
  const [activeIndex, setActiveIndex] = useState(0);

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
        colors={["rgba(10, 132, 255, 0.4)", "rgba(10, 132, 255, 0.1)", "rgba(0,0,0,0.2)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name={active.icon as any} size={80} color={Colors.dark.accent} />
        </View>

        <ThemedText type="h2" style={styles.title}>
          {active.title}
        </ThemedText>

        <ThemedText type="body" style={styles.description}>
          {active.description}
        </ThemedText>

        <View style={styles.meta}>
          <Feather name="clock" size={16} color={Colors.dark.textSecondary} />
          <ThemedText type="small" style={styles.duration}>
            {active.duration}
          </ThemedText>
        </View>
      </View>

      <View style={styles.indicators}>
        {FEATURED_SERVICES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === activeIndex && styles.indicatorActive,
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
    height: 340,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    backgroundColor: "#1a1a1a",
    justifyContent: "space-between",
    padding: Spacing.xl,
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
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    opacity: 0.9,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
    color: Colors.dark.text,
  },
  description: {
    textAlign: "center",
    opacity: 0.8,
    marginBottom: Spacing.md,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  duration: {
    color: Colors.dark.textSecondary,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    zIndex: 2,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  indicatorActive: {
    backgroundColor: Colors.dark.accent,
    width: 24,
  },
});
