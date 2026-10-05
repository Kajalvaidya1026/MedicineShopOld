import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

/* ============================================================
   LOGIN TYPES
============================================================ */

type LoginStep =
  | "login"
  | "forgot"
  | "otp"
  | "reset"
  | "success";

/* ============================================================
   HERO IMAGES
============================================================ */

const heroImages = [
  require("../../assets/images/pharmacy-3.png"),
  require("../../assets/images/pharmacy-1.png"),
];

/* ============================================================
   BOTTOM STATS DATA
============================================================ */

const STATS_DATA = [
  {
    number: "01",
    title: "Medicines",
    subtitle: "Verified Database",
    badge: "50,000+",
  },
  {
    number: "02",
    title: "Inventory",
    subtitle: "Real-Time Stock",
    badge: "Auto-Track",
  },
  {
    number: "03",
    title: "Orders",
    subtitle: "Fast Processing",
    badge: "Instant POS",
  },
  {
    number: "04",
    title: "Reports",
    subtitle: "Smart Analytics",
    badge: "AI Powered",
  },
];

/* ============================================================
   HOME SCREEN COMPONENT
============================================================ */

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 420;

  /* ==========================================================
     HERO IMAGE CAROUSEL ANIMATION
  ========================================================== */

  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const [imageOpacity] = useState(() => new Animated.Value(1));
  const [imageTranslate] = useState(() => new Animated.Value(0));

  const switchImage = useCallback(
    (targetIndex: number) => {
      if (targetIndex === heroImageIndex) return;

      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(imageTranslate, {
          toValue: 15,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHeroImageIndex(targetIndex);
        imageTranslate.setValue(-15);

        Animated.parallel([
          Animated.timing(imageOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(imageTranslate, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [heroImageIndex, imageOpacity, imageTranslate]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex =
        heroImageIndex === heroImages.length - 1 ? 0 : heroImageIndex + 1;
      switchImage(nextIndex);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroImageIndex, switchImage]);

  /* ==========================================================
     ENTRANCE & FLOATING ANIMATIONS
  ========================================================== */

  const [heroFadeAnim] = useState(() => new Animated.Value(0));
  const [heroSlideAnim] = useState(() => new Animated.Value(24));
  const [statsFadeAnim] = useState(() => new Animated.Value(0));
  const [statsSlideAnim] = useState(() => new Animated.Value(20));
  const [floatAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.stagger(180, [
      Animated.parallel([
        Animated.timing(heroFadeAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(heroSlideAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(statsFadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(statsSlideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    return () => floatLoop.stop();
  }, [heroFadeAnim, heroSlideAnim, statsFadeAnim, statsSlideAnim, floatAnim]);

  /* ==========================================================
     LOGIN STATES
  ========================================================== */

  const [showLogin, setShowLogin] = useState(false);
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

  /* ==========================================================
     OTP TIMER
  ========================================================== */

  useEffect(() => {
    if (loginStep !== "otp" || seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loginStep, seconds]);

  /* ==========================================================
     OPEN / CLOSE LOGIN
  ========================================================== */

  const openLogin = () => {
    setLoginStep("login");
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setLoginStep("login");
    setEmail("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setSeconds(300);
  };

  /* ==========================================================
     EMAIL VALIDATION
  ========================================================== */

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ==========================================================
     LOGIN HANDLER
  ========================================================== */

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter your password.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    Alert.alert(
      "Login",
      "Backend authentication will be connected here."
    );
  };

  /* ==========================================================
     FORGOT PASSWORD HANDLER
  ========================================================== */

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your registered email.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setSeconds(300);
    setOtp(["", "", "", "", "", ""]);
    setLoginStep("otp");
  };

  /* ==========================================================
     OTP INPUT HANDLERS
  ========================================================== */

  const handleOtpChange = (value: string, index: number) => {
    const onlyNumber = value.replace(/[^0-9]/g, "");
    const updatedOtp = [...otp];
    updatedOtp[index] = onlyNumber.slice(-1);
    setOtp(updatedOtp);

    if (onlyNumber && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit OTP.");
      return;
    }

    setLoginStep("reset");
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setSeconds(300);
    Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
  };

  /* ==========================================================
     PASSWORD VALIDATION
  ========================================================== */

  const hasEightCharacters = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const passwordValid =
    hasEightCharacters &&
    hasUppercase &&
    hasLowercase &&
    hasNumber;

  const resetPassword = () => {
    if (!newPassword) {
      Alert.alert("Password Required", "Please enter a new password.");
      return;
    }

    if (!passwordValid) {
      Alert.alert("Invalid Password", "Please meet all password requirements.");
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Confirm Password", "Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "New password and confirm password must match.");
      return;
    }

    setLoginStep("success");
  };

  /* ==========================================================
     TIME FORMAT
  ========================================================== */

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;

  /* ==========================================================
     PASSWORD REQUIREMENTS HELPER
  ========================================================== */

  const renderPasswordRequirements = () => {
    if (!newPassword) {
      return null;
    }

    return (
      <View style={styles.requirementsBox}>
        <Text style={styles.requirementsTitle}>Password must contain:</Text>

        <View style={styles.requirementRow}>
          <Text style={[styles.requirementIcon, hasEightCharacters && styles.requirementPassed]}>
            {hasEightCharacters ? "✓" : "•"}
          </Text>
          <Text style={[styles.requirementText, hasEightCharacters && styles.requirementPassedText]}>
            At least 8 characters
          </Text>
        </View>

        <View style={styles.requirementRow}>
          <Text style={[styles.requirementIcon, hasUppercase && styles.requirementPassed]}>
            {hasUppercase ? "✓" : "•"}
          </Text>
          <Text style={[styles.requirementText, hasUppercase && styles.requirementPassedText]}>
            One uppercase letter (A-Z)
          </Text>
        </View>

        <View style={styles.requirementRow}>
          <Text style={[styles.requirementIcon, hasLowercase && styles.requirementPassed]}>
            {hasLowercase ? "✓" : "•"}
          </Text>
          <Text style={[styles.requirementText, hasLowercase && styles.requirementPassedText]}>
            One lowercase letter (a-z)
          </Text>
        </View>

        <View style={styles.requirementRow}>
          <Text style={[styles.requirementIcon, hasNumber && styles.requirementPassed]}>
            {hasNumber ? "✓" : "•"}
          </Text>
          <Text style={[styles.requirementText, hasNumber && styles.requirementPassedText]}>
            One number (0-9)
          </Text>
        </View>
      </View>
    );
  };

  /* ==========================================================
     LOGIN MODAL RENDER HELPER
  ========================================================== */

  const renderLoginModal = () => {
    return (
      <Modal
        visible={showLogin}
        transparent
        animationType="fade"
        onRequestClose={closeLogin}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.loginCard, isMobile && styles.loginCardMobile]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* CLOSE BUTTON */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeLogin}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {/* =================================================
                  STEP: LOGIN
              ================================================= */}
              {loginStep === "login" && (
                <View>
                  <View style={styles.modalLogo}>
                    <View style={styles.modalCrossVertical} />
                    <View style={styles.modalCrossHorizontal} />
                  </View>

                  <Text style={styles.modalTitle}>Welcome Back</Text>
                  <Text style={styles.modalSubtitle}>
                    Sign in to continue to MEDICARE
                  </Text>

                  {/* EMAIL */}
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#9AAEB4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />

                  {/* PASSWORD */}
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#9AAEB4"
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eyeText}>
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* FORGOT PASSWORD LINK */}
                  <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={() => setLoginStep("forgot")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* SUBMIT BUTTON */}
                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={handleLogin}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryButtonText}>Sign In</Text>
                  </TouchableOpacity>

                  <Text style={styles.securityText}>
                    🔒 Secure access • Role-based authentication
                  </Text>
                </View>
              )}

              {/* =================================================
                  STEP: FORGOT PASSWORD
              ================================================= */}
              {loginStep === "forgot" && (
                <View>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepCircleText}>1</Text>
                  </View>

                  <Text style={styles.modalTitle}>Forgot Password?</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter your registered email and we will send a 6-digit OTP.
                  </Text>

                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#9AAEB4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={handleForgotPassword}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryButtonText}>Send OTP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setLoginStep("login")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backButtonText}>← Back to Login</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* =================================================
                  STEP: OTP
              ================================================= */}
              {loginStep === "otp" && (
                <View>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepCircleText}>2</Text>
                  </View>

                  <Text style={styles.modalTitle}>Verify OTP</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter the 6-digit code sent to
                  </Text>
                  <Text style={styles.otpEmail}>{email}</Text>

                  {/* OTP BOXES */}
                  <View style={styles.otpContainer}>
                    {otp.map((value, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpRefs.current[index] = ref;
                        }}
                        value={value}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(event) => handleOtpKeyPress(event, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        style={[
                          styles.otpInput,
                          value ? styles.otpInputActive : null,
                        ]}
                      />
                    ))}
                  </View>

                  {/* TIMER */}
                  <Text style={styles.timerText}>
                    {seconds > 0
                      ? `OTP expires in ${formattedTime}`
                      : "OTP expired"}
                  </Text>

                  {/* VERIFY BUTTON */}
                  <TouchableOpacity
                    style={[
                      styles.modalPrimaryButton,
                      seconds <= 0 && styles.disabledButton,
                    ]}
                    onPress={verifyOtp}
                    disabled={seconds <= 0}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryButtonText}>Verify OTP</Text>
                  </TouchableOpacity>

                  {/* RESEND */}
                  <TouchableOpacity
                    onPress={resendOtp}
                    disabled={seconds > 0}
                    style={styles.resendButton}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.resendText,
                        seconds > 0 && styles.resendDisabled,
                      ]}
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setLoginStep("forgot")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backButtonText}>← Change Email</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* =================================================
                  STEP: RESET PASSWORD
              ================================================= */}
              {loginStep === "reset" && (
                <View>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepCircleText}>3</Text>
                  </View>

                  <Text style={styles.modalTitle}>Create New Password</Text>
                  <Text style={styles.modalSubtitle}>
                    Create a strong password for your MEDICARE account.
                  </Text>

                  {/* NEW PASSWORD */}
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      placeholderTextColor="#9AAEB4"
                      secureTextEntry={!showNewPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eyeText}>
                        {showNewPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {renderPasswordRequirements()}

                  {/* CONFIRM PASSWORD */}
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9AAEB4"
                      secureTextEntry={!showConfirmPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eyeText}>
                        {showConfirmPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {confirmPassword && newPassword !== confirmPassword && (
                    <Text style={styles.passwordMismatch}>
                      Passwords do not match.
                    </Text>
                  )}

                  {/* RESET BUTTON */}
                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={resetPassword}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryButtonText}>
                      Update Password
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setLoginStep("login")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backButtonText}>← Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* =================================================
                  STEP: SUCCESS
              ================================================= */}
              {loginStep === "success" && (
                <View style={styles.successContainer}>
                  <View style={styles.successCircle}>
                    <Text style={styles.successSymbol}>✓</Text>
                  </View>

                  <Text style={styles.modalTitle}>Password Updated</Text>
                  <Text style={styles.modalSubtitle}>
                    Your password has been changed successfully. You can now log in with your new credentials.
                  </Text>

                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={() => setLoginStep("login")}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalPrimaryButtonText}>
                      Continue to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ==========================================================
     HERO HEIGHT CALCULATION
  ========================================================== */

  const heroMinHeight = isMobile
    ? Math.max(540, height * 0.72)
    : Math.max(680, height * 0.82);

  /* ==========================================================
     MAIN WEBSITE RETURN
  ========================================================== */

  return (
    <>
      {/* 1. HIDE EXPO ROUTER HEADER TO REMOVE TOP 'INDEX' TEXT */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.fullScreen}>
        {/* =====================================================
            HEADER / NAVBAR
        ===================================================== */}
        <View
          style={[
            styles.navbar,
            isMobile && styles.navbarMobile,
            isSmallMobile && styles.navbarSmallMobile,
          ]}
        >
          <View style={styles.navbarInner}>
            {/* BRAND / LOGO */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.brand}
              onPress={() => {}}
            >
              <View style={styles.logoBadge}>
                <LinearGradient
                  colors={["#0EA5B7", "#083344"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoBadgeGradient}
                >
                  <Ionicons name="medkit" size={20} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <View style={styles.brandTextWrapper}>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandTitle}>MEDICARE</Text>
                  <View style={styles.brandDot} />
                </View>
                <Text style={styles.brandSubTitle}>SMART PHARMACY OS</Text>
              </View>
            </TouchableOpacity>

            {/* DESKTOP NAVIGATION LINKS */}
            {!isMobile && (
              <View style={styles.navigation}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.navItemActive}
                >
                  <View style={styles.activeNavDot} />
                  <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.navItem}>
                  <Text style={styles.navText}>Solutions</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.navItem}>
                  <Text style={styles.navText}>Inventory</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.navItem}>
                  <Text style={styles.navText}>About</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.navItem}>
                  <Text style={styles.navText}>Contact</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* NAVBAR ACTION BUTTON */}
            <TouchableOpacity
              style={styles.navbarLoginBtn}
              onPress={openLogin}
              activeOpacity={0.85}
            >
              <Ionicons
                name="person-outline"
                size={15}
                color="#38BDF8"
                style={styles.loginBtnIcon}
              />
              <Text style={styles.navbarLoginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* =====================================================
            SCROLLABLE LANDING PAGE CONTENT
        ===================================================== */}
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ===================================================
              HERO SECTION
          =================================================== */}
          <View
            style={[
              styles.hero,
              { minHeight: heroMinHeight },
              isMobile && styles.heroMobile,
            ]}
          >
            {/* HERO BACKGROUND IMAGE */}
            <Animated.Image
              source={heroImages[heroImageIndex]}
              resizeMode="cover"
              style={[
                styles.heroBackgroundImage,
                Platform.OS === "web" &&
                  ({
                    objectPosition: isMobile ? "center center" : "75% center",
                  } as any),
                {
                  opacity: imageOpacity,
                  transform: [{ translateX: imageTranslate }],
                },
              ]}
            />

            {/* HORIZONTAL GRADIENT: DARK TEAL ON LEFT FOR TEXT READABILITY, CLEAR ON PHARMACIST */}
            <LinearGradient
              colors={
                isMobile
                  ? [
                      "rgba(5, 22, 29, 0.96)",
                      "rgba(5, 22, 29, 0.88)",
                      "rgba(5, 22, 29, 0.72)",
                    ]
                  : [
                      "rgba(4, 20, 26, 0.98)",
                      "rgba(5, 24, 32, 0.92)",
                      "rgba(7, 30, 38, 0.76)",
                      "rgba(7, 30, 38, 0.35)",
                      "rgba(7, 30, 38, 0.18)",
                    ]
              }
              locations={isMobile ? [0, 0.45, 1] : [0, 0.38, 0.58, 0.82, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />

            {/* VERTICAL GRADIENT: SEAMLESS VIGNETTE AND BOTTOM BLEND */}
            <LinearGradient
              colors={[
                "rgba(4, 20, 26, 0.5)",
                "transparent",
                "rgba(7, 30, 38, 0.85)",
                "#071E26",
              ]}
              locations={[0, 0.3, 0.82, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* HERO MAIN CONTENT WRAPPER */}
            <View style={styles.heroInnerContainer}>
              <Animated.View
                style={[
                  styles.heroContent,
                  isMobile && styles.heroContentMobile,
                  {
                    opacity: heroFadeAnim,
                    transform: [{ translateY: heroSlideAnim }],
                  },
                ]}
              >
                {/* FLOATING BADGE CHIP */}
                <Animated.View
                  style={[
                    styles.badgeChip,
                    {
                      transform: [{ translateY: floatAnim }],
                    },
                  ]}
                >
                  <View style={styles.badgePulseOuter}>
                    <View style={styles.badgePulseInner} />
                  </View>
                  <Text style={styles.badgeText}>
                    SMART PHARMACY MANAGEMENT PLATFORM
                  </Text>
                </Animated.View>

                {/* MAIN HERO HEADLINE */}
                <Text
                  style={[
                    styles.heroTitle,
                    isMobile && styles.heroTitleMobile,
                    isSmallMobile && styles.heroTitleSmallMobile,
                  ]}
                >
                  Next-Gen Medicine{"\n"}
                  <Text style={styles.heroTitleAccent}>
                    Shop Management
                  </Text>
                </Text>

                {/* HERO DESCRIPTION */}
                <Text
                  style={[
                    styles.heroDescription,
                    isMobile && styles.heroDescriptionMobile,
                  ]}
                >
                  Streamline medicine billing, verified inventory tracking, expiry
                  monitoring, and real-time pharmacy operations with intelligent
                  precision.
                </Text>

                {/* CTA BUTTONS ROW */}
                <View
                  style={[
                    styles.buttonRow,
                    isMobile && styles.buttonRowMobile,
                  ]}
                >
                  {/* PROMINENT PRIMARY CTA */}
                  <TouchableOpacity
                    style={styles.primaryCtaTouchable}
                    onPress={openLogin}
                    activeOpacity={0.88}
                  >
                    <LinearGradient
                      colors={["#00B4D8", "#0EA5E9", "#0284C7"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.primaryCtaGradient}
                    >
                      <Text style={styles.primaryCtaText}>Get Started</Text>
                      <View style={styles.ctaArrowCircle}>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="#FFFFFF"
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* PROMINENT SECONDARY CTA */}
                  <TouchableOpacity
                    style={styles.secondaryCtaButton}
                    onPress={openLogin}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="play-circle-outline"
                      size={18}
                      color="#38BDF8"
                      style={styles.secondaryCtaIcon}
                    />
                    <Text style={styles.secondaryCtaText}>Live Demo</Text>
                  </TouchableOpacity>
                </View>

                {/* REFINED INTERACTIVE CAROUSEL INDICATORS */}
                <View style={styles.carouselBar}>
                  <Text style={styles.carouselLabel}>VIEW:</Text>
                  <View style={styles.carouselIndicators}>
                    {heroImages.map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => switchImage(index)}
                        activeOpacity={0.7}
                        style={styles.indicatorHitArea}
                      >
                        <View
                          style={[
                            styles.dot,
                            index === heroImageIndex
                              ? styles.activeDot
                              : styles.inactiveDot,
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.carouselCounter}>
                    0{heroImageIndex + 1} / 0{heroImages.length}
                  </Text>
                </View>
              </Animated.View>

              {/* DESKTOP PHARMACIST HIGHLIGHT FLOATING CARD */}
              {!isMobile && (
                <Animated.View
                  style={[
                    styles.floatingPharmacistBadge,
                    {
                      transform: [
                        {
                          translateY: Animated.multiply(floatAnim, -1),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.floatingBadgeIcon}>
                    <Ionicons
                      name="shield-checkmark"
                      size={22}
                      color="#38BDF8"
                    />
                  </View>
                  <View>
                    <Text style={styles.floatingBadgeTitle}>
                      Verified Dispensing
                    </Text>
                    <Text style={styles.floatingBadgeSubtitle}>
                      Pharmacist Oversight • FDA Compliant
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </View>

          {/* ===================================================
              4 STATISTICS SECTION (BELOW HERO CONTENT - NO OVERLAP)
          =================================================== */}
          <Animated.View
            style={[
              styles.statsSection,
              {
                opacity: statsFadeAnim,
                transform: [{ translateY: statsSlideAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.statsGrid,
                isMobile && styles.statsGridMobile,
              ]}
            >
              {STATS_DATA.map((item, index) => (
                <View
                  key={item.number}
                  style={[
                    styles.statCard,
                    isMobile && styles.statCardMobile,
                  ]}
                >
                  <View style={styles.statHeaderRow}>
                    <View style={styles.statNumberBadge}>
                      <Text style={styles.statNumberText}>{item.number}</Text>
                    </View>
                    <View style={styles.statChipBadge}>
                      <Text style={styles.statChipText}>{item.badge}</Text>
                    </View>
                  </View>

                  <Text style={styles.statTitle}>{item.title}</Text>
                  <Text style={styles.statSubtitle}>{item.subtitle}</Text>

                  {/* SUBTLE CARD ACCENT LINE */}
                  <View style={styles.statAccentLine} />
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ===================================================
              FOOTER BRAND STRIP
          =================================================== */}
          <View style={styles.footerStrip}>
            <Text style={styles.footerText}>
              MEDICARE SMART PHARMACY PLATFORM • ALL RIGHTS RESERVED
            </Text>
          </View>
        </ScrollView>

        {/* LOGIN MODAL */}
        {renderLoginModal()}
      </View>
    </>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  /* ==========================================================
     MAIN FULL SCREEN CONTAINER
  ========================================================== */
  fullScreen: {
    flex: 1,
    backgroundColor: "#071E26",
  },

  /* ==========================================================
     NAVBAR
  ========================================================== */
  navbar: {
    height: 74,
    backgroundColor: "rgba(7, 30, 38, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(56, 189, 248, 0.12)",
    zIndex: 30,
    justifyContent: "center",
    paddingHorizontal: 48,
  },

  navbarMobile: {
    height: 68,
    paddingHorizontal: 18,
  },

  navbarSmallMobile: {
    paddingHorizontal: 12,
  },

  navbarInner: {
    width: "100%",
    maxWidth: 1340,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    overflow: "hidden",
    marginRight: 13,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.35)",
  },

  logoBadgeGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  brandTextWrapper: {
    justifyContent: "center",
  },

  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
  },

  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#38BDF8",
    marginLeft: 4,
    marginBottom: 4,
  },

  brandSubTitle: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#38BDF8",
    letterSpacing: 1.8,
    marginTop: -1,
  },

  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  navItemActive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.25)",
  },

  activeNavDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#38BDF8",
    marginRight: 8,
  },

  navText: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 14,
    fontWeight: "600",
  },

  navTextActive: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  navbarLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: "rgba(14, 165, 233, 0.14)",
    borderWidth: 1.5,
    borderColor: "#0EA5E9",
    borderRadius: 22,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  loginBtnIcon: {
    marginRight: 7,
  },

  navbarLoginText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  /* ==========================================================
     SCROLL CONTAINER
  ========================================================== */
  mainScrollView: {
    flex: 1,
    backgroundColor: "#071E26",
  },

  mainScrollContent: {
    flexGrow: 1,
    backgroundColor: "#071E26",
  },

  /* ==========================================================
     HERO SECTION
  ========================================================== */
  hero: {
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 64,
    paddingVertical: 48,
  },

  heroMobile: {
    paddingHorizontal: 20,
    paddingVertical: 36,
  },

  heroBackgroundImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  heroInnerContainer: {
    width: "100%",
    maxWidth: 1340,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },

  heroContent: {
    width: "60%",
    maxWidth: 680,
  },

  heroContentMobile: {
    width: "100%",
    maxWidth: "100%",
  },

  badgeChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.4)",
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginBottom: 20,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  badgePulseOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(56, 189, 248, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  badgePulseInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#38BDF8",
  },

  badgeText: {
    color: "#BAE6FD",
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 54,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginBottom: 22,
  },

  heroTitleMobile: {
    fontSize: 34,
    lineHeight: 42,
    marginBottom: 16,
  },

  heroTitleSmallMobile: {
    fontSize: 29,
    lineHeight: 36,
  },

  heroTitleAccent: {
    color: "#38BDF8",
  },

  heroDescription: {
    color: "rgba(224, 242, 254, 0.9)",
    fontSize: 16.5,
    lineHeight: 28,
    maxWidth: 540,
    fontWeight: "400",
    marginBottom: 32,
  },

  heroDescriptionMobile: {
    fontSize: 14.5,
    lineHeight: 24,
    marginBottom: 24,
  },

  /* ==========================================================
     PROMINENT CTA BUTTONS
  ========================================================== */
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 36,
    flexWrap: "wrap",
  },

  buttonRowMobile: {
    gap: 12,
    marginBottom: 28,
  },

  primaryCtaTouchable: {
    borderRadius: 32,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },

  primaryCtaGradient: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },

  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  ctaArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  secondaryCtaButton: {
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.4)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  secondaryCtaIcon: {
    marginRight: 8,
  },

  secondaryCtaText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  /* ==========================================================
     CAROUSEL CONTROLS BAR
  ========================================================== */
  carouselBar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(4, 20, 26, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 10,
  },

  carouselLabel: {
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1,
  },

  carouselIndicators: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  indicatorHitArea: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  dot: {
    height: 7,
    borderRadius: 4,
  },

  activeDot: {
    width: 28,
    backgroundColor: "#38BDF8",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 2,
  },

  inactiveDot: {
    width: 9,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },

  carouselCounter: {
    color: "#BAE6FD",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginLeft: 2,
  },

  /* ==========================================================
     DESKTOP FLOATING PHARMACIST BADGE
  ========================================================== */
  floatingPharmacistBadge: {
    position: "absolute",
    right: 20,
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(7, 30, 38, 0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.3)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
    gap: 14,
  },

  floatingBadgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  floatingBadgeTitle: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  floatingBadgeSubtitle: {
    color: "#94A3B8",
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: 2,
  },

  /* ==========================================================
     4 STATISTICS SECTION (IN FLOW BELOW HERO - ZERO OVERLAP)
  ========================================================== */
  statsSection: {
    width: "100%",
    backgroundColor: "#071E26",
    paddingHorizontal: 48,
    paddingTop: 18,
    paddingBottom: 48,
  },

  statsGrid: {
    width: "100%",
    maxWidth: 1340,
    alignSelf: "center",
    flexDirection: "row",
    gap: 18,
  },

  statsGridMobile: {
    flexDirection: "column",
    gap: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: "rgba(10, 38, 48, 0.85)",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.18)",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
    position: "relative",
    overflow: "hidden",
  },

  statCardMobile: {
    padding: 16,
  },

  statHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statNumberBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(56, 189, 248, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.3)",
  },

  statNumberText: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "900",
  },

  statChipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  statChipText: {
    color: "#BAE6FD",
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  statTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: 0.2,
  },

  statSubtitle: {
    color: "rgba(224, 242, 254, 0.65)",
    fontSize: 12.5,
    fontWeight: "500",
    lineHeight: 18,
  },

  statAccentLine: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "rgba(56, 189, 248, 0.25)",
    borderRadius: 1,
  },

  /* ==========================================================
     FOOTER STRIP
  ========================================================== */
  footerStrip: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(4, 20, 26, 0.95)",
  },

  footerText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  /* ==========================================================
     LOGIN MODAL STYLES (PRESERVED AUTH FLOW)
  ========================================================== */
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(3, 14, 18, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loginCard: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 28,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 16,
    position: "relative",
  },

  loginCardMobile: {
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 20,
  },

  modalScrollContent: {
    paddingBottom: 8,
  },

  closeButton: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closeButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "800",
  },

  modalLogo: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EAF6F8",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: "#0D5367",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  modalCrossVertical: {
    position: "absolute",
    width: 9,
    height: 28,
    backgroundColor: "#0D5367",
    borderRadius: 3,
  },

  modalCrossHorizontal: {
    position: "absolute",
    width: 28,
    height: 9,
    backgroundColor: "#0D5367",
    borderRadius: 3,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },

  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  inputLabel: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    fontSize: 14,
  },

  passwordContainer: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    color: "#0F172A",
    fontSize: 14,
  },

  eyeButton: {
    paddingHorizontal: 14,
  },

  eyeText: {
    color: "#0A829A",
    fontSize: 12,
    fontWeight: "700",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 16,
  },

  forgotText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  modalPrimaryButton: {
    height: 50,
    backgroundColor: "#0D5367",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    shadowColor: "#0D5367",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  modalPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  securityText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 16,
    fontWeight: "500",
  },

  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EAF6F8",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  stepCircleText: {
    color: "#0D5367",
    fontSize: 18,
    fontWeight: "800",
  },

  backButton: {
    alignItems: "center",
    marginTop: 18,
  },

  backButtonText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  otpEmail: {
    textAlign: "center",
    color: "#0D5367",
    fontSize: 14,
    fontWeight: "700",
    marginTop: -14,
    marginBottom: 18,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 16,
    gap: 6,
  },

  otpInput: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 11,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  otpInputActive: {
    borderColor: "#0A829A",
    backgroundColor: "#F0FDFA",
  },

  timerText: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "600",
  },

  resendButton: {
    alignItems: "center",
    marginTop: 14,
  },

  resendText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  resendDisabled: {
    color: "#94A3B8",
  },

  disabledButton: {
    opacity: 0.5,
  },

  requirementsBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginBottom: 8,
  },

  requirementsTitle: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  requirementIcon: {
    fontSize: 12,
    color: "#94A3B8",
    marginRight: 6,
    fontWeight: "800",
  },

  requirementPassed: {
    color: "#16A34A",
  },

  requirementText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "500",
  },

  requirementPassedText: {
    color: "#16A34A",
    fontWeight: "600",
  },

  passwordMismatch: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
    fontWeight: "600",
  },

  successContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },

  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  successSymbol: {
    color: "#16A34A",
    fontSize: 34,
    fontWeight: "900",
  },
});