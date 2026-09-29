import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RoleLogin() {
  const router = useRouter();

  const { role } = useLocalSearchParams<{
    role?: string;
  }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    console.log({
      role,
      email,
      password,
    });

    // Later:
    // Connect this button to your Spring Boot login API.
  };

  return (
    <View style={styles.page}>
      {/* Background decoration */}

      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

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

              <View style={styles.visual}>
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
              </View>
            </View>
          </View>

          {/* RIGHT SIDE */}

          <View style={styles.rightSide}>
            <View style={styles.loginCard}>
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

              <Pressable
                onPress={login}
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>

                <Text style={styles.loginArrow}>→</Text>
              </Pressable>

              {/* SECURITY */}

              <View style={styles.security}>
                <View style={styles.securityIcon}>
                  <Text>✓</Text>
                </View>

                <Text style={styles.securityText}>
                  Your information is securely protected
                </Text>
              </View>

              {/* BACK */}

              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Back to role selection</Text>
              </Pressable>
            </View>

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
    backgroundColor: "#F5F9FA",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 38,
    shadowColor: "#183E4A",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.12,
    shadowRadius: 30,
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
    color: "#173A46",
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE7EA",
    backgroundColor: "#FAFCFC",
    paddingHorizontal: 16,
    color: "#203F49",
    fontSize: 14,
  },

  forgot: {
    color: "#087E98",
    fontSize: 11,
    fontWeight: "800",
  },

  loginButton: {
    height: 57,
    borderRadius: 13,
    backgroundColor: "#0B687F",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    marginTop: 5,
    shadowColor: "#0B687F",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
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

  backButton: {
    alignItems: "center",
    marginTop: 25,
  },

  backText: {
    color: "#087E98",
    fontSize: 12,
    fontWeight: "800",
  },

  footer: {
    color: "#8A9AA0",
    fontSize: 10,
    marginTop: 18,
  },
});
