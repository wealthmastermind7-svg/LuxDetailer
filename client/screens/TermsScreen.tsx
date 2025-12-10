import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing } from "@/constants/theme";

export default function TermsScreen() {
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
          <ThemedText type="h3" style={styles.heading}>Terms of Service</ThemedText>
          <ThemedText type="body" style={styles.text}>
            By using LuxDetailer, you agree to these terms and conditions. Please read them carefully.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>User Responsibilities</ThemedText>
          <ThemedText type="body" style={styles.text}>
            You agree to provide accurate information when booking services and to comply with all applicable laws and regulations.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>Booking and Cancellation</ThemedText>
          <ThemedText type="body" style={styles.text}>
            Bookings can be cancelled free of charge up to 24 hours before the scheduled service. Cancellations made less than 24 hours before may incur a cancellation fee.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>Payment</ThemedText>
          <ThemedText type="body" style={styles.text}>
            Payment must be received before service is provided. All prices are final and non-refundable except for cancellations within the allowed timeframe.
          </ThemedText>
        </GlassCard>

        <GlassCard style={styles.section}>
          <ThemedText type="h4" style={styles.subheading}>Limitation of Liability</ThemedText>
          <ThemedText type="body" style={styles.text}>
            LuxDetailer shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
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
