import React, { useState, useMemo } from "react";
import { ScrollView, View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { ServicesStackParamList } from "@/navigation/ServicesStackNavigator";

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;
type RouteType = RouteProp<ServicesStackParamList, "ServiceDetails">;

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  duration: number;
  imageUrl: string | null;
  features: string | null;
  isActive: boolean | null;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

const ADD_ONS: AddOn[] = [
  { id: "1", name: "Engine Bay Detail", price: 89 },
  { id: "2", name: "Headlight Restoration", price: 79 },
  { id: "3", name: "Wheel Ceramic Coating", price: 149 },
  { id: "4", name: "Leather Protection", price: 99 },
  { id: "5", name: "Odor Elimination", price: 49 },
  { id: "6", name: "Pet Hair Removal", price: 59 },
];

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}h ${mins}m`;
}

function parseFeatures(features: string | null): string[] {
  if (!features) return [];
  try {
    return JSON.parse(features);
  } catch {
    return [];
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  exterior: "droplet",
  interior: "wind",
  premium: "star",
  protection: "shield",
};

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  
  const serviceId = route.params?.serviceId;
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const service = useMemo(() => {
    return services.find(s => s.id === serviceId);
  }, [services, serviceId]);

  const features = useMemo(() => {
    return parseFeatures(service?.features || null);
  }, [service]);

  const basePrice = useMemo(() => {
    return service ? parseFloat(service.price) : 0;
  }, [service]);

  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((total, addOnId) => {
      const addOn = ADD_ONS.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
  }, [selectedAddOns]);

  const totalPrice = basePrice + addOnsTotal;

  const handleAddOnToggle = (addOnId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleBookNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("BookingFlow", {
      serviceId,
      addOns: selectedAddOns,
      totalPrice,
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Feather name="alert-circle" size={48} color={Colors.dark.textSecondary} />
        <ThemedText type="h3" style={styles.errorText}>Service not found</ThemedText>
      </View>
    );
  }

  const icon = CATEGORY_ICONS[service.category] || "star";

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
            <Feather name={icon as any} size={48} color={Colors.dark.accent} />
          </View>
          
          <ThemedText type="h1" style={styles.serviceName}>
            {service.name}
          </ThemedText>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color={Colors.dark.textSecondary} />
              <ThemedText type="small" style={styles.metaText}>
                {formatDuration(service.duration)}
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
              ${basePrice.toFixed(0)}
            </ThemedText>
          </View>
        </GlassCard>

        {service.description ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              About This Service
            </ThemedText>
            <ThemedText type="body" style={styles.description}>
              {service.description}
            </ThemedText>
          </View>
        ) : null}

        {features.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              What's Included
            </ThemedText>
            {features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.checkIcon}>
                  <Feather name="check" size={16} color={Colors.dark.accentGreen} />
                </View>
                <ThemedText type="body" style={styles.featureText}>
                  {feature}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Add-Ons
          </ThemedText>
          {ADD_ONS.map((addon) => {
            const isSelected = selectedAddOns.includes(addon.id);
            return (
              <Pressable
                key={addon.id}
                onPress={() => handleAddOnToggle(addon.id)}
                style={[
                  styles.addonCard,
                  isSelected && styles.addonCardSelected,
                ]}
              >
                <ThemedText type="body" style={styles.addonName}>{addon.name}</ThemedText>
                <ThemedText type="body" style={styles.addonPrice}>
                  +${addon.price}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable 
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <LinearGradient
            colors={[Colors.dark.accent, "#0066CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookButtonGradient}
          >
            <ThemedText type="h3" style={styles.bookButtonText}>
              Book Now - ${totalPrice.toFixed(0)}
            </ThemedText>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: Spacing.md,
    color: Colors.dark.textSecondary,
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
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(52, 199, 89, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    flex: 1,
  },
  addonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  addonCardSelected: {
    borderColor: Colors.dark.accent,
    backgroundColor: "rgba(10, 132, 255, 0.1)",
  },
  addonName: {
    flex: 1,
  },
  addonPrice: {
    color: Colors.dark.accent,
    fontWeight: "600",
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
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  bookButtonGradient: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
