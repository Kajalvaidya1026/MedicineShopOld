import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import AuthAnimatedCard from "../components/AuthAnimatedCard";
import EmbossedIcon from "../components/EmbossedIcon";
import { AUTH_THEME, createAuthFloat, triggerPressScale } from "../../components/auth-theme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [cardEntrance] = useState(() => new Animated.Value(0));
  const [iconFloat] = useState(() => new Animated.Value(0));
  const [buttonScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const floatAnimation = createAuthFloat(iconFloat, { duration: 2400 });
    const entranceAnimation = Animated.timing(cardEntrance, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    entranceAnimation.start();
    floatAnimation.start();

    return () => {
      entranceAnimation.stop();
      floatAnimation.stop();
    };
  }, [cardEntrance, iconFloat]);

  const handleSendOTP = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    router.push("/Login/otp");
  };

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/Login/role");
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.985,
      friction: 7,
      tension: 220,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 7,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const iconRotation = iconFloat.interpolate({
    inputRange: [0, 1],
    outputRange: ["-1deg", "1deg"],
  });
  const iconTranslateY = iconFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });
  const cardTranslateY = cardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });
  const cardScale = cardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.985, 1],
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <Animated.View
        style={[
          styles.cardEntrance,
          {
            opacity: cardEntrance,
            transform: [
              { perspective: 900 },
              { translateY: cardTranslateY },
              { scale: cardScale },
            ],
          },
        ]}
      >
        <AuthAnimatedCard>
          <View style={styles.content}>
            <Animated.View
              style={{
                transform: [
                  { translateY: iconTranslateY },
                  { rotate: iconRotation },
                  { perspective: 700 },
                ],
              }}
            >
              <EmbossedIcon icon="lock-closed" />
            </Animated.View>

            <Text style={styles.title}>Forgot Password?</Text>

            <Text style={styles.description}>
              Enter your registered email address and we will send you a
              4-digit code to reset your password.
            </Text>

            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Animated.View
              style={{
                transform: [{ scale: buttonScale }],
                width: "100%",
              }}
            >
              <LinearGradient
                colors={["#0D5D76", "#0B3D4F", "#0B2433"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Pressable
                  style={styles.button}
                  onPress={handleSendOTP}
                  onPressIn={() => {
                    handlePressIn();
                    triggerPressScale(buttonScale, 0.985).start();
                  }}
                  onPressOut={() => {
                    handlePressOut();
                    triggerPressScale(buttonScale, 1).start();
                  }}
                >
                  <Text style={styles.buttonText}>SEND OTP</Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>

            <Pressable
              onPress={safeBack}
              style={styles.backButton}
            >
              <Text style={styles.backText}>← Back to Login</Text>
            </Pressable>
          </View>
        </AuthAnimatedCard> 
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AUTH_THEME.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    overflow: "hidden",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#E2F3F4",
    top: -100,
    right: -100,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#DDF2F4",
    bottom: -100,
    left: -100,
  },

  content: {
    alignItems: "center",
  },

  cardEntrance: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    color: AUTH_THEME.colors.text,
    textAlign: "center",
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: AUTH_THEME.colors.textSoft,
    textAlign: "center",
    marginBottom: 14,
  },

  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: AUTH_THEME.colors.border,
    borderRadius: AUTH_THEME.radius.input,
    backgroundColor: AUTH_THEME.colors.surfaceAlt,
    paddingHorizontal: 18,
    fontSize: 15,
    color: "#20242C",
    marginBottom: 16,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    shadowColor: "#A5BBC6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },

  gradientButton: {
    borderRadius: AUTH_THEME.radius.button,
    shadowColor: AUTH_THEME.colors.primary,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 7,
  },

  button: {
    height: 54,
    borderRadius: AUTH_THEME.radius.button,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  backButton: {
    marginTop: 12,
  },

  backText: {
    color: AUTH_THEME.colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});