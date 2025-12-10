import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing } from "@/constants/theme";

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#0a0a0a", "#111111"]} style={StyleSheet.absoluteFill} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.section}>
          <ThemedText type="h3" style={styles.heading}>Privacy Policy</ThemedText>
          <ThemedText type="body" style={styles.text}>
            LuxDetailer is committed to protecting your privacy. We collect and use your information only to provide our services and improve your experience.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>Information We Collect</ThemedText>
          <ThemedText type="body" style={styles.text}>
            We collect information you provide directly, such as when you create an account, book a service, or contact us. This includes your name, email, phone number, and vehicle information.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>How We Use Your Information</ThemedText>
          <ThemedText type="body" style={styles.text}>
            Your information is used to process bookings, send service updates, improve our services, and communicate with you about your account.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>Security</ThemedText>
          <ThemedText type="body" style={styles.text}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>Contact Us</ThemedText>
          <ThemedText type="body" style={styles.text}>
            If you have any questions about our privacy practices, please contact us at privacy@luxdetailer.com
          </ThemedText>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundRoot },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg },
  section: { marginBottom: Spacing.md },
  heading: { marginBottom: Spacing.md },
  subheading: { marginBottom: Spacing.sm },
  text: { opacity: 0.7, lineHeight: 22 },
});
