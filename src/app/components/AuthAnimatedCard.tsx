import React, { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type AuthAnimatedCardProps = {
  children: ReactNode;
};

export default function AuthAnimatedCard({
  children,
}: AuthAnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Card entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 45,
      useNativeDriver: true,
    }).start();

    // Border glow animation only
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim, scaleAnim]);

  const borderOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  return (
    <Animated.View
      style={[
        styles.outer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Animated border ONLY */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.borderGlow,
          {
            opacity: borderOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={["#6C63FF", "#00C6FF", "#8E2DE2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* NORMAL OPAQUE CARD */}
      <View style={styles.card}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 30,
    padding: 2,
    position: "relative",

    // Static background so the card never becomes transparent
    backgroundColor: "#6C63FF",

    shadowColor: "#6C63FF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },

  borderGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    borderRadius: 30,
    overflow: "hidden",
  },

  card: {
    backgroundColor: "#F5F7FA",
    borderRadius: 28,

    padding: 28,

    // Keep content fully visible
    opacity: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
});