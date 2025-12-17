import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { CinematicHero } from "@/components/CinematicHero";

export function FeaturedVideoReel() {
  return (
    <View style={styles.container}>
      <CinematicHero
        height={320}
        gradient={["#0D1B2A", "#1A1A1D", "#0D1B2A"]}
        accentColor="#D4AF37"
      />

      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
        style={styles.overlay}
      />

      <View style={styles.content}>
        <ThemedText type="h2" numberOfLines={1} style={styles.title}>
          Teggy's Elite
        </ThemedText>
        <ThemedText type="small" numberOfLines={1} style={styles.subtitle}>
          Professional ceramic coatings & protection
        </ThemedText>
      </View>
    </View>
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
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
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
    color: Colors.dark.accent,
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.8,
    fontWeight: "500",
  },
});
