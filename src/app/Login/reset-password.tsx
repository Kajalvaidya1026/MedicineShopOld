import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { AUTH_THEME, createAuthFloat, triggerPressScale } from "../../components/auth-theme";

import AuthAnimatedCard from "../components/AuthAnimatedCard";
import EmbossedIcon from "../components/EmbossedIcon";

export default function ResetPassword() {
  const { role } = useLocalSearchParams();

  const roleName = Array.isArray(role) ? role[0] : role;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [buttonScale] = useState(() => new Animated.Value(1));
  const [securityFloat] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const floatAnimation = createAuthFloat(securityFloat, { duration: 2400 });
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, [securityFloat]);

  // Password validations
  const hasEightCharacters = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialCharacter =
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleResetPassword = () => {
    if (!hasEightCharacters) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!hasUppercase) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!hasLowercase) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!hasNumber) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one number."
      );
      return;
    }

    if (!hasSpecialCharacter) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one special character."
      );
      return;
    }

    if (!passwordsMatch) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirm password must be the same."
      );
      return;
    }

    Alert.alert(
      "Password Changed",
      "Your password has been reset successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            router.push({
              pathname: "/Login/role",
              params: {
                role: roleName || "",
              },
            });
          },
        },
      ]
    );
  };

  const handlePressIn = () => {
    triggerPressScale(buttonScale, 0.985, {
      friction: 7,
      tension: 220,
    }).start();
  };

  const handlePressOut = () => {
    triggerPressScale(buttonScale, 1, {
      friction: 7,
      tension: 180,
    }).start();
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/Login/role",
      params: { role: roleName || "" },
    });
  };

  const securityFloatY = securityFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  return (
    <View style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <AuthAnimatedCard>
        <View style={styles.content}>
          {/* Icon */}
          <Animated.View
            style={{ transform: [{ translateY: securityFloatY }] }}
          >
            <EmbossedIcon icon="lock-closed" />
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>
            Reset Password
          </Text>

          <Text style={styles.subtitle}>
            Create a strong new password for your account
          </Text>

          {/* New Password */}
          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor="#98A2B3"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />

            <Pressable
              onPress={() =>
                setShowNewPassword(!showNewPassword)
              }
              style={styles.eyeButton}
            >
              <Ionicons
                name={
                  showNewPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#0A829A"
              />
            </Pressable>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirements}>
            <Text style={styles.requirementTitle}>
              Password must contain:
            </Text>

            <Requirement
              valid={hasEightCharacters}
              text="At least 8 characters"
            />

            <Requirement
              valid={hasUppercase}
              text="At least 1 uppercase letter"
            />

            <Requirement
              valid={hasLowercase}
              text="At least 1 lowercase letter"
            />

            <Requirement
              valid={hasNumber}
              text="At least 1 number"
            />

            <Requirement
              valid={hasSpecialCharacter}
              text="At least 1 special character"
            />
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor="#98A2B3"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              style={styles.eyeButton}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#0A829A"
              />
            </Pressable>
          </View>

          {/* Password Match */}
          {confirmPassword.length > 0 && (
            <Text
              style={
                passwordsMatch
                  ? styles.matchValid
                  : styles.matchInvalid
              }
            >
              {passwordsMatch
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </Text>
          )}

          {/* Reset Button */}
          <Animated.View
            style={{
              width: "100%",
              transform: [{ scale: buttonScale }],
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
                onPress={handleResetPassword}
                onPressIn={() => {
                  handlePressIn();
                  triggerPressScale(buttonScale, 0.985).start();
                }}
                onPressOut={() => {
                  handlePressOut();
                  triggerPressScale(buttonScale, 1).start();
                }}
              >
                <Text style={styles.buttonText}>
                  RESET PASSWORD
                </Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>

          {/* Back */}
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </Pressable>
        </View>
      </AuthAnimatedCard>
    </View>
  );
}

/* --------------------------------------------------
   Password Requirement Component
-------------------------------------------------- */

function Requirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <Text
      style={
        valid
          ? styles.requirementValid
          : styles.requirementInvalid
      }
    >
      {valid ? "✓" : "○"} {text}
    </Text>
  );
}

/* --------------------------------------------------
   Styles
-------------------------------------------------- */

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
    width: "100%",
  },

  title: {
    marginTop: 18,
    fontSize: 27,
    fontWeight: "800",
    color: AUTH_THEME.colors.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 14,
    lineHeight: 20,
    color: AUTH_THEME.colors.textSoft,
    textAlign: "center",
  },

  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },

  passwordContainer: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: AUTH_THEME.colors.border,
    borderRadius: AUTH_THEME.radius.input,
    backgroundColor: AUTH_THEME.colors.surfaceAlt,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 12,
    marginBottom: 14,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    shadowColor: "#A5BBC6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#20242C",
  },

  eyeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  requirements: {
    width: "100%",
    backgroundColor: AUTH_THEME.colors.surfaceSoft,
    borderRadius: 14,
    padding: 13,
    marginBottom: 18,
  },

  requirementTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
  },

  requirementValid: {
    fontSize: 12,
    color: "#16803C",
    marginTop: 3,
    fontWeight: "600",
  },

  requirementInvalid: {
    fontSize: 12,
    color: "#8A8F98",
    marginTop: 3,
  },

  matchValid: {
    width: "100%",
    color: "#16803C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: -6,
    marginBottom: 5,
  },

  matchInvalid: {
    width: "100%",
    color: "#D14343",
    fontSize: 12,
    fontWeight: "700",
    marginTop: -6,
    marginBottom: 5,
  },

  gradientButton: {
    width: "100%",
    borderRadius: AUTH_THEME.radius.button,
    marginTop: 12,
    shadowColor: AUTH_THEME.colors.primary,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 7,
  },

  button: {
    width: "100%",
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
    marginTop: 18,
  },

  backText: {
    color: AUTH_THEME.colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});