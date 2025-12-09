# DetailProX - Premium Mobile Car Detailing App

## Overview
DetailProX is a premium mobile car detailing application built with Expo (React Native). The app features a luxury automotive aesthetic with glassmorphism UI, bold oversized typography, and fluid 60fps animations. Users can browse services, book appointments, manage their vehicles, and track their detailing history.

## Project Architecture

### Frontend (Expo React Native)
- **Location**: `client/` directory
- **Framework**: Expo with React Navigation 7+
- **State Management**: React Query for server state
- **Animations**: React Native Reanimated 3 for 60fps animations
- **UI Pattern**: iOS 26 Liquid Glass design with dark theme

### Backend (Express)
- **Location**: `server/` directory
- **Framework**: Express with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Object Storage for media assets

### Design System
- **Theme**: Dark-only with deep black (#000000) and graphite (#1C1C1E)
- **Effects**: Glassmorphism using expo-blur
- **Accent**: Premium gold (#D4AF37) with cyan highlights (#00D4FF)
- **Typography**: Bold oversized headings for luxury feel

## File Structure

```
client/
  App.tsx                    # Main app entry with providers
  constants/theme.ts         # Design tokens and theme configuration
  components/
    GlassCard.tsx           # Glassmorphism card component
    FloatingMascot.tsx      # Animated floating mascot overlay
    ThemedText.tsx          # Typography components
    ThemedView.tsx          # Themed container components
    ErrorBoundary.tsx       # App error boundary
  navigation/
    MainTabNavigator.tsx    # Bottom tab navigation with FAB
    RootStackNavigator.tsx  # Root stack navigator
  screens/
    HomeScreen.tsx          # Dashboard with stats and quick actions
    ServicesScreen.tsx      # Service catalog with video showcase
    ServiceDetailScreen.tsx # Individual service detail with video
    BookingFlowScreen.tsx   # Multi-step booking wizard
    BookingsScreen.tsx      # Booking history timeline
    VehicleProfileScreen.tsx # Vehicle management
    SettingsScreen.tsx      # App settings
  hooks/
    useScreenOptions.tsx    # Consistent header options
    useTheme.tsx           # Theme hook

server/
  index.ts                  # Express server entry
  routes.ts                 # API route definitions
  db/
    index.ts               # Database connection
    schema.ts              # Drizzle schema definitions
  storage.ts               # Data access layer
```

## Key Features

### Home Dashboard
- Premium statistics cards showing service history
- Quick action buttons for common tasks
- Next appointment preview
- Loyalty rewards display

### Services Catalog
- Categorized service listings (Exterior, Interior, Premium, Paint Protection)
- Video showcase for each service category
- Detailed service information with pricing
- Visual gallery for each service

### Booking System
- Multi-step booking wizard (Service > Date > Time > Location > Confirmation)
- Date picker with availability indicators
- Time slot selection
- Location input with service options
- Order summary with confirmation

### Bookings Management
- Timeline view of upcoming appointments
- Past bookings history
- Status tracking (scheduled, confirmed, in-progress, completed)
- Progress indicators for active jobs

### Vehicle Profile
- Vehicle management with make/model/year
- Service history per vehicle
- Condition tracking

## Development Commands

```bash
# Start development servers (Expo + Express)
npm run all:dev

# Start only Expo
npm run expo:dev

# Start only server
npm run server:dev

# Push database changes
npm run db:push
```

## Design Guidelines
See `design_guidelines.md` for comprehensive design specifications.

## Recent Changes
- December 9, 2025: Initial implementation of complete DetailProX app
  - Premium glassmorphism UI components
  - 5-tab navigation with floating action button
  - Complete booking flow
  - Service catalog with video showcase
  - Animated floating mascot

## User Preferences
- Dark theme only
- Bold, oversized typography for luxury feel
- Haptic feedback on all interactions
- Smooth 60fps animations
- Glassmorphism effects throughout
