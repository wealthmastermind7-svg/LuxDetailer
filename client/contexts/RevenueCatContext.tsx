import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Platform, Alert } from "react-native";
import Purchases, { 
  CustomerInfo, 
  PurchasesOffering,
  LOG_LEVEL,
  PurchasesPackage,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
// Platform-specific API keys
// iOS public API key is safe to embed (RevenueCat public keys are designed for client use)
const REVENUECAT_API_KEY_IOS = "appl_hqUXYScZfkKuNjVFBoJAQFVVZjk";
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || "";
const ENTITLEMENT_ID = "LuxDetailer Pro";

interface RevenueCatContextType {
  isProSubscriber: boolean;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  isLoading: boolean;
  isRevenueCatConfigured: boolean;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  presentPaywall: () => Promise<boolean>;
  presentCustomerCenter: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error("useRevenueCat must be used within a RevenueCatProvider");
  }
  return context;
}

interface RevenueCatProviderProps {
  children: ReactNode;
}

export function RevenueCatProvider({ children }: RevenueCatProviderProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevenueCatConfigured, setIsRevenueCatConfigured] = useState(false);

  const isProSubscriber = customerInfo?.entitlements.active[ENTITLEMENT_ID] !== undefined;

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        if (Platform.OS === "web") {
          console.log("[RevenueCat] Not available on web platform");
          setIsLoading(false);
          return;
        }

        // Select API key based on platform
        const apiKey = Platform.OS === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
        
        if (!apiKey) {
          console.log("[RevenueCat] No API key configured for", Platform.OS);
          setIsLoading(false);
          return;
        }

        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
          console.log(`[RevenueCat] Configuring with ${Platform.OS.toUpperCase()} API key`);
          console.log(`[RevenueCat] iOS key being used: ${Platform.OS === "ios" ? apiKey.substring(0, 10) + "..." : "N/A (Android)"}`);
        }
        
        await Purchases.configure({ apiKey });
        setIsRevenueCatConfigured(true);
        if (__DEV__) console.log("[RevenueCat] SDK configured successfully");

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        if (__DEV__) console.log("[RevenueCat] Customer info loaded:", info.originalAppUserId);

        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setCurrentOffering(offerings.current);
          if (__DEV__) console.log("[RevenueCat] Current offering:", offerings.current.identifier);
        }

        Purchases.addCustomerInfoUpdateListener((info) => {
          if (__DEV__) console.log("[RevenueCat] Customer info updated");
          setCustomerInfo(info);
        });

      } catch (error) {
        if (__DEV__) console.log("[RevenueCat] Initialization error (expected in Expo Go):", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    if (!isRevenueCatConfigured) return;
    
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.log("[RevenueCat] Error refreshing customer info:", error);
    }
  }, [isRevenueCatConfigured]);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    if (!isRevenueCatConfigured) {
      Alert.alert(
        "Subscription Not Available",
        "In-app purchases require a native build. Please test on TestFlight or App Store.",
        [{ text: "OK" }]
      );
      return false;
    }

    try {
      setIsLoading(true);
      const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(newInfo);
      
      if (newInfo.entitlements.active[ENTITLEMENT_ID]) {
        return true;
      }
      return false;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.log("[RevenueCat] Purchase error:", error);
        Alert.alert("Purchase Error", "There was an error processing your purchase. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isRevenueCatConfigured]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!isRevenueCatConfigured) {
      Alert.alert(
        "Restore Not Available",
        "Restoring purchases requires a native build.",
        [{ text: "OK" }]
      );
      return false;
    }

    try {
      setIsLoading(true);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      
      if (info.entitlements.active[ENTITLEMENT_ID]) {
        Alert.alert("Purchases Restored", "Your subscription has been restored successfully!");
        return true;
      } else {
        Alert.alert("No Active Subscription", "No active subscription was found to restore.");
        return false;
      }
    } catch (error) {
      console.log("[RevenueCat] Restore error:", error);
      Alert.alert("Restore Error", "There was an error restoring your purchases. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isRevenueCatConfigured]);

  const presentPaywall = useCallback(async (): Promise<boolean> => {
    if (!isRevenueCatConfigured) {
      Alert.alert(
        "Subscription Required",
        "To access the Business Dashboard, subscribe to LuxDetailer Pro.\n\n• Monthly: $99/month\n• Yearly: $999/year (Save $189!)\n\nIn-app purchases require a native build. Please test on TestFlight or App Store.",
        [{ text: "OK" }]
      );
      return false;
    }

    try {
      const paywallResult = await RevenueCatUI.presentPaywall();
      
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          await refreshCustomerInfo();
          return true;
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
        default:
          return false;
      }
    } catch (error) {
      console.log("[RevenueCat] Paywall error:", error);
      return false;
    }
  }, [isRevenueCatConfigured, refreshCustomerInfo]);

  const presentCustomerCenter = useCallback(async (): Promise<void> => {
    if (!isRevenueCatConfigured) {
      Alert.alert(
        "Customer Center Not Available",
        "Subscription management requires a native build.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (error) {
      console.log("[RevenueCat] Customer center error:", error);
      Alert.alert("Error", "Unable to open subscription management. Please try again.");
    }
  }, [isRevenueCatConfigured]);

  const value: RevenueCatContextType = {
    isProSubscriber,
    customerInfo,
    currentOffering,
    isLoading,
    isRevenueCatConfigured,
    purchasePackage,
    restorePurchases,
    presentPaywall,
    presentCustomerCenter,
    refreshCustomerInfo,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}
