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
import { router } from "expo-router";

import AuthAnimatedCard from "../components/AuthAnimatedCard";
import EmbossedIcon from "../components/EmbossedIcon";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [buttonScale] = useState(() => new Animated.Value(1));
  const [glow] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glow]);

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

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <AuthAnimatedCard>
        <View style={styles.content}>
          <EmbossedIcon icon="lock-closed" />

          <Text style={styles.title}>
            Forgot Password?
          </Text>

          <Text style={styles.description}>
            Enter your registered email address and we will send you a
            4-digit code to reset your password.
          </Text>

          <Text style={styles.label}>
            Email Address
          </Text>

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
            <Pressable
              style={styles.button}
              onPress={handleSendOTP}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>
                SEND OTP
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Back to Login
            </Text>
          </Pressable>
        </View>
      </AuthAnimatedCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FA",
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

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
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
    borderColor: "#DCE8EB",
    borderRadius: 13,
    backgroundColor: "#F7FAFB",
    paddingHorizontal: 18,
    fontSize: 15,
    color: "#20242C",
    marginBottom: 16,

    shadowColor: "#173A46",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,

    elevation: 3,
  },

  button: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0D5367",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#0D5367",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 7,
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
    color: "#0A829A",
    fontSize: 14,
    fontWeight: "700",
  },
});