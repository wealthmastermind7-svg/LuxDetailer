import React from "react";
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useRevenueCat } from "@/contexts/RevenueCatContext";

interface FeatureRowProps {
  icon: string;
  text: string;
}

function FeatureRow({ icon, text }: FeatureRowProps) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Feather name={icon as any} size={16} color={Colors.dark.accent} />
      </View>
      <ThemedText type="body" style={styles.featureText}>
        {text}
      </ThemedText>
    </View>
  );
}

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { 
    isProSubscriber, 
    customerInfo, 
    currentOffering,
    isLoading,
    isRevenueCatConfigured,
    purchasePackage,
    restorePurchases,
    presentPaywall,
    presentCustomerCenter,
  } = useRevenueCat();

  const handleSubscribe = async (packageType: "monthly" | "annual") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!isRevenueCatConfigured) {
      presentPaywall();
      return;
    }

    const pkg = currentOffering?.availablePackages.find(
      p => p.identifier === `$rc_${packageType}`
    );

    if (pkg) {
      await purchasePackage(pkg);
    } else {
      await presentPaywall();
    }
  };

  const handleManageSubscription = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    presentCustomerCenter();
  };

  const handleRestorePurchases = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    restorePurchases();
  };

  const expirationDate = customerInfo?.entitlements.active["LuxDetailer Pro"]?.expirationDate;
  const formattedExpiration = expirationDate 
    ? new Date(expirationDate).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      })
    : null;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
      </View>
    );
  }

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
        {isProSubscriber ? (
          <View style={styles.subscribedSection}>
            <View style={styles.subscribedBadge}>
              <LinearGradient
                colors={["#FFD60A", "#FF9500"]}
                style={styles.subscribedBadgeGradient}
              >
                <Feather name="award" size={32} color="#000000" />
              </LinearGradient>
            </View>
            
            <ThemedText type="h1" style={styles.subscribedTitle}>
              LuxDetailer Pro
            </ThemedText>
            <ThemedText type="body" style={styles.subscribedStatus}>
              Active Subscription
            </ThemedText>

            {formattedExpiration ? (
              <GlassCard style={styles.expirationCard}>
                <Feather name="calendar" size={20} color={Colors.dark.accent} />
                <View style={styles.expirationText}>
                  <ThemedText type="caption" style={styles.expirationLabel}>
                    Renews on
                  </ThemedText>
                  <ThemedText type="body" style={styles.expirationDate}>
                    {formattedExpiration}
                  </ThemedText>
                </View>
              </GlassCard>
            ) : null}

            <GlassCard style={styles.benefitsCard}>
              <ThemedText type="caption" style={styles.benefitsTitle}>
                YOUR BENEFITS
              </ThemedText>
              <FeatureRow icon="bar-chart-2" text="Full Analytics Dashboard" />
              <FeatureRow icon="users" text="Unlimited Customer Management" />
              <FeatureRow icon="calendar" text="Advanced Booking System" />
              <FeatureRow icon="mail" text="Automated Notifications" />
              <FeatureRow icon="credit-card" text="Payment Processing" />
              <FeatureRow icon="headphones" text="Priority Support" />
            </GlassCard>

            <Pressable
              onPress={handleManageSubscription}
              style={({ pressed }) => [
                styles.manageButton,
                pressed && styles.manageButtonPressed,
              ]}
            >
              <Feather name="settings" size={20} color={Colors.dark.accent} />
              <ThemedText type="body" style={styles.manageButtonText}>
                Manage Subscription
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.subscribeSection}>
            <View style={styles.heroIcon}>
              <Feather name="briefcase" size={48} color={Colors.dark.accent} />
            </View>
            
            <ThemedText type="h1" style={styles.heroTitle}>
              LuxDetailer Pro
            </ThemedText>
            <ThemedText type="body" style={styles.heroSubtitle}>
              Everything you need to run your business
            </ThemedText>

            <GlassCard style={styles.featuresCard}>
              <FeatureRow icon="bar-chart-2" text="Full Analytics Dashboard" />
              <FeatureRow icon="users" text="Unlimited Customer Management" />
              <FeatureRow icon="calendar" text="Advanced Booking System" />
              <FeatureRow icon="mail" text="Automated Notifications" />
              <FeatureRow icon="credit-card" text="Payment Processing" />
              <FeatureRow icon="headphones" text="Priority Support" />
            </GlassCard>

            <View style={styles.plansContainer}>
              <Pressable
                onPress={() => handleSubscribe("monthly")}
                style={({ pressed }) => [
                  styles.planCard,
                  pressed && styles.planCardPressed,
                ]}
              >
                <ThemedText type="caption" style={styles.planLabel}>
                  MONTHLY
                </ThemedText>
                <ThemedText type="h1" style={styles.planPrice}>
                  $99
                </ThemedText>
                <ThemedText type="caption" style={styles.planPeriod}>
                  per month
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => handleSubscribe("annual")}
                style={({ pressed }) => [
                  styles.planCard,
                  styles.planCardHighlighted,
                  pressed && styles.planCardPressed,
                ]}
              >
                <View style={styles.bestValueBadge}>
                  <ThemedText type="caption" style={styles.bestValueText}>
                    BEST VALUE
                  </ThemedText>
                </View>
                <ThemedText type="caption" style={styles.planLabel}>
                  YEARLY
                </ThemedText>
                <ThemedText type="h1" style={styles.planPrice}>
                  $999
                </ThemedText>
                <ThemedText type="caption" style={styles.planPeriod}>
                  per year
                </ThemedText>
                <ThemedText type="caption" style={styles.planSavings}>
                  Save $189
                </ThemedText>
              </Pressable>
            </View>

            <Pressable
              onPress={handleRestorePurchases}
              style={({ pressed }) => [
                styles.restoreButton,
                pressed && styles.restoreButtonPressed,
              ]}
            >
              <ThemedText type="body" style={styles.restoreButtonText}>
                Restore Purchases
              </ThemedText>
            </Pressable>

            <ThemedText type="caption" style={styles.disclaimer}>
              Subscription automatically renews. Cancel anytime in your device settings.
            </ThemedText>
          </View>
        )}
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
  subscribedSection: {
    alignItems: "center",
  },
  subscribedBadge: {
    marginBottom: Spacing.lg,
  },
  subscribedBadgeGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  subscribedTitle: {
    marginBottom: Spacing.xs,
  },
  subscribedStatus: {
    color: "#34C759",
    marginBottom: Spacing.xl,
  },
  expirationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    width: "100%",
  },
  expirationText: {
    marginLeft: Spacing.md,
  },
  expirationLabel: {
    opacity: 0.6,
  },
  expirationDate: {
    fontWeight: "500",
  },
  benefitsCard: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    opacity: 0.6,
    marginBottom: Spacing.md,
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundSecondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  manageButtonPressed: {
    opacity: 0.8,
  },
  manageButtonText: {
    marginLeft: Spacing.sm,
    color: Colors.dark.accent,
    fontWeight: "500",
  },
  subscribeSection: {
    alignItems: "center",
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    opacity: 0.6,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  featuresCard: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
  },
  plansContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    width: "100%",
  },
  planCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundSecondary,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  planCardHighlighted: {
    borderColor: Colors.dark.accent,
    borderWidth: 2,
  },
  planCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  bestValueBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  bestValueText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  planLabel: {
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  planPrice: {
    color: Colors.dark.accent,
  },
  planPeriod: {
    opacity: 0.6,
  },
  planSavings: {
    color: "#34C759",
    marginTop: Spacing.xs,
    fontWeight: "500",
  },
  restoreButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  restoreButtonPressed: {
    opacity: 0.6,
  },
  restoreButtonText: {
    color: Colors.dark.accent,
  },
  disclaimer: {
    opacity: 0.4,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
});
