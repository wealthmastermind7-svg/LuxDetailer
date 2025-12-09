import React from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { FloatingMascot } from "@/components/FloatingMascot";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { ServicesStackParamList } from "@/navigation/ServicesStackNavigator";

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

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

const CATEGORY_ICONS: Record<string, string> = {
  exterior: "droplet",
  interior: "wind",
  premium: "star",
  protection: "shield",
};

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

export default function ServicesScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleServicePress = (serviceId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ServiceDetails", { serviceId });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
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
            paddingBottom: tabBarHeight + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="body" style={styles.subtitle}>
          Professional detailing services for your vehicle
        </ThemedText>

        {services.map((service) => {
          const features = parseFeatures(service.features);
          const icon = CATEGORY_ICONS[service.category] || "star";
          
          return (
            <GlassCard
              key={service.id}
              onPress={() => handleServicePress(service.id)}
              style={styles.serviceCard}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIconContainer}>
                  <Feather name={icon as any} size={24} color={Colors.dark.accent} />
                </View>
                <View style={styles.serviceMeta}>
                  <ThemedText type="caption" style={styles.serviceDuration}>
                    {formatDuration(service.duration)}
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
                {features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <ThemedText type="caption" style={styles.featureText}>
                      {feature}
                    </ThemedText>
                  </View>
                ))}
                {features.length > 3 ? (
                  <View style={styles.featureTag}>
                    <ThemedText type="caption" style={styles.featureText}>
                      +{features.length - 3} more
                    </ThemedText>
                  </View>
                ) : null}
              </View>
              
              <View style={styles.serviceFooter}>
                <ThemedText type="price" style={styles.servicePrice}>
                  ${parseFloat(service.price).toFixed(0)}
                </ThemedText>
                <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
              </View>
            </GlassCard>
          );
        })}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
