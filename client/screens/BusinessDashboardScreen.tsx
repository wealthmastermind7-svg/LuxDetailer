import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useRevenueCat } from "@/contexts/RevenueCatContext";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

interface DashboardCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

function DashboardCard({ icon, title, value, subtitle, color = Colors.dark.accent }: DashboardCardProps) {
  return (
    <GlassCard style={styles.dashboardCard}>
      <View style={[styles.cardIconContainer, { backgroundColor: `${color}20` }]}>
        <Feather name={icon as any} size={24} color={color} />
      </View>
      <ThemedText type="h2" style={[styles.cardValue, { color }]}>
        {value}
      </ThemedText>
      <ThemedText type="body" style={styles.cardTitle}>
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText type="caption" style={styles.cardSubtitle}>
          {subtitle}
        </ThemedText>
      ) : null}
    </GlassCard>
  );
}

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

function ActionButton({ icon, label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.actionButtonPressed,
      ]}
    >
      <View style={styles.actionIcon}>
        <Feather name={icon as any} size={20} color={Colors.dark.accent} />
      </View>
      <ThemedText type="body" style={styles.actionLabel}>
        {label}
      </ThemedText>
      <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
    </Pressable>
  );
}

export default function BusinessDashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const { isProSubscriber, presentPaywall, isLoading: subscriptionLoading } = useRevenueCat();

  const { data: stats } = useQuery<{
    totalBookings: number;
    revenue: number;
    activeCustomers: number;
    pendingBookings: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isProSubscriber,
  });

  useEffect(() => {
    if (!subscriptionLoading && !isProSubscriber) {
      presentPaywall();
    }
  }, [isProSubscriber, subscriptionLoading, presentPaywall]);

  if (subscriptionLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <ThemedText type="body" style={styles.loadingText}>
          Checking subscription...
        </ThemedText>
      </View>
    );
  }

  if (!isProSubscriber) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LinearGradient
          colors={["#000000", "#0a0a0a", "#111111"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.lockedContainer}>
          <View style={styles.lockIcon}>
            <Feather name="lock" size={48} color={Colors.dark.accent} />
          </View>
          <ThemedText type="h2" style={styles.lockedTitle}>
            LuxDetailer Pro Required
          </ThemedText>
          <ThemedText type="body" style={styles.lockedDescription}>
            Subscribe to access your business dashboard with analytics, customer management, and more.
          </ThemedText>
          
          <View style={styles.pricingContainer}>
            <GlassCard style={styles.pricingCard}>
              <ThemedText type="caption" style={styles.pricingLabel}>MONTHLY</ThemedText>
              <ThemedText type="h2" style={styles.pricingValue}>$99</ThemedText>
              <ThemedText type="caption" style={styles.pricingPeriod}>/month</ThemedText>
            </GlassCard>
            <GlassCard style={[styles.pricingCard, styles.pricingCardHighlighted]}>
              <View style={styles.saveBadge}>
                <ThemedText type="caption" style={styles.saveBadgeText}>SAVE $189</ThemedText>
              </View>
              <ThemedText type="caption" style={styles.pricingLabel}>YEARLY</ThemedText>
              <ThemedText type="h2" style={styles.pricingValue}>$999</ThemedText>
              <ThemedText type="caption" style={styles.pricingPeriod}>/year</ThemedText>
            </GlassCard>
          </View>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              presentPaywall();
            }}
            style={({ pressed }) => [
              styles.subscribeButton,
              pressed && styles.subscribeButtonPressed,
            ]}
          >
            <ThemedText type="body" style={styles.subscribeButtonText}>
              Subscribe Now
            </ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const dashboardStats = stats || {
    totalBookings: 47,
    revenue: 12847,
    activeCustomers: 23,
    pendingBookings: 5,
  };

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
        <View style={styles.proBadge}>
          <Feather name="award" size={16} color="#FFD60A" />
          <ThemedText type="caption" style={styles.proBadgeText}>
            LuxDetailer Pro
          </ThemedText>
        </View>

        <ThemedText type="h1" style={styles.welcomeTitle}>
          Business Dashboard
        </ThemedText>
        <ThemedText type="body" style={styles.welcomeSubtitle}>
          Manage your business operations
        </ThemedText>

        <View style={styles.statsGrid}>
          <DashboardCard
            icon="calendar"
            title="Total Bookings"
            value={dashboardStats.totalBookings}
            subtitle="This month"
          />
          <DashboardCard
            icon="dollar-sign"
            title="Revenue"
            value={`$${dashboardStats.revenue.toLocaleString()}`}
            subtitle="This month"
            color="#34C759"
          />
          <DashboardCard
            icon="users"
            title="Active Customers"
            value={dashboardStats.activeCustomers}
            subtitle="Total"
            color="#FF9500"
          />
          <DashboardCard
            icon="clock"
            title="Pending"
            value={dashboardStats.pendingBookings}
            subtitle="Awaiting confirmation"
            color="#FF453A"
          />
        </View>

        <GlassCard style={styles.actionsSection}>
          <ThemedText type="caption" style={styles.sectionTitle}>
            QUICK ACTIONS
          </ThemedText>
          <ActionButton
            icon="list"
            label="View All Bookings"
            onPress={() => navigation.navigate("AllBookings")}
          />
          <ActionButton
            icon="bar-chart-2"
            label="Analytics & Reports"
            onPress={() => navigation.navigate("Analytics")}
          />
          <ActionButton
            icon="settings"
            label="Business Settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <ActionButton
            icon="credit-card"
            label="Manage Subscription"
            onPress={() => navigation.navigate("Subscription")}
          />
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    opacity: 0.6,
  },
  lockedContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  lockIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  lockedTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  lockedDescription: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: Spacing.xl,
  },
  pricingContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pricingCard: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minWidth: 140,
  },
  pricingCardHighlighted: {
    borderWidth: 2,
    borderColor: Colors.dark.accent,
  },
  saveBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  saveBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  pricingLabel: {
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  pricingValue: {
    color: Colors.dark.accent,
    fontSize: 32,
  },
  pricingPeriod: {
    opacity: 0.6,
  },
  subscribeButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
  },
  subscribeButtonPressed: {
    opacity: 0.8,
  },
  subscribeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 214, 10, 0.15)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  proBadgeText: {
    color: "#FFD60A",
    marginLeft: Spacing.xs,
    fontWeight: "600",
  },
  welcomeTitle: {
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    opacity: 0.6,
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  dashboardCard: {
    width: "48%",
    flexGrow: 1,
    minWidth: 150,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontWeight: "500",
  },
  cardSubtitle: {
    opacity: 0.6,
    marginTop: 2,
  },
  actionsSection: {
    padding: 0,
    overflow: "hidden",
  },
  sectionTitle: {
    opacity: 0.6,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  actionButtonPressed: {
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  actionLabel: {
    flex: 1,
    fontWeight: "500",
  },
});
