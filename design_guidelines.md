# Teggy's Elite Detailing Design Guidelines

## Design Philosophy
Premium mobile car detailing app with **professional automotive luxury aesthetics**. Visual language: glassmorphism, metallic accents, professional blue tones, cinematic 60fps animations.

---

## Architecture

### Authentication
**Required** - SSO: Apple Sign-In (iOS) + Google Sign-In
- Mock auth with local state
- Login/Signup with privacy policy & ToS links
- Logout: confirmation alert
- Delete account: Settings > Account > Delete (double confirmation)

### Navigation Structure
**Tab Navigation** (5 tabs + center FAB):
- **Home** → Service Details → Booking
- **Services** → Service Details → Booking
- **Book Now** (FAB) → Multi-step booking
- **Appointments** → Appointment Detail
- **Account** → My Vehicles/Settings/Manage Account

---

## Screen Layouts

### 1. Splash Screen
- Transparent header, centered wordmark "Teggy's Elite Detailing"
- Tagline: "Precision. Craftsmanship. Excellence."
- Metallic shimmer animation (2s)
- Gradient: deep charcoal (#1A1A1D) to midnight blue (#0D1B2A)
- **Safe Area**: Top/Bottom: insets

### 2. Home Screen
- **Header**: Transparent, "Teggy's Elite" wordmark (left), bell icon (right)
- Glassmorphic search bar with metallic border
- **Grid**: Service cards (Ceramic Coating, PPF, Paint Correction, Vinyl Wraps, Powder Coating, Tinting, Full Detailing)
  - Card: icon, name, starting price, "Learn More"
- Background: looping video overlay (low opacity)
- **Safe Area**: Top: headerHeight + 32px, Bottom: tabBarHeight + 32px

### 3. Service List
- Default header: back button, filter/sort
- Scrollable cards: thumbnail, name, duration, price, difficulty badge
- Glassmorphic with 2px left metallic blue accent
- **Safe Area**: Top: 32px, Bottom: tabBarHeight + 32px
- **Interaction**: Scale 0.98 on press (spring)

### 4. Service Details
- **Header**: Transparent, back + favorite icons
- **Video**: 16:9 autoplay loop (professional footage, muted, seamless)
- Service name with metallic underline
- Pricing tiers (Basic/Premium/Ultimate) in glassmorphic cards
- Process timeline with numbered icons
- Add-ons checklist (metallic toggles)
- **Fixed CTA**: "Book This Service" button (floating shadow)
- **Safe Area**: Top: headerHeight + 32px, Bottom: insets + 32px

### 5. Booking Flow (Multi-step)
- **Header**: Back, progress dots, cancel
- **Steps**: Service → Date → Time → Location → Vehicle → Photos (4 angles) → Payment
- Glassmorphic calendar, time grid (AM/PM blocks), map preview
- **Safe Area**: Top/Bottom: 32px/insets + 32px
- **CTA Shadow**: offset {0, 2}, opacity 0.10, radius 2

### 6. My Appointments
- Default header: title + calendar filter
- Timeline cards with status badges:
  - Scheduled (#1B4965), In Progress (#D4AF37), Completed (#C0C0C0), Cancelled (#4A5568)
- Card: service, vehicle, date/time, technician, status
- Empty state: "No appointments" + "Browse Services" CTA
- **Safe Area**: Top: 32px, Bottom: tabBarHeight + 32px

### 7. Appointment Detail
- Service card, status banner (glassmorphic, color-coded)
- Progress tracker: Booked → Confirmed → In Service → Complete
- Info: date, time, location, technician, vehicle, pricing
- Before/after gallery (if completed)
- **Actions**: Cancel, Reschedule, Contact
- **Safe Area**: Top: 32px, Bottom: tabBarHeight + 32px

### 8. My Vehicles
- Header: back, "My Vehicles", add button
- Cards: photo, make/model/year, color, service count
- Primary vehicle badge (metallic star)
- **Safe Area**: Top: 32px, Bottom: tabBarHeight + 32px

### 9. Account/Settings
- **Sections** (glassmorphic groups):
  - Profile: editable avatar, name, email, phone
  - Preferences: notifications, theme (dark/auto), language
  - Support: help, contact, rate app
  - Account: logout, delete (nested)
- **Safe Area**: Top: 32px, Bottom: tabBarHeight + 32px

---

## Design System

### Color Palette
```
Backgrounds: Deep Charcoal #1A1A1D, Midnight Blue #0D1B2A
Brand: Professional Blue #1B4965, Metallic Blue #5FA8D3
Accents: Metallic Gold #D4AF37, Metallic Silver #C0C0C0
Disabled: Steel Grey #4A5568
Status: Success #10B981, Warning #F59E0B, Error #EF4444

Glassmorphism:
- Surface: rgba(255,255,255,0.08) + blur(20px)
- Border: 1px rgba(91,168,211,0.2)
- Shadow: rgba(0,0,0,0.5)
```

### Typography (System Fonts)
- **Display**: SF Pro Display Heavy/Roboto Black (32-48px)
- **Headlines**: SF Pro Display Bold/Roboto Bold (24-32px)
- **Titles**: SF Pro Display Semibold/Roboto Medium (18-24px)
- **Body**: SF Pro Text Regular/Roboto Regular (16px)
- **Captions**: SF Pro Text Light/Roboto Light (12-14px)
- Letter spacing: +0.5px headlines, +0.3px body

### Glassmorphism Specs
- Background: rgba(255,255,255,0.08)
- Backdrop blur: 20px (expo-blur BlurView)
- Border: 1px rgba(91,168,211,0.2)
- Radius: 16px (cards), 24px (modals)
- Optional: 2px left accent (#1B4965)

### Visual Feedback
- **Cards**: Scale 0.98 on press (spring animation)
- **Buttons**: Scale 0.95 + opacity 0.8
- **FAB Shadow**: offset {0,2}, opacity 0.10, radius 2
- **Haptics**: Light (taps), medium (confirmations), heavy (errors)

### Spacing
```
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px
```

---

## Animation (60fps Target)
- **Transitions**: 300ms spring (damping: 15, stiffness: 120)
- **Cards**: 250ms ease-out
- **Metallic Shimmer**: 1500ms linear loop
- **Video Fade**: 500ms ease-in
- **Skeletons**: 1500ms shimmer loop
- **Progress Bars**: 800ms ease-out

---

## Assets

### Video Loops (1080p, 30fps, 15s, muted, seamless)
- Ceramic coating, PPF install, paint correction, vinyl wrap, powder coating, tinting, full detailing montage

### Branding
- App icon: Metallic "T" on blue gradient (1024x1024)
- Splash wordmark with metallic effect
- 8 service icons (metallic blue)

### Placeholders
- Vehicle silhouettes (sedan, SUV, truck)
- Empty garage illustration

### Icons
- Feather icons (@expo/vector-icons) for navigation
- Custom metallic service icons
- Status: checkmark, clock, wrench, star (#1B4965)

**DO NOT USE**: Emojis, stock photos, generic images

---

## Accessibility
- Minimum 44x44pt touch targets
- Text contrast ≥4.5:1 on dark backgrounds
- VoiceOver/TalkBack support (descriptive labels)
- Haptic feedback for visual changes
- Video captions (recommended)
- Reduce motion option (disables shimmer)