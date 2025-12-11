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
import { HomeVideoHero } from "@/components/HomeVideoHero";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const SERVICES = [
  { id: "1", name: "Express Exterior", icon: "wind", price: 95, duration: "30-40m" },
  { id: "2", name: "Gold Wash", icon: "droplet", price: 145, duration: "55-70m" },
  { id: "3", name: "Platinum Wash", icon: "shield", price: 225, duration: "90-120m" },
  { id: "4", name: "Scratch Removal", icon: "zap", price: 260, duration: "70-90m" },
  { id: "5", name: "Interior Detail", icon: "home", price: 350, duration: "80-100m" },
  { id: "6", name: "Deluxe Detail", icon: "star", price: 415, duration: "150-180m" },
  { id: "7", name: "Signature Detail", icon: "heart", price: 625, duration: "200-240m" },
  { id: "8", name: "Diamond Ceramic", icon: "award", price: 1045, duration: "300-360m" },
  { id: "9", name: "Window Tinting", icon: "grid", price: 1045, duration: "200-240m" },
  { id: "10", name: "Titanium Gloss", icon: "sun", price: 1680, duration: "200-240m" },
].sort((a, b) => a.price - b.price);

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

  const handleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Settings");
  };

  const handleSeeAllServices = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Services");
  };

  const handlePromoPress = (promoCode: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("BookingFlow", { promoCode });
  };

  const handleRewardsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMascotMessage("Rewards program coming soon!");
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
            onPress={handleNotifications}
            style={styles.notificationButton}
          >
            <Feather name="bell" size={24} color={Colors.dark.text} />
          </Pressable>
        </View>

        <HomeVideoHero onPress={handleBookNow} />

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
          
          <GlassCard onPress={handleRewardsPress} style={styles.quickActionCard}>
            <Feather name="gift" size={28} color={Colors.dark.accentGreen} />
            <ThemedText type="small" style={styles.quickActionLabel} numberOfLines={1}>
              Rewards
            </ThemedText>
          </GlassCard>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="h3">Popular Services</ThemedText>
          <Pressable onPress={handleSeeAllServices}>
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
          <GlassCard 
            key={promo.id} 
            style={styles.promoCard}
            onPress={() => handlePromoPress(promo.id)}
          >
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
    fontSize: 13,
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
