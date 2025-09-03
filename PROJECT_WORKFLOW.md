# Project Workflow: Reteamnow-app

This document explains the typical user workflow and navigation flow in the Reteamnow-app, from onboarding to main features. It is intended to help developers understand the user journey and app logic for future enhancements.

---

## 1. Onboarding
- **Purpose:** Introduce new users to the app, its features, and benefits.
- **Screens:** Located in `src/screens/OnboardingScreens/`.
- **Flow:**
  - User launches the app for the first time.
  - Onboarding screens guide the user through app highlights.
  - User can skip or complete onboarding.

---

## 2. User Login
- **Purpose:** Authenticate users and provide access to personalized features.
- **Screens:** Located in `src/screens/AuthScreens/` (e.g., `LoginScreen.tsx`).
- **Flow:**
  - After onboarding, user is directed to the login screen.
  - User enters credentials (email/password or other methods).
  - Authentication handled via `src/services/authService.ts` and context in `src/context/authContext.tsx`.
  - On success, user is navigated to the dashboard.

---

## 3. Dashboard
- **Purpose:** Main landing page after login, showing key user info and quick actions.
- **Screens:** Likely in `src/screens/TabScreens/` or `src/screens/DrawerScreens/`.
- **Flow:**
  - User sees personalized dashboard with stats, events, or announcements.
  - Dashboard may use context providers for attendance, health, leaderboard, etc.

---

## 4. Bottom Tabs Navigation
- **Purpose:** Allow users to switch between main app sections easily.
- **Navigation:** Defined in `src/navigation/BottomTabs.tsx`.
- **Tabs:**
  - Home/Dashboard
  - FunZone
  - HealthTrack
  - Settings
  - Others as defined in navigation config
- **Flow:**
  - User can tap tabs to switch between features.
  - Each tab loads its respective stack navigator and screens.

---

## 5. Feature Workflows
- **FunZone:**
  - Accessed via FunZone tab.
  - Screens in `src/screens/FunZoneScreens/`.
  - May include games, activities, or events.

- **HealthTrack:**
  - Accessed via HealthTrack tab.
  - Screens in `src/screens/HealthTrackScreens/`.
  - Tracks health metrics, attendance, etc.

- **Settings:**
  - Accessed via Settings tab.
  - Screens in `src/screens/SettingsScreens/`.
  - User can update profile, preferences, and app settings.

- **Announcements (Drawer Navigation):**
  - Accessed via Drawer navigation menu.
  - Screens in `src/screens/DrawerScreens/` (e.g., `AnnouncementsScreen.tsx`).
  - Used to display important announcements, updates, or notifications to users.
  - Navigation logic defined in `src/navigation/DrawerScreens/` or related navigation files.
  - Typically available from the side menu or hamburger icon on the dashboard/main screens.

---

## 6. Context & Services
- **Context Providers:**
  - Used for global state (auth, attendance, health, leaderboard).
  - Located in `src/context/`.
- **Services:**
  - Handle API calls and business logic.
  - Located in `src/services/`.

---

## 7. Navigation Structure
- **Stack Navigators:**
  - Used for screen transitions within each tab.
  - Defined in `src/navigation/` (e.g., `AppStack.tsx`, `AuthStack.tsx`).
- **Root Navigator:**
  - Manages overall navigation flow (onboarding → auth → main app).
  - Defined in `src/navigation/RootNavigator.tsx`.

---

## 8. Logout & Session Management
- **Logout:**
  - User can log out from settings or dashboard.
  - Session cleared, user returned to login screen.

---

## 9. Extending Workflow
- Add new tabs/screens by updating navigation and creating new screen components.
- Use context and services for new features.

---

*This workflow summary helps developers understand the user journey and navigation logic for the Reteamnow-app.*
