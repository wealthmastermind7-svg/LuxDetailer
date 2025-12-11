import React, { useState, useMemo } from "react";
import { ScrollView, View, StyleSheet, Pressable, TextInput, ActivityIndicator, Alert, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { FloatingMascot } from "@/components/FloatingMascot";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { apiRequest } from "@/lib/query-client";
import { useAuth } from "@/contexts/AuthContext";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type RouteType = RouteProp<{ BookingFlow: { serviceId?: string; addOns?: string[]; totalPrice?: number } }, "BookingFlow">;

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  duration: number;
  imageUrl: string | null;
  features: string | null;
  isActive: boolean | null;
}

const ALL_STEPS = ["Service", "Date", "Time", "Location", "Confirm"];
const STEPS_WITHOUT_SERVICE = ["Date", "Time", "Location", "Confirm"];

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const ADD_ON_NAMES: Record<string, { name: string; price: number }> = {
  "1": { name: "Engine Bay Detail", price: 89 },
  "2": { name: "Headlight Restoration", price: 79 },
  "3": { name: "Wheel Ceramic Coating", price: 149 },
  "4": { name: "Leather Protection", price: 99 },
  "5": { name: "Odor Elimination", price: 49 },
  "6": { name: "Pet Hair Removal", price: 59 },
};

const LOCATION_PRESETS = [
  { id: "home", label: "Home", icon: "home" as const, hint: "Your home address" },
  { id: "office", label: "Office", icon: "briefcase" as const, hint: "Your work address" },
  { id: "other", label: "Other", icon: "map-pin" as const, hint: "Enter address" },
];

function generateDates(): { day: string; date: string; month: string; fullDate: string }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      day: days[date.getDay()],
      date: date.getDate().toString(),
      month: months[date.getMonth()],
      fullDate: date.toISOString().split("T")[0],
    });
  }
  return dates;
}

export default function BookingFlowScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const queryClient = useQueryClient();
  const { isAuthenticated, login, register } = useAuth();
  
  const preSelectedServiceId = route.params?.serviceId;
  const preSelectedAddOns = route.params?.addOns || [];
  const preSelectedTotalPrice = route.params?.totalPrice;
  
  const hasPreSelection = !!preSelectedServiceId;
  const STEPS = hasPreSelection ? STEPS_WITHOUT_SERVICE : ALL_STEPS;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(preSelectedServiceId || null);
  const [selectedAddOns] = useState<string[]>(preSelectedAddOns);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateDisplay, setSelectedDateDisplay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocationType, setSelectedLocationType] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const DATES = generateDates();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const calculatedTotalPrice = useMemo(() => {
    if (preSelectedTotalPrice !== undefined) {
      return preSelectedTotalPrice;
    }
    const service = services.find(s => s.id === selectedService);
    if (!service) return 0;
    const basePrice = parseFloat(service.price);
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = ADD_ON_NAMES[addOnId];
      return total + (addOn?.price || 0);
    }, 0);
    return basePrice + addOnsTotal;
  }, [preSelectedTotalPrice, services, selectedService, selectedAddOns]);

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      serviceId: string;
      date: string;
      time: string;
      location: string;
      notes?: string;
      totalPrice: string;
      addOns?: string;
    }) => {
      return apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Booking Confirmed!",
        "Your detailing appointment has been scheduled. We'll see you soon!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    },
    onError: () => {
      Alert.alert("Error", "Failed to create booking. Please try again.");
    },
  });

  const submitBooking = () => {
    if (selectedService && selectedDate && selectedTime && location.length > 0) {
      createBookingMutation.mutate({
        serviceId: selectedService,
        date: selectedDate,
        time: selectedTime,
        location,
        notes: notes || undefined,
        totalPrice: calculatedTotalPrice.toFixed(2),
        addOns: selectedAddOns.length > 0 ? JSON.stringify(selectedAddOns) : undefined,
      });
    }
  };

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      setLoginError("Please enter username and password");
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      if (isRegistering) {
        await register(loginUsername, loginPassword);
      } else {
        await login(loginUsername, loginPassword);
      }
      setShowLoginModal(false);
      setLoginUsername("");
      setLoginPassword("");
      if (pendingSubmit) {
        submitBooking();
        setPendingSubmit(false);
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (createBookingMutation.isPending || pendingSubmit) {
        return;
      }
      if (!location || location.length === 0) {
        Alert.alert("Missing Address", "Please enter your service address.");
        return;
      }
      if (!isAuthenticated) {
        setPendingSubmit(true);
        setLoginError(null);
        setShowLoginModal(true);
        return;
      }
      submitBooking();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const stepName = STEPS[currentStep];
    switch (stepName) {
      case "Service": return !!selectedService;
      case "Date": return !!selectedDate;
      case "Time": return !!selectedTime;
      case "Location": return location.trim().length > 0;
      case "Confirm": return true;
      default: return false;
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
      </View>
    );
  }

  const renderStepContent = () => {
    const stepName = STEPS[currentStep];
    
    switch (stepName) {
      case "Service":
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Select Service
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Choose the detailing service you need
            </ThemedText>
            {services.map((service) => (
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
                      ${parseFloat(service.price).toFixed(0)}
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

      case "Date":
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
                    setSelectedDate(dateItem.fullDate);
                    setSelectedDateDisplay(`${dateItem.month} ${dateItem.date}`);
                  }}
                  style={({ pressed }) => [
                    styles.dateCard,
                    selectedDate === dateItem.fullDate && styles.dateCardSelected,
                    pressed && styles.dateCardPressed,
                  ]}
                >
                  <ThemedText type="caption" style={styles.dateDay}>
                    {dateItem.day}
                  </ThemedText>
                  <ThemedText type="h2" style={[
                    styles.dateNumber,
                    selectedDate === dateItem.fullDate && styles.dateNumberSelected,
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

      case "Time":
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

      case "Location":
        return (
          <View style={styles.stepContent}>
            <ThemedText type="h2" style={styles.stepTitle}>
              Where Are We Coming?
            </ThemedText>
            <ThemedText type="body" style={styles.stepSubtitle}>
              Enter your service address
            </ThemedText>
            
            <GlassCard style={[styles.inputCard, styles.largeAddressCard]}>
              <ThemedText type="small" style={styles.inputLabel}>
                Service Address
              </ThemedText>
              <TextInput
                style={[styles.textInput, styles.largeAddressInput]}
                value={location}
                onChangeText={setLocation}
                placeholder="123 Main St, City, State"
                placeholderTextColor={Colors.dark.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
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
                placeholder="Gate code, parking spot, access info..."
                placeholderTextColor={Colors.dark.textSecondary}
                autoCapitalize="sentences"
              />
            </GlassCard>
          </View>
        );

      case "Confirm":
        const basePrice = selectedServiceData ? parseFloat(selectedServiceData.price) : 0;
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
              {selectedAddOns.length > 0 ? (
                <View style={styles.addOnsSection}>
                  <ThemedText type="body" style={styles.summaryLabel}>Add-Ons</ThemedText>
                  {selectedAddOns.map((addOnId) => {
                    const addOn = ADD_ON_NAMES[addOnId];
                    if (!addOn) return null;
                    return (
                      <View key={addOnId} style={styles.addOnRow}>
                        <ThemedText type="small" style={styles.addOnName}>{addOn.name}</ThemedText>
                        <ThemedText type="small" style={styles.addOnPrice}>+${addOn.price}</ThemedText>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              <View style={styles.summaryRow}>
                <ThemedText type="body" style={styles.summaryLabel}>Date</ThemedText>
                <ThemedText type="h4">{selectedDateDisplay}</ThemedText>
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
              {selectedAddOns.length > 0 ? (
                <View style={styles.summaryRow}>
                  <ThemedText type="body" style={styles.summaryLabel}>Base Service</ThemedText>
                  <ThemedText type="body">${basePrice.toFixed(0)}</ThemedText>
                </View>
              ) : null}
              <View style={styles.summaryRow}>
                <ThemedText type="h4">Total</ThemedText>
                <ThemedText type="price" style={styles.totalPrice}>
                  ${calculatedTotalPrice.toFixed(0)}
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

      <View style={styles.bottomBar}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.95)", "#000000"]}
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
            disabled={!canProceed() || createBookingMutation.isPending}
            style={[
              styles.nextButton, 
              currentStep === 0 && styles.nextButtonFull,
              canProceed() && styles.nextButtonActive
            ]}
          >
            {createBookingMutation.isPending 
              ? "Booking..." 
              : currentStep === STEPS.length - 1 
                ? "Confirm Booking" 
                : "Continue"}
          </Button>
        </View>
      </View>

      <FloatingMascot 
        message={undefined}
        bottomOffset={140}
      />

      <Modal
        visible={showLoginModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowLoginModal(false);
          setPendingSubmit(false);
          setLoginError(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="h3">
                {isRegistering ? "Create Account" : "Sign In"}
              </ThemedText>
              <Pressable onPress={() => {
                setShowLoginModal(false);
                setPendingSubmit(false);
                setLoginError(null);
              }}>
                <Feather name="x" size={24} color={Colors.dark.text} />
              </Pressable>
            </View>
            <ThemedText type="body" style={styles.modalSubtitle}>
              {isRegistering 
                ? "Create an account to book your appointment"
                : "Sign in to complete your booking"}
            </ThemedText>
            {loginError ? (
              <View style={styles.errorBox}>
                <ThemedText type="small" style={styles.errorText}>{loginError}</ThemedText>
              </View>
            ) : null}
            <TextInput
              style={styles.modalInput}
              placeholder="Username"
              placeholderTextColor={Colors.dark.textSecondary}
              value={loginUsername}
              onChangeText={setLoginUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Password"
              placeholderTextColor={Colors.dark.textSecondary}
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            <Button 
              onPress={handleLogin} 
              disabled={isLoggingIn}
              style={styles.modalButton}
            >
              {isLoggingIn 
                ? "Please wait..." 
                : isRegistering ? "Create Account" : "Sign In"}
            </Button>
            <Pressable 
              onPress={() => {
                setIsRegistering(!isRegistering);
                setLoginError(null);
              }}
              style={styles.switchAuthMode}
            >
              <ThemedText type="small" style={styles.switchAuthText}>
                {isRegistering 
                  ? "Already have an account? Sign in" 
                  : "Need an account? Create one"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  largeAddressCard: {
    marginBottom: Spacing.lg,
  },
  largeAddressInput: {
    minHeight: 80,
    fontSize: 18,
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
  addOnsSection: {
    paddingVertical: Spacing.sm,
  },
  addOnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.md,
  },
  addOnName: {
    opacity: 0.8,
  },
  addOnPrice: {
    color: Colors.dark.accent,
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
    bottom: 75,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    zIndex: 100,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    minHeight: 70,
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
    minHeight: 56,
    ...Shadows.glow,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonActive: {
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  locationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  locationCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  locationCardSelected: {
    borderColor: Colors.dark.accent,
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
  locationCardPressed: {
    opacity: 0.8,
  },
  locationLabel: {
    marginTop: Spacing.sm,
  },
  locationLabelSelected: {
    color: Colors.dark.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.xl,
    paddingBottom: Spacing.xl * 2,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    opacity: 0.7,
    marginBottom: Spacing.lg,
  },
  errorBox: {
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: "#FF3B30",
  },
  modalInput: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    color: Colors.dark.text,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  modalButton: {
    marginTop: Spacing.sm,
  },
  switchAuthMode: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  switchAuthText: {
    color: Colors.dark.accent,
  },
});
