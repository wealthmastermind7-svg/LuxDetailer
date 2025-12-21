import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  color: string;
}

function MetricCard({ label, value, change, trend, color }: AnalyticsMetric) {
  return (
    <GlassCard style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <ThemedText type="caption" style={styles.metricLabel}>
          {label}
        </ThemedText>
        <View style={[styles.trendBadge, { backgroundColor: trend === "up" ? "#34C75920" : "#FF453A20" }]}>
          <Feather 
            name={trend === "up" ? "trending-up" : "trending-down"} 
            size={14} 
            color={trend === "up" ? "#34C759" : "#FF453A"} 
          />
          <ThemedText 
            type="caption" 
            style={[styles.trendText, { color: trend === "up" ? "#34C759" : "#FF453A" }]}
          >
            {change}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="h2" style={[styles.metricValue, { color }]}>
        {value}
      </ThemedText>
    </GlassCard>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const { data: analytics } = useQuery({
    queryKey: ["/api/dashboard/analytics"],
  });

  const metrics = [
    { label: "Revenue", value: "$12,847", change: "+12%", trend: "up" as const, color: "#34C759" },
    { label: "Bookings", value: "47", change: "+8%", trend: "up" as const, color: Colors.dark.accent },
    { label: "Customers", value: "23", change: "+5%", trend: "up" as const, color: "#FF9500" },
    { label: "Conversion", value: "68%", change: "-3%", trend: "down" as const, color: "#FF453A" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#111111"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="h1" style={styles.title}>
          Analytics & Reports
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          Your business performance overview
        </ThemedText>

        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </View>

        <GlassCard style={styles.chartSection}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Revenue Trend
          </ThemedText>
          <View style={styles.chartPlaceholder}>
            <Feather name="bar-chart-2" size={48} color={Colors.dark.accent} />
            <ThemedText type="body" style={styles.chartText}>
              Chart visualization
            </ThemedText>
          </View>
        </GlassCard>

        <GlassCard style={styles.chartSection}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Top Services
          </ThemedText>
          <View style={styles.serviceList}>
            {[
              { name: "Ceramic Coating", value: "24 bookings", percent: 51 },
              { name: "Paint Protection Film", value: "15 bookings", percent: 32 },
              { name: "Paint Correction", value: "8 bookings", percent: 17 },
            ].map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <ThemedText type="body" style={styles.serviceName}>
                    {service.name}
                  </ThemedText>
                  <ThemedText type="caption" style={styles.serviceValue}>
                    {service.value}
                  </ThemedText>
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { width: `${service.percent}%`, backgroundColor: Colors.dark.accent },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={styles.chartSection}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Customer Satisfaction
          </ThemedText>
          <View style={styles.ratingContainer}>
            <View style={styles.ratingCircle}>
              <ThemedText type="h1" style={styles.ratingValue}>
                4.8
              </ThemedText>
              <ThemedText type="caption" style={styles.ratingLabel}>
                / 5.0
              </ThemedText>
            </View>
            <View style={styles.reviewsInfo}>
              <ThemedText type="body" style={styles.reviewsCount}>
                142 reviews
              </ThemedText>
              <ThemedText type="caption" style={styles.reviewsDescription}>
                Based on customer feedback
              </ThemedText>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: Spacing.xl,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  metricCard: {
    width: "48%",
    flexGrow: 1,
    minWidth: 150,
    paddingVertical: Spacing.lg,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  metricLabel: {
    opacity: 0.6,
    flex: 1,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  trendText: {
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  chartSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  chartText: {
    marginTop: Spacing.md,
    opacity: 0.6,
  },
  serviceList: {
    gap: Spacing.lg,
  },
  serviceItem: {
    gap: Spacing.md,
  },
  serviceInfo: {
    justifyContent: "space-between",
  },
  serviceName: {
    fontWeight: "500",
  },
  serviceValue: {
    opacity: 0.6,
    marginTop: 2,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: BorderRadius.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  ratingCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${Colors.dark.accent}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingValue: {
    color: Colors.dark.accent,
    fontSize: 36,
  },
  ratingLabel: {
    opacity: 0.6,
  },
  reviewsInfo: {
    flex: 1,
  },
  reviewsCount: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  reviewsDescription: {
    opacity: 0.6,
  },
});
