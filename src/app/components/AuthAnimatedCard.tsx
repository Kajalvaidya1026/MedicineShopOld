import React, { ReactNode, useEffect, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type AuthAnimatedCardProps = {
  children: ReactNode;
};

export default function AuthAnimatedCard({
  children,
}: AuthAnimatedCardProps) {
  const [scaleAnim] = useState(() => new Animated.Value(0.95));
  const [glowAnim] = useState(() => new Animated.Value(0));

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
          colors={["#20B9C5", "#0D5367", "#083344"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* NORMAL OPAQUE CARD */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <LinearGradient
            colors={["#20B9C5", "#0D5367", "#083344"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.brandIcon}
          >
            <Ionicons name="medkit" size={21} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text style={styles.brandName}>MEDICARE</Text>
            <Text style={styles.brandSubtitle}>PHARMACY MANAGEMENT</Text>
          </View>
        </View>
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "100%",
    flexShrink: 1,
    borderRadius: 30,
    padding: 2,
    position: "relative",

    // Static background so the card never becomes transparent
    backgroundColor: "#0D5367",

    shadowColor: "#0D5367",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
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
    maxHeight: "100%",
    flexGrow: 0,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCECEF",
    shadowColor: "#173A46",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  cardContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E4F2F3",
    shadowColor: "#0D5367",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 4,
  },

  brandName: {
    color: "#0D5367",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  brandSubtitle: {
    color: "#72858B",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 2,
  },
});