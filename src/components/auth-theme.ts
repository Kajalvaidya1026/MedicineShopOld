import { Animated, Easing } from "react-native";

export const AUTH_THEME = {
  colors: {
    background: "#F5F9FA",
    surface: "#FFFFFF",
    surfaceAlt: "#F7FAFB",
    surfaceSoft: "#F2F8F9",
    border: "#DCE8EB",
    borderStrong: "#C7D9DE",
    primary: "#0D5367",
    primaryDark: "#0B2433",
    primaryLight: "#20B9C5",
    accent: "#0A829A",
    text: "#0F172A",
    textSoft: "#64748B",
    textMuted: "#7A8F9F",
    success: "#16803C",
    successSoft: "#DCF5EA",
    danger: "#D14343",
    shadow: "#173A46",
    glow: "#E2F3F4",
  },
  radius: {
    card: 28,
    input: 13,
    button: 16,
    icon: 20,
  },
  shadow: {
    soft: {
      shadowColor: "#173A46",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 10,
    },
    button: {
      shadowColor: "#0D5367",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 12,
      elevation: 7,
    },
    inset: {
      shadowColor: "#A5BBC6",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.18,
      shadowRadius: 5,
      elevation: 3,
    },
  },
};

export const createAuthEntrance = (
  animation: Animated.Value,
  { duration = 420, offset = 10 } = {}
) =>
  Animated.timing(animation, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });

export const createAuthFloat = (
  animation: Animated.Value,
  { duration = 2400, range = 4 } = {}
) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ])
  );

export const triggerPressScale = (
  animation: Animated.Value,
  toValue: number,
  { friction = 7, tension = 220 } = {}
) =>
  Animated.spring(animation, {
    toValue,
    friction,
    tension,
    useNativeDriver: true,
  });
