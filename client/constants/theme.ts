import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: "#0A84FF",
    link: "#0A84FF",
    backgroundRoot: "#000000",
    backgroundDefault: "#1C1C1E",
    backgroundSecondary: "#2C2C2E",
    backgroundTertiary: "#3A3A3C",
    accent: "#0A84FF",
    accentYellow: "#FFD60A",
    accentGreen: "#30D158",
    glassSurface: "rgba(255, 255, 255, 0.08)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
    shadow: "rgba(0, 0, 0, 0.4)",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#0A84FF",
    link: "#0A84FF",
    backgroundRoot: "#000000",
    backgroundDefault: "#1C1C1E",
    backgroundSecondary: "#2C2C2E",
    backgroundTertiary: "#3A3A3C",
    accent: "#0A84FF",
    accentYellow: "#FFD60A",
    accentGreen: "#30D158",
    glassSurface: "rgba(255, 255, 255, 0.08)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
    shadow: "rgba(0, 0, 0, 0.4)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  inputHeight: 48,
  buttonHeight: 56,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 64,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 48,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 22,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
  },
  bodyLarge: {
    fontSize: 20,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 17,
    fontWeight: "500" as const,
  },
  price: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 0,
  },
};

export const Glass = {
  surface: "rgba(255, 255, 255, 0.08)",
  surfaceHover: "rgba(255, 255, 255, 0.12)",
  border: "rgba(255, 255, 255, 0.12)",
  borderLight: "rgba(255, 255, 255, 0.18)",
  blur: 20,
};

export const Animation = {
  spring: {
    damping: 15,
    stiffness: 120,
  },
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};
