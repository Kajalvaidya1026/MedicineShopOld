import { useEffect, useRef, useState } from "react";
import AnimatedCard from "../components/AnimatedCard";
import {
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type LoginStep = "login" | "forgot" | "otp" | "reset" | "success";

export default function HomeScreen() {
  const [showLogin, setShowLogin] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroAnimation = useRef(new Animated.Value(0)).current;
  const medicineAnimation = useRef(new Animated.Value(0)).current;

  const [loginStep, setLoginStep] = useState<LoginStep>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [seconds, setSeconds] = useState(300);

  /* =====================================================
     OTP TIMER
  ===================================================== */

  useEffect(() => {
    if (loginStep !== "otp" || seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loginStep, seconds]);

  /* =====================================================
     OPEN LOGIN
  ===================================================== */

  const openLogin = () => {
    setLoginStep("login");
    setShowLogin(true);
  };

  /* =====================================================
     CLOSE LOGIN
  ===================================================== */

  const closeLogin = () => {
    setShowLogin(false);

    setTimeout(() => {
      setLoginStep("login");
    }, 200);
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Login Required", "Please enter your email and password.");
      return;
    }

    Alert.alert(
      "Login Successful",
      "Authentication will connect to your backend later.",
    );
  };

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  const openForgotPassword = () => {
    setLoginStep("forgot");
  };

  const sendOTP = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Email Required", "Please enter your registered email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setEmail(trimmedEmail);
    setOtp(["", "", "", "", "", ""]);
    setSeconds(300);
    setLoginStep("otp");
  };

  /* =====================================================
     OTP
  ===================================================== */

  const handleOTPChange = (value: string, index: number) => {
    const number = value.replace(/[^0-9]/g, "");

    if (!number) {
      const updatedOTP = [...otp];
      updatedOTP[index] = "";
      setOtp(updatedOTP);
      return;
    }

    const updatedOTP = [...otp];

    updatedOTP[index] = number.slice(-1);

    setOtp(updatedOTP);

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const verifyOTP = () => {
    if (seconds <= 0) {
      Alert.alert(
        "OTP Expired",
        "Your OTP has expired. Please request a new OTP.",
      );
      return;
    }

    const code = otp.join("");

    if (code.length !== 6) {
      Alert.alert("Incomplete OTP", "Please enter the complete 6-digit OTP.");
      return;
    }

    setLoginStep("reset");
  };

  const resendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    setSeconds(300);

    Alert.alert("OTP Sent", "A new OTP has been generated.");
  };

  /* =====================================================
     PASSWORD RESET
  ===================================================== */

  const resetPassword = () => {
    if (!newPassword) {
      Alert.alert("Password Required", "Please enter a new password.");
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Confirm Password", "Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "New Password and Confirm New Password must be the same.",
      );
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one uppercase letter.",
      );
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one lowercase letter.",
      );
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least one number.",
      );
      return;
    }

    setLoginStep("success");
  };

  /* =====================================================
     BACK BUTTON
  ===================================================== */

  const goBack = () => {
    if (loginStep === "forgot") {
      setLoginStep("login");
    } else if (loginStep === "otp") {
      setLoginStep("forgot");
    } else if (loginStep === "reset") {
      setLoginStep("otp");
    } else if (loginStep === "success") {
      setLoginStep("login");
    }
  };

  /* =====================================================
     RESET AUTH FORM
  ===================================================== */

  const resetAuthForm = () => {
    setEmail("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setSeconds(300);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <View style={styles.container}>
      {/* =================================================
          MAIN PAGE
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={[styles.header, scrollY > 50 && styles.headerScrolled]}>
          <View style={styles.brandContainer}>
            <View style={styles.logoBox}>
              <View style={styles.crossVertical} />
              <View style={styles.crossHorizontal} />
            </View>

            <View>
              <Text style={styles.logoText}>MEDICARE</Text>

              <Text style={styles.logoSubText}>Medicine Shop Management</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.headerLoginButton}
            onPress={openLogin}
          >
            <Text style={styles.headerLoginText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSmallText}>
              MEDICINE SHOP MANAGEMENT SYSTEM
            </Text>

            <Text style={styles.heroTitle}>
              Manage Your Medicine Shop With Ease
            </Text>

            <Text style={styles.heroDescription}>
              Manage medicines, stock, customers, suppliers, orders and billing
              from one secure system.
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={openLogin}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>

          {/* MEDICINE ILLUSTRATION */}

          <View style={styles.medicineIllustration}>
            <View style={styles.bottleShadow} />

            <View style={styles.bottle}>
              <View style={styles.bottleCap} />

              <View style={styles.bottleLabel}>
                <Text style={styles.bottleTitle}>MED</Text>

                <Text style={styles.bottleText}>CARE</Text>
              </View>
            </View>

            <View style={styles.capsule}>
              <View style={styles.capsuleTop} />
              <View style={styles.capsuleBottom} />
            </View>

            <View style={styles.tablet}>
              <View style={styles.tabletLine} />
            </View>
          </View>
        </View>

        {/* =================================================
            SERVICES
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionSmallTitle}>OUR SYSTEM</Text>

          <Text style={styles.sectionTitle}>
            Everything You Need in One Place
          </Text>

          <Text style={styles.sectionDescription}>
            A centralized system to manage the complete medicine shop workflow.
          </Text>

          <View style={styles.serviceGrid}>
            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>Medicine Management</Text>

              <Text style={styles.serviceText}>
                Manage medicines, categories, batches and expiry dates.
              </Text>
            </View>

            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>Stock Management</Text>

              <Text style={styles.serviceText}>
                Monitor stock levels and identify low-stock medicines.
              </Text>
            </View>

            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>Orders & Billing</Text>

              <Text style={styles.serviceText}>
                Manage purchase orders, invoices, payments and returns.
              </Text>
            </View>

            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>Reports</Text>

              <Text style={styles.serviceText}>
                View sales, purchases, stock and business reports.
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            CTA
        ================================================= */}

        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>

          <Text style={styles.ctaText}>
            Login to access your Medicine Shop Management System.
          </Text>

          <TouchableOpacity style={styles.ctaButton} onPress={openLogin}>
            <Text style={styles.ctaButtonText}>Login to System</Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>MEDICARE</Text>

          <Text style={styles.footerText}>Secure • Simple • Reliable</Text>

          <Text style={styles.copyright}>
            © 2026 MEDICARE. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* =================================================
          LOGIN / PASSWORD RECOVERY MODAL
      ================================================= */}

      <Modal
        visible={showLogin}
        transparent
        animationType="fade"
        onRequestClose={closeLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loginCard}>
            {/* CLOSE BUTTON */}

            <TouchableOpacity style={styles.closeButton} onPress={closeLogin}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            {/* LOGIN CONTENT SCROLL */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.loginScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* =================================================
                  LOGIN
              ================================================= */}

              {loginStep === "login" && (
                <>
                  <View style={styles.loginLogo}>
                    <View style={styles.loginCrossVertical} />
                    <View style={styles.loginCrossHorizontal} />
                  </View>

                  <Text style={styles.loginTitle}>Welcome Back</Text>

                  <Text style={styles.loginSubtitle}>
                    Login to your Medicine Shop account
                  </Text>

                  <Text style={styles.inputLabel}>Email Address</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#8AA0A7"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Text style={styles.inputLabel}>Password</Text>

                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#8AA0A7"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />

                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.eyeText}>👁</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={openForgotPassword}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                  >
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>

                  <Text style={styles.securityText}>
                    🔒 Your login information is securely protected.
                  </Text>
                </>
              )}

              {/* =================================================
                  FORGOT PASSWORD
              ================================================= */}

              {loginStep === "forgot" && (
                <>
                  <View style={styles.stepIcon}>
                    <Text style={styles.stepIconText}>🔐</Text>
                  </View>

                  <Text style={styles.loginTitle}>Forgot Password?</Text>

                  <Text style={styles.loginSubtitle}>
                    Enter your registered email and we'll help you securely
                    reset your password.
                  </Text>

                  <Text style={styles.inputLabel}>Registered Email</Text>

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
                    style={styles.loginButton}
                    onPress={sendOTP}
                  >
                    <Text style={styles.loginButtonText}>Send OTP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={styles.backText}>← Back to Sign In</Text>
                  </TouchableOpacity>

                  <View style={styles.securityBox}>
                    <Text style={styles.securityTitle}>
                      🔒 Secure Password Recovery
                    </Text>

                    <Text style={styles.securityText}>
                      Verification is required before changing your password.
                    </Text>
                  </View>
                </>
              )}

              {/* =================================================
                  OTP
              ================================================= */}

              {loginStep === "otp" && (
                <>
                  <View style={styles.stepIcon}>
                    <Text style={styles.stepIconText}>✉</Text>
                  </View>

                  <Text style={styles.loginTitle}>Verify Your Email</Text>

                  <Text style={styles.loginSubtitle}>
                    Enter the 6-digit verification code sent to your registered
                    email.
                  </Text>

                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpRefs.current[index] = ref;
                        }}
                        style={[
                          styles.otpInput,
                          digit ? styles.otpFilled : null,
                        ]}
                        value={digit}
                        onChangeText={(value) => handleOTPChange(value, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                      />
                    ))}
                  </View>

                  <Text style={styles.timer}>
                    {seconds > 0 ? (
                      <>
                        Code expires in{" "}
                        <Text style={styles.timerBold}>
                          {Math.floor(seconds / 60)}:
                          {String(seconds % 60).padStart(2, "0")}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.timerExpired}>
                        OTP expired. Please resend OTP.
                      </Text>
                    )}
                  </Text>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={verifyOTP}
                  >
                    <Text style={styles.loginButtonText}>Verify OTP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={resendOTP}
                  >
                    <Text style={styles.resendText}>
                      Didn't receive the code? Resend OTP
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={styles.backText}>← Back</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* =================================================
                  RESET PASSWORD
              ================================================= */}

              {loginStep === "reset" && (
                <>
                  {/* 3D PASSWORD ICON */}

                  <View style={styles.passwordIconWrapper}>
                    <View style={styles.passwordIconShadow} />

                    <View style={styles.passwordIcon}>
                      <View style={styles.lockShackle} />

                      <View style={styles.lockBody}>
                        <View style={styles.lockKeyhole} />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.loginTitle}>Create New Password</Text>

                  <Text style={styles.loginSubtitle}>
                    Create a strong password to keep your Medicine Shop account
                    secure.
                  </Text>

                  {/* NEW PASSWORD */}

                  <Text style={styles.inputLabel}>New Password</Text>

                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter new password"
                      placeholderTextColor="#8AA0A7"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                    />

                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Text style={styles.eyeText}>👁</Text>
                    </TouchableOpacity>
                  </View>

                  {/* PASSWORD REQUIREMENTS */}

                  {newPassword.length > 0 &&
                    !(
                      newPassword.length >= 8 &&
                      /[A-Z]/.test(newPassword) &&
                      /[a-z]/.test(newPassword) &&
                      /[0-9]/.test(newPassword)
                    ) && (
                      <View style={styles.passwordRequirements}>
                        <View style={styles.requirementsHeader}>
                          <View style={styles.requirementsDot} />

                          <Text style={styles.requirementsTitle}>
                            Password requirements
                          </Text>
                        </View>

                        <Text style={styles.requirementText}>
                          • At least 8 characters
                        </Text>

                        <Text style={styles.requirementText}>
                          • One uppercase letter
                        </Text>

                        <Text style={styles.requirementText}>
                          • One lowercase letter
                        </Text>

                        <Text style={styles.requirementText}>• One number</Text>
                      </View>
                    )}

                  {/* CONFIRM PASSWORD */}

                  <Text style={styles.inputLabel}>Confirm New Password</Text>

                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Confirm new password"
                      placeholderTextColor="#8AA0A7"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                    />

                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Text style={styles.eyeText}>👁</Text>
                    </TouchableOpacity>
                  </View>

                  {/* PASSWORD MISMATCH MESSAGE */}

                  {confirmPassword.length > 0 &&
                    confirmPassword !== newPassword && (
                      <Text style={styles.passwordMismatchText}>
                        Passwords do not match
                      </Text>
                    )}

                  {/* CREATE PASSWORD BUTTON */}

                  <TouchableOpacity
                    style={styles.createPasswordButton}
                    onPress={resetPassword}
                  >
                    <View style={styles.button3DLayer} />

                    <Text style={styles.createPasswordText}>
                      Create New Password
                    </Text>

                    <Text style={styles.buttonArrow}>→</Text>
                  </TouchableOpacity>

                  {/* BACK */}

                  <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={styles.backText}>← Back to Verification</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {loginStep === "success" && (
                <>
                  <View style={styles.successCircle}>
                    <Text style={styles.successCheck}>✓</Text>
                  </View>

                  <Text style={styles.loginTitle}>Password Changed</Text>

                  <Text style={styles.loginSubtitle}>
                    Your password has been successfully updated.
                  </Text>

                  <Text style={styles.successDescription}>
                    You can now sign in securely using your new password.
                  </Text>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                      setLoginStep("login");
                      setNewPassword("");
                      setConfirmPassword("");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                  >
                    <Text style={styles.loginButtonText}>Back to Login</Text>
                  </TouchableOpacity>

                  <Text style={styles.securityText}>
                    🔒 Your account is now protected with your new password.
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     MAIN CONTAINER
  ======================================================= */

  container: {
    flex: 1,
    backgroundColor: "#F5F9FA",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    height: 82,
    backgroundColor: "#083C4A",
    paddingHorizontal: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerScrolled: {
    height: 70,
    paddingHorizontal: 30,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  brandContainer: {
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },

  logoSubText: {
    color: "#B7D7DE",
    fontSize: 9,
    marginTop: 2,
  },

  headerLoginButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
  },

  headerLoginText: {
    color: "#0D5367",
    fontSize: 14,
    fontWeight: "700",
  },

  /* =======================================================
     HERO
  ======================================================= */

  hero: {
    backgroundColor: "#083C4A",
    paddingHorizontal: 35,
    paddingTop: 55,
    paddingBottom: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroContent: {
    width: "55%",
  },

  heroSmallText: {
    color: "#72C5D3",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 14,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "800",
  },

  heroDescription: {
    color: "#C7DDE2",
    fontSize: 15,
    lineHeight: 24,
    marginTop: 18,
    maxWidth: 500,
  },

  primaryButton: {
    backgroundColor: "#0A829A",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignSelf: "flex-start",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* =======================================================
     MEDICINE ILLUSTRATION
  ======================================================= */

  medicineIllustration: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  bottleShadow: {
    position: "absolute",
    bottom: 30,
    width: 170,
    height: 28,
    borderRadius: 50,
    backgroundColor: "#062F3A",
  },

  bottle: {
    width: 125,
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    position: "absolute",
    bottom: 45,
    alignItems: "center",
  },

  bottleCap: {
    width: 90,
    height: 25,
    backgroundColor: "#0A829A",
    borderRadius: 7,
    position: "absolute",
    top: -18,
  },

  bottleLabel: {
    width: 100,
    height: 85,
    backgroundColor: "#EAF6F8",
    marginTop: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  bottleTitle: {
    color: "#0D5367",
    fontSize: 19,
    fontWeight: "900",
  },

  bottleText: {
    color: "#0D5367",
    fontSize: 10,
    fontWeight: "700",
  },

  capsule: {
    width: 85,
    height: 38,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    right: 10,
    bottom: 45,
    transform: [{ rotate: "-25deg" }],
    overflow: "hidden",
    flexDirection: "row",
  },

  capsuleTop: {
    flex: 1,
    backgroundColor: "#72C5D3",
  },

  capsuleBottom: {
    flex: 1,
    backgroundColor: "#EAF6F8",
  },

  tablet: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: "#72C5D3",
    position: "absolute",
    left: 25,
    bottom: 45,
  },

  tabletLine: {
    width: 30,
    height: 2,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 20,
    left: 6,
  },

  /* =======================================================
     SERVICES
  ======================================================= */

  section: {
    paddingHorizontal: 35,
    paddingVertical: 60,
  },

  sectionSmallTitle: {
    color: "#0A829A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  sectionTitle: {
    color: "#153B47",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },

  sectionDescription: {
    color: "#70868D",
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 30,
  },

  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  serviceCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  serviceTitle: {
    color: "#153B47",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  serviceText: {
    color: "#70868D",
    fontSize: 13,
    lineHeight: 20,
  },

  /* =======================================================
     CTA
  ======================================================= */

  cta: {
    backgroundColor: "#EAF6F8",
    marginHorizontal: 35,
    marginBottom: 50,
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
  },

  ctaTitle: {
    color: "#153B47",
    fontSize: 28,
    fontWeight: "800",
  },

  ctaText: {
    color: "#70868D",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },

  ctaButton: {
    backgroundColor: "#0D5367",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 22,
  },

  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    backgroundColor: "#083C4A",
    paddingVertical: 35,
    alignItems: "center",
  },

  footerBrand: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },

  footerText: {
    color: "#B7D7DE",
    fontSize: 12,
    marginTop: 8,
  },

  copyright: {
    color: "#7FA7B0",
    fontSize: 11,
    marginTop: 15,
  },

  /* =======================================================
     MODAL
  ======================================================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(4, 35, 43, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loginCard: {
    width: "100%",
    maxWidth: 450,
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
    position: "relative",
  },

  loginScrollContent: {
    paddingTop: 5,
    paddingBottom: 10,
  },

  closeButton: {
    position: "absolute",
    right: 18,
    top: 15,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F6F7",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closeText: {
    color: "#153B47",
    fontSize: 25,
    lineHeight: 28,
  },

  /* =======================================================
     LOGIN LOGO
  ======================================================= */

  loginLogo: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#EAF6F8",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  loginCrossVertical: {
    position: "absolute",
    width: 10,
    height: 29,
    backgroundColor: "#0D5367",
    borderRadius: 2,
  },

  loginCrossHorizontal: {
    position: "absolute",
    width: 29,
    height: 10,
    backgroundColor: "#0D5367",
    borderRadius: 2,
  },

  loginTitle: {
    color: "#153B47",
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
  },

  loginSubtitle: {
    color: "#70868D",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 25,
  },

  /* =======================================================
     INPUT
  ======================================================= */

  inputLabel: {
    color: "#153B47",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D7E5E8",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#153B47",
    backgroundColor: "#FAFCFC",
    marginBottom: 16,
  },

  /* =======================================================
     PASSWORD INPUT
  ======================================================= */

  passwordInputWrapper: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D7E5E8",
    borderRadius: 10,
    backgroundColor: "#FAFCFC",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
    paddingRight: 12,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    color: "#153B47",
    fontSize: 14,
  },

  eyeButton: {
    width: 45,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  eyeText: {
    fontSize: 20,
    color: "#0D5367",
  },

  passwordMismatchText: {
    color: "#D64545",
    fontSize: 12,
    fontWeight: "600",
    marginTop: -9,
    marginLeft: 2,
    marginBottom: 12,
  },

  /* =======================================================
     FORGOT PASSWORD
  ======================================================= */

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -3,
    marginBottom: 20,
  },

  forgotText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  /* =======================================================
     LOGIN BUTTON
  ======================================================= */

  loginButton: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#0D5367",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  /* =======================================================
     SECURITY
  ======================================================= */

  securityText: {
    color: "#8AA0A7",
    fontSize: 11,
    textAlign: "center",
    marginTop: 18,
    lineHeight: 17,
  },

  securityBox: {
    backgroundColor: "#F5F9FA",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },

  securityTitle: {
    color: "#153B47",
    fontSize: 12,
    fontWeight: "800",
  },

  /* =======================================================
     STEP ICON
  ======================================================= */

  stepIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#EAF6F8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  stepIconText: {
    fontSize: 27,
  },

  /* =======================================================
     BACK
  ======================================================= */

  backButton: {
    alignItems: "center",
    marginTop: 18,
  },

  backText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  /* =======================================================
     OTP
  ======================================================= */

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  otpInput: {
    width: 45,
    height: 52,
    borderWidth: 1,
    borderColor: "#D7E5E8",
    borderRadius: 10,
    backgroundColor: "#FAFCFC",
    color: "#153B47",
    fontSize: 21,
    fontWeight: "700",
  },

  otpFilled: {
    borderColor: "#0A829A",
    backgroundColor: "#EAF6F8",
  },

  timer: {
    textAlign: "center",
    color: "#70868D",
    fontSize: 12,
    marginTop: 18,
  },

  timerBold: {
    color: "#0D5367",
    fontWeight: "800",
  },

  timerExpired: {
    color: "#D64545",
    fontSize: 13,
    fontWeight: "700",
  },

  resendButton: {
    alignItems: "center",
    marginTop: 16,
  },

  resendText: {
    color: "#0A829A",
    fontSize: 12,
    fontWeight: "700",
  },

  /* =======================================================
     SUCCESS
  ======================================================= */

  successCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#EAF6F8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  successCheck: {
    color: "#0D5367",
    fontSize: 42,
    fontWeight: "800",
  },

  successDescription: {
    color: "#70868D",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 10,
  },

  /* =======================================================
     3D PASSWORD ICON
  ======================================================= */

  passwordIconWrapper: {
    width: 82,
    height: 82,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    position: "relative",
  },

  passwordIconShadow: {
    position: "absolute",
    width: 62,
    height: 18,
    borderRadius: 30,
    backgroundColor: "#C9DDE1",
    bottom: 4,
    transform: [
      {
        scaleX: 1.1,
      },
    ],
  },

  passwordIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#0D5367",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
    elevation: 8,
    shadowColor: "#083C4A",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  lockShackle: {
    position: "absolute",
    width: 25,
    height: 25,
    borderWidth: 6,
    borderColor: "#72C5D3",
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    top: 8,
  },

  lockBody: {
    width: 34,
    height: 27,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  lockKeyhole: {
    width: 7,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0D5367",
  },

  /* =======================================================
     PASSWORD REQUIREMENTS
  ======================================================= */

  passwordRequirements: {
    backgroundColor: "#F5F9FA",
    borderWidth: 1,
    borderColor: "#E1ECEE",
    borderRadius: 14,
    padding: 14,
    marginTop: 2,
    marginBottom: 17,
    shadowColor: "#0D5367",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  requirementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  requirementsDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#0A829A",
    marginRight: 8,
  },

  requirementsTitle: {
    color: "#153B47",
    fontSize: 12,
    fontWeight: "800",
  },

  requirementText: {
    fontSize: 12,
    color: "#8AA0A7",
    marginTop: 7,
    fontWeight: "500",
  },

  /* =======================================================
     CREATE PASSWORD BUTTON
  ======================================================= */

  createPasswordButton: {
    height: 53,
    borderRadius: 11,
    backgroundColor: "#0D5367",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#083C4A",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  button3DLayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#062F3A",
  },

  createPasswordText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  buttonArrow: {
    color: "#72C5D3",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
});
