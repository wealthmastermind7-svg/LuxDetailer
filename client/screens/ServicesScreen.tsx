import React from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { FloatingMascot } from "@/components/FloatingMascot";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { ServicesStackParamList } from "@/navigation/ServicesStackNavigator";

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

const SERVICES = [
  {
    id: "1",
    name: "Full Detail",
    description: "Complete interior and exterior cleaning with hand wash, wax, and interior deep clean",
    icon: "star",
    price: 299,
    duration: "4-5 hours",
    features: ["Hand wash", "Clay bar treatment", "Wax protection", "Interior vacuum", "Dashboard polish"],
  },
  {
    id: "2",
    name: "Ceramic Coating",
    description: "Long-lasting protection with professional-grade ceramic coating application",
    icon: "shield",
    price: 899,
    duration: "8+ hours",
    features: ["Paint correction", "Surface prep", "9H ceramic coat", "2-year warranty", "Hydrophobic finish"],
  },
  {
    id: "3",
    name: "Paint Correction",
    description: "Remove swirl marks, scratches, and oxidation for a showroom finish",
    icon: "zap",
    price: 449,
    duration: "6-8 hours",
    features: ["Multi-stage polish", "Swirl removal", "Scratch elimination", "High gloss finish"],
  },
  {
    id: "4",
    name: "Interior Detail",
    description: "Deep clean and condition all interior surfaces and upholstery",
    icon: "wind",
    price: 149,
    duration: "2-3 hours",
    features: ["Steam cleaning", "Leather conditioning", "Carpet shampoo", "Odor elimination"],
  },
  {
    id: "5",
    name: "Engine Bay",
    description: "Professional engine compartment cleaning and dressing",
    icon: "cpu",
    price: 89,
    duration: "1-2 hours",
    features: ["Degrease", "Steam clean", "Dress plastics", "Protect components"],
  },
  {
    id: "6",
    name: "Headlight Restoration",
    description: "Restore clarity and brightness to oxidized headlights",
    icon: "sun",
    price: 79,
    duration: "1 hour",
    features: ["Sand oxidation", "Polish clear", "UV sealant", "Improved visibility"],
  },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();

  const handleServicePress = (serviceId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ServiceDetails", { serviceId });
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
            paddingBottom: tabBarHeight + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="body" style={styles.subtitle}>
          Professional detailing services for your vehicle
        </ThemedText>

        {SERVICES.map((service) => (
          <GlassCard
            key={service.id}
            onPress={() => handleServicePress(service.id)}
            style={styles.serviceCard}
          >
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconContainer}>
                <Feather name={service.icon as any} size={24} color={Colors.dark.accent} />
              </View>
              <View style={styles.serviceMeta}>
                <ThemedText type="caption" style={styles.serviceDuration}>
                  {service.duration}
                </ThemedText>
              </View>
            </View>
            
            <ThemedText type="h3" style={styles.serviceName}>
              {service.name}
            </ThemedText>
            
            <ThemedText type="small" style={styles.serviceDescription}>
              {service.description}
            </ThemedText>
            
            <View style={styles.featuresContainer}>
              {service.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <ThemedText type="caption" style={styles.featureText}>
                    {feature}
                  </ThemedText>
                </View>
              ))}
              {service.features.length > 3 ? (
                <View style={styles.featureTag}>
                  <ThemedText type="caption" style={styles.featureText}>
                    +{service.features.length - 3} more
                  </ThemedText>
                </View>
              ) : null}
            </View>
            
            <View style={styles.serviceFooter}>
              <ThemedText type="price" style={styles.servicePrice}>
                ${service.price}
              </ThemedText>
              <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <FloatingMascot 
        message="Need help choosing a service?"
        bottomOffset={tabBarHeight + Spacing.lg}
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
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  serviceCard: {
    marginBottom: Spacing.md,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceDuration: {
    color: Colors.dark.textSecondary,
  },
  serviceName: {
    marginBottom: Spacing.xs,
  },
  serviceDescription: {
    opacity: 0.7,
    marginBottom: Spacing.md,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  featureTag: {
    backgroundColor: Colors.dark.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  featureText: {
    color: Colors.dark.textSecondary,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
  },
  servicePrice: {
    color: Colors.dark.accent,
  },
});
