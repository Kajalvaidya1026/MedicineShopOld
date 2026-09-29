import React, { useState } from "react";
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
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    router.push({
      pathname: "/Login/otp",
      params: { email },
    });
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
            <Text style={styles.title}>
              Forgot your password?
            </Text>

            <Text style={styles.description}>
              No problem. Enter the email address associated
              with your account and we'll send you a
              verification code.
            </Text>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email address
            </Text>

            <TextInput
              style={[
                styles.input,
                error ? styles.inputError : null,
              ]}
              placeholder="Enter your email"
              placeholderTextColor="#8AA2A9"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* CONTINUE */}

            <Pressable
              style={styles.primaryButton}
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>
                Continue →
              </Text>
            </Pressable>

            {/* BACK */}

            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>
                ← Back to sign in
              </Text>
            </Pressable>
          </View>

          {/* SECURITY */}

          <View style={styles.securityBox}>
            <View style={styles.securityIcon}>
              <Text style={styles.securityCheck}>✓</Text>
            </View>

            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>
                Your information is secure
              </Text>

              <Text style={styles.securityText}>
                We protect your account information using
                secure authentication.
              </Text>
            </View>
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
    paddingTop: 70,
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

  title: {
    color: "#153B47",
    fontSize: 29,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: "#70868D",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 13,
    marginBottom: 30,
  },

  label: {
    color: "#153B47",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D4E5E8",
    borderRadius: 10,
    backgroundColor: "#F9FCFC",
    paddingHorizontal: 16,
    color: "#153B47",
    fontSize: 14,
  },

  inputError: {
    borderColor: "#D9534F",
  },

  errorText: {
    color: "#D9534F",
    fontSize: 12,
    marginTop: 7,
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

  backButton: {
    alignItems: "center",
    marginTop: 22,
  },

  backText: {
    color: "#0A829A",
    fontSize: 14,
    fontWeight: "700",
  },

  securityBox: {
    width: "100%",
    maxWidth: 470,
    flexDirection: "row",
    backgroundColor: "#EAF6F8",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },

  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0D5367",
    alignItems: "center",
    justifyContent: "center",
  },

  securityCheck: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  securityContent: {
    flex: 1,
    marginLeft: 12,
  },

  securityTitle: {
    color: "#153B47",
    fontSize: 13,
    fontWeight: "800",
  },

  securityText: {
    color: "#70868D",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  footer: {
    textAlign: "center",
    color: "#82979D",
    fontSize: 11,
    paddingBottom: 25,
  },
});