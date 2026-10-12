import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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

import { AUTH_THEME, createAuthFloat, triggerPressScale } from "../../components/auth-theme";
import AuthAnimatedCard from "../components/AuthAnimatedCard";
import EmbossedIcon from "../components/EmbossedIcon";

type PublicRole = "Customer" | "Supplier" | "Doctor";
type FormErrors = Partial<
  Record<"name" | "email" | "accountType" | "password" | "confirmPassword", string>
>;

const publicRoles: PublicRole[] = ["Customer", "Supplier", "Doctor"];

export default function CreateAccount() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState<PublicRole | "">("Customer");
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submissionNotice, setSubmissionNotice] = useState<{
    title: string;
    message: string;
    success: boolean;
  } | null>(null);

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

  const hasEightCharacters = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordValid =
    hasEightCharacters && hasUppercase && hasLowercase && hasNumber;

  const handleCreateAccount = () => {
    const errors: FormErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = "Please enter your name.";
    }

    if (!trimmedEmail) {
      errors.email = "Please enter your email address.";
    } else if (!emailPattern.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!accountType) {
      errors.accountType = "Please select an account type.";
    }

    if (!password) {
      errors.password = "Please enter a password.";
    } else if (!passwordValid) {
      errors.password =
        "Use at least 8 characters, including uppercase and lowercase letters and a number.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setEmail(trimmedEmail);
    setAccountTypeOpen(false);
    setSubmissionNotice({
      title: "Account Created Successfully!",
      message: "Your MEDICARE registration form has been completed successfully.",
      success: true,
    });
  };

  const continueToSignIn = () => {
    setSubmissionNotice(null);
    safeBack();
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
            {submissionNotice?.success && (
              <Text style={styles.noticeRole}>Account Type: {accountType}</Text>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={
                submissionNotice?.success
                  ? continueToSignIn
                  : () => setSubmissionNotice(null)
              }
              style={styles.noticeButton}
            >
              <Text style={styles.noticeButtonText}>
                {submissionNotice?.success ? "Continue to Sign In" : "OK"}
              </Text>
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

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, formErrors.name && styles.inputWithError]}
              placeholder="Enter your full name"
              placeholderTextColor="#9AAEB4"
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                if (formErrors.name && value.trim()) {
                  setFormErrors((current) => ({ ...current, name: undefined }));
                }
              }}
              autoCapitalize="words"
            />
            {!!formErrors.name && (
              <Text style={styles.fieldError}>{formErrors.name}</Text>
            )}

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputWithError]}
              placeholder="Enter your email"
              placeholderTextColor="#9AAEB4"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (formErrors.email) {
                  const trimmedEmail = value.trim();
                  const emailError = !trimmedEmail
                    ? "Please enter your email address."
                    : emailPattern.test(trimmedEmail)
                      ? undefined
                      : "Please enter a valid email address.";
                  setFormErrors((current) => ({
                    ...current,
                    email: emailError,
                  }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!formErrors.email && (
              <Text style={styles.fieldError}>{formErrors.email}</Text>
            )}

            <Text style={styles.label}>Account Type</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Account Type: ${accountType || "Select account type"}`}
              accessibilityState={{ expanded: accountTypeOpen }}
              onPress={() => setAccountTypeOpen((isOpen) => !isOpen)}
              style={[
                styles.accountTypeInput,
                formErrors.accountType && styles.inputWithError,
              ]}
            >
              <Text
                style={[
                  styles.accountTypeValue,
                  !accountType && styles.accountTypePlaceholder,
                ]}
              >
                {accountType || "Select account type"}
              </Text>
              <Text style={styles.accountTypeChevron}>
                {accountTypeOpen ? "⌃" : "⌄"}
              </Text>
            </Pressable>
            {accountTypeOpen && (
              <View style={styles.accountTypeOptions}>
                {publicRoles.map((role) => (
                  <Pressable
                    key={role}
                    accessibilityRole="button"
                    accessibilityState={{ selected: accountType === role }}
                    onPress={() => {
                      setAccountType(role);
                      setAccountTypeOpen(false);
                      setFormErrors((current) => ({
                        ...current,
                        accountType: undefined,
                      }));
                    }}
                    style={[
                      styles.accountTypeOption,
                      accountType === role && styles.accountTypeOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.accountTypeOptionText,
                        accountType === role &&
                          styles.accountTypeOptionTextSelected,
                      ]}
                    >
                      {role}
                    </Text>
                    {accountType === role && (
                      <Text style={styles.accountTypeCheck}>✓</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
            {!!formErrors.accountType && (
              <Text style={styles.fieldError}>{formErrors.accountType}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordContainer,
                formErrors.password && styles.inputWithError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#9AAEB4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (formErrors.password) {
                    setFormErrors((current) => ({
                      ...current,
                      password: !value
                        ? "Please enter a password."
                        : value.length >= 8 &&
                            /[A-Z]/.test(value) &&
                            /[a-z]/.test(value) &&
                            /[0-9]/.test(value)
                          ? undefined
                          : "Use at least 8 characters, including uppercase and lowercase letters and a number.",
                    }));
                  }
                  if (formErrors.confirmPassword && confirmPassword) {
                    setFormErrors((current) => ({
                      ...current,
                      confirmPassword:
                        confirmPassword === value
                          ? undefined
                          : "Passwords do not match.",
                    }));
                  }
                }}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeButtonText}>{showPassword ? "Hide" : "Show"}</Text>
              </Pressable>
            </View>

            {!!formErrors.password && (
              <Text style={styles.fieldError}>{formErrors.password}</Text>
            )}

            {renderRequirements()}

            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.passwordContainer,
                formErrors.confirmPassword && styles.inputWithError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#9AAEB4"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (formErrors.confirmPassword) {
                    setFormErrors((current) => ({
                      ...current,
                      confirmPassword: !value
                        ? "Please confirm your password."
                        : value === password
                          ? undefined
                          : "Passwords do not match.",
                    }));
                  }
                }}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirmPassword((current) => !current)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeButtonText}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
            {!!formErrors.confirmPassword && (
              <Text style={styles.fieldError}>
                {formErrors.confirmPassword}
              </Text>
            )}

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
                  onPressIn={() => triggerPressScale(buttonScale, 0.985).start()}
                  onPressOut={() => triggerPressScale(buttonScale, 1).start()}
                >
                  <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
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
  inputWithError: {
    marginBottom: 5,
  },
  fieldError: {
    width: "100%",
    color: AUTH_THEME.colors.danger,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  accountTypeInput: {
    width: "100%",
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: AUTH_THEME.colors.border,
    borderRadius: AUTH_THEME.radius.input,
    backgroundColor: AUTH_THEME.colors.surfaceAlt,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    ...AUTH_THEME.shadow.inset,
  },
  accountTypeValue: {
    color: "#20242C",
    fontSize: 15,
  },
  accountTypePlaceholder: {
    color: "#9AAEB4",
  },
  accountTypeChevron: {
    color: AUTH_THEME.colors.accent,
    fontSize: 20,
    fontWeight: "700",
  },
  accountTypeOptions: {
    width: "100%",
    marginTop: -12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AUTH_THEME.colors.border,
    borderRadius: AUTH_THEME.radius.input,
    backgroundColor: AUTH_THEME.colors.surface,
    ...AUTH_THEME.shadow.soft,
  },
  accountTypeOption: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AUTH_THEME.colors.border,
  },
  accountTypeOptionSelected: {
    backgroundColor: AUTH_THEME.colors.surfaceSoft,
  },
  accountTypeOptionText: {
    color: AUTH_THEME.colors.text,
    fontSize: 15,
  },
  accountTypeOptionTextSelected: {
    color: AUTH_THEME.colors.accent,
    fontWeight: "700",
  },
  accountTypeCheck: {
    color: AUTH_THEME.colors.success,
    fontSize: 16,
    fontWeight: "800",
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
  noticeRole: {
    marginTop: 12,
    color: AUTH_THEME.colors.text,
    fontSize: 14,
    fontWeight: "700",
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
