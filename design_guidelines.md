# DetailProX Design Guidelines

## Design Philosophy
Premium mobile car detailing application with **cinematic high-end commercial automotive aesthetics**. The visual language emphasizes luxury, sophistication, and premium service quality through glassmorphism, dramatic lighting, and fluid 60fps animations.

---

## Architecture

### Authentication
**Required** - Multi-user booking system with account management
- **SSO Authentication**: Apple Sign-In (iOS required) + Google Sign-In
- Mock auth flow in prototype using local state
- Login/Signup screens with privacy policy & terms of service placeholder links
- Account screen with logout (confirmation alert) and delete account (nested under Settings > Account > Delete with double confirmation)

### Navigation
**Tab Navigation** (5 tabs with center action button)
- **Home** - Main dashboard with glassmorphic service tiles
- **Services** - Catalog with video reels
- **Book Now** (Center FAB) - Core booking action
- **My Bookings** - Appointment timeline
- **Profile** - Account & vehicle management

### Root Navigation Stacks
1. **Home Stack**: Home → Service Details → Booking Flow
2. **Services Stack**: Service List → Service Details (with video)
3. **Booking Stack**: Multi-step form (Date → Time → Location → Photos → Payment)
4. **Bookings Stack**: My Bookings → Booking Detail
5. **Profile Stack**: Profile → My Vehicle → Settings → Account

---

## Screen Specifications

### 1. Splash Screen
- **Purpose**: Brand introduction with cinematic entrance
- **Layout**:
  - Transparent header (no navigation bar)
  - Floating mascot in center with soft glow effect
  - Oversized "DetailProX" typography using **Zayan Luxury Font**
  - Cinematic lighting sweep animation from top-left to bottom-right
  - Full-screen gradient background (deep black to graphite)
- **Safe Area**: Top: insets.top, Bottom: insets.bottom
- **Animation**: 2-second fade-in with mascot float-up effect

### 2. Home Screen
- **Purpose**: Primary navigation hub for all app features
- **Layout**:
  - **Transparent header** with "DetailProX" wordmark (left) and notification bell (right)
  - **Search bar** below header with glassmorphic styling
  - **Main content**: Scrollable grid of glassmorphic tiles
    - Services tile (with preview image)
    - My Car tile (with vehicle photo)
    - Book Now tile (highlighted with subtle glow)
    - Promotions tile (with badge indicator)
  - **Background**: Cinematic looping video of car detailing (subtle, low opacity)
  - **Floating mascot** in bottom-right with idle animation
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Components**: Glassmorphic cards, video background, floating mascot overlay

### 3. Service List Screen
- **Purpose**: Browse all available detailing services
- **Layout**:
  - **Default navigation header** with back button (left) and filter button (right)
  - **Scrollable list** of service cards
  - Each card displays: service thumbnail, name, duration, price
  - Cards use glassmorphism with blur effect
  - Tap to expand shows video preview
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Visual Feedback**: Card lifts on press with subtle shadow increase

### 4. Service Details Screen
- **Purpose**: Detailed service information with cinematic showcase
- **Layout**:
  - **Transparent header** with back button (left) and share button (right)
  - **Autoplay video reel** at top (full-width, 16:9 aspect ratio)
  - **Oversized service name** using **Beepop Luxury Shadow Font**
  - Pricing information with large bold numbers
  - Service description with **Pluvix Luxury Font**
  - Add-ons checklist with glassmorphic toggles
  - **Fixed bottom CTA**: "Book Now" button with floating shadow
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: insets.bottom + Spacing.xl
- **Video**: Loops seamlessly, no controls visible

### 5. Booking Flow (Multi-step Form)
- **Purpose**: Complete service reservation
- **Layout**:
  - **Default header** with back button (left) and step indicator (center)
  - **Non-scrollable root** - each step is a separate screen
  - **Submit button** at bottom (floating above safe area)
  - Steps:
    1. Calendar date picker with glassmorphic styling
    2. Time slot selection grid
    3. Location input with map preview
    4. Car photo upload (drag-drop zone with glassmorphic border)
    5. Payment summary with itemized pricing
- **Safe Area**: Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl
- **Buttons**: Submit button has shadow (offset: {width: 0, height: 2}, opacity: 0.10, radius: 2)

### 6. My Bookings Screen
- **Purpose**: View and manage appointments
- **Layout**:
  - **Default header** with title "My Bookings" and calendar filter (right)
  - **Scrollable list** of booking cards with timeline connector
  - Each card shows: service name, date/time, status badge, progress indicator
  - Status colors: Pending (graphite), Confirmed (soft blue), In Progress (neon yellow), Completed (neon green)
  - Glassmorphic cards with vertical timeline line connecting them
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Animation**: Progress bar fills smoothly when booking status changes

### 7. My Vehicle Screen
- **Purpose**: Manage saved vehicle information
- **Layout**:
  - **Transparent header** with back button (left) and edit button (right)
  - **Hero vehicle photo** with parallax scroll effect
  - **Glassmorphic info card** overlaying bottom of photo
  - Vehicle details: Make, Model, Year
  - "Update Photo" button below
  - Service history timeline
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Parallax**: Vehicle photo scrolls at 0.5x speed of content

### 8. Profile/Settings Screen
- **Purpose**: Account management and app preferences
- **Layout**:
  - **Default header** with "Profile" title
  - **Scrollable form** with glassmorphic section groups
  - User avatar (circular, with edit overlay)
  - Display name field
  - Account section: Email, Phone, Password
  - Settings section: Notifications, Theme, Language
  - Danger zone: Logout, Delete Account (nested)
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl

---

## Floating Mascot Overlay
- **Present on every screen** except splash and onboarding
- **Position**: Bottom-right corner, 24px from edges
- **Size**: 64x64px circular container
- **Animation States**:
  - Idle: Gentle vertical float (±4px, 2s duration)
  - Happy: Slight bounce on booking confirmation
  - Thinking: Subtle rotation during loading
  - Instructive: Pulse glow when showing tooltip
- **Speech Bubbles**: Small glassmorphic tooltip appears above mascot with contextual tips
- **Tap Interaction**: Opens help overlay or dismisses current tooltip

---

## Design System

### Color Palette
```
Primary Colors:
- Deep Black: #000000 (backgrounds)
- Graphite Grey: #1C1C1E (secondary surfaces)
- Smoke Glass White: rgba(255, 255, 255, 0.1) (glassmorphism overlays)

Accent Colors:
- Soft Neon Blue: #0A84FF (CTAs, links)
- Neon Yellow: #FFD60A (highlights, warnings)
- Neon Green: #30D158 (success states)

Surface Colors:
- Glass Surface: rgba(255, 255, 255, 0.08) with blur(20px)
- Glass Border: rgba(255, 255, 255, 0.12)
- Shadow: rgba(0, 0, 0, 0.4)
```

### Typography
**Oversized Luxury Fonts** (custom integration required):
- **Display/Headers**: Zayan Luxury Font (serif, 48-72px)
- **Titles**: Beepop Luxury Shadow Font (decorative, 32-48px)
- **Body**: Pluvix Luxury Font (elegant, 16-20px)
- **Labels**: Retrola Ink Font (vintage, 12-14px)
- **Specialty**: Stronghold Freak Font (bold impact, 24-36px)

**Fallback System Fonts** (if custom fonts unavailable):
- iOS: SF Pro Display (Bold/Heavy for headers)
- Android: Roboto Bold

### Glassmorphism Specifications
All touchable cards and overlays use:
- **Background**: rgba(255, 255, 255, 0.08)
- **Backdrop Blur**: 20px (using expo-blur BlurView)
- **Border**: 1px solid rgba(255, 255, 255, 0.12)
- **Border Radius**: 16px for cards, 24px for modals
- **Elevation**: Only for floating buttons

### Visual Feedback
- **Touchable Cards**: Scale down to 0.98 on press, return with spring animation
- **Buttons**: Scale to 0.95 + opacity to 0.8 on press
- **Floating Action Button**: Shadow specs:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- **Haptic Feedback**: Light impact on all taps, medium impact on confirmations, heavy impact on errors

### Spacing System
```
Spacing.xs: 4px
Spacing.sm: 8px
Spacing.md: 16px
Spacing.lg: 24px
Spacing.xl: 32px
Spacing.xxl: 48px
```

---

## Animation Specifications
All animations target **60fps performance**:
- **Page Transitions**: 300ms spring animation (damping: 15, stiffness: 120)
- **Card Expansion**: 250ms ease-out
- **Mascot Float**: 2000ms ease-in-out infinite
- **Video Fade-in**: 500ms ease-in
- **Loading States**: Shimmer effect with 1500ms loop
- **Scroll Parallax**: Transform translateY based on scroll offset

---

## Assets Required

### Core Content Assets
1. **Mascot Character** (5 emotional states)
   - Idle floating animation (Lottie JSON)
   - Happy state
   - Thinking state
   - Instructive state
   - Excited state
   - Must match automotive luxury aesthetic
   - Soft glow effect around character

2. **Service Video Reels** (cinematic loops)
   - Ceramic coating application (15s loop)
   - Paint polishing detail shot (15s loop)
   - Interior detailing (15s loop)
   - Engine bay cleaning (15s loop)
   - All videos: 1080p, 30fps, seamless loop

3. **App Icons & Branding**
   - App icon featuring mascot (1024x1024)
   - Splash screen emblem (mascot silhouette)
   - Favicon (mascot simplified)

### UI Assets
- Service category icons (8 icons using Feather icon set)
- Status indicator icons (4 states)
- Empty state illustrations (2-3 minimal graphics)
- Background gradient textures (subtle automotive patterns)

**DO NOT USE**: Emojis, stock photos, generic car images
**USE**: Feather icons from @expo/vector-icons, custom mascot, high-quality service videos

---

## Accessibility
- All interactive elements minimum 44x44pt touch target
- Text contrast ratio minimum 4.5:1 against backgrounds
- Support iOS VoiceOver and Android TalkBack
- Haptic feedback alternatives for visual-only cues
- Video captions for service reels (optional but recommended)