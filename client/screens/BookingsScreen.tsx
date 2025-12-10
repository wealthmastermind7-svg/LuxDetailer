import React, { useState } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { FloatingMascot } from "@/components/FloatingMascot";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { BookingsStackParamList } from "@/navigation/BookingsStackNavigator";
import { apiRequest } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<BookingsStackParamList>;
type TabType = "all" | "upcoming" | "past" | "cancelled";

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
  createdAt: string | null;
  updatedAt: string | null;
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

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<ApiBooking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => 
      apiRequest(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
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
    };
  });

  const upcomingBookings = displayBookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const pastBookings = displayBookings.filter(b => b.status === "completed");
  const cancelledBookings = displayBookings.filter(b => b.status === "cancelled");

  const getFilteredBookings = () => {
    switch (activeTab) {
      case "all":
        return displayBookings;
      case "upcoming":
        return upcomingBookings;
      case "past":
        return pastBookings;
      case "cancelled":
        return cancelledBookings;
      default:
        return upcomingBookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  const handleBookingPress = (bookingId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("BookingDetails", { bookingId });
  };

  const handleCancelBooking = (bookingId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    cancelMutation.mutate(bookingId);
  };

  const handleNewBooking = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("BookingFlow");
  };

  const renderBookingCard = (booking: DisplayBooking, showTimeline: boolean = false) => {
    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.scheduled;
    const canCancel = booking.status !== "completed" && booking.status !== "cancelled";
    
    return (
      <View key={booking.id} style={styles.timelineItem}>
        {showTimeline ? (
          <View style={styles.timelineConnector}>
            <View style={[styles.timelineDot, { backgroundColor: status.color }]} />
            <View style={styles.timelineLine} />
          </View>
        ) : null}
        <View style={styles.bookingCardWrapper}>
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
          
          {canCancel ? (
            <Pressable
              onPress={() => handleCancelBooking(booking.id)}
              style={styles.cancelButton}
            >
              <Feather name="x" size={16} color={Colors.dark.textSecondary} />
              <ThemedText type="caption" style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
      </View>
    );
  }

  const tabs: Array<{ id: TabType; label: string; count: number }> = [
    { id: "all", label: "All", count: displayBookings.length },
    { id: "upcoming", label: "Upcoming", count: upcomingBookings.length },
    { id: "past", label: "Past", count: pastBookings.length },
    { id: "cancelled", label: "Cancelled", count: cancelledBookings.length },
  ];

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
        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.id);
              }}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
            >
              <ThemedText
                type="small"
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </ThemedText>
              {tab.count > 0 && (
                <View style={[styles.badge, activeTab === tab.id && styles.badgeActive]}>
                  <ThemedText type="caption" style={styles.badgeText}>
                    {tab.count}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <View style={styles.section}>
            {filteredBookings.map((booking) => renderBookingCard(booking, activeTab === "upcoming"))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="calendar" size={48} color={Colors.dark.textSecondary} />
            </View>
            <ThemedText type="h3" style={styles.emptyTitle}>
              {activeTab === "all" ? "No Bookings Yet" : `No ${tabs.find(t => t.id === activeTab)?.label} Bookings`}
            </ThemedText>
            <ThemedText type="body" style={styles.emptyText}>
              {activeTab === "all" || activeTab === "upcoming"
                ? "Book your first detailing service to get started"
                : `You don't have any ${activeTab} bookings`}
            </ThemedText>
            {(activeTab === "all" || activeTab === "upcoming") && (
              <Pressable
                onPress={handleNewBooking}
                style={styles.bookNowButton}
              >
                <Feather name="plus" size={18} color={Colors.dark.background} />
                <ThemedText type="small" style={styles.bookNowButtonText}>
                  Book Now
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      <FloatingMascot 
        message={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} bookings`}
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
  tabsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    paddingHorizontal: 0,
  },
  tab: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    borderBottomColor: Colors.dark.accent,
  },
  tabLabel: {
    fontWeight: "500",
    opacity: 0.6,
  },
  tabLabelActive: {
    opacity: 1,
    color: Colors.dark.accent,
  },
  badge: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  badgeActive: {
    backgroundColor: Colors.dark.accent,
  },
  badgeText: {
    color: Colors.dark.text,
    fontWeight: "600",
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
  bookingCardWrapper: {
    flex: 1,
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
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  cancelButtonText: {
    color: Colors.dark.textSecondary,
    fontWeight: "500",
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
    marginBottom: Spacing.lg,
  },
  bookNowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.accent,
  },
  bookNowButtonText: {
    color: Colors.dark.background,
    fontWeight: "600",
  },
});
