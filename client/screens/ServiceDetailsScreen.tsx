import React from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type RouteType = RouteProp<HomeStackParamList, "ServiceDetails">;

const SERVICES: Record<string, any> = {
  "1": {
    name: "Full Detail",
    description: "Our signature full detail service includes a complete interior and exterior transformation. We start with a thorough hand wash using premium pH-neutral soap, followed by clay bar treatment to remove contaminants. The exterior receives a hand-applied coat of premium carnauba wax for protection and shine.",
    icon: "star",
    price: 299,
    duration: "4-5 hours",
    features: ["Premium hand wash", "Clay bar treatment", "Carnauba wax protection", "Interior deep clean", "Dashboard & console polish", "Window cleaning", "Tire dressing", "Air freshener"],
  },
  "2": {
    name: "Ceramic Coating",
    description: "Professional-grade ceramic coating provides the ultimate protection for your vehicle's paint. Our 9H ceramic coating creates a permanent bond with your paint, offering unmatched durability, hydrophobic properties, and a deep, glossy finish that lasts for years.",
    icon: "shield",
    price: 899,
    duration: "8+ hours",
    features: ["Multi-stage paint correction", "IPA wipe down", "9H ceramic coating application", "2-year warranty", "Hydrophobic finish", "UV protection", "Chemical resistance", "Easy maintenance"],
  },
  "3": {
    name: "Paint Correction",
    description: "Restore your paint to showroom condition with our multi-stage paint correction service. We systematically remove swirl marks, light scratches, water spots, and oxidation to reveal a flawless finish.",
    icon: "zap",
    price: 449,
    duration: "6-8 hours",
    features: ["Paint depth measurement", "Multi-stage compound polish", "Swirl mark removal", "Light scratch elimination", "Water spot removal", "High gloss finish", "Paint sealant protection"],
  },
  "4": {
    name: "Interior Detail",
    description: "A comprehensive interior cleaning that covers every surface. We steam clean, vacuum, and condition all materials including leather, fabric, plastic, and glass for a fresh, like-new cabin.",
    icon: "wind",
    price: 149,
    duration: "2-3 hours",
    features: ["Hot water extraction", "Leather cleaning & conditioning", "Carpet shampooing", "Steam sanitization", "Vent cleaning", "Glass cleaning", "Odor elimination"],
  },
};

const ADD_ONS = [
  { id: "1", name: "Engine Bay Detail", price: 89 },
  { id: "2", name: "Headlight Restoration", price: 79 },
  { id: "3", name: "Wheel Ceramic Coating", price: 149 },
  { id: "4", name: "Leather Protection", price: 99 },
];

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  
  const serviceId = route.params?.serviceId || "1";
  const service = SERVICES[serviceId] || SERVICES["1"];

  const handleBookNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("BookingFlow", { serviceId });
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
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Feather name={service.icon} size={48} color={Colors.dark.accent} />
          </View>
          
          <ThemedText type="h1" style={styles.serviceName}>
            {service.name}
          </ThemedText>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color={Colors.dark.textSecondary} />
              <ThemedText type="small" style={styles.metaText}>
                {service.duration}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Feather name="award" size={16} color={Colors.dark.accentGreen} />
              <ThemedText type="small" style={styles.metaTextGreen}>
                Premium Quality
              </ThemedText>
            </View>
          </View>
        </View>

        <GlassCard style={styles.priceCard}>
          <View style={styles.priceContent}>
            <ThemedText type="small" style={styles.priceLabel}>
              Starting from
            </ThemedText>
            <ThemedText type="display" style={styles.price}>
              ${service.price}
            </ThemedText>
          </View>
        </GlassCard>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            About This Service
          </ThemedText>
          <ThemedText type="body" style={styles.description}>
            {service.description}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            What's Included
          </ThemedText>
          {service.features.map((feature: string, index: number) => (
            <View key={index} style={styles.featureItem}>
              <Feather name="check-circle" size={20} color={Colors.dark.accentGreen} />
              <ThemedText type="body" style={styles.featureText}>
                {feature}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Add-Ons
          </ThemedText>
          {ADD_ONS.map((addon) => (
            <GlassCard key={addon.id} style={styles.addonCard}>
              <View style={styles.addonContent}>
                <ThemedText type="body">{addon.name}</ThemedText>
                <ThemedText type="h4" style={styles.addonPrice}>
                  +${addon.price}
                </ThemedText>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <Button onPress={handleBookNow} style={styles.bookButton}>
          Book Now - ${service.price}
        </Button>
      </View>
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
  heroSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  serviceName: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    color: Colors.dark.textSecondary,
  },
  metaTextGreen: {
    color: Colors.dark.accentGreen,
  },
  priceCard: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  priceContent: {
    alignItems: "center",
  },
  priceLabel: {
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  price: {
    color: Colors.dark.accent,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  description: {
    opacity: 0.8,
    lineHeight: 26,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureText: {
    flex: 1,
  },
  addonCard: {
    marginBottom: Spacing.sm,
  },
  addonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addonPrice: {
    color: Colors.dark.accent,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  bookButton: {
    ...Shadows.glow,
  },
});
