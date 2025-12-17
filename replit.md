# Teggy's Elite Detailing - Premium Mobile Car Detailing App

## Overview
Teggy's Elite Detailing is a premium mobile car detailing application built with Expo (React Native). The app features luxury automotive aesthetic with glassmorphism UI, bold oversized typography, and fluid 60fps animations. Users can browse services (ceramic coatings, paint protection film, paint correction, vinyl wraps, powder coating, window tinting, detailing), book appointments, manage their vehicles, track their detailing history, and subscribe to membership plans. The app includes secure authentication with Bearer tokens, role-based access control, and a complete business owner admin view.

## Project Architecture

### Frontend (Expo React Native)
- **Location**: `client/` directory
- **Framework**: Expo with React Navigation 7+
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Animations**: React Native Reanimated 3 for 60fps fluid animations
- **UI Pattern**: iOS 26 Liquid Glass design with dark theme
- **Authentication**: Bearer token-based auth with secure session management

### Backend (Express)
- **Location**: `server/` directory
- **Framework**: Express with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Object Storage for media assets
- **Authentication**: Bearer token JWT implementation with session management
- **Security**: Role-based access control (user/admin)

### Design System
- **Theme**: Dark-only with deep black (#000000) and graphite (#1C1C1E)
- **Effects**: Glassmorphism using expo-blur and expo-glass-effect
- **Accent**: Premium gold (#D4AF37) with cyan highlights (#00D4FF)
- **Typography**: Bold oversized headings (40-48px) for luxury feel
- **Layout**: Liquid glass cards with edge illumination on press, spring animations

## File Structure

```
client/
  App.tsx                           # Main app entry with error boundary & providers
  constants/theme.ts                # Design tokens, colors, typography, spacing
  components/
    GlassCard.tsx                  # Glassmorphism card component with press effects
    FloatingMascot.tsx             # Animated floating mascot overlay
    ThemedText.tsx                 # Typography components (headings, body, captions)
    ThemedView.tsx                 # Themed container components
    ErrorBoundary.tsx              # App crash handling with restart
    KeyboardAwareScrollView.tsx     # Keyboard-aware scrolling for inputs
  navigation/
    MainTabNavigator.tsx           # Bottom tab navigation with FAB (5 tabs)
    RootStackNavigator.tsx         # Root stack navigator
    HomeStackNavigator.tsx         # Home tab stack with membership nav
  screens/
    HomeScreen.tsx                 # Dashboard with stats, quick actions, next appointment
    ServicesScreen.tsx             # Service catalog with category filters
    ServiceDetailScreen.tsx        # Individual service detail with looping video
    BookingFlowScreen.tsx          # Multi-step booking wizard
    BookingsScreen.tsx             # Booking history timeline view
    VehicleProfileScreen.tsx       # Vehicle management
    MembershipsScreen.tsx          # Membership plans & subscription management
    SettingsScreen.tsx             # App settings & user preferences
  hooks/
    useScreenOptions.tsx           # Consistent header options hook
    useTheme.tsx                   # Theme hook for dark mode
  contexts/
    AuthContext.tsx                # Authentication state & token management
  lib/
    query-client.ts                # React Query config & API request utility

server/
  index.ts                          # Express server entry with auto-seeding
  routes.ts                         # API route definitions
  db/
    index.ts                       # Database connection setup
    schema.ts                      # Drizzle schema (users, bookings, services, memberships)
  storage.ts                        # Data access layer with CRUD operations
```

## Key Features

### Authentication & Security
- Bearer token-based authentication with JWT
- Secure session management
- Role-based access control (user/admin)
- Password hashing with bcrypt
- Protected API endpoints with requireAuth middleware

### Home Dashboard
- Premium statistics cards with service history metrics
- Quick action buttons (Book Service, View Memberships, etc.)
- Next appointment preview with status
- Loyalty rewards display
- Membership status indicator

### Services Catalog
- Categorized service listings (Exterior, Interior, Premium, Paint Protection)
- Continuous looping service videos
- Detailed service information with pricing and features
- Service availability status
- Interactive service cards with press animations

### Booking System
- Multi-step booking wizard with progress tracking
  - Step 1: Service selection with category filter
  - Step 2: Date picker with availability indicators
  - Step 3: Time slot selection
  - Step 4: Location input with address validation
  - Step 5: Order summary with confirmation
- Real-time booking status tracking
- Confirmation details with booking reference

### Bookings Management
- Timeline view of upcoming appointments
- Past bookings history
- Status tracking (scheduled, confirmed, in-progress, completed)
- Progress indicators for active jobs
- Ability to cancel bookings

### Membership System
- **Three subscription tiers with automatic renewal:**
  - Weekly Wash Club: $149/month (4 washes/month) - 60% savings
  - Fortnightly Fresh: $99/month (2 washes/month) - 45% savings - **Most Popular**
  - Monthly Maintain: $79/month (1 wash/month) - 45% savings
- Member benefits (priority scheduling, add-on discounts)
- Auto-seeded membership plans on server startup
- Membership status and renewal information
- Cancel membership functionality

### Vehicle Profile
- Vehicle management with make/model/year/color
- Multiple vehicle support per user
- Service history per vehicle
- Condition tracking and notes

### Admin Features (Business Owner View)
- User management dashboard
- Booking management and assignment
- Service catalog management
- Membership plan management
- Analytics and reporting (future enhancement)
- Seed endpoints for initial data population

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details

### Bookings
- `GET /api/bookings` - List user bookings (requires auth)
- `POST /api/bookings` - Create new booking (requires auth)
- `PATCH /api/bookings/:id` - Update booking (requires auth)
- `DELETE /api/bookings/:id` - Cancel booking (requires auth)

### Memberships
- `GET /api/memberships/plans` - List membership plans
- `GET /api/memberships/user` - Get user membership (requires auth)
- `POST /api/memberships/subscribe` - Subscribe to plan (requires auth)
- `DELETE /api/memberships/cancel` - Cancel membership (requires auth)

### Admin (Requires Auth + Admin Role)
- `POST /api/admin/seed-services` - Populate default services
- `POST /api/admin/seed-memberships` - Populate membership plans

## Development Commands

```bash
# Start development servers (Expo + Express)
npm run all:dev

# Start only Expo
npm run expo:dev

# Start only Express server
npm run server:dev

# Push database migrations
npm run db:push
```

## Database Schema

### Users Table
- id, email, password (hashed), fullName, phone, role, createdAt, updatedAt

### Services Table
- id, name, description, category, price, duration, features (JSON), video, isActive

### Bookings Table
- id, userId, serviceId, vehicleId, bookingDate, bookingTime, location, status, notes, createdAt, updatedAt

### Vehicles Table
- id, userId, make, model, year, color, notes, createdAt, updatedAt

### Membership Plans Table
- id, name, description, frequency, pricePerMonth, serviceIncluded, features (JSON), savingsPercent, isPopular, isActive

### User Memberships Table
- id, userId, planId, status, renewalDate, createdAt, updatedAt

## Design Guidelines
See `design_guidelines.md` for comprehensive design specifications including:
- Color palette and usage
- Typography hierarchy
- Component patterns
- Animation guidelines
- Safe area handling
- Responsive layouts

## Recent Changes

### December 17, 2025 - Cinematic Hero Experience & Responsive Typography
- **Complete**: Replaced looping videos with handcrafted cinematic experience
  - Created CinematicHero component with parallax scrolling effects
  - Implemented smooth spring animations and interactive moments
  - Organic gradient backgrounds with layered parallax depth
  - Interactive center element with glow effects and spring responses
  - Animated particles trigger on user interaction for tactile feedback
  - Replaced HomeVideoHero, FeaturedVideoReel, and ServiceVideoHero with cinematic versions
  - Feels premium and handcrafted vs. generic video playback

- **Complete**: Responsive font sizing system (zero text wrapping)
  - Created useResponsiveFontSize hook for dynamic font scaling
  - All text sizes adjust based on screen width (320px-600px range)
  - ThemedText component now uses responsive sizes automatically
  - Preset ranges for display, h1-h4, body, small, caption, link, price
  - Linear interpolation ensures smooth scaling across all screen sizes
  - No more text wrapping or overflow at any viewport

### December 12, 2025 - Teggy's Elite Detailing Rebranding & Video Optimization
- **Complete**: Full app rebranding to Teggy's Elite Detailing
  - Updated app name, slug, and branding throughout
  - Generated professional app icon reflecting premium automotive detailing aesthetic
  - Updated color theme from cyan (#0A84FF) to professional blue (#1E90FF)
  - Updated design guidelines with Teggy's brand specifications
  - Updated services catalog to match Teggy's Elite Detailing offerings
  - Header now displays "Teggy's Elite" branding

### December 11, 2025
- **Fixed**: Automatic seeding of services and membership plans on server startup
- **Complete**: Membership system integration

### December 9, 2025
- Initial implementation of complete LuxDetailer app
  - Premium glassmorphism UI components with expo-glass-effect
  - 5-tab navigation with floating action button (FAB)
  - Complete multi-step booking flow with progress tracking
  - Service catalog with continuous looping videos
  - Animated floating mascot overlay
  - Bearer token authentication with secure session management
  - Role-based access control (user/admin)
  - Booking history with timeline view
  - Vehicle profile management
  - App settings screen

## User Preferences & Design Decisions
- **Dark theme only** - All screens optimized for dark mode
- **Bold, oversized typography** - Headers 40-48px for premium luxury feel
- **Haptic feedback** - All interactive elements trigger haptic feedback
- **Smooth 60fps animations** - Using React Native Reanimated for performance
- **Glassmorphism effects** - Cards use blur, transparency, and tinted glass effects
- **Location button activation** - Activates after preset selection; address validation at booking confirmation
- **GlassCard implementation** - Uses View when onPress undefined to prevent interference with TextInputs
- **Membership intervals** - Three tiers support weekly (4/month), fortnightly (2/month), monthly (1/month) washes
- **Security** - All sensitive endpoints protected with Bearer token authentication and role-based middleware

## Repository
This is a **complete single repository** with both frontend and backend. No additional repositories are needed.
