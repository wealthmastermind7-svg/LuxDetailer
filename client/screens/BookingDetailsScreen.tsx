import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";

type RouteType = RouteProp<BookingsStackParamList, "BookingDetails">;

const BOOKING_DETAILS = {
  id: "1",
  service: "Full Detail",
  date: "December 18, 2024",
  time: "10:00 AM",
  status: "confirmed" as const,
  price: 299,
  location: "123 Main Street, Apt 4B, New York, NY 10001",
  vehicle: {
    make: "BMW",
    model: "M4 Competition",
    year: "2024",
    color: "San Marino Blue",
  },
  technician: {
    name: "Michael Chen",
    rating: 4.9,
    jobs: 248,
  },
  addOns: [
    { name: "Engine Bay Detail", price: 89 },
  ],
  timeline: [
    { time: "10:00 AM", label: "Scheduled arrival", completed: false },
    { time: "10:15 AM", label: "Exterior wash begins", completed: false },
    { time: "11:30 AM", label: "Clay bar treatment", completed: false },
    { time: "1:00 PM", label: "Interior deep clean", completed: false },
    { time: "2:30 PM", label: "Final inspection", completed: false },
  ],
};

export default function BookingDetailsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<RouteType>();

  const booking = BOOKING_DETAILS;
  const subtotal = booking.price + booking.addOns.reduce((sum, a) => sum + a.price, 0);

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
        <View style={styles.statusHeader}>
          <View style={styles.statusIcon}>
            <Feather name="check-circle" size={32} color={Colors.dark.accent} />
          </View>
          <ThemedText type="h2" style={styles.statusTitle}>
            Booking Confirmed
          </ThemedText>
          <ThemedText type="body" style={styles.statusSubtitle}>
            {booking.date} at {booking.time}
          </ThemedText>
        </View>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Service Details
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText type="body" style={styles.detailLabel}>Service</ThemedText>
            <ThemedText type="body">{booking.service}</ThemedText>
          </View>
          {booking.addOns.map((addon, index) => (
            <View key={index} style={styles.detailRow}>
              <ThemedText type="body" style={styles.detailLabel}>Add-on</ThemedText>
              <ThemedText type="body">{addon.name}</ThemedText>
            </View>
          ))}
        </GlassCard>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="truck" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Vehicle
            </ThemedText>
          </View>
          <ThemedText type="h3" style={styles.vehicleName}>
            {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
          </ThemedText>
          <ThemedText type="small" style={styles.vehicleColor}>
            {booking.vehicle.color}
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Location
            </ThemedText>
          </View>
          <ThemedText type="body">{booking.location}</ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Your Technician
            </ThemedText>
          </View>
          <View style={styles.technicianRow}>
            <View style={styles.technicianAvatar}>
              <Feather name="user" size={24} color={Colors.dark.text} />
            </View>
            <View style={styles.technicianInfo}>
              <ThemedText type="h4">{booking.technician.name}</ThemedText>
              <View style={styles.technicianMeta}>
                <Feather name="star" size={14} color={Colors.dark.accentYellow} />
                <ThemedText type="small" style={styles.technicianRating}>
                  {booking.technician.rating} ({booking.technician.jobs} jobs)
                </ThemedText>
              </View>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="clock" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Timeline
            </ThemedText>
          </View>
          {booking.timeline.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                item.completed && styles.timelineDotCompleted,
              ]} />
              <View style={styles.timelineContent}>
                <ThemedText type="small" style={styles.timelineTime}>
                  {item.time}
                </ThemedText>
                <ThemedText type="body">{item.label}</ThemedText>
              </View>
            </View>
          ))}
        </GlassCard>

        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="credit-card" size={20} color={Colors.dark.accent} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Payment Summary
            </ThemedText>
          </View>
          <View style={styles.paymentRow}>
            <ThemedText type="body" style={styles.detailLabel}>{booking.service}</ThemedText>
            <ThemedText type="body">${booking.price}</ThemedText>
          </View>
          {booking.addOns.map((addon, index) => (
            <View key={index} style={styles.paymentRow}>
              <ThemedText type="body" style={styles.detailLabel}>{addon.name}</ThemedText>
              <ThemedText type="body">${addon.price}</ThemedText>
            </View>
          ))}
          <View style={styles.paymentDivider} />
          <View style={styles.paymentRow}>
            <ThemedText type="h4">Total</ThemedText>
            <ThemedText type="price" style={styles.totalPrice}>${subtotal}</ThemedText>
          </View>
        </GlassCard>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <Button style={styles.contactButton}>
          Contact Support
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
  statusHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  statusTitle: {
    marginBottom: Spacing.xs,
  },
  statusSubtitle: {
    opacity: 0.7,
  },
  section: {
    marginBottom: Spacing.md,
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    opacity: 0.6,
  },
  vehicleName: {
    marginBottom: Spacing.xs,
  },
  vehicleColor: {
    opacity: 0.6,
  },
  technicianRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  technicianAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  technicianInfo: {
    flex: 1,
  },
  technicianMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  technicianRating: {
    opacity: 0.7,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.backgroundSecondary,
    marginRight: Spacing.md,
    marginTop: 4,
  },
  timelineDotCompleted: {
    backgroundColor: Colors.dark.accentGreen,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    opacity: 0.6,
    marginBottom: 2,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: Colors.dark.glassBorder,
    marginVertical: Spacing.md,
  },
  totalPrice: {
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
  contactButton: {
    ...Shadows.glow,
  },
});
