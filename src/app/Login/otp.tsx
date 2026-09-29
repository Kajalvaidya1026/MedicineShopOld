import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function OTPPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const email =
    typeof params.email === "string"
      ? params.email
      : "your email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState("");

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (
    value: string,
    index: number
  ) => {
    const cleanValue = value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = cleanValue.slice(-1);

    setOtp(newOtp);
    setError("");

    if (cleanValue && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: any,
    index: number
  ) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setError("");

    router.push("/Login/reset-password");
  };

  const resendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(59);
    setError("");
    inputs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <View style={styles.crossVertical} />
              <View style={styles.crossHorizontal} />
            </View>

            <View>
              <Text style={styles.logoText}>MEDICARE</Text>

              <Text style={styles.logoSubText}>
                Medicine Management
              </Text>
            </View>
          </View>

          <Text style={styles.helpText}>Help</Text>
        </View>

        {/* MAIN */}

        <View style={styles.main}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>@</Text>
            </View>

            <Text style={styles.title}>
              Verify your email
            </Text>

            <Text style={styles.description}>
              We sent a 6-digit verification code to
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>

            {/* OTP */}

            <Text style={styles.label}>
              Verification code
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    error ? styles.otpError : null,
                  ]}
                  value={value}
                  onChangeText={(text) =>
                    handleChange(text, index)
                  }
                  onKeyPress={(event) =>
                    handleKeyPress(event, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* TIMER */}

            <View style={styles.timerRow}>
              <Text style={styles.timerLabel}>
                Code expires in
              </Text>

              <Text style={styles.timer}>
                00:{timer.toString().padStart(2, "0")}
              </Text>
            </View>

            {/* VERIFY */}

            <Pressable
              style={styles.primaryButton}
              onPress={handleVerify}
            >
              <Text style={styles.primaryButtonText}>
                Verify OTP →
              </Text>
            </Pressable>

            {/* RESEND */}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>

              <Pressable
                onPress={resendOTP}
                disabled={timer > 0}
              >
                <Text
                  style={[
                    styles.resendButton,
                    timer > 0 &&
                      styles.resendDisabled,
                  ]}
                >
                  Resend OTP
                </Text>
              </Pressable>
            </View>

            {/* BACK */}

            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>
                ← Back
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footer}>
          © 2026 MEDICARE • Secure • Simple • Reliable
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FA",
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    height: 82,
    backgroundColor: "#0D5367",
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  crossVertical: {
    position: "absolute",
    width: 9,
    height: 27,
    backgroundColor: "#0D5367",
    borderRadius: 2,
  },

  crossHorizontal: {
    position: "absolute",
    width: 27,
    height: 9,
    backgroundColor: "#0D5367",
    borderRadius: 2,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  logoSubText: {
    color: "#CDE9EE",
    fontSize: 10,
    marginTop: 2,
  },

  helpText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  main: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  card: {
    width: "100%",
    maxWidth: 470,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    elevation: 8,
    shadowColor: "#0D5367",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EAF6F8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  iconText: {
    color: "#0D5367",
    fontSize: 25,
    fontWeight: "800",
  },

  title: {
    color: "#153B47",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: "#70868D",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },

  email: {
    color: "#0D5367",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
  },

  label: {
    color: "#153B47",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  otpInput: {
    width: 48,
    height: 55,
    borderWidth: 1,
    borderColor: "#D4E5E8",
    borderRadius: 10,
    backgroundColor: "#F9FCFC",
    color: "#153B47",
    fontSize: 20,
    fontWeight: "800",
  },

  otpError: {
    borderColor: "#D9534F",
  },

  errorText: {
    color: "#D9534F",
    fontSize: 12,
    marginTop: 8,
  },

  timerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
    gap: 5,
  },

  timerLabel: {
    color: "#70868D",
    fontSize: 13,
  },

  timer: {
    color: "#0D5367",
    fontSize: 13,
    fontWeight: "800",
  },

  primaryButton: {
    height: 52,
    backgroundColor: "#0D5367",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 5,
  },

  resendText: {
    color: "#70868D",
    fontSize: 13,
  },

  resendButton: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "800",
  },

  resendDisabled: {
    color: "#AABBC0",
  },

  backButton: {
    alignItems: "center",
    marginTop: 20,
  },

  backText: {
    color: "#0A829A",
    fontSize: 14,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#82979D",
    fontSize: 11,
    paddingBottom: 25,
  },
}); 