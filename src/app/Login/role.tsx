import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AUTH_THEME, createAuthFloat, triggerPressScale } from "../../components/auth-theme";
import { normalizeRole } from "../../constants/roles";
import { loginUser } from "../../api/auth";
import { ApiError } from "../../api/client";

export default function RoleLogin() {
  const router = useRouter();

  const { role } = useLocalSearchParams<{
    role?: string;
  }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cardEntrance] = useState(() => new Animated.Value(0));
  const [medicalFloat] = useState(() => new Animated.Value(0));
  const [buttonScale] = useState(() => new Animated.Value(1));
  const [loginSuccessVisible, setLoginSuccessVisible] = useState(false);
  const [loginError, setLoginError] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loginInFlight = useRef(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    },
    []
  );

  useEffect(() => {
    const entranceAnimation = Animated.timing(cardEntrance, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    const floatAnimation = createAuthFloat(medicalFloat, { duration: 2400 });

    entranceAnimation.start();
    floatAnimation.start();

    return () => {
      entranceAnimation.stop();
      floatAnimation.stop();
    };
  }, [cardEntrance, medicalFloat]);

  const cardTranslateY = cardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [9, 0],
  });
  const cardScale = cardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.99, 1],
  });
  const medicalFloatY = medicalFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const login = async () => {
    if (loginInFlight.current) {
      return;
    }

    const dashboardRole = normalizeRole(role);

    if (!dashboardRole) {
      setLoginError({
        title: "Role Unavailable",
        message: "Choose a supported role before signing in.",
      });
      return;
    }

    loginInFlight.current = true;
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await loginUser(email.trim(), password);

      if (!response.flag) {
        setLoginError({
          title: "Login Failed",
          message: response.message || "Invalid username or password.",
        });
        return;
      }

      setLoginSuccessVisible(true);
      navigationTimer.current = setTimeout(() => {
        router.replace({
          pathname: "/Dashboard/[role]",
          params: { role: dashboardRole },
        });
      }, 1400);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to sign in right now. Please try again.";

      setLoginError({ title: "Login Error", message });
    } finally {
      loginInFlight.current = false;
      setIsLoading(false);
    }
  };

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <View style={styles.page}>
      {/* Background decoration */}

      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <Modal
        visible={loginSuccessVisible || loginError !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setLoginSuccessVisible(false);
          setLoginError(null);
        }}
      >
        <View style={styles.successModalBackdrop}>
          <View style={styles.successModalCard}>
            {loginError ? (
              <>
                <View style={[styles.successIcon, styles.errorIcon]}>
                  <Text style={[styles.successIconText, styles.errorIconText]}>
                    !
                  </Text>
                </View>
                <Text style={styles.successTitle}>{loginError.title}</Text>
                <Text style={styles.successMessage}>{loginError.message}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setLoginError(null)}
                  style={styles.errorDismissButton}
                >
                  <Text style={styles.errorDismissText}>OK</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Login Successful!</Text>
                <Text style={styles.successMessage}>
                  Taking you to your dashboard.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* LEFT SIDE */}

          <View style={styles.leftSide}>
            <View style={styles.brand}>
              <View style={styles.brandIcon}>
                <Text style={styles.plus}>+</Text>
              </View>

              <View>
                <Text style={styles.brandName}>MEDICARE</Text>

                <Text style={styles.brandSub}>PHARMACY MANAGEMENT SYSTEM</Text>
              </View>
            </View>

            <View style={styles.leftContent}>
              <Text style={styles.smallText}>WELCOME BACK</Text>

              <Text style={styles.bigTitle}>
                Manage your{"\n"}
                <Text style={styles.blue}>pharmacy smarter.</Text>
              </Text>

              <Text style={styles.description}>
                Access your personalized dashboard to manage medicines,
                inventory, orders, prescriptions and pharmacy operations.
              </Text>

              {/* 3D Medical Object */}

              <Animated.View
                style={[
                  styles.visual,
                  { transform: [{ translateY: medicalFloatY }] },
                ]}
              >
                <View style={styles.visualGlow} />

                <View style={styles.medicalCircle}>
                  <Text style={styles.medicalPlus}>+</Text>
                </View>

                <View style={styles.miniCapsule}>
                  <View style={styles.miniBlue} />
                  <View style={styles.miniWhite} />
                </View>

                <View style={styles.miniPill}>
                  <View style={styles.pillLine} />
                </View>
              </Animated.View>
            </View>
          </View>

          {/* RIGHT SIDE */}

          <View style={styles.rightSide}>
            <Animated.View
              style={[
                styles.loginCard,
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
              <View style={styles.cardTopLine} />

              <Text style={styles.loginSmall}>ACCOUNT ACCESS</Text>

              <Text style={styles.loginTitle}>{role || "User"} Login</Text>

              <Text style={styles.loginDescription}>
                Sign in to continue to your dashboard.
              </Text>

              {/* EMAIL */}

              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9AAAB1"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              {/* PASSWORD */}

              <View style={styles.field}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Password</Text>

                  <Pressable
                    onPress={() => router.push("/Login/forgot-password")}
                  >
                    <Text style={styles.forgot}>Forgot password?</Text>
                  </Pressable>
                </View>

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9AAAB1"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              {/* LOGIN */}

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
                  style={styles.gradientButtonWrap}
                >
                  <Pressable
                    onPress={login}
                    disabled={isLoading}
                    accessibilityState={{ disabled: isLoading, busy: isLoading }}
                    style={({ pressed }) => [
                      styles.loginButton,
                      pressed && !isLoading && styles.buttonPressed,
                    ]}
                    onPressIn={() => {
                      if (!isLoading) {
                        triggerPressScale(buttonScale, 0.985).start();
                      }
                    }}
                    onPressOut={() => {
                      if (!isLoading) {
                        triggerPressScale(buttonScale, 1).start();
                      }
                    }}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>

                    <Text style={styles.loginArrow}>→</Text>
                  </Pressable>
                </LinearGradient>
              </Animated.View>

              {/* SECURITY */}

              <View style={styles.security}>
                <View style={styles.securityIcon}>
                  <Text>✓</Text>
                </View>

                <Text style={styles.securityText}>
                  Your information is securely protected
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/Login/create-account")}
                style={styles.createAccountLink}
              >
                <Text style={styles.createAccountText}>Create account</Text>
              </Pressable>

              <Pressable
                onPress={safeBack}
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Back to role selection</Text>
              </Pressable>
            </Animated.View>

            <Text style={styles.footer}>Secure • Simple • Reliable</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: AUTH_THEME.colors.background,
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#E2F4F7",
    top: -180,
    left: -150,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#EAF3FF",
    bottom: -150,
    right: -130,
  },

  container: {
    flexGrow: 1,
    flexDirection: "row",
    minHeight: 750,
  },

  /* LEFT */

  leftSide: {
    flex: 1,
    backgroundColor: "#0D4253",
    paddingHorizontal: 70,
    paddingVertical: 45,
    justifyContent: "space-between",
    overflow: "hidden",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  plus: {
    color: "#0D7089",
    fontSize: 32,
    fontWeight: "900",
  },

  brandName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1,
  },

  brandSub: {
    color: "#8FB8C3",
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 3,
  },

  leftContent: {
    maxWidth: 600,
    marginTop: 60,
  },

  smallText: {
    color: "#66D3E0",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  bigTitle: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "900",
    marginTop: 14,
  },

  blue: {
    color: "#64DCE8",
  },

  description: {
    color: "#9EC0C9",
    fontSize: 15,
    lineHeight: 25,
    maxWidth: 530,
    marginTop: 22,
  },

  /* 3D VISUAL */

  visual: {
    height: 220,
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  visualGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(77,220,230,0.08)",
  },

  medicalCircle: {
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 15,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },

  medicalPlus: {
    fontSize: 80,
    fontWeight: "900",
    color: "#0C829B",
  },

  miniCapsule: {
    position: "absolute",
    width: 110,
    height: 42,
    borderRadius: 25,
    overflow: "hidden",
    flexDirection: "row",
    transform: [{ rotate: "-25deg" }],
    left: 30,
    top: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  miniBlue: {
    flex: 1,
    backgroundColor: "#28B6C9",
  },

  miniWhite: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  miniPill: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    right: 60,
    bottom: 25,
    transform: [{ rotate: "20deg" }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  pillLine: {
    position: "absolute",
    width: 40,
    height: 2,
    backgroundColor: "#D4E6EA",
    top: 29,
    left: 10,
  },

  /* RIGHT */

  rightSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 50,
  },

  loginCard: {
    width: "100%",
    maxWidth: 490,
    backgroundColor: AUTH_THEME.colors.surface,
    borderRadius: AUTH_THEME.radius.card,
    padding: 38,
    shadowColor: AUTH_THEME.colors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 12,
  },

  cardTopLine: {
    position: "absolute",
    height: 5,
    backgroundColor: "#0B839D",
    left: 35,
    right: 35,
    top: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  loginSmall: {
    color: "#0A879E",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 5,
  },

  loginTitle: {
    color: AUTH_THEME.colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 8,
  },

  loginDescription: {
    color: "#84949A",
    fontSize: 13,
    marginTop: 7,
    marginBottom: 28,
  },

  field: {
    marginBottom: 20,
  },

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    color: "#284853",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },

  input: {
    height: 55,
    borderRadius: AUTH_THEME.radius.input,
    borderWidth: 1,
    borderColor: AUTH_THEME.colors.border,
    backgroundColor: AUTH_THEME.colors.surfaceAlt,
    paddingHorizontal: 16,
    color: "#203F49",
    fontSize: 14,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    shadowColor: "#B8C9CF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },

  forgot: {
    color: "#087E98",
    fontSize: 11,
    fontWeight: "800",
  },

  gradientButtonWrap: {
    borderRadius: 16,
    marginTop: 5,
    shadowColor: "#0B687F",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },

  loginButton: {
    height: 57,
    borderRadius: 16,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  loginArrow: {
    color: "#FFFFFF",
    fontSize: 20,
  },

  security: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  securityIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#DCF5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  securityText: {
    color: "#84949A",
    fontSize: 10,
  },

  createAccountLink: {
    alignItems: "center",
    marginTop: 14,
  },

  createAccountText: {
    color: AUTH_THEME.colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },

  backButton: {
    alignItems: "center",
    marginTop: 18,
  },

  backText: {
    color: AUTH_THEME.colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },

  successModalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.38)",
  },

  successModalCard: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 30,
    borderRadius: AUTH_THEME.radius.card,
    backgroundColor: AUTH_THEME.colors.surface,
    ...AUTH_THEME.shadow.soft,
  },

  successIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderRadius: 27,
    backgroundColor: AUTH_THEME.colors.successSoft,
  },

  successIconText: {
    color: AUTH_THEME.colors.success,
    fontSize: 28,
    fontWeight: "800",
  },

  errorIcon: {
    backgroundColor: "#FEE2E2",
  },

  errorIconText: {
    color: AUTH_THEME.colors.danger,
  },

  successTitle: {
    color: AUTH_THEME.colors.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  successMessage: {
    marginTop: 8,
    color: AUTH_THEME.colors.textSoft,
    fontSize: 14,
    textAlign: "center",
  },

  errorDismissButton: {
    minWidth: 88,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: AUTH_THEME.radius.button,
    backgroundColor: AUTH_THEME.colors.primary,
  },

  errorDismissText: {
    color: AUTH_THEME.colors.surface,
    fontSize: 14,
    fontWeight: "700",
  },

  footer: {
    color: "#8A9AA0",
    fontSize: 10,
    marginTop: 18,
  },
});
