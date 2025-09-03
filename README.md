# Project Report: Reteamnow-app

## Overview
This report provides a summary of the project structure, key files, and their purposes to help future developers understand and extend the Reteamnow-app project.

---

## 1. Project Structure

- **Root Files:**
  - `App.tsx`, `index.js`: Main entry points for the React Native app.
  - `package.json`, `tsconfig.json`, `babel.config.js`, `jest.config.js`: Configuration files for dependencies, TypeScript, Babel, and Jest.
  - `app.json`: App configuration for React Native.
  - `metro.config.js`, `react-native.config.js`: Metro and React Native custom configs.
  - `Gemfile`: Ruby dependencies (for iOS builds).
  - `additions.md`: Documentation or notes.

- **Folders:**
  - `android/`, `ios/`: Native code and configuration for Android and iOS platforms.
  - `assets/`: Images and bootsplash assets.
  - `public/`: Static files and images for web (if used).
  - `src/`: Main source code (see below for details).
  - `__tests__/`: Test files for the app.

---

## 2. Source Code (`src/`)

- **components/**: Reusable UI components (e.g., `ImagePicker.tsx`, `LoginIllustration.tsx`).
- **config/**: App-wide configuration (API endpoints, colors, theme, typography).
- **context/**: React Contexts for state management (attendance, auth, health, leaderboard).
- **data/**: Mock data (e.g., `mockEventPhotos.ts`).
- **navigation/**: Navigation stacks and tab navigators (e.g., `AppStack.tsx`, `RootNavigator.tsx`).
- **screens/**: Screen components grouped by feature (Auth, Drawer, FunZone, HealthTrack, Onboarding, Settings, Tab).
- **services/**: Business logic and API calls (e.g., `attendanceService.ts`, `authService.ts`).
- **types/**: TypeScript type definitions (e.g., `env.d.ts`).

---

## 3. Key Files & Their Roles

- **App.tsx**: Main app component, sets up navigation and context providers.
- **src/navigation/**: Organizes navigation logic for different app sections.
- **src/context/**: Manages global state for features like authentication and attendance.
- **src/services/**: Handles API requests and business logic for features.
- **src/screens/**: Contains UI screens for each app feature.
- **src/components/**: Contains reusable UI elements.

---

## 4. Adding New Features

- **Add new screens** in `src/screens/` and update navigation in `src/navigation/`.
- **Add new services** in `src/services/` for API/business logic.
- **Add new context** in `src/context/` if global state is needed.
- **Add new components** in `src/components/` for reusable UI.
- **Update types** in `src/types/` as needed.

---

## 5. Testing

- Tests are located in `__tests__/`.
- Use Jest for unit testing.

---

## 6. Platform-Specific Notes

- **Android:** Native code/config in `android/`.
- **iOS:** Native code/config in `ios/`.
- **Assets:** Place images and bootsplash assets in `assets/`.

---

## 7. Setup & Development

- Install dependencies: `npm install`
- Run app: `npx react-native run-android` or `npx react-native run-ios`
- Run tests: `npm test`

---

## 8. Recommendations

- Follow existing folder structure for new features.
- Write clear documentation for new modules.
- Keep types up-to-date for maintainability.
- Use context for global state, services for API/business logic, and navigation for screen management.

---

## 9. Useful References

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

---

## 10. Contact

For questions, refer to the documentation or contact the original authors.

---

*This report is intended to help future developers quickly understand and contribute to the Reteamnow-app project.*
