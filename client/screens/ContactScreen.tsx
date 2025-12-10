import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing } from "@/constants/theme";

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!email || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", "Your message has been sent. We'll respond within 24 hours.");
    setEmail("");
    setMessage("");
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
        <ThemedText type="body" style={styles.subtitle}>Have questions? We're here to help.</ThemedText>
        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={Colors.dark.textSecondary}
            keyboardType="email-address"
          />
        </GlassCard>
        <GlassCard style={styles.inputCard}>
          <ThemedText type="small" style={styles.label}>Message</ThemedText>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us how we can help..."
            placeholderTextColor={Colors.dark.textSecondary}
            multiline
            numberOfLines={6}
          />
        </GlassCard>
        <Button title="Send Message" onPress={handleSend} />
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
  messageInput: { textAlignVertical: "top", paddingTop: Spacing.sm },
});
