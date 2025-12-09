import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { FloatingMascot } from "@/components/FloatingMascot";
import { HeaderTitle } from "@/components/HeaderTitle";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const SERVICES = [
  { id: "1", name: "Full Detail", icon: "star", price: 299, duration: "4-5 hrs" },
  { id: "2", name: "Ceramic Coating", icon: "shield", price: 899, duration: "8+ hrs" },
  { id: "3", name: "Paint Correction", icon: "zap", price: 449, duration: "6-8 hrs" },
  { id: "4", name: "Interior Clean", icon: "wind", price: 149, duration: "2-3 hrs" },
];

const PROMOTIONS = [
  { id: "1", title: "First Time Special", discount: "20% OFF", description: "New customers" },
  { id: "2", title: "Ceramic Bundle", discount: "$200 OFF", description: "Coating + Detail" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const [mascotMessage, setMascotMessage] = useState("Welcome! Tap to book your first detail.");

  const handleServicePress = (serviceId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ServiceDetails", { serviceId });
  };

  const handleBookNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("BookingFlow");
  };

  const handleMyVehicle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("MyVehicle");
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
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <HeaderTitle />
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={styles.notificationButton}
          >
            <Feather name="bell" size={24} color={Colors.dark.text} />
          </Pressable>
        </View>

        <View style={styles.heroSection}>
          <ThemedText type="h1" style={styles.heroTitle}>
            Premium Car
          </ThemedText>
          <ThemedText type="h1" style={styles.heroTitleAccent}>
            Detailing
          </ThemedText>
          <ThemedText type="body" style={styles.heroSubtitle}>
            Experience the art of automotive perfection
          </ThemedText>
        </View>

        <GlassCard 
          onPress={handleBookNow} 
          style={styles.bookNowCard}
          hasGlow
          glowColor={Colors.dark.accent}
        >
          <View style={styles.bookNowContent}>
            <View>
              <ThemedText type="h3" style={styles.bookNowTitle}>
                Book Your Detail
              </ThemedText>
              <ThemedText type="small" style={styles.bookNowSubtitle}>
                Schedule your next appointment
              </ThemedText>
            </View>
            <View style={styles.bookNowArrow}>
              <Feather name="arrow-right" size={24} color={Colors.dark.accent} />
            </View>
          </View>
        </GlassCard>

        <View style={styles.quickActions}>
          <GlassCard onPress={handleMyVehicle} style={styles.quickActionCard}>
            <Feather name="truck" size={28} color={Colors.dark.accent} />
            <ThemedText type="small" style={styles.quickActionLabel}>
              My Vehicle
            </ThemedText>
          </GlassCard>
          
          <GlassCard 
            onPress={() => navigation.navigate("BookingFlow")} 
            style={styles.quickActionCard}
          >
            <Feather name="clock" size={28} color={Colors.dark.accentYellow} />
            <ThemedText type="small" style={styles.quickActionLabel}>
              History
            </ThemedText>
          </GlassCard>
          
          <GlassCard style={styles.quickActionCard}>
            <Feather name="gift" size={28} color={Colors.dark.accentGreen} />
            <ThemedText type="small" style={styles.quickActionLabel}>
              Rewards
            </ThemedText>
          </GlassCard>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="h3">Popular Services</ThemedText>
          <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <ThemedText type="link">See All</ThemedText>
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesScroll}
        >
          {SERVICES.map((service) => (
            <GlassCard
              key={service.id}
              onPress={() => handleServicePress(service.id)}
              style={styles.serviceCard}
            >
              <View style={styles.serviceIconContainer}>
                <Feather name={service.icon as any} size={24} color={Colors.dark.accent} />
              </View>
              <ThemedText type="h4" style={styles.serviceName}>
                {service.name}
              </ThemedText>
              <ThemedText type="caption" style={styles.serviceDuration}>
                {service.duration}
              </ThemedText>
              <ThemedText type="price" style={styles.servicePrice}>
                ${service.price}
              </ThemedText>
            </GlassCard>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <ThemedText type="h3">Special Offers</ThemedText>
        </View>

        {PROMOTIONS.map((promo) => (
          <GlassCard key={promo.id} style={styles.promoCard}>
            <View style={styles.promoContent}>
              <View>
                <ThemedText type="h4">{promo.title}</ThemedText>
                <ThemedText type="small" style={styles.promoDescription}>
                  {promo.description}
                </ThemedText>
              </View>
              <View style={styles.promoBadge}>
                <ThemedText type="h4" style={styles.promoDiscount}>
                  {promo.discount}
                </ThemedText>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <FloatingMascot 
        message={mascotMessage}
        bottomOffset={tabBarHeight + Spacing.lg}
        onPress={() => setMascotMessage("")}
      />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
  },
  heroTitleAccent: {
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -1,
    color: Colors.dark.accent,
  },
  heroSubtitle: {
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
  bookNowCard: {
    marginBottom: Spacing.lg,
  },
  bookNowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookNowTitle: {
    marginBottom: Spacing.xs,
  },
  bookNowSubtitle: {
    opacity: 0.7,
  },
  bookNowArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  quickActionLabel: {
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  servicesScroll: {
    paddingRight: Spacing.lg,
    marginBottom: Spacing.xl,
    marginLeft: -Spacing.lg,
    paddingLeft: Spacing.lg,
  },
  serviceCard: {
    width: 160,
    marginRight: Spacing.md,
    alignItems: "flex-start",
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  serviceName: {
    marginBottom: Spacing.xs,
  },
  serviceDuration: {
    opacity: 0.6,
    marginBottom: Spacing.sm,
  },
  servicePrice: {
    color: Colors.dark.accent,
  },
  promoCard: {
    marginBottom: Spacing.md,
  },
  promoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoDescription: {
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
  promoBadge: {
    backgroundColor: "rgba(255, 214, 10, 0.15)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  promoDiscount: {
    color: Colors.dark.accentYellow,
    fontSize: 16,
  },
});
