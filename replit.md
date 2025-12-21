# Teggy's Elite Detailing - Premium Mobile Car Detailing App

## Overview
Teggy's Elite Detailing is a premium mobile car detailing application built with Expo (React Native). The app features a luxury automotive aesthetic with a glassmorphism UI, bold oversized typography, and fluid 60fps animations. Users can browse services, book appointments, manage their vehicles, track their detailing history, and subscribe to membership plans. The app includes secure authentication with Bearer tokens, role-based access control, and a complete business owner admin view.

## User Preferences
- **Dark theme only** - All screens optimized for dark mode
- **Bold, oversized typography** - Headers 40-48px for premium luxury feel
- **Haptic feedback** - All interactive elements trigger haptic feedback
- **Smooth 60fps animations** - Using React Native Reanimated for performance
- **Glassmorphism effects** - Cards use blur, transparency, and tinted glass effects
- **Location button activation** - Activates after preset selection; address validation at booking confirmation
- **GlassCard implementation** - Uses View when onPress undefined to prevent interference with TextInputs
- **Membership intervals** - Three tiers support weekly (4/month), fortnightly (2/month), monthly (1/month) washes
- **Security** - All sensitive endpoints protected with Bearer token authentication and role-based middleware

## System Architecture

### Frontend (Expo React Native)
- **Framework**: Expo with React Navigation 7+
- **State Management**: React Query (@tanstack/react-query)
- **Animations**: React Native Reanimated 3
- **UI Pattern**: iOS 26 Liquid Glass design with dark theme, glassmorphism using `expo-blur` and `expo-glass-effect`
- **Authentication**: Bearer token-based
- **Design System**: Dark-only theme (deep black, graphite), premium gold accent with cyan highlights, bold oversized typography (40-48px), liquid glass cards with edge illumination.
- **Key Features**:
    - Multi-step booking wizard
    - Services catalog with continuous looping videos/cinematic experience
    - Animated floating mascot guidance system
    - Responsive font sizing
    - Role-based access control (user/admin)
    - Membership system with three subscription tiers
    - Vehicle profile management
    - Admin dashboard for business owners (gated by B2B subscription)

### Backend (Express)
- **Framework**: Express with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Object Storage for media assets
- **Authentication**: Bearer token JWT with session management
- **Security**: Role-based access control (user/admin), password hashing (bcrypt), protected API endpoints.
- **Key Features**:
    - User authentication (signup, login, logout)
    - CRUD operations for services, bookings, vehicles, and memberships
    - Automatic seeding of services and membership plans
    - Protected endpoints for admin functionalities

## iOS Build Configuration
- **newArchEnabled**: true (required by react-native-reanimated for Fabric)
- **jsEngine**: "hermes" (recommended for New Architecture, optimizes Fabric performance)
- **deploymentTarget**: 15.0 (ensures pod compatibility)
- **Deep-link scheme**: luxdetailer:// (matches bundle identifier com.cerolauto.luxdetailer)
- **iOS permissions**: Camera, photo library access configured in infoPlist
- **RevenueCat iOS key**: appl_hqUXYScZfkKuNjVFBoJAQFVVZjk (hardcoded for client-side use)
- **EAS build env**: RCT_NEW_ARCH_ENABLED=1 set in preview and production builds to enable Fabric architecture during pod install

## External Dependencies
- **React Query**: For server state management.
- **React Native Reanimated 3**: For fluid animations.
- **Expo Blur** and **Expo Glass Effect**: For glassmorphism UI elements.
- **PostgreSQL**: Relational database.
- **Drizzle ORM**: For database interaction.
- **Bcrypt**: For password hashing.
- **RevenueCat** (`react-native-purchases`, `react-native-purchases-ui`): For B2B subscription management and paywalls (LuxDetailer Pro).