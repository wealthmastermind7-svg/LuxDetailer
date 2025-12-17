import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Alert, Switch } from "react-native";
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
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useMascot } from "@/contexts/MascotContext";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const USER = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  memberSince: "October 2024",
  bookings: 4,
  totalSpent: 1347,
};

interface MenuItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
}

function MenuItem({ 
  icon, 
  label, 
  value, 
  onPress, 
  showArrow = true, 
  isDestructive = false,
  rightElement,
}: MenuItemProps) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
      disabled={!onPress}
    >
      <View style={[styles.menuIcon, isDestructive && styles.menuIconDestructive]}>
        <Feather 
          name={icon as any} 
          size={20} 
          color={isDestructive ? "#FF453A" : Colors.dark.accent} 
        />
      </View>
      <View style={styles.menuContent}>
        <ThemedText 
          type="body" 
          style={[styles.menuLabel, isDestructive && styles.menuLabelDestructive]}
        >
          {label}
        </ThemedText>
        {value ? (
          <ThemedText type="small" style={styles.menuValue}>
            {value}
          </ThemedText>
        ) : null}
      </View>
      {rightElement ? rightElement : (
        showArrow && onPress ? (
          <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
        ) : null
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { setMascotMessage } = useMascot();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  React.useEffect(() => {
    setMascotMessage("Manage your account, vehicles, and preferences.");
  }, [setMascotMessage]);
  
  // For demo: business owner mode. In production, fetch from auth context/backend
  const isBusinessOwner = true; // TODO: Replace with role check from user auth context

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Account", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "Are you absolutely sure? This is permanent.",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Yes, Delete", 
                  style: "destructive",
                  onPress: () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                  },
                },
              ]
            );
          },
        },
      ]
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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText type="h1" style={styles.avatarText}>
                {USER.name.split(" ").map(n => n[0]).join("")}
              </ThemedText>
            </View>
            <Pressable 
              style={styles.editAvatarButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Feather name="camera" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
          <ThemedText type="h2" style={styles.userName}>
            {USER.name}
          </ThemedText>
          <ThemedText type="body" style={styles.userEmail}>
            {USER.email}
          </ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <GlassCard style={styles.statCard}>
            <ThemedText type="h2" style={styles.statValue} numberOfLines={1}>
              {USER.bookings}
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel} numberOfLines={1}>
              Bookings
            </ThemedText>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <ThemedText type="h2" style={styles.statValue} numberOfLines={1}>
              ${USER.totalSpent}
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel} numberOfLines={2}>
              Total Spent
            </ThemedText>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <ThemedText type="h2" style={styles.statValue} numberOfLines={1}>
              Gold
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel} numberOfLines={1}>
              Member
            </ThemedText>
          </GlassCard>
        </View>

        <GlassCard style={styles.menuSection}>
          <ThemedText type="caption" style={styles.menuSectionTitle}>
            ACCOUNT
          </ThemedText>
          <MenuItem 
            icon="user" 
            label="Personal Information" 
            onPress={() => navigation.navigate("Settings")}
          />
          <MenuItem 
            icon="phone" 
            label="Phone Number" 
            value={USER.phone}
            onPress={() => navigation.navigate("Settings")}
          />
          <MenuItem 
            icon="mail" 
            label="Email Address" 
            value={USER.email}
            onPress={() => navigation.navigate("Settings")}
          />
          <MenuItem 
            icon="lock" 
            label="Change Password" 
            onPress={() => navigation.navigate("ChangePassword")}
          />
        </GlassCard>

        <GlassCard style={styles.menuSection}>
          <ThemedText type="caption" style={styles.menuSectionTitle}>
            PREFERENCES
          </ThemedText>
          <MenuItem 
            icon="bell" 
            label="Push Notifications" 
            showArrow={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setNotificationsEnabled(value);
                }}
                trackColor={{ 
                  false: Colors.dark.backgroundSecondary, 
                  true: Colors.dark.accent 
                }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <MenuItem 
            icon="mail" 
            label="Marketing Emails" 
            showArrow={false}
            rightElement={
              <Switch
                value={marketingEnabled}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMarketingEnabled(value);
                }}
                trackColor={{ 
                  false: Colors.dark.backgroundSecondary, 
                  true: Colors.dark.accent 
                }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </GlassCard>

        {isBusinessOwner && (
          <GlassCard style={styles.menuSection}>
            <ThemedText type="caption" style={styles.menuSectionTitle}>
              BUSINESS
            </ThemedText>
            <MenuItem 
              icon="list" 
              label="All Bookings" 
              value="View all customer bookings"
              onPress={() => navigation.navigate("AllBookings")}
            />
          </GlassCard>
        )}

        <GlassCard style={styles.menuSection}>
          <ThemedText type="caption" style={styles.menuSectionTitle}>
            SUPPORT
          </ThemedText>
          <MenuItem 
            icon="help-circle" 
            label="Help Center" 
            onPress={() => navigation.navigate("Help")}
          />
          <MenuItem 
            icon="message-circle" 
            label="Contact Us" 
            onPress={() => navigation.navigate("Contact")}
          />
          <MenuItem 
            icon="file-text" 
            label="Terms of Service" 
            onPress={() => navigation.navigate("Terms")}
          />
          <MenuItem 
            icon="shield" 
            label="Privacy Policy" 
            onPress={() => navigation.navigate("Privacy")}
          />
        </GlassCard>

        <GlassCard style={styles.menuSection}>
          <MenuItem 
            icon="log-out" 
            label="Sign Out" 
            onPress={handleLogout}
            showArrow={false}
          />
          <MenuItem 
            icon="trash-2" 
            label="Delete Account" 
            onPress={handleDeleteAccount}
            showArrow={false}
            isDestructive
          />
        </GlassCard>

        <ThemedText type="caption" style={styles.version}>
          MyCustomIOSApp v1.0.0
        </ThemedText>
      </ScrollView>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 36,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.dark.backgroundRoot,
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  userEmail: {
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    minHeight: 140,
  },
  statValue: {
    color: Colors.dark.accent,
    marginBottom: Spacing.xs,
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    opacity: 0.6,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 15,
    width: "100%",
  },
  menuSection: {
    marginBottom: Spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  menuSectionTitle: {
    opacity: 0.6,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  menuItemPressed: {
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  menuIconDestructive: {
    backgroundColor: "rgba(255, 69, 58, 0.15)",
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontWeight: "500",
  },
  menuLabelDestructive: {
    color: "#FF453A",
  },
  menuValue: {
    opacity: 0.6,
    marginTop: 2,
  },
  version: {
    textAlign: "center",
    opacity: 0.4,
    marginTop: Spacing.lg,
  },
});
