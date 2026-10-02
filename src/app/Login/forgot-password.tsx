import React, { useEffect, useRef, useState } from "react";
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

  const buttonScale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

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
  }, []);

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
          <EmbossedIcon icon="🔒" />

          <Text style={styles.title}>
            Forgot Password?
          </Text>

          <Text style={styles.description}>
            Enter your registered email address and we will
            send you an OTP to reset your password.
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
    backgroundColor: "#EEF1F5",
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
    backgroundColor: "#E4E7FF",
    top: -100,
    right: -100,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#DDF7FF",
    bottom: -100,
    left: -100,
  },

  content: {
    alignItems: "center",
  },

  title: {
    marginTop: 22,
    fontSize: 28,
    fontWeight: "800",
    color: "#20242C",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#707782",
    textAlign: "center",
    marginBottom: 28,
  },

  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "700",
    color: "#383D46",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EEF1F5",
    paddingHorizontal: 18,
    fontSize: 15,
    color: "#20242C",
    marginBottom: 20,

    shadowColor: "#FFFFFF",
    shadowOffset: {
      width: -4,
      height: -4,
    },
    shadowOpacity: 1,
    shadowRadius: 6,

    elevation: 3,
  },

  button: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#6C63FF",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
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
    marginTop: 22,
  },

  backText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "700",
  },
});