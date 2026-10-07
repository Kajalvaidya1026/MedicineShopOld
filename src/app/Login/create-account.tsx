import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
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
import { registerUser } from "../../api/auth";
import { ApiError } from "../../api/client";

export default function CreateAccount() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState<{
    title: string;
    message: string;
    success: boolean;
  } | null>(null);
  const submissionInFlight = React.useRef(false);

  const [cardEntrance] = useState(() => new Animated.Value(0));
  const [iconFloat] = useState(() => new Animated.Value(0));
  const [buttonScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const entranceAnimation = Animated.timing(cardEntrance, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    });

    const floatAnimation = createAuthFloat(iconFloat, { duration: 2400 });

    entranceAnimation.start();
    floatAnimation.start();

    return () => {
      entranceAnimation.stop();
      floatAnimation.stop();
    };
  }, [cardEntrance, iconFloat]);

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/Login/role");
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const indianMobilePattern = /^[6-9]\d{9}$/;

  const hasEightCharacters = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordValid =
    hasEightCharacters && hasUppercase && hasLowercase && hasNumber;

  const handleCreateAccount = async () => {
    if (submissionInFlight.current) {
      return;
    }

    if (!fullName.trim()) {
      Alert.alert("Name Required", "Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!userId.trim()) {
      Alert.alert("User ID Required", "Please enter your user ID.");
      return;
    }

    if (!contactNumber.trim()) {
      Alert.alert("Contact Number Required", "Please enter your contact number.");
      return;
    }

    if (!indianMobilePattern.test(contactNumber.trim())) {
      Alert.alert(
        "Invalid Contact Number",
        "Enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (!passwordValid) {
      Alert.alert(
        "Invalid Password",
        "Please meet all password requirements."
      );
      return;
    }

    submissionInFlight.current = true;
    setIsSubmitting(true);
    setSubmissionNotice(null);

    try {
      await registerUser({
        userName: userId.trim(),
        password,
        fullName: fullName.trim(),
        email: email.trim(),
        contactNumber: contactNumber.trim(),
        roleId: 1,
        isActive: true,
      });
      setSubmissionNotice({
        title: "Registration Successful",
        message: "Your account has been created successfully.",
        success: true,
      });
    } catch (error) {
      setSubmissionNotice({
        title: "Registration Failed",
        message:
          error instanceof ApiError
            ? error.message
            : "Unable to create your account right now. Please try again.",
        success: false,
      });
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const cardTranslateY = cardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });
  const cardScale = cardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.985, 1],
  });
  const iconTranslateY = iconFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const renderRequirements = () => {
    if (!password) return null;

    return (
      <View style={styles.requirements}>
        <Text style={styles.requirementTitle}>Password must contain:</Text>

        <Text style={[styles.requirementItem, hasEightCharacters && styles.requirementValid]}>
          {hasEightCharacters ? "✓" : "○"} At least 8 characters
        </Text>
        <Text style={[styles.requirementItem, hasUppercase && styles.requirementValid]}>
          {hasUppercase ? "✓" : "○"} One uppercase letter (A-Z)
        </Text>
        <Text style={[styles.requirementItem, hasLowercase && styles.requirementValid]}>
          {hasLowercase ? "✓" : "○"} One lowercase letter (a-z)
        </Text>
        <Text style={[styles.requirementItem, hasNumber && styles.requirementValid]}>
          {hasNumber ? "✓" : "○"} One number (0-9)
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <Modal
        visible={submissionNotice !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSubmissionNotice(null)}
      >
        <View style={styles.noticeBackdrop}>
          <View style={styles.noticeCard}>
            <View
              style={[
                styles.noticeIcon,
                submissionNotice?.success
                  ? styles.noticeIconSuccess
                  : styles.noticeIconError,
              ]}
            >
              <Text
                style={[
                  styles.noticeIconText,
                  submissionNotice?.success
                    ? styles.noticeIconTextSuccess
                    : styles.noticeIconTextError,
                ]}
              >
                {submissionNotice?.success ? "✓" : "!"}
              </Text>
            </View>
            <Text style={styles.noticeTitle}>{submissionNotice?.title}</Text>
            <Text style={styles.noticeMessage}>{submissionNotice?.message}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSubmissionNotice(null)}
              style={styles.noticeButton}
            >
              <Text style={styles.noticeButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Animated.View
        style={{
          width: "100%",
          maxWidth: 430,
          opacity: cardEntrance,
          transform: [
            { perspective: 900 },
            { translateY: cardTranslateY },
            { scale: cardScale },
          ],
        }}
      >
        <AuthAnimatedCard>
          <View style={styles.content}>
            <Animated.View
              style={{ transform: [{ translateY: iconTranslateY }, { perspective: 700 }] }}
            >
              <EmbossedIcon icon="person-add" />
            </Animated.View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to get started with MEDICARE.
            </Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9AAEB4"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9AAEB4"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>User ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a user ID"
              placeholderTextColor="#9AAEB4"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit Indian mobile number"
              placeholderTextColor="#9AAEB4"
              value={contactNumber}
              onChangeText={(value) =>
                setContactNumber(value.replace(/\D/g, "").slice(0, 10))
              }
              keyboardType="number-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#9AAEB4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeButtonText}>{showPassword ? "Hide" : "Show"}</Text>
              </Pressable>
            </View>

            {renderRequirements()}

            <Animated.View style={{ transform: [{ scale: buttonScale }], width: "100%" }}>
              <LinearGradient
                colors={["#0D5D76", "#0B3D4F", "#0B2433"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Pressable
                  style={styles.button}
                  onPress={handleCreateAccount}
                  disabled={isSubmitting}
                  accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                  onPressIn={() => triggerPressScale(buttonScale, 0.985).start()}
                  onPressOut={() => triggerPressScale(buttonScale, 1).start()}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>

            <Pressable onPress={safeBack} style={styles.backButton}>
              <Text style={styles.backText}>← Back to Sign In</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: AUTH_THEME.colors.background,
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
    marginTop: 18,
    fontSize: 28,
    fontWeight: "800",
    color: AUTH_THEME.colors.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 21,
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
    ...AUTH_THEME.shadow.inset,
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
    ...AUTH_THEME.shadow.inset,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#20242C",
  },
  eyeButton: {
    width: 42,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: AUTH_THEME.colors.accent,
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
  requirementItem: {
    fontSize: 12,
    color: "#8A8F98",
    marginTop: 4,
  },
  requirementValid: {
    color: AUTH_THEME.colors.success,
    fontWeight: "700",
  },
  noticeBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.38)",
  },
  noticeCard: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 30,
    borderRadius: AUTH_THEME.radius.card,
    backgroundColor: AUTH_THEME.colors.surface,
    ...AUTH_THEME.shadow.soft,
  },
  noticeIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderRadius: 27,
  },
  noticeIconSuccess: {
    backgroundColor: AUTH_THEME.colors.successSoft,
  },
  noticeIconError: {
    backgroundColor: "#FEE2E2",
  },
  noticeIconText: {
    fontSize: 28,
    fontWeight: "800",
  },
  noticeIconTextSuccess: {
    color: AUTH_THEME.colors.success,
  },
  noticeIconTextError: {
    color: AUTH_THEME.colors.danger,
  },
  noticeTitle: {
    color: AUTH_THEME.colors.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  noticeMessage: {
    marginTop: 8,
    color: AUTH_THEME.colors.textSoft,
    fontSize: 14,
    textAlign: "center",
  },
  noticeButton: {
    minWidth: 88,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: AUTH_THEME.radius.button,
    backgroundColor: AUTH_THEME.colors.primary,
  },
  noticeButtonText: {
    color: AUTH_THEME.colors.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  gradientButton: {
    width: "100%",
    borderRadius: AUTH_THEME.radius.button,
    ...AUTH_THEME.shadow.button,
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
