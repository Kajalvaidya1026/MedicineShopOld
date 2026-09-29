import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react"; // Used to store password values

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function ResetPassword() {
  const { role } = useLocalSearchParams();

  const roleName = Array.isArray(role) ? role[0] : role;

  // Store the password entered by the user
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasEightCharacters = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // Check whether both passwords are the same
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleResetPassword = () => {
    // Check if password is at least 8 characters
    if (!hasEightCharacters) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least 8 characters.",
      );
      return;
    }

    // Check for uppercase letter
    if (!hasUppercase) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one uppercase letter.",
      );
      return;
    }

    // Check for lowercase letter
    if (!hasLowercase) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one lowercase letter.",
      );
      return;
    }

    // Check for number
    if (!hasNumber) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one number.",
      );
      return;
    }

    // Check for special character
    if (!hasSpecialCharacter) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one special character.",
      );
      return;
    }

    // Check whether passwords match
    if (!passwordsMatch) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirm password must be the same.",
      );
      return;
    }

    // If all validations are successful
    Alert.alert("Success", "Your password has been reset successfully.", [
      {
        text: "OK",
        onPress: () => {
          // Return to the selected role login page
          router.push({
            pathname: "/Login/role",
            params: { role: roleName },
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>
          Create a new password for your account
        </Text>

        <Text style={styles.label}>New Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter new password"
            placeholderTextColor="#98A2B3"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#1E3A5F"
            />
          </TouchableOpacity>
        </View>

        {/* Password requirements - these update while the user types */}
        <View style={styles.requirements}>
          <Text style={styles.requirementTitle}>Password must contain:</Text>

          {/* At least 8 characters */}
          <Text style={hasEightCharacters ? styles.valid : styles.invalid}>
            {hasEightCharacters ? "✓" : "✗"} At least 8 characters,1 uppercase
            letter,1 lowercase letter, 1 special character
          </Text>
        </View>

        <Text style={styles.label}>Confirm Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm new password"
            placeholderTextColor="#98A2B3"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#1E3A5F"
            />
          </TouchableOpacity>
        </View>
        {/* Show whether both passwords are the same */}
        {confirmPassword.length > 0 && (
          <Text style={passwordsMatch ? styles.valid : styles.invalid}>
            {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E3A5F",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#667085",
    textAlign: "center",
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    height: 50,
    backgroundColor: "#062148",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  backText: {
    color: "#1E3A5F",
    textAlign: "center",
    marginTop: 25,
    fontWeight: "600",
  },

  // Password requirements box
  requirements: {
    marginTop: -10,
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },

  // Password requirements heading
  requirementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 3,
  },

  // Green text when requirement is satisfied
  valid: {
    color: "green",
    fontSize: 13,
    marginTop: 2,
  },

  // Red text when requirement is not satisfied
  invalid: {
    color: "red",
    fontSize: 13,
    marginTop: 2,
  },
  // Container for password input and Show/Hide button
  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
  },

  // Password input takes the available space
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
});
