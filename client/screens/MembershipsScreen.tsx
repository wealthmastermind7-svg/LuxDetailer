import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/query-client";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  frequency: string;
  pricePerMonth: string;
  serviceIncluded: string;
  features: string;
  savingsPercent: number;
  isPopular: boolean;
}

interface UserMembership {
  id: string;
  planId: string;
  status: string;
  startDate: string;
  nextWashDate: string | null;
  washesRemaining: number;
}

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Weekly",
  fortnightly: "Every 2 Weeks",
  monthly: "Monthly",
};

const FREQUENCY_ICONS: Record<string, string> = {
  weekly: "repeat",
  fortnightly: "refresh-cw",
  monthly: "calendar",
};

const GOLD_COLOR = "#D4AF37";
const MUTED_COLOR = "#6B7280";
const SUCCESS_COLOR = Colors.dark.accentGreen;
const ERROR_COLOR = "#EF4444";

export default function MembershipsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/memberships/plans"],
  });

  const { data: userMembership, isLoading: membershipLoading } = useQuery<UserMembership | null>({
    queryKey: ["/api/memberships/my"],
    enabled: isAuthenticated,
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      return apiRequest("POST", "/api/memberships/subscribe", { planId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memberships/my"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedPlan(null);
    },
    onError: (error: any) => {
      Alert.alert("Subscription Failed", error.message || "Could not subscribe to plan");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/memberships/cancel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memberships/my"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      Alert.alert("Sign In Required", "Please sign in to subscribe to a membership plan.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPlan(planId);
  };

  const confirmSubscribe = () => {
    if (selectedPlan) {
      subscribeMutation.mutate(selectedPlan);
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Cancel Membership",
      "Are you sure you want to cancel your membership? You will lose any remaining washes.",
      [
        { text: "Keep Membership", style: "cancel" },
        { text: "Cancel", style: "destructive", onPress: () => cancelMutation.mutate() },
      ]
    );
  };

  const parseFeatures = (featuresJson: string): string[] => {
    try {
      return JSON.parse(featuresJson);
    } catch {
      return [];
    }
  };

  const isLoading = plansLoading || membershipLoading;

  const activeMembership = userMembership?.status === "active" ? userMembership : null;
  const activePlan = activeMembership && plans?.find((p) => p.id === activeMembership.planId);

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
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <ThemedText type="h1" style={styles.title}>
            Membership
          </ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Save with recurring wash subscriptions
          </ThemedText>
        </Animated.View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.accent} />
          </View>
        ) : activeMembership && activePlan ? (
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <GlassCard style={styles.activeMembershipCard} hasGlow glowColor={Colors.dark.accent}>
              <View style={styles.activeBadge}>
                <Feather name="check-circle" size={16} color={Colors.dark.accent} />
                <ThemedText type="small" style={styles.activeBadgeText}>
                  Active Member
                </ThemedText>
              </View>

              <ThemedText type="h2" style={styles.activePlanName}>
                {activePlan.name}
              </ThemedText>

              <View style={styles.membershipStats}>
                <View style={styles.stat}>
                  <ThemedText type="h2" style={styles.statValue}>
                    {activeMembership.washesRemaining}
                  </ThemedText>
                  <ThemedText type="small" style={styles.statLabel}>
                    Washes Left
                  </ThemedText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <ThemedText type="h2" style={styles.statValue}>
                    ${activePlan.pricePerMonth}
                  </ThemedText>
                  <ThemedText type="small" style={styles.statLabel}>
                    Per Month
                  </ThemedText>
                </View>
              </View>

              {activeMembership.nextWashDate ? (
                <View style={styles.nextWashContainer}>
                  <Feather name="calendar" size={16} color={MUTED_COLOR} />
                  <ThemedText type="small" style={styles.nextWashText}>
                    Next wash: {new Date(activeMembership.nextWashDate).toLocaleDateString()}
                  </ThemedText>
                </View>
              ) : null}

              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <ThemedText type="small" style={styles.cancelButtonText}>
                  Cancel Membership
                </ThemedText>
              </Pressable>
            </GlassCard>
          </Animated.View>
        ) : null}

        <ThemedText type="h3" style={styles.sectionTitle}>
          {activeMembership ? "Switch Plans" : "Choose Your Plan"}
        </ThemedText>

        {plans?.map((plan, index) => {
          const features = parseFeatures(plan.features);
          const isSelected = selectedPlan === plan.id;
          const isCurrentPlan = activeMembership?.planId === plan.id;

          return (
            <Animated.View
              key={plan.id}
              entering={FadeInUp.delay(300 + index * 100).duration(600)}
            >
              <GlassCard
                style={[
                  styles.planCard,
                  plan.isPopular && styles.popularPlanCard,
                  isSelected && styles.selectedPlanCard,
                ]}
                onPress={() => !isCurrentPlan && handleSubscribe(plan.id)}
                hasGlow={plan.isPopular || isSelected}
                glowColor={plan.isPopular ? GOLD_COLOR : Colors.dark.accent}
              >
                {plan.isPopular ? (
                  <View style={styles.popularBadge}>
                    <Feather name="star" size={12} color={Colors.dark.backgroundRoot} />
                    <ThemedText type="small" style={styles.popularBadgeText}>
                      Most Popular
                    </ThemedText>
                  </View>
                ) : null}

                {isCurrentPlan ? (
                  <View style={styles.currentPlanBadge}>
                    <Feather name="check" size={12} color={Colors.dark.accent} />
                    <ThemedText type="small" style={styles.currentPlanBadgeText}>
                      Current Plan
                    </ThemedText>
                  </View>
                ) : null}

                <View style={styles.planHeader}>
                  <View style={styles.planIconContainer}>
                    <Feather
                      name={FREQUENCY_ICONS[plan.frequency] as any}
                      size={24}
                      color={plan.isPopular ? GOLD_COLOR : Colors.dark.accent}
                    />
                  </View>
                  <View style={styles.planTitleContainer}>
                    <ThemedText type="h3" style={styles.planName}>
                      {plan.name}
                    </ThemedText>
                    <ThemedText type="small" style={styles.frequency}>
                      {FREQUENCY_LABELS[plan.frequency]}
                    </ThemedText>
                  </View>
                  <View style={styles.priceContainer}>
                    <ThemedText type="h2" style={styles.price}>
                      ${plan.pricePerMonth}
                    </ThemedText>
                    <ThemedText type="small" style={styles.priceLabel}>
                      /month
                    </ThemedText>
                  </View>
                </View>

                <ThemedText type="body" style={styles.planDescription}>
                  {plan.description}
                </ThemedText>

                {plan.savingsPercent > 0 ? (
                  <View style={styles.savingsBadge}>
                    <Feather name="trending-down" size={14} color={SUCCESS_COLOR} />
                    <ThemedText type="small" style={styles.savingsText}>
                      Save {plan.savingsPercent}% vs single washes
                    </ThemedText>
                  </View>
                ) : null}

                <View style={styles.featuresContainer}>
                  {features.map((feature, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Feather name="check" size={16} color={Colors.dark.accent} />
                      <ThemedText type="small" style={styles.featureText}>
                        {feature}
                      </ThemedText>
                    </View>
                  ))}
                </View>

                {isSelected ? (
                  <Pressable
                    style={styles.confirmButton}
                    onPress={confirmSubscribe}
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? (
                      <ActivityIndicator size="small" color={Colors.dark.backgroundRoot} />
                    ) : (
                      <>
                        <Feather name="check-circle" size={18} color={Colors.dark.backgroundRoot} />
                        <ThemedText type="body" style={styles.confirmButtonText}>
                          Confirm Subscription
                        </ThemedText>
                      </>
                    )}
                  </Pressable>
                ) : !isCurrentPlan ? (
                  <View style={styles.selectButton}>
                    <ThemedText type="body" style={styles.selectButtonText}>
                      Select Plan
                    </ThemedText>
                    <Feather name="arrow-right" size={18} color={Colors.dark.text} />
                  </View>
                ) : null}
              </GlassCard>
            </Animated.View>
          );
        })}

        <View style={styles.footer}>
          <ThemedText type="small" style={styles.footerText}>
            Memberships auto-renew monthly. Cancel anytime.
          </ThemedText>
          <ThemedText type="small" style={styles.footerText}>
            Unused washes do not roll over.
          </ThemedText>
        </View>
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
    fontSize: 36,
    fontWeight: "800",
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: MUTED_COLOR,
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xxl * 2,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  activeMembershipCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  activeBadgeText: {
    color: Colors.dark.accent,
    fontWeight: "600",
  },
  activePlanName: {
    color: Colors.dark.text,
    marginBottom: Spacing.lg,
  },
  membershipStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: Colors.dark.accent,
    fontSize: 32,
  },
  statLabel: {
    color: MUTED_COLOR,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.dark.glassBorder,
  },
  nextWashContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
  },
  nextWashText: {
    color: MUTED_COLOR,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    color: ERROR_COLOR,
  },
  planCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  popularPlanCard: {
    borderWidth: 1,
    borderColor: GOLD_COLOR,
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: Colors.dark.accent,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: GOLD_COLOR,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  popularBadgeText: {
    color: Colors.dark.backgroundRoot,
    fontWeight: "700",
    fontSize: 11,
  },
  currentPlanBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  currentPlanBadgeText: {
    color: Colors.dark.accent,
    fontWeight: "600",
    fontSize: 11,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  planTitleContainer: {
    flex: 1,
  },
  planName: {
    color: Colors.dark.text,
    fontSize: 18,
  },
  frequency: {
    color: MUTED_COLOR,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    color: Colors.dark.text,
    fontSize: 24,
  },
  priceLabel: {
    color: MUTED_COLOR,
  },
  planDescription: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: Spacing.md,
  },
  savingsText: {
    color: Colors.dark.accentGreen,
    fontWeight: "600",
  },
  featuresContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  featureText: {
    color: Colors.dark.textSecondary,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
  },
  selectButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  confirmButtonText: {
    color: Colors.dark.backgroundRoot,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    color: MUTED_COLOR,
    textAlign: "center",
  },
});
