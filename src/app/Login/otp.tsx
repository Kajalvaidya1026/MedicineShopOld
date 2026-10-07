import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AuthAnimatedCard from "../components/AuthAnimatedCard";
import { AUTH_THEME, createAuthFloat, triggerPressScale } from "../../components/auth-theme";

export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(21);
  const [error, setError] = useState("");

  const [verified, setVerified] = useState(false);
  const [securityFloat] = useState(() => new Animated.Value(0));
  const [verifyButtonScale] = useState(() => new Animated.Value(1));

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const floatAnimation = createAuthFloat(securityFloat, { duration: 2400 });
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, [securityFloat]);

  // Fill animation for each OTP box
  const [fillAnimations] = useState(() =>
    Array.from({ length: 4 }, () => new Animated.Value(0))
  );

  // Green success animation
  const [successScale] = useState(() => new Animated.Value(0));
  const [successOpacity] = useState(() => new Animated.Value(0));

  // Checkmark animation
  const [checkScale] = useState(() => new Animated.Value(0));

  // Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Animate OTP box from bottom to top
  const animateFill = (index: number, filled: boolean) => {
    Animated.timing(fillAnimations[index], {
      toValue: filled ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Handle OTP input
  const handleOTPChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newOTP = [...otp];
    newOTP[index] = digit;

    setOtp(newOTP);
    setError("");

    animateFill(index, digit !== "");

    // Move to next box
    if (digit && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Hide keyboard after last digit
    if (digit && index === otp.length - 1) {
      Keyboard.dismiss();
    }
  };

  // Handle backspace
  const handleKeyPress = (
    event: any,
    index: number
  ) => {
    if (event.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Verify OTP
  const verifyOTP = () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    // Demo OTP
    if (enteredOTP !== "2342") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setError("");
    setVerified(true);

    // Animate all boxes to green
    Animated.parallel(
      fillAnimations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      )
    ).start();

    // Success animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),

        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),

      Animated.sequence([
        Animated.spring(checkScale, {
          toValue: 1.2,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),

        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const resendOTP = () => {
    setTimer(21);
    setOtp(["", "", "", ""]);
    setError("");
    setVerified(false);

    fillAnimations.forEach((animation) => {
      animation.setValue(0);
    });

    successScale.setValue(0);
    successOpacity.setValue(0);
    checkScale.setValue(0);

    inputRefs.current[0]?.focus();
  };

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/Login/role");
  };

  const securityFloatY = securityFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  const verifyButtonTransform = [{ scale: verifyButtonScale }];

  return (
    <View style={styles.container}>
      <AuthAnimatedCard>
        <View style={styles.header}>
          <Animated.View
            style={{ transform: [{ translateY: securityFloatY }] }}
          >
            <View style={styles.headerIcon}>
              <Ionicons name="lock-closed" size={28} color="#0D7180" />
            </View>
          </Animated.View>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            {verified
              ? "Your code has been verified."
              : "Enter the 4-digit code sent to your registered device."}
          </Text>
        </View>

        {/* OTP BOXES */}
        {!verified && (
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => {
              const scaleY = fillAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              });

              const translateY = fillAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [25, 0],
              });

              const fillOpacity = fillAnimations[index].interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0, 0.7, 1],
              });

              return (
                <View key={index} style={styles.otpBoxWrapper}>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.otpFill,
                      {
                        opacity: fillOpacity,
                        transform: [{ translateY }, { scaleY }],
                      },
                      verified && styles.verifiedFill,
                    ]}
                  />
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(value) => handleOTPChange(value, index)}
                    onKeyPress={(event) => handleKeyPress(event, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    editable={!verified}
                    style={[
                      styles.otpInput,
                      verified && styles.verifiedText,
                    ]}
                    textAlign="center"
                    selectTextOnFocus
                  />
                </View>
              );
            })}
          </View>
        )}

        {/* ERROR */}
        {!verified && error !== "" && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* TIMER */}
        {!verified && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              OTP expires in{" "}
              <Text style={styles.timerNumber}>
                {timer}s
              </Text>
            </Text>
          </View>
        )}

        {/* VERIFY BUTTON */}
        {!verified && (
          <Animated.View
            style={[
              { width: "100%" },
              { transform: verifyButtonTransform },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.verifyButton}
              onPress={verifyOTP}
              onPressIn={() => triggerPressScale(verifyButtonScale, 0.985).start()}
              onPressOut={() => triggerPressScale(verifyButtonScale, 1).start()}
            >
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* RESEND */}
        {!verified && (
          <TouchableOpacity
            onPress={resendOTP}
            disabled={timer > 0}
            style={styles.resendButton}
          >
            <Text
              style={[
                styles.resendText,
                timer > 0 && styles.resendDisabled,
              ]}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={safeBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to Login</Text>
        </TouchableOpacity>

        {/* SUCCESS */}
        {verified && (
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: successOpacity,
                transform: [
                  {
                    scale: successScale,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.checkCircle,
                {
                  transform: [
                    {
                      scale: checkScale,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.checkMark}>✓</Text>
            </Animated.View>

            <View style={styles.secureText}>
              <Ionicons name="lock-closed" size={13} color="#168C68" />
              <Text style={styles.secureTextLabel}>Verified and secure</Text>
            </View>
          </Animated.View>
        )}
      </AuthAnimatedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: AUTH_THEME.colors.background,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#EAF6F8",
    borderWidth: 1,
    borderColor: "#D3E6E9",
    shadowColor: "#0D5367",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.16,
    shadowRadius: 11,
    elevation: 6,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: AUTH_THEME.colors.text,
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 14,
    color: AUTH_THEME.colors.textSoft,
    textAlign: "center",
    lineHeight: 21,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },

  otpBoxWrapper: {
    width: 56,
    height: 62,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: AUTH_THEME.colors.surface,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: "#D7E3ED",
    borderBottomColor: "#C5D4E1",
    position: "relative",

    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  /*
   * This is the colored layer.
   * It starts at the bottom and grows upward.
   */
  otpFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    backgroundColor: "#0D5367",
    borderRadius: 13,
  },

  verifiedFill: {
    backgroundColor: "#22B981",
  },

  otpInput: {
    width: "100%",
    height: "100%",
    fontSize: 23,
    fontWeight: "700",
    color: "#FFFFFF",
    zIndex: 2,
  },

  verifiedText: {
    color: "#FFFFFF",
  },

  errorText: {
    color: "#E53935",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },

  timerContainer: {
    alignItems: "center",
    marginBottom: 14,
  },

  timerText: {
    fontSize: 13,
    color: "#777F89",
  },

  timerNumber: {
    fontWeight: "700",
    color: "#0e0d0d",
  },

  verifyButton: {
    height: 49,
    borderRadius: AUTH_THEME.radius.button,
    backgroundColor: AUTH_THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,

    shadowColor: AUTH_THEME.colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  resendButton: {
    alignItems: "center",
    marginTop: 10,
  },

  resendText: {
    color: AUTH_THEME.colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },

  resendDisabled: {
    color: "#AAB0B8",
  },

  successContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#22C55E",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  checkMark: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
  },

  successTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    color: "#22A447",
  },

  successMessage: {
    marginTop: 5,
    fontSize: 13,
    color: "#777F89",
    textAlign: "center",
  },

  secureText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },

  secureTextLabel: {
    color: "#168C68",
    fontSize: 12,
    fontWeight: "700",
  },
  backLink: {
    alignItems: "center",
    marginTop: 16,
  },
  backLinkText: {
    color: AUTH_THEME.colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});