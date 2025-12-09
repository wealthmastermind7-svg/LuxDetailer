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
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";

type NavigationProp = NativeStackNavigationProp<BookingsStackParamList>;

type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed";

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  progress: number;
}

const BOOKINGS: Booking[] = [
  {
    id: "1",
    service: "Full Detail",
    date: "Dec 18, 2024",
    time: "10:00 AM",
    status: "confirmed",
    price: 299,
    progress: 0,
  },
  {
    id: "2",
    service: "Ceramic Coating",
    date: "Dec 10, 2024",
    time: "9:00 AM",
    status: "in_progress",
    price: 899,
    progress: 60,
  },
  {
    id: "3",
    service: "Interior Detail",
    date: "Nov 28, 2024",
    time: "2:00 PM",
    status: "completed",
    price: 149,
    progress: 100,
  },
  {
    id: "4",
    service: "Paint Correction",
    date: "Nov 15, 2024",
    time: "11:00 AM",
    status: "completed",
    price: 449,
    progress: 100,
  },
];

const STATUS_CONFIG = {
  pending: {
    color: Colors.dark.textSecondary,
    icon: "clock",
    label: "Pending",
  },
  confirmed: {
    color: Colors.dark.accent,
    icon: "check-circle",
    label: "Confirmed",
  },
  in_progress: {
    color: Colors.dark.accentYellow,
    icon: "loader",
    label: "In Progress",
  },
  completed: {
    color: Colors.dark.accentGreen,
    icon: "check-circle",
    label: "Completed",
  },
};

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();

  const upcomingBookings = BOOKINGS.filter(b => b.status !== "completed");
  const pastBookings = BOOKINGS.filter(b => b.status === "completed");

  const handleBookingPress = (bookingId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("BookingDetails", { bookingId });
  };

  const renderBookingCard = (booking: Booking, showTimeline: boolean = false) => {
    const status = STATUS_CONFIG[booking.status];
    
    return (
      <View key={booking.id} style={styles.timelineItem}>
        {showTimeline ? (
          <View style={styles.timelineConnector}>
            <View style={[styles.timelineDot, { backgroundColor: status.color }]} />
            <View style={styles.timelineLine} />
          </View>
        ) : null}
        <GlassCard
          onPress={() => handleBookingPress(booking.id)}
          style={[styles.bookingCard, showTimeline && styles.bookingCardTimeline]}
        >
          <View style={styles.bookingHeader}>
            <View style={styles.bookingInfo}>
              <ThemedText type="h4">{booking.service}</ThemedText>
              <ThemedText type="small" style={styles.bookingDate}>
                {booking.date} at {booking.time}
              </ThemedText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
              <Feather name={status.icon as any} size={14} color={status.color} />
              <ThemedText type="caption" style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </ThemedText>
            </View>
          </View>
          
          {booking.status === "in_progress" ? (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${booking.progress}%`, backgroundColor: status.color }
                  ]} 
                />
              </View>
              <ThemedText type="caption" style={styles.progressText}>
                {booking.progress}% Complete
              </ThemedText>
            </View>
          ) : null}
          
          <View style={styles.bookingFooter}>
            <ThemedText type="price" style={styles.bookingPrice}>
              ${booking.price}
            </ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </View>
        </GlassCard>
      </View>
    );
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
        {upcomingBookings.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Upcoming
            </ThemedText>
            {upcomingBookings.map((booking) => renderBookingCard(booking, true))}
          </View>
        ) : null}

        {pastBookings.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Past Bookings
            </ThemedText>
            {pastBookings.map((booking) => renderBookingCard(booking, false))}
          </View>
        ) : null}

        {BOOKINGS.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="calendar" size={48} color={Colors.dark.textSecondary} />
            </View>
            <ThemedText type="h3" style={styles.emptyTitle}>
              No Bookings Yet
            </ThemedText>
            <ThemedText type="body" style={styles.emptyText}>
              Book your first detailing service to get started
            </ThemedText>
          </View>
        ) : null}
      </ScrollView>

      <FloatingMascot 
        message="Tap any booking for details"
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  timelineItem: {
    flexDirection: "row",
  },
  timelineConnector: {
    width: 24,
    alignItems: "center",
    marginRight: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: Spacing.lg,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.dark.backgroundSecondary,
    marginTop: Spacing.xs,
  },
  bookingCard: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  bookingCardTimeline: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDate: {
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  statusText: {
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    opacity: 0.6,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
  },
  bookingPrice: {
    color: Colors.dark.accent,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: "center",
  },
});
