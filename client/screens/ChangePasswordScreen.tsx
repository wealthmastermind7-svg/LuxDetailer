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
import { Colors, Spacing } from "@/constants/theme";

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSave = () => {
    if (!current || !newPass || !confirm) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPass.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", "Password changed successfully", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#0a0a0a", "#111111"]} style={StyleSheet.absoluteFill} />
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="body" style={styles.subtitle}>Update your password to keep your account secure</ThemedText>
        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.label}>Current Password</ThemedText>
          <TextInput
            style={styles.input}
            value={current}
            onChangeText={setCurrent}
            placeholder="••••••••"
            placeholderTextColor={Colors.dark.textSecondary}
            secureTextEntry
          />
        </GlassCard>
        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.label}>New Password</ThemedText>
          <TextInput
            style={styles.input}
            value={newPass}
            onChangeText={setNewPass}
            placeholder="••••••••"
            placeholderTextColor={Colors.dark.textSecondary}
            secureTextEntry
          />
        </GlassCard>
        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.label}>Confirm Password</ThemedText>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            placeholderTextColor={Colors.dark.textSecondary}
            secureTextEntry
          />
        </GlassCard>
        <Button title="Update Password" onPress={handleSave} />
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundRoot },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg },
  subtitle: { opacity: 0.6, marginBottom: Spacing.lg },
  inputCard: { marginBottom: Spacing.md },
  label: { marginBottom: Spacing.sm },
  input: { color: Colors.dark.text, fontSize: 16, padding: 0 },
});
