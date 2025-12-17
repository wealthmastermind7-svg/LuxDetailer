import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useMascot } from "@/contexts/MascotContext";

interface Business {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  website: string | null;
  isActive: boolean | null;
}

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

export default function BusinessProfileScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { setMascotMessage } = useMascot();
  
  const { slug } = route.params as { slug: string };

  const { data: business, isLoading, error } = useQuery<Business>({
    queryKey: [`/api/businesses/${slug}`],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    enabled: !!business,
  });

  React.useEffect(() => {
    if (business) {
      setMascotMessage(`Welcome to ${business.name}! Browse their services.`);
    }
  }, [business, setMascotMessage]);

  const handleCall = () => {
    if (business?.contactPhone) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Linking.openURL(`tel:${business.contactPhone}`);
    }
  };

  const handleEmail = () => {
    if (business?.contactEmail) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Linking.openURL(`mailto:${business.contactEmail}`);
    }
  };

  const handleWebsite = () => {
    if (business?.website) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Linking.openURL(business.website);
    }
  };

  const handleBookService = (serviceId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Main", {
      screen: "HomeTab",
      params: {
        screen: "BookingFlow",
        params: { serviceId },
      },
    });
  };

  const primaryColor = business?.primaryColor || Colors.dark.accent;
  const secondaryColor = business?.secondaryColor || Colors.dark.accentYellow;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top + 60 }]}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <ThemedText style={styles.loadingText}>Loading business...</ThemedText>
      </View>
    );
  }

  if (error || !business) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top + 60 }]}>
        <Feather name="alert-circle" size={48} color={Colors.dark.textSecondary} />
        <ThemedText style={styles.errorText}>Business not found</ThemedText>
        <Pressable
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <ThemedText style={styles.retryText}>Go Back</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + 80,
        paddingBottom: insets.bottom + Spacing.xxl,
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {business.logoUrl ? (
          <Image
            source={{ uri: business.logoUrl }}
            style={styles.logo}
            contentFit="contain"
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <ThemedText style={styles.logoInitial}>
              {business.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        )}
        <ThemedText style={styles.businessName}>{business.name}</ThemedText>
        {business.description ? (
          <ThemedText style={styles.businessDescription}>
            {business.description}
          </ThemedText>
        ) : null}
      </LinearGradient>

      <View style={styles.contactRow}>
        {business.contactPhone ? (
          <Pressable style={styles.contactButton} onPress={handleCall}>
            <Feather name="phone" size={20} color={primaryColor} />
            <ThemedText style={[styles.contactText, { color: primaryColor }]}>
              Call
            </ThemedText>
          </Pressable>
        ) : null}
        {business.contactEmail ? (
          <Pressable style={styles.contactButton} onPress={handleEmail}>
            <Feather name="mail" size={20} color={primaryColor} />
            <ThemedText style={[styles.contactText, { color: primaryColor }]}>
              Email
            </ThemedText>
          </Pressable>
        ) : null}
        {business.website ? (
          <Pressable style={styles.contactButton} onPress={handleWebsite}>
            <Feather name="globe" size={20} color={primaryColor} />
            <ThemedText style={[styles.contactText, { color: primaryColor }]}>
              Website
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      {business.address ? (
        <GlassCard style={styles.addressCard}>
          <Feather name="map-pin" size={18} color={Colors.dark.textSecondary} />
          <ThemedText style={styles.addressText}>{business.address}</ThemedText>
        </GlassCard>
      ) : null}

      <ThemedText style={styles.sectionTitle}>Services</ThemedText>
      
      {services.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>
            No services available yet
          </ThemedText>
        </GlassCard>
      ) : (
        services.map((service) => (
          <GlassCard key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
              <ThemedText style={[styles.servicePrice, { color: primaryColor }]}>
                ${service.price}
              </ThemedText>
            </View>
            {service.description ? (
              <ThemedText style={styles.serviceDescription}>
                {service.description}
              </ThemedText>
            ) : null}
            <View style={styles.serviceFooter}>
              <View style={styles.durationBadge}>
                <Feather name="clock" size={14} color={Colors.dark.textSecondary} />
                <ThemedText style={styles.durationText}>
                  {service.duration} min
                </ThemedText>
              </View>
              <Pressable
                style={[styles.bookButton, { backgroundColor: primaryColor }]}
                onPress={() => handleBookService(service.id)}
              >
                <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
              </Pressable>
            </View>
          </GlassCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundRoot,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.dark.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundRoot,
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    marginTop: Spacing.md,
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  headerGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.dark.text,
  },
  businessName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.text,
    textAlign: "center",
  },
  businessDescription: {
    fontSize: 17,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
  },
  serviceCard: {
    marginBottom: Spacing.md,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.dark.text,
    flex: 1,
  },
  servicePrice: {
    fontSize: 17,
    fontWeight: "700",
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  durationText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  bookButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 14,
  },
});
