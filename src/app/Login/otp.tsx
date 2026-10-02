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

import AuthAnimatedCard from "../components/AuthAnimatedCard";

export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(21);
  const [error, setError] = useState("");

  const [verified, setVerified] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Fill animation for each OTP box
  const fillAnimations = useRef(
    Array.from({ length: 6 }, () => new Animated.Value(0))
  ).current;

  // Green success animation
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  // Checkmark animation
  const checkScale = useRef(new Animated.Value(0)).current;

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
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Hide keyboard after last digit
    if (digit && index === 5) {
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

    if (enteredOTP.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    // Demo OTP
    if (enteredOTP !== "234234") {
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
    setOtp(["", "", "", "", "", ""]);
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

  return (
    <View style={styles.container}>
      <AuthAnimatedCard>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>

          <Text style={styles.subtitle}>
            Enter the 6-digit OTP sent to your email
          </Text>
        </View>

        {/* OTP BOXES */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => {
            /*
             * ScaleY starts from 0 and grows to 1.
             * The transformOrigin effect is simulated by
             * positioning the fill at the bottom.
             */
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
                {/* Animated bottom-to-top fill */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.otpFill,
                    {
                      opacity: fillOpacity,
                      transform: [
                        {
                          translateY,
                        },
                        {
                          scaleY,
                        },
                      ],
                    },
                    verified && styles.verifiedFill,
                  ]}
                />

                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) =>
                    handleOTPChange(value, index)
                  }
                  onKeyPress={(event) =>
                    handleKeyPress(event, index)
                  }
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

        {/* ERROR */}
        {error !== "" && (
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
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.verifyButton}
            onPress={verifyOTP}
          >
            <Text style={styles.verifyButtonText}>
              Verify OTP
            </Text>
          </TouchableOpacity>
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

            <Text style={styles.successTitle}>
              OTP Verified
            </Text>

            <Text style={styles.successMessage}>
              Your OTP has been verified successfully.
            </Text>
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
    backgroundColor: "#EEF2F7",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#20242A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#777F89",
    textAlign: "center",
    lineHeight: 21,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
  },

  otpBoxWrapper: {
    width: 45,
    height: 55,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E7EBF0",
    borderWidth: 1,
    borderColor: "#D4DAE1",
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
    backgroundColor: "65#6C63FF",
    borderRadius: 11,
  },

  verifiedFill: {
    backgroundColor: "#22C55E",
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
    marginBottom: 20,
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
    height: 52,
    borderRadius: 14,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,

    shadowColor: "#6ab69f",
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
    marginTop: 18,
  },

  resendText: {
    color: "#7a74e5",
    fontSize: 14,
    fontWeight: "600",
  },

  resendDisabled: {
    color: "#AAB0B8",
  },

  successContainer: {
    alignItems: "center",
    marginTop: 20,
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
    marginTop: 14,// 
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
});