import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing, Shadows } from "@/constants/theme";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Johnson");
  const [email, setEmail] = useState("alex.johnson@email.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", "Your profile has been updated.", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#111111"]}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAwareScrollViewCompat
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
        <ThemedText type="body" style={styles.subtitle}>
          Update your personal information
        </ThemedText>

        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.inputLabel}>
            First Name
          </ThemedText>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor={Colors.dark.textSecondary}
          />
        </GlassCard>

        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.inputLabel}>
            Last Name
          </ThemedText>
          <TextInput
            style={styles.textInput}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor={Colors.dark.textSecondary}
          />
        </GlassCard>

        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.inputLabel}>
            Email Address
          </ThemedText>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={Colors.dark.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </GlassCard>

        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.inputLabel}>
            Phone Number
          </ThemedText>
          <TextInput
            style={styles.textInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor={Colors.dark.textSecondary}
            keyboardType="phone-pad"
          />
        </GlassCard>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <Button onPress={handleSave} style={styles.saveButton}>
          Save Changes
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
  subtitle: {
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  inputCard: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    opacity: 0.6,
    marginBottom: Spacing.sm,
  },
  textInput: {
    color: Colors.dark.text,
    fontSize: 17,
    paddingVertical: Spacing.xs,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  saveButton: {
    ...Shadows.glow,
  },
});
