import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const STEPS = ["Service", "Date", "Time", "Location", "Confirm"];

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const DATES = [
  { day: "Mon", date: "16", month: "Dec" },
  { day: "Tue", date: "17", month: "Dec" },
  { day: "Wed", date: "18", month: "Dec" },
  { day: "Thu", date: "19", month: "Dec" },
  { day: "Fri", date: "20", month: "Dec" },
  { day: "Sat", date: "21", month: "Dec" },
  { day: "Sun", date: "22", month: "Dec" },
];

const SERVICES_LIST = [
  { id: "1", name: "Full Detail", price: 299 },
  { id: "2", name: "Ceramic Coating", price: 899 },
  { id: "3", name: "Paint Correction", price: 449 },
  { id: "4", name: "Interior Detail", price: 149 },
];

export default function BookingFlowScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedService;
      case 1: return !!selectedDate;
      case 2: return !!selectedTime;
      case 3: return location.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const selectedServiceData = SERVICES_LIST.find(s => s.id === selectedService);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Select Service
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Choose the detailing service you need
            </ThemedText>
            {SERVICES_LIST.map((service) => (
              <GlassCard
                key={service.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedService(service.id);
                }}
                style={[
                  styles.optionCard,
                  selectedService === service.id && styles.optionCardSelected,
                ]}
              >
                <View style={styles.optionContent}>
                  <View>
                    <ThemedText type="h4">{service.name}</ThemedText>
                    <ThemedText type="price" style={styles.optionPrice}>
                      ${service.price}
                    </ThemedText>
                  </View>
                  {selectedService === service.id ? (
                    <View style={styles.checkCircle}>
                      <Feather name="check" size={16} color="#FFFFFF" />
                    </View>
                  ) : null}
                </View>
              </GlassCard>
            ))}
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Select Date
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Choose your preferred appointment date
            </ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {DATES.map((dateItem, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDate(dateItem.date);
                  }}
                  style={({ pressed }) => [
                    styles.dateCard,
                    selectedDate === dateItem.date && styles.dateCardSelected,
                    pressed && styles.dateCardPressed,
                  ]}
                >
                  <ThemedText type="caption" style={styles.dateDay}>
                    {dateItem.day}
                  </ThemedText>
                  <ThemedText type="h2" style={[
                    styles.dateNumber,
                    selectedDate === dateItem.date && styles.dateNumberSelected,
                  ]}>
                    {dateItem.date}
                  </ThemedText>
                  <ThemedText type="caption" style={styles.dateMonth}>
                    {dateItem.month}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Select Time
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Choose your preferred time slot
            </ThemedText>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedTime(time);
                  }}
                  style={({ pressed }) => [
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected,
                    pressed && styles.timeSlotPressed,
                  ]}
                >
                  <ThemedText 
                    type="body" 
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.timeTextSelected,
                    ]}
                  >
                    {time}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Service Location
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Where should we come to detail your vehicle?
            </ThemedText>
            <GlassCard style={styles.inputCard}>
              <ThemedText type="small" style={styles.inputLabel}>
                Address
              </ThemedText>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your address"
                placeholderTextColor={Colors.dark.textSecondary}
                multiline
              />
            </GlassCard>
            <GlassCard style={styles.inputCard}>
              <ThemedText type="small" style={styles.inputLabel}>
                Special Instructions (Optional)
              </ThemedText>
              <TextInput
                style={styles.textInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Gate code, parking instructions, etc."
                placeholderTextColor={Colors.dark.textSecondary}
                multiline
              />
            </GlassCard>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Confirm Booking
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Review your appointment details
            </ThemedText>
            <GlassCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={styles.summaryLabel}>Service</ThemedText>
                <ThemedText type="h4">{selectedServiceData?.name}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={styles.summaryLabel}>Date</ThemedText>
                <ThemedText type="h4">Dec {selectedDate}, 2024</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={styles.summaryLabel}>Time</ThemedText>
                <ThemedText type="h4">{selectedTime}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={styles.summaryLabel}>Location</ThemedText>
                <ThemedText type="body" style={styles.summaryAddress}>{location}</ThemedText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <ThemedText type="h4">Total</ThemedText>
                <ThemedText type="price" style={styles.totalPrice}>
                  ${selectedServiceData?.price}
                </ThemedText>
              </View>
            </GlassCard>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#111111"]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={[styles.progressContainer, { paddingTop: headerHeight + Spacing.md }]}>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              index <= currentStep && styles.progressDotActive,
            ]}>
              {index < currentStep ? (
                <Feather name="check" size={12} color="#FFFFFF" />
              ) : null}
            </View>
            {index < STEPS.length - 1 ? (
              <View style={[
                styles.progressLine,
                index < currentStep && styles.progressLineActive,
              ]} />
            ) : null}
          </View>
        ))}
      </View>

      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.buttonRow}>
          {currentStep > 0 ? (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.dark.text} />
            </Pressable>
          ) : null}
          <Button 
            onPress={handleNext} 
            disabled={!canProceed()}
            style={[styles.nextButton, currentStep === 0 && styles.nextButtonFull]}
          >
            {currentStep === STEPS.length - 1 ? "Confirm Booking" : "Continue"}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundRoot,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  progressDotActive: {
    backgroundColor: Colors.dark.accent,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.dark.backgroundSecondary,
    marginHorizontal: Spacing.xs,
  },
  progressLineActive: {
    backgroundColor: Colors.dark.accent,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  stepContent: {
    paddingTop: Spacing.lg,
  },
  stepTitle: {
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    marginBottom: Spacing.md,
  },
  optionCardSelected: {
    borderColor: Colors.dark.accent,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionPrice: {
    color: Colors.dark.accent,
    marginTop: Spacing.xs,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  datesContainer: {
    paddingVertical: Spacing.md,
  },
  dateCard: {
    width: 70,
    paddingVertical: Spacing.lg,
    marginRight: Spacing.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  dateCardSelected: {
    borderColor: Colors.dark.accent,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
  dateCardPressed: {
    opacity: 0.8,
  },
  dateDay: {
    opacity: 0.6,
    marginBottom: Spacing.xs,
  },
  dateNumber: {
    marginBottom: Spacing.xs,
  },
  dateNumberSelected: {
    color: Colors.dark.accent,
  },
  dateMonth: {
    opacity: 0.6,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  timeSlot: {
    width: "30%",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  timeSlotSelected: {
    borderColor: Colors.dark.accent,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
  timeSlotPressed: {
    opacity: 0.8,
  },
  timeText: {
    color: Colors.dark.text,
  },
  timeTextSelected: {
    color: Colors.dark.accent,
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
    minHeight: 60,
    textAlignVertical: "top",
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    opacity: 0.6,
  },
  summaryAddress: {
    textAlign: "right",
    flex: 1,
    marginLeft: Spacing.lg,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.dark.glassBorder,
    marginVertical: Spacing.md,
  },
  totalPrice: {
    color: Colors.dark.accent,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    flex: 1,
    ...Shadows.glow,
  },
  nextButtonFull: {
    flex: 1,
  },
});
