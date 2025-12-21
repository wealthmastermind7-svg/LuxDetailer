import React, { useState } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
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
import { PremiumVideoMontage } from "@/components/PremiumVideoMontage";
import { useMascot } from "@/contexts/MascotContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { ServicesStackParamList } from "@/navigation/ServicesStackNavigator";

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

const CATEGORIES = [
  { id: "all", name: "All Services", icon: "grid" },
  { id: "exterior", name: "Exterior", icon: "droplet" },
  { id: "interior", name: "Interior", icon: "wind" },
  { id: "premium", name: "Premium", icon: "star" },
  { id: "protection", name: "Protection", icon: "shield" },
];

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { setMascotMessage } = useMascot();

  React.useEffect(() => {
    setMascotMessage("Explore our premium detailing services!");
  }, [setMascotMessage]);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const filteredServices = (selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory)
  ).sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  const handleServicePress = (serviceId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ServiceDetails", { serviceId });
  };

  const handleCategoryPress = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
    const category = CATEGORIES.find(c => c.id === categoryId);
    setMascotMessage(`Showing ${category?.name.toLowerCase()}...`);
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
        <PremiumVideoMontage />
        
        <ThemedText type="h2" style={styles.sectionTitle}>
          Our Services
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          Professional detailing services for your vehicle
        </ThemedText>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => handleCategoryPress(category.id)}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
            >
              <Feather 
                name={category.icon as any} 
                size={18} 
                color={selectedCategory === category.id ? Colors.dark.accent : Colors.dark.textSecondary}
                style={styles.categoryIcon}
              />
              <ThemedText 
                type="small"
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.id && styles.categoryLabelActive,
                ]}
              >
                {category.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={Colors.dark.textSecondary} />
            <ThemedText type="h3" style={styles.emptyTitle}>
              No services found
            </ThemedText>
            <ThemedText type="small" style={styles.emptySubtitle}>
              Try selecting a different category
            </ThemedText>
          </View>
        ) : (
          filteredServices.map((service) => {
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
          })
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
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.lg,
  },
  categoriesContainer: {
    marginBottom: Spacing.xl,
  },
  categoriesScroll: {
    paddingRight: Spacing.lg,
    marginLeft: -Spacing.lg,
    paddingLeft: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    marginRight: Spacing.sm,
  },
  categoryTabActive: {
    backgroundColor: "rgba(10, 132, 255, 0.2)",
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  categoryIcon: {
    marginRight: Spacing.xs,
  },
  categoryLabel: {
    color: Colors.dark.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.dark.accent,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    color: Colors.dark.textSecondary,
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
