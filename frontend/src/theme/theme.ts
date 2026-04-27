import { DefaultTheme } from "@react-navigation/native";

/**
 * Color Palette - Red & Navy Blue Enterprise Theme
 */
const palette = {
  // Navy Blues (Primary - Background/Cards)
  navy900: "#07162E",
  navy850: "#0A1F40",
  navy800: "#0D2A57",
  navy700: "#0B2A57",
  navy600: "#1A3A70",
  navy500: "#18427E",
  
  // Reds (Accent - CTAs/Highlights)
  red900: "#8B0D1F",
  red800: "#A31229",
  red700: "#B3122F",
  red600: "#C21839",
  red500: "#D7263D",
  red400: "#E63A4B",
  red300: "#F16474",
  
  // Neutrals
  white: "#FFFFFF",
  slate100: "#E7EDF7",
  slate200: "#D4DFE9",
  slate300: "#91A5C8",
  slate400: "#6B7E99",
  slate500: "#4A5A7A",
  black: "#000000",
};

/**
 * Typography Scale
 */
export const typography = {
  hero: {
    fontSize: 42,
    fontWeight: "700" as const,
    lineHeight: 50,
  },
  h1: {
    fontSize: 34,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "600" as const,
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  h5: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
};

/**
 * Main Theme Object
 */
export const theme = {
  colors: {
    background: palette.navy900,
    surfacePrimary: palette.navy850,
    surfaceSecondary: palette.navy800,
    surfaceInverse: palette.white,
    
    accentPrimary: palette.red500,
    accentSecondary: palette.red400,
    accentLight: palette.red300,
    accentDark: palette.red700,
    
    textPrimary: palette.white,
    textSecondary: palette.slate300,
    textTertiary: palette.slate400,
    textInverse: palette.navy900,
    
    success: "#2BCB8A",
    warning: "#F7B955",
    danger: palette.red300,
    error: palette.red500,
    info: palette.slate300,
    
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.05)",
    shadow: "rgba(0, 0, 0, 0.3)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  typography,

  animation: {
    duration: {
      fastest: 150,
      fast: 250,
      base: 350,
      slow: 500,
      slower: 750,
      slowest: 1000,
    },
    easing: {
      easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

/**
 * Navigation Theme
 */
export const AppTheme = {
  navigationTheme: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: palette.navy900,
      card: palette.navy850,
      text: palette.white,
      border: palette.navy600,
      primary: palette.red500,
      notification: palette.red500,
    },
  },
  palette,
};
