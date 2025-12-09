import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const VEHICLE = {
  make: "BMW",
  model: "M4 Competition",
  year: "2024",
  color: "San Marino Blue",
  vin: "WBS83DH06RFJ12345",
  licensePlate: "ABC-1234",
};

const SERVICE_HISTORY = [
  { id: "1", service: "Full Detail", date: "Nov 28, 2024", price: 299 },
  { id: "2", service: "Ceramic Coating", date: "Oct 15, 2024", price: 899 },
  { id: "3", service: "Interior Detail", date: "Sep 5, 2024", price: 149 },
];

export default function MyVehicleScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const scrollY = useSharedValue(0);
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-100, 0], [1.3, 1], "clamp");
    const translateY = interpolate(scrollY.value, [0, 200], [0, -50], "clamp");
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#111111"]}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.heroImageContainer, imageAnimatedStyle]}>
          {vehicleImage ? (
            <Image source={{ uri: vehicleImage }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Feather name="truck" size={64} color={Colors.dark.textSecondary} />
              <ThemedText type="body" style={styles.placeholderText}>
                Add a photo of your vehicle
              </ThemedText>
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.heroGradient}
          />
        </Animated.View>

        <View style={styles.vehicleHeader}>
          <ThemedText type="h1" style={styles.vehicleName}>
            {VEHICLE.year} {VEHICLE.make}
          </ThemedText>
          <ThemedText type="h2" style={styles.vehicleModel}>
            {VEHICLE.model}
          </ThemedText>
          <View style={styles.vehicleColor}>
            <View style={[styles.colorDot, { backgroundColor: "#0066CC" }]} />
            <ThemedText type="body" style={styles.colorText}>
              {VEHICLE.color}
            </ThemedText>
          </View>
        </View>

        <Pressable onPress={handlePickImage} style={styles.updatePhotoButton}>
          <Feather name="camera" size={20} color={Colors.dark.accent} />
          <ThemedText type="link" style={styles.updatePhotoText}>
            {vehicleImage ? "Update Photo" : "Add Photo"}
          </ThemedText>
        </Pressable>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Vehicle Details
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText type="body" style={styles.detailLabel}>Make</ThemedText>
            <ThemedText type="body">{VEHICLE.make}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText type="body" style={styles.detailLabel}>Model</ThemedText>
            <ThemedText type="body">{VEHICLE.model}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText type="body" style={styles.detailLabel}>Year</ThemedText>
            <ThemedText type="body">{VEHICLE.year}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText type="body" style={styles.detailLabel}>Color</ThemedText>
            <ThemedText type="body">{VEHICLE.color}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText type="body" style={styles.detailLabel}>License Plate</ThemedText>
            <ThemedText type="body">{VEHICLE.licensePlate}</ThemedText>
          </View>
        </GlassCard>

        <View style={styles.sectionHeaderStandalone}>
          <ThemedText type="h3">Service History</ThemedText>
        </View>

        {SERVICE_HISTORY.map((service) => (
          <GlassCard key={service.id} style={styles.historyCard}>
            <View style={styles.historyContent}>
              <View>
                <ThemedText type="h4">{service.service}</ThemedText>
                <ThemedText type="small" style={styles.historyDate}>
                  {service.date}
                </ThemedText>
              </View>
              <ThemedText type="price" style={styles.historyPrice}>
                ${service.price}
              </ThemedText>
            </View>
          </GlassCard>
        ))}

        <View style={styles.totalContainer}>
          <ThemedText type="body" style={styles.totalLabel}>
            Total Spent on Detailing
          </ThemedText>
          <ThemedText type="display" style={styles.totalAmount}>
            $1,347
          </ThemedText>
        </View>
      </Animated.ScrollView>
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
  heroImageContainer: {
    height: 220,
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: Spacing.md,
    opacity: 0.6,
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  vehicleHeader: {
    marginBottom: Spacing.lg,
  },
  vehicleName: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  vehicleModel: {
    color: Colors.dark.accent,
    marginBottom: Spacing.md,
  },
  vehicleColor: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  colorText: {
    opacity: 0.7,
  },
  updatePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  updatePhotoText: {
    color: Colors.dark.accent,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionHeaderStandalone: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.glassBorder,
  },
  detailLabel: {
    opacity: 0.6,
  },
  historyCard: {
    marginBottom: Spacing.sm,
  },
  historyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: {
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
  historyPrice: {
    color: Colors.dark.accent,
  },
  totalContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    marginTop: Spacing.lg,
  },
  totalLabel: {
    opacity: 0.6,
    marginBottom: Spacing.sm,
  },
  totalAmount: {
    color: Colors.dark.accent,
  },
});
