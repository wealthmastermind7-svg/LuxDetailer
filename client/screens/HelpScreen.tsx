import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Colors, Spacing } from "@/constants/theme";

const FAQ_ITEMS = [
  { question: "How do I book a service?", answer: "Tap the Services tab, select a service, choose date/time, and confirm your booking." },
  { question: "Can I reschedule my booking?", answer: "Yes, go to My Bookings and tap any upcoming booking to reschedule it." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, Apple Pay, and Google Pay." },
  { question: "Is there a cancellation fee?", answer: "Free cancellation up to 24 hours before your appointment." },
  { question: "How long does detailing take?", answer: "Most services take 2-4 hours depending on the package selected." },
  { question: "Do you offer mobile services?", answer: "Yes, we come to your location. Service areas may vary." },
];

export default function HelpScreen() {
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
        <ThemedText type="body" style={styles.subtitle}>Frequently Asked Questions</ThemedText>
        {FAQ_ITEMS.map((item, index) => (
          <GlassCard key={index} style={styles.faqCard}>
            <View style={styles.faqQuestion}>
              <Feather name="help-circle" size={20} color={Colors.dark.accent} />
              <ThemedText type="h4" style={styles.question}>{item.question}</ThemedText>
            </View>
            <ThemedText type="body" style={styles.answer}>{item.answer}</ThemedText>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.backgroundRoot },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg },
  subtitle: { opacity: 0.6, marginBottom: Spacing.lg },
  faqCard: { marginBottom: Spacing.md },
  faqQuestion: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.md, gap: Spacing.md },
  question: { flex: 1 },
  answer: { opacity: 0.7, lineHeight: 20 },
});
