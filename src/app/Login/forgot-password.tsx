import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your registered email.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    router.push("/Login/otp");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <View style={styles.crossVertical} />
              <View style={styles.crossHorizontal} />
            </View>

            <View>
              <Text style={styles.logoText}>MEDICARE</Text>
              <Text style={styles.logoSubText}>
                Medicine Shop Management
              </Text>
            </View>
          </View>

          <Text style={styles.help}>Help</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <View style={styles.lockBody} />
            <View style={styles.lockTop} />
          </View>

          <Text style={styles.title}>Forgot Password?</Text>

          <Text style={styles.description}>
            Enter your registered email address and we'll help you securely
            reset your password.
          </Text>

          <Text style={styles.label}>Registered Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#8AA0A7"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back to Sign In</Text>
          </TouchableOpacity>

          <View style={styles.securityBox}>
            <Text style={styles.securityTitle}>🔒 Secure Password Recovery</Text>

            <Text style={styles.securityText}>
              Your account information is protected. Verification is required
              before changing your password.
            </Text>
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

  scroll: {
    flexGrow: 1,
  },

  header: {
    height: 82,
    backgroundColor: "#083C4A",
    paddingHorizontal: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
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
    letterSpacing: 1,
  },

  logoSubText: {
    color: "#B7D7DE",
    fontSize: 9,
    marginTop: 2,
  },

  help: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  card: {
    width: "90%",
    maxWidth: 470,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 34,
    alignSelf: "center",
    marginTop: 55,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 4,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#EAF6F8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  lockBody: {
    width: 25,
    height: 21,
    backgroundColor: "#0D5367",
    borderRadius: 5,
    position: "absolute",
    bottom: 13,
  },

  lockTop: {
    width: 17,
    height: 18,
    borderWidth: 4,
    borderColor: "#0D5367",
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    top: 13,
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
    marginTop: 10,
    marginBottom: 30,
  },

  label: {
    color: "#153B47",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D7E5E8",
    borderRadius: 11,
    backgroundColor: "#FAFCFC",
    paddingHorizontal: 15,
    color: "#153B47",
    fontSize: 14,
  },

  continueButton: {
    height: 52,
    backgroundColor: "#0D5367",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  backButton: {
    alignItems: "center",
    marginTop: 20,
  },

  backText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  securityBox: {
    backgroundColor: "#F5F9FA",
    borderRadius: 12,
    padding: 15,
    marginTop: 25,
  },

  securityTitle: {
    color: "#153B47",
    fontSize: 12,
    fontWeight: "800",
  },

  securityText: {
    color: "#70868D",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  footer: {
    textAlign: "center",
    color: "#8AA0A7",
    fontSize: 11,
    marginTop: 30,
    marginBottom: 30,
  },
});