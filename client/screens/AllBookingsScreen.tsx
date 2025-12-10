import React, { useState } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type BookingStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";

interface ApiBooking {
  id: string;
  userId: string | null;
  vehicleId: string | null;
  serviceId: string | null;
  date: string;
  time: string;
  status: string;
  location: string | null;
  notes: string | null;
  totalPrice: string | null;
  progress: number | null;
}

interface Service {
  id: string;
  name: string;
  price: string;
}

interface DisplayBooking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  progress: number;
  clientId: string | null;
}

const STATUS_CONFIG: Record<BookingStatus, { color: string; icon: string; label: string }> = {
  scheduled: {
    color: Colors.dark.textSecondary,
    icon: "clock",
    label: "Scheduled",
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
  cancelled: {
    color: Colors.dark.textSecondary,
    icon: "x-circle",
    label: "Cancelled",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function AllBookingsScreen() {
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<ApiBooking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const isLoading = bookingsLoading || servicesLoading;

  const displayBookings: DisplayBooking[] = bookings.map(booking => {
    const service = services.find(s => s.id === booking.serviceId);
    return {
      id: booking.id,
      service: service?.name || "Unknown Service",
      date: formatDate(booking.date),
      time: booking.time,
      status: (booking.status as BookingStatus) || "scheduled",
      price: booking.totalPrice ? parseFloat(booking.totalPrice) : 0,
      progress: booking.progress || 0,
      clientId: booking.userId,
    };
  });

  const filteredBookings = filterStatus === "all" 
    ? displayBookings 
    : displayBookings.filter(b => b.status === filterStatus);

  const statuses: Array<{ id: BookingStatus | "all"; label: string; count: number }> = [
    { id: "all", label: "All", count: displayBookings.length },
    { id: "scheduled", label: "Scheduled", count: displayBookings.filter(b => b.status === "scheduled").length },
    { id: "confirmed", label: "Confirmed", count: displayBookings.filter(b => b.status === "confirmed").length },
    { id: "in_progress", label: "In Progress", count: displayBookings.filter(b => b.status === "in_progress").length },
    { id: "completed", label: "Completed", count: displayBookings.filter(b => b.status === "completed").length },
  ];

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
        {/* Stats Header */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: Colors.dark.backgroundSecondary }]}>
            <ThemedText type="h4" style={{ fontWeight: "700" }}>{displayBookings.length}</ThemedText>
            <ThemedText type="caption" style={styles.statLabel}>Total Bookings</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: `${Colors.dark.accentGreen}20` }]}>
            <ThemedText type="h4" style={{ color: Colors.dark.accentGreen, fontWeight: "700" }}>
              {displayBookings.filter(b => b.status === "completed").length}
            </ThemedText>
            <ThemedText type="caption" style={[styles.statLabel, { color: Colors.dark.accentGreen }]}>Completed</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: `${Colors.dark.accent}20` }]}>
            <ThemedText type="h4" style={{ color: Colors.dark.accent, fontWeight: "700" }}>
              ${displayBookings.reduce((sum, b) => sum + b.price, 0)}
            </ThemedText>
            <ThemedText type="caption" style={[styles.statLabel, { color: Colors.dark.accent }]}>Revenue</ThemedText>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {statuses.map((status) => (
            <Pressable
              key={status.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterStatus(status.id);
              }}
              style={[
                styles.filterChip,
                filterStatus === status.id && styles.filterChipActive,
              ]}
            >
              <ThemedText
                type="small"
                style={[
                  styles.filterLabel,
                  filterStatus === status.id && styles.filterLabelActive,
                ]}
              >
                {status.label}
              </ThemedText>
              {status.count > 0 && (
                <View style={[styles.filterBadge, filterStatus === status.id && styles.filterBadgeActive]}>
                  <ThemedText type="caption" style={styles.filterBadgeText}>
                    {status.count}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <View style={styles.bookingsList}>
            {filteredBookings.map((booking) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.scheduled;
              return (
                <View key={booking.id} style={styles.bookingItemWrapper}>
                  <GlassCard style={styles.bookingCard}>
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingInfo}>
                        <ThemedText type="h3" style={{ fontWeight: "700", fontSize: 18, lineHeight: 22 }}>
                          {booking.service}
                        </ThemedText>
                        <ThemedText type="body" style={styles.bookingDate}>
                          {booking.date} • {booking.time}
                        </ThemedText>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
                        <Feather name={status.icon as any} size={13} color={status.color} />
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
                      <View>
                        <ThemedText type="caption" style={{ opacity: 0.6 }}>Price</ThemedText>
                        <ThemedText type="price" style={styles.bookingPrice}>
                          ${booking.price}
                        </ThemedText>
                      </View>
                      <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
                    </View>
                  </GlassCard>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={Colors.dark.textSecondary} />
            <ThemedText type="h3" style={styles.emptyTitle}>
              No Bookings
            </ThemedText>
            <ThemedText type="body" style={styles.emptyText}>
              No bookings match the selected filter
            </ThemedText>
          </View>
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
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
  filterScroll: {
    marginBottom: Spacing.xl,
  },
  filterContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActive: {
    borderColor: Colors.dark.accent,
    backgroundColor: `${Colors.dark.accent}10`,
  },
  filterLabel: {
    fontWeight: "600",
    fontSize: 13,
    opacity: 0.6,
  },
  filterLabelActive: {
    opacity: 1,
    color: Colors.dark.accent,
    fontWeight: "700",
  },
  filterBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  filterBadgeActive: {
    backgroundColor: Colors.dark.accent,
  },
  filterBadgeText: {
    fontWeight: "600",
    fontSize: 11,
  },
  bookingsList: {
    marginBottom: Spacing.xl,
  },
  bookingItemWrapper: {
    marginBottom: Spacing.md,
  },
  bookingCard: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDate: {
    opacity: 0.5,
    marginTop: Spacing.sm,
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    minHeight: 28,
    justifyContent: "center",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 11,
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
    paddingTop: Spacing.lg,
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
  },
  bookingPrice: {
    color: Colors.dark.accent,
    fontWeight: "700",
    fontSize: 18,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    opacity: 0.6,
  },
});
