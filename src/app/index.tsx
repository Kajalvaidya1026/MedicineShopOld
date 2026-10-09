import { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
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
  | "signup"
  | "forgot"
  | "otp"
  | "otp-success"
  | "reset"
  | "signup-success"
  | "login-success"
  | "success";

type PublicAccountType = "Customer" | "Supplier" | "Doctor";
type LandingTab = "Home" | "About Us" | "Services" | "Contact Us";

const publicAccountTypes: PublicAccountType[] = [
  "Customer",
  "Supplier",
  "Doctor",
];

const landingTabs: LandingTab[] = ["Home", "About Us", "Services", "Contact Us"];

const serviceCards = [
  {
    icon: "medkit-outline" as const,
    title: "Medicine and Inventory Management",
    description:
      "Organize medicine details and keep inventory information easy to review.",
  },
  {
    icon: "receipt-outline" as const,
    title: "Sales and Billing",
    description:
      "Support clear sales and billing workflows for day-to-day pharmacy operations.",
  },
  {
    icon: "people-outline" as const,
    title: "Supplier Management",
    description:
      "Keep supplier information organized and accessible when managing stock.",
  },
  {
    icon: "time-outline" as const,
    title: "Medicine Expiry Tracking",
    description:
      "Review expiry dates to help staff identify medicines that need attention.",
  },
  {
    icon: "alert-circle-outline" as const,
    title: "Low-Stock Monitoring",
    description:
      "Highlight stock levels that may need a timely review or replenishment.",
  },
  {
    icon: "bar-chart-outline" as const,
    title: "Reports and Analytics",
    description:
      "Present operational information in a clear format for easier review.",
  },
];

/* ============================================================
   HERO IMAGES
============================================================ */

const heroImages = [
  require("../../assets/images/pharmacy-3.png"),
  require("../../assets/images/pharmacy-1.png"),
];

/* ============================================================
   HOME SCREEN COMPONENT
============================================================ */

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isSmallMobile = width < 420;
  const isCompactNavbar = width < 640;

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
  }, [heroFadeAnim, heroSlideAnim, floatAnim]);

  /* ==========================================================
     LOGIN STATES
  ========================================================== */

  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>("login");
  const [authCardEntrance] = useState(() => new Animated.Value(0));
  const [authLogoFloat] = useState(() => new Animated.Value(0));
  const [authButtonScale] = useState(() => new Animated.Value(1));

  const [email, setEmail] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [fullName, setFullName] = useState("");
  const [accountType, setAccountType] =
    useState<PublicAccountType>("Customer");
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [seconds, setSeconds] = useState(300);
  const [activeLandingTab, setActiveLandingTab] =
    useState<LandingTab>("Home");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactErrors, setContactErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [contactNotice, setContactNotice] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<Partial<Record<LandingTab, number>>>({});
  const navTrailProgress = useRef(new Animated.Value(0)).current;
  const navActivationProgress = useRef(new Animated.Value(1)).current;
  const themeSwitchGlow = useRef(new Animated.Value(0)).current;
  const contactEntranceProgress = useRef(new Animated.Value(0)).current;
  const contactCardHoverProgress = useRef(new Animated.Value(0)).current;
  const contactButtonHoverProgress = useRef(new Animated.Value(0)).current;
  const contactButtonPressProgress = useRef(new Animated.Value(0)).current;
  const contactSuccessProgress = useRef(new Animated.Value(0)).current;
  const contactFocusProgress = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const contactEntranceStarted = useRef(false);
  const contactSubmissionTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pageTheme = isDarkMode
    ? {
        page: "#071E26",
        navbar: "rgba(7, 30, 38, 0.96)",
        border: "rgba(56, 189, 248, 0.18)",
        section: "#081F28",
        sectionAlternate: "#0A2630",
        card: "rgba(255, 255, 255, 0.045)",
        cardBorder: "rgba(56, 189, 248, 0.18)",
        heading: "#FFFFFF",
        text: "rgba(224, 242, 254, 0.78)",
        mutedText: "rgba(224, 242, 254, 0.68)",
        navText: "rgba(255, 255, 255, 0.72)",
        navTextActive: "#FFFFFF",
        heroText: "#FFFFFF",
        heroDescription: "rgba(224, 242, 254, 0.9)",
        heroOverlayStart: "rgba(4, 20, 26, 0.98)",
        heroOverlayMiddle: "rgba(5, 24, 32, 0.92)",
        heroOverlayEnd: "rgba(7, 30, 38, 0.18)",
        heroVignette: "#071E26",
        carouselBackground: "rgba(4, 20, 26, 0.65)",
        footer: "rgba(4, 20, 26, 0.95)",
        footerText: "rgba(255, 255, 255, 0.55)",
        contactCard: "rgba(255, 255, 255, 0.05)",
        contactInput: "rgba(4, 20, 26, 0.62)",
        contactInputText: "#FFFFFF",
        contactPlaceholder: "#9AAEB4",
        contactLabel: "#E0F2FE",
        contactSuccess: "#86EFAC",
        contactError: "#FCA5A5",
      }
    : {
        page: "#F3FAFC",
        navbar: "rgba(255, 255, 255, 0.97)",
        border: "rgba(13, 83, 103, 0.14)",
        section: "#FFFFFF",
        sectionAlternate: "#EAF5F8",
        card: "#FFFFFF",
        cardBorder: "rgba(13, 83, 103, 0.14)",
        heading: "#0B2433",
        text: "#334155",
        mutedText: "#526575",
        navText: "#334155",
        navTextActive: "#083344",
        heroText: "#0B2433",
        heroDescription: "#334155",
        heroOverlayStart: "rgba(255, 255, 255, 0.96)",
        heroOverlayMiddle: "rgba(255, 255, 255, 0.88)",
        heroOverlayEnd: "rgba(243, 250, 252, 0.3)",
        heroVignette: "#F3FAFC",
        carouselBackground: "rgba(255, 255, 255, 0.88)",
        footer: "#FFFFFF",
        footerText: "#64748B",
        contactCard: "#FFFFFF",
        contactInput: "#FFFFFF",
        contactInputText: "#0F172A",
        contactPlaceholder: "#64748B",
        contactLabel: "#1E293B",
        contactSuccess: "#15803D",
        contactError: "#B91C1C",
      };

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
    themeSwitchGlow.stopAnimation();
    themeSwitchGlow.setValue(0);
    if (!reduceMotion) {
      Animated.sequence([
        Animated.timing(themeSwitchGlow, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(themeSwitchGlow, {
          toValue: 0,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(
    () => () => {
      if (contactSubmissionTimer.current) {
        clearTimeout(contactSubmissionTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!showLogin) return;

    authCardEntrance.setValue(0);
    authButtonScale.setValue(1);

    const entranceAnimation = Animated.timing(authCardEntrance, {
      toValue: 1,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    entranceAnimation.start();

    if (loginStep !== "login" && loginStep !== "signup") {
      return () => entranceAnimation.stop();
    }

    authLogoFloat.setValue(0);
    const logoFloatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(authLogoFloat, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(authLogoFloat, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    logoFloatAnimation.start();

    return () => {
      entranceAnimation.stop();
      logoFloatAnimation.stop();
    };
  }, [authButtonScale, authCardEntrance, authLogoFloat, loginStep, showLogin]);

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
    setLoginEmailError("");
    setLoginStep("login");
    setShowLogin(true);
  };

  const openSignup = () => {
    setFullName("");
    setNewPassword("");
    setConfirmPassword("");
    setAccountType("Customer");
    setAccountTypeOpen(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setLoginStep("signup");
  };

  const closeLogin = () => {
    setShowLogin(false);
    setLoginStep("login");
    setEmail("");
    setLoginEmailError("");
    setPassword("");
    setOtp(["", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setSeconds(300);
  };

  /* ==========================================================
     EMAIL VALIDATION
  ========================================================== */

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginEmailChange = (value: string) => {
    setEmail(value);

    if (loginEmailError) {
      const trimmedEmail = value.trim();
      setLoginEmailError(
        !trimmedEmail
          ? "Please enter your email address."
          : emailPattern.test(trimmedEmail)
            ? ""
            : "Please enter a valid email address."
      );
    }
  };

  /* ==========================================================
     LOGIN HANDLER
  ========================================================== */

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    setEmail(trimmedEmail);

    if (!trimmedEmail) {
      setLoginEmailError("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setLoginEmailError("Please enter a valid email address.");
      return;
    }

    setLoginEmailError("");

    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter your password.");
      return;
    }

    setLoginStep("login-success");
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
    setOtp(["", "", "", ""]);
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

    if (enteredOtp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter the complete 4-digit code.");
      return;
    }

    setLoginStep("otp-success");
  };

  const resendOtp = () => {
    setOtp(["", "", "", ""]);
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

  const handleSignup = () => {
    if (!fullName.trim()) {
      Alert.alert("Name Required", "Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!passwordValid) {
      Alert.alert("Invalid Password", "Please meet all password requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "Your passwords must match.");
      return;
    }

    setLoginStep("signup-success");
  };

  const navigateLandingTab = (tab: LandingTab) => {
    setActiveLandingTab(tab);

    if (reduceMotion) {
      navTrailProgress.setValue(1);
      navActivationProgress.setValue(1);
    } else {
      navTrailProgress.setValue(0);
      navActivationProgress.setValue(0);
      Animated.parallel([
        Animated.timing(navTrailProgress, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(navActivationProgress, {
          toValue: 1,
          speed: 20,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const y = tab === "Home" ? 0 : sectionOffsets.current[tab];
    if (y !== undefined) {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, y - 12),
        animated: !reduceMotion,
      });
    }
  };

  const updateActiveLandingTab = (offsetY: number) => {
    const sectionMarker = offsetY + 180;
    const visibleTab =
      [...landingTabs]
        .reverse()
        .find((tab) => {
          const sectionOffset =
            tab === "Home" ? 0 : sectionOffsets.current[tab];
          return sectionOffset !== undefined && sectionOffset <= sectionMarker;
        }) ?? "Home";

    setActiveLandingTab((current) =>
      current === visibleTab ? current : visibleTab,
    );
  };

  const handleLandingScroll = (
    offsetY: number,
    viewportHeight: number,
  ) => {
    updateActiveLandingTab(offsetY);
    const contactOffset = sectionOffsets.current["Contact Us"];
    if (
      contactOffset === undefined ||
      contactEntranceStarted.current ||
      contactOffset > offsetY + viewportHeight * 0.85
    ) {
      return;
    }

    contactEntranceStarted.current = true;
    if (reduceMotion) {
      contactEntranceProgress.setValue(1);
      return;
    }

    Animated.timing(contactEntranceProgress, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const animateContactFocus = (fieldIndex: number, focused: boolean) => {
    const progress = contactFocusProgress[fieldIndex];
    progress.stopAnimation();
    if (reduceMotion) {
      progress.setValue(focused ? 1 : 0);
      return;
    }

    Animated.timing(progress, {
      toValue: focused ? 1 : 0,
      duration: focused ? 180 : 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const clearContactNotice = () => {
    setContactNotice("");
    contactSuccessProgress.setValue(0);
  };

  const submitContactForm = () => {
    if (contactLoading) return;

    const errors: typeof contactErrors = {};
    const trimmedName = contactName.trim();
    const trimmedEmail = contactEmail.trim();

    if (!trimmedName) errors.name = "Please enter your name.";
    if (!trimmedEmail) {
      errors.email = "Please enter your email address.";
    } else if (!emailPattern.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!contactMessage.trim()) {
      errors.message = "Please enter a message.";
    }

    setContactErrors(errors);
    if (Object.keys(errors).length > 0) {
      clearContactNotice();
      return;
    }

    setContactName(trimmedName);
    setContactEmail(trimmedEmail);
    setContactLoading(true);
    clearContactNotice();
    contactSubmissionTimer.current = setTimeout(() => {
      contactSubmissionTimer.current = null;
      setContactLoading(false);
      setContactNotice(
        "Thanks for reaching out. This is a frontend demo, so your message has not been sent.",
      );

      if (reduceMotion) {
        contactSuccessProgress.setValue(1);
        return;
      }

      Animated.timing(contactSuccessProgress, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 650);
  };

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

  const renderRecoveryProgress = (activeStep: 1 | 2 | 3) => {
    const progressWidth = `${((activeStep - 1) / 2) * 100}%` as `${number}%`;
    const steps = ["Email", "Verify", "Reset"];

    return (
      <View
        style={styles.recoveryProgress}
        accessibilityRole="progressbar"
        accessibilityLabel={`Password recovery step ${activeStep} of 3`}
        accessibilityValue={{ min: 1, max: 3, now: activeStep }}
      >
        <View style={styles.progressRail}>
          <View style={[styles.progressRailFill, { width: progressWidth }]} />
        </View>
        {steps.map((label, index) => {
          const step = index + 1;
          const isComplete = step < activeStep;
          const isActive = step === activeStep;

          return (
            <View key={label} style={styles.progressStep}>
              <View
                style={[
                  styles.progressNode,
                  isComplete && styles.progressNodeComplete,
                  isActive && styles.progressNodeActive,
                ]}
              >
                {isComplete ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.progressNodeText,
                      isActive && styles.progressNodeTextActive,
                    ]}
                  >
                    {step}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  (isComplete || isActive) && styles.progressLabelCurrent,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const modalCardTranslateY = authCardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [9, 0],
  });
  const modalCardScale = authCardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.99, 1],
  });
  const modalCardRotateX = authCardEntrance.interpolate({
    inputRange: [0, 1],
    outputRange: ["1deg", "0deg"],
  });
  const modalLogoTranslateY = authLogoFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  const modalLogoRotate = authLogoFloat.interpolate({
    inputRange: [0, 1],
    outputRange: ["-0.6deg", "0.6deg"],
  });

  const renderModalPrimaryButton = (
    label: string,
    onPress: () => void,
    disabled = false
  ) => (
    <Animated.View
      style={[
        { width: "100%" },
        { transform: [{ scale: authButtonScale }] },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.modalPrimaryButton,
          disabled && styles.disabledButton,
        ]}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(authButtonScale, {
            toValue: 0.985,
            friction: 7,
            tension: 220,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(authButtonScale, {
            toValue: 1,
            friction: 7,
            tension: 180,
            useNativeDriver: true,
          }).start()
        }
        disabled={disabled}
        activeOpacity={0.85}
      >
        <Text style={styles.modalPrimaryButtonText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

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
          <Animated.View
            style={[
              styles.loginCard,
              isMobile && styles.loginCardMobile,
              {
                opacity: authCardEntrance,
                transform: [
                  { perspective: 900 },
                  { translateY: modalCardTranslateY },
                  { rotateX: modalCardRotateX },
                  { scale: modalCardScale },
                ],
              },
            ]}
          >
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
                  <Animated.View
                    style={{
                      transform: [
                        { perspective: 700 },
                        { translateY: modalLogoTranslateY },
                        { rotateX: modalLogoRotate },
                      ],
                    }}
                  >
                    <View style={styles.modalLogo}>
                      <LinearGradient
                        colors={["#20B9C5", "#0D5367", "#083344"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalLogoGradient}
                      >
                        <Ionicons name="medkit" size={25} color="#FFFFFF" />
                      </LinearGradient>
                    </View>
                  </Animated.View>

                  <Text style={styles.modalTitle}>Welcome Back</Text>
                  <Text style={styles.modalSubtitle}>
                    Sign in to continue to MEDICARE
                  </Text>

                  {/* EMAIL */}
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    value={email}
                    onChangeText={handleLoginEmailChange}
                    placeholder="Enter your email"
                    placeholderTextColor="#9AAEB4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  {!!loginEmailError && (
                    <Text style={styles.emailError}>{loginEmailError}</Text>
                  )}

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
                  {renderModalPrimaryButton("Sign In", handleLogin)}

                  <Text style={styles.securityText}>
                    🔒 Secure access • Role-based authentication
                  </Text>

                  <View style={styles.signupPrompt}>
                    <Text style={styles.signupPromptText}>
                      New to MEDICARE?
                    </Text>
                    <TouchableOpacity
                      onPress={openSignup}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.signupLink}>Create account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* =================================================
                  STEP: SIGN UP
              ================================================= */}
              {loginStep === "signup" && (
                <View>
                  <Animated.View
                    style={{
                      transform: [
                        { perspective: 700 },
                        { translateY: modalLogoTranslateY },
                        { rotateX: modalLogoRotate },
                      ],
                    }}
                  >
                    <View style={styles.modalLogo}>
                      <LinearGradient
                        colors={["#20B9C5", "#0D5367", "#083344"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalLogoGradient}
                      >
                        <Ionicons
                          name="person-add"
                          size={23}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                    </View>
                  </Animated.View>

                  <Text style={styles.modalTitle}>Create Account</Text>
                  <Text style={styles.modalSubtitle}>
                    Sign up to get started with MEDICARE
                  </Text>

                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9AAEB4"
                    autoCapitalize="words"
                    style={styles.input}
                  />

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

                  <Text style={styles.inputLabel}>Account Type</Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Account Type: ${accountType}`}
                    accessibilityState={{ expanded: accountTypeOpen }}
                    onPress={() => setAccountTypeOpen((isOpen) => !isOpen)}
                    activeOpacity={0.8}
                    style={styles.accountTypeInput}
                  >
                    <Text style={styles.accountTypeValue}>{accountType}</Text>
                    <Text style={styles.accountTypeChevron}>
                      {accountTypeOpen ? "⌃" : "⌄"}
                    </Text>
                  </TouchableOpacity>
                  {accountTypeOpen && (
                    <View style={styles.accountTypeOptions}>
                      {publicAccountTypes.map((role) => (
                        <TouchableOpacity
                          key={role}
                          accessibilityRole="button"
                          accessibilityState={{ selected: accountType === role }}
                          onPress={() => {
                            setAccountType(role);
                            setAccountTypeOpen(false);
                          }}
                          activeOpacity={0.75}
                          style={[
                            styles.accountTypeOption,
                            accountType === role &&
                              styles.accountTypeOptionSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.accountTypeOptionText,
                              accountType === role &&
                                styles.accountTypeOptionTextSelected,
                            ]}
                          >
                            {role}
                          </Text>
                          {accountType === role && (
                            <Text style={styles.accountTypeCheck}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Create a password"
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
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eyeText}>
                        {showConfirmPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {renderModalPrimaryButton("Create Account", handleSignup)}

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setLoginStep("login")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backButtonText}>
                      ← Back to Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* =================================================
                  STEP: FORGOT PASSWORD
              ================================================= */}
              {loginStep === "forgot" && (
                <View>
                  {renderRecoveryProgress(1)}

                  <Text style={styles.modalTitle}>Forgot Password?</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter your registered email and we will send a 4-digit code.
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

                  {renderModalPrimaryButton("Send OTP", handleForgotPassword)}

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
                  {renderRecoveryProgress(2)}

                  <Text style={styles.modalTitle}>Verification Code</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter the 4-digit code sent to your registered email.
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
                        textContentType="oneTimeCode"
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
                  {renderModalPrimaryButton(
                    "Verify OTP",
                    verifyOtp,
                    seconds <= 0
                  )}

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

              {loginStep === "otp-success" && (
                <View style={styles.verificationSuccess}>
                  {renderRecoveryProgress(2)}
                  <View style={styles.verificationSuccessIcon}>
                    <Ionicons name="checkmark" size={34} color="#FFFFFF" />
                  </View>
                  <Text style={styles.modalTitle}>Verification Code</Text>
                  <Text style={styles.modalSubtitle}>
                    Your email has been verified.
                  </Text>
                  <View style={styles.verifiedSecure}>
                    <Ionicons
                      name="lock-closed"
                      size={13}
                      color="#168C68"
                    />
                    <Text style={styles.verifiedSecureText}>
                      Verified and secure
                    </Text>
                  </View>
                  {renderModalPrimaryButton("Continue", () =>
                    setLoginStep("reset")
                  )}
                </View>
              )}

              {/* =================================================
                  STEP: RESET PASSWORD
              ================================================= */}
              {loginStep === "reset" && (
                <View>
                  {renderRecoveryProgress(3)}

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

                  {confirmPassword.length > 0 &&
                    newPassword !== confirmPassword && (
                      <Text style={styles.passwordMismatch}>
                        Passwords do not match.
                      </Text>
                    )}

                  {/* RESET BUTTON */}
                  {renderModalPrimaryButton("Update Password", resetPassword)}

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

                  {renderModalPrimaryButton("Continue to Login", () =>
                    setLoginStep("login")
                  )}
                </View>
              )}

              {loginStep === "signup-success" && (
                <View style={styles.successContainer}>
                  <View style={styles.successCircle}>
                    <Text style={styles.successSymbol}>✓</Text>
                  </View>

                  <Text style={styles.modalTitle}>
                    Account Created Successfully!
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    Your MEDICARE registration form has been completed
                    successfully.
                  </Text>
                  <Text style={styles.signupSuccessRole}>
                    Account Type: {accountType}
                  </Text>

                  {renderModalPrimaryButton("Continue to Sign In", () =>
                    setLoginStep("login")
                  )}
                </View>
              )}

              {loginStep === "login-success" && (
                <View style={styles.successContainer}>
                  <View style={styles.successCircle}>
                    <Text style={styles.successSymbol}>✓</Text>
                  </View>

                  <Text style={styles.modalTitle}>Login Successful!</Text>
                  <Text style={styles.modalSubtitle}>
                    You have successfully signed in to MEDICARE.
                  </Text>

                  {renderModalPrimaryButton("OK", closeLogin)}
                </View>
              )}
            </ScrollView>
          </Animated.View>
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

      <View style={[styles.fullScreen, { backgroundColor: pageTheme.page }]}>
        {/* =====================================================
            HEADER / NAVBAR
        ===================================================== */}
        <View
          style={[
            styles.navbar,
            isMobile && styles.navbarMobile,
            isCompactNavbar && styles.navbarCompact,
            {
              backgroundColor: pageTheme.navbar,
              borderBottomColor: pageTheme.border,
            },
          ]}
        >
          <View
            style={[
              styles.navbarInner,
              isCompactNavbar && styles.navbarInnerCompact,
            ]}
          >
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
                  <Text
                    style={[
                      styles.brandTitle,
                      !isDarkMode && styles.brandTitleLight,
                    ]}
                  >
                    MEDICARE
                  </Text>
                  <View style={styles.brandDot} />
                </View>
                <Text
                  style={[
                    styles.brandSubTitle,
                    !isDarkMode && styles.brandSubTitleLight,
                  ]}
                >
                  SMART PHARMACY OS
                </Text>
              </View>
            </TouchableOpacity>

            <ScrollView
              horizontal
              style={[
                styles.navigation,
                isMobile && styles.navigationMobile,
                isCompactNavbar && styles.navigationCompact,
              ]}
              contentContainerStyle={[
                styles.navigationContent,
                isMobile && styles.navigationContentMobile,
              ]}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {landingTabs.map((tab) => {
                const isActive = activeLandingTab === tab;
                const trailDistance =
                  tab.length * (isMobile ? 6 : 7) + (isMobile ? 22 : 38);
                return (
                  <TouchableOpacity
                    key={tab}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    activeOpacity={0.8}
                    onPress={() => navigateLandingTab(tab)}
                    style={[
                      isActive ? styles.navItemActive : styles.navItem,
                      isMobile && styles.navItemMobile,
                    ]}
                  >
                    {isActive && (
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.navLightTrail,
                          {
                            opacity: navTrailProgress.interpolate({
                              inputRange: [0, 0.15, 0.85, 1],
                              outputRange: [0, 0.65, 0.65, 0],
                            }),
                            transform: [
                              {
                                translateX: navTrailProgress.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [-18, trailDistance],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    )}
                    <Animated.View
                      style={[
                        styles.navItemContent,
                        isActive && {
                          opacity: navActivationProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.78, 1],
                          }),
                          transform: [
                            {
                              scale: navActivationProgress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.96, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      {isActive && <View style={styles.activeNavDot} />}
                      <Text
                        style={[
                          isActive ? styles.navTextActive : styles.navText,
                          {
                            color: isActive
                              ? pageTheme.navTextActive
                              : pageTheme.navText,
                          },
                          isMobile && styles.navTextMobile,
                        ]}
                      >
                        {tab}
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* NAVBAR ACTION BUTTON */}
            <TouchableOpacity
              style={[
                styles.navbarLoginBtn,
                !isDarkMode && styles.navbarLoginBtnLight,
              ]}
              onPress={openLogin}
              activeOpacity={0.85}
            >
              <Ionicons
                name="person-outline"
                size={15}
                color="#38BDF8"
                style={styles.loginBtnIcon}
              />
              <Text
                style={[
                  styles.navbarLoginText,
                  !isDarkMode && styles.navbarLoginTextLight,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              accessibilityHint="Changes the appearance of the home page"
              onPress={toggleTheme}
              activeOpacity={0.8}
              style={[
                styles.themeToggle,
                !isDarkMode && styles.themeToggleLight,
                isMobile && styles.themeToggleMobile,
              ]}
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.themeToggleGlow,
                  {
                    opacity: themeSwitchGlow.interpolate({
                      inputRange: [0, 0.45, 1],
                      outputRange: [0, 0.8, 0],
                    }),
                    transform: [
                      {
                        scale: themeSwitchGlow.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.7, 1.35],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Ionicons
                name={isDarkMode ? "sunny-outline" : "moon-outline"}
                size={18}
                color={isDarkMode ? "#FDE68A" : "#0D7490"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =====================================================
            SCROLLABLE LANDING PAGE CONTENT
        ===================================================== */}
        <ScrollView
          ref={scrollViewRef}
          style={[
            styles.mainScrollView,
            { backgroundColor: pageTheme.page },
          ]}
          contentContainerStyle={[
            styles.mainScrollContent,
            { backgroundColor: pageTheme.page },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onScroll={(event) =>
            handleLandingScroll(
              event.nativeEvent.contentOffset.y,
              event.nativeEvent.layoutMeasurement.height,
            )
          }
          scrollEventThrottle={16}
        >
          {/* ===================================================
              HERO SECTION
          =================================================== */}
          <View
            nativeID="home"
            style={[
              styles.hero,
              { minHeight: heroMinHeight },
              isMobile && styles.heroMobile,
              !isDarkMode && styles.heroLight,
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
                isDarkMode && isMobile
                  ? [
                      "rgba(5, 22, 29, 0.96)",
                      "rgba(5, 22, 29, 0.88)",
                      "rgba(5, 22, 29, 0.72)",
                    ]
                  : isDarkMode
                    ? [
                        pageTheme.heroOverlayStart,
                        pageTheme.heroOverlayMiddle,
                        "rgba(7, 30, 38, 0.76)",
                        "rgba(7, 30, 38, 0.35)",
                        pageTheme.heroOverlayEnd,
                      ]
                  : [
                      pageTheme.heroOverlayStart,
                      pageTheme.heroOverlayMiddle,
                      "rgba(255, 255, 255, 0.7)",
                      "rgba(255, 255, 255, 0.32)",
                      pageTheme.heroOverlayEnd,
                    ]
              }
              locations={
                isDarkMode && isMobile
                  ? [0, 0.45, 1]
                  : [0, 0.38, 0.58, 0.82, 1]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />

            {/* VERTICAL GRADIENT: SEAMLESS VIGNETTE AND BOTTOM BLEND */}
            <LinearGradient
              colors={
                isDarkMode
                  ? [
                      "rgba(4, 20, 26, 0.5)",
                      "transparent",
                      "rgba(7, 30, 38, 0.85)",
                      pageTheme.heroVignette,
                    ]
                  : [
                      "rgba(255, 255, 255, 0.12)",
                      "transparent",
                      "rgba(243, 250, 252, 0.55)",
                      pageTheme.heroVignette,
                    ]
              }
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
                {/* MAIN HERO HEADLINE */}
                <View style={styles.heroTitle3D}>
                  <Text
                    style={[
                      styles.heroTitle,
                      isMobile && styles.heroTitleMobile,
                      isSmallMobile && styles.heroTitleSmallMobile,
                      !isDarkMode && styles.heroTitleLight,
                    ]}
                  >
                    Next-Gen Medicine{"\n"}
                    <Text style={styles.heroTitleAccent}>
                      Shop Management
                    </Text>
                  </Text>
                </View>

                {/* HERO DESCRIPTION */}
                <Text
                  style={[
                    styles.heroDescription,
                    isMobile && styles.heroDescriptionMobile,
                    !isDarkMode && styles.heroDescriptionLight,
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

                </View>

                {/* REFINED INTERACTIVE CAROUSEL INDICATORS */}
                <View
                  style={[
                    styles.carouselBar,
                    { backgroundColor: pageTheme.carouselBackground },
                  ]}
                >
                  <Text
                    style={[
                      styles.carouselLabel,
                      !isDarkMode && styles.carouselTextLight,
                    ]}
                  >
                    VIEW:
                  </Text>
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
                  <Text
                    style={[
                      styles.carouselCounter,
                      !isDarkMode && styles.carouselTextLight,
                    ]}
                  >
                    0{heroImageIndex + 1} / 0{heroImages.length}
                  </Text>
                </View>
              </Animated.View>

            </View>
          </View>

          <View
            nativeID="about-us"
            onLayout={(event) => {
              sectionOffsets.current["About Us"] =
                event.nativeEvent.layout.y;
            }}
            style={[
              styles.infoSection,
              isMobile && styles.infoSectionMobile,
              {
                backgroundColor: pageTheme.section,
                borderTopColor: pageTheme.border,
              },
            ]}
          >
            <View style={styles.sectionInner}>
              <Text style={styles.sectionEyebrow}>OUR PURPOSE</Text>
              <Text
                style={[styles.sectionTitle, { color: pageTheme.heading }]}
              >
                About MEDICARE
              </Text>
              <Text
                style={[styles.sectionDescription, { color: pageTheme.text }]}
              >
                MEDICARE is a Medicine Shop Management System designed to
                simplify pharmacy operations. It helps organize medicine
                inventory, manage sales and billing, track expiry dates, and
                maintain supplier information in one clear experience.
              </Text>
              <View
                style={[
                  styles.aboutHighlights,
                  isMobile && styles.aboutHighlightsMobile,
                ]}
              >
                {[
                  {
                    icon: "grid-outline" as const,
                    title: "Stay organized",
                    text: "Bring essential pharmacy information together.",
                  },
                  {
                    icon: "time-outline" as const,
                    title: "Keep an eye on dates",
                    text: "Make expiry tracking easier to review.",
                  },
                  {
                    icon: "flash-outline" as const,
                    title: "Simplify daily work",
                    text: "Support smoother day-to-day shop operations.",
                  },
                ].map((highlight) => (
                  <View
                    key={highlight.title}
                    style={[
                      styles.highlightCard,
                      {
                        backgroundColor: pageTheme.card,
                        borderColor: pageTheme.cardBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name={highlight.icon}
                      size={24}
                      color="#38BDF8"
                    />
                    <Text
                      style={[
                        styles.highlightTitle,
                        { color: pageTheme.heading },
                      ]}
                    >
                      {highlight.title}
                    </Text>
                    <Text
                      style={[
                        styles.highlightDescription,
                        { color: pageTheme.mutedText },
                      ]}
                    >
                      {highlight.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View
            nativeID="services"
            onLayout={(event) => {
              sectionOffsets.current.Services = event.nativeEvent.layout.y;
            }}
            style={[
              styles.servicesSection,
              isMobile && styles.infoSectionMobile,
              {
                backgroundColor: pageTheme.sectionAlternate,
                borderTopColor: pageTheme.border,
              },
            ]}
          >
            <View style={styles.sectionInner}>
              <Text style={styles.sectionEyebrow}>WHAT YOU CAN DO</Text>
              <Text
                style={[styles.sectionTitle, { color: pageTheme.heading }]}
              >
                Services
              </Text>
              <Text
                style={[styles.sectionDescription, { color: pageTheme.text }]}
              >
                Explore tools designed to support common medicine shop
                workflows. These are frontend demonstrations, not a claim that
                backend services are connected.
              </Text>
              <View
                style={[
                  styles.servicesGrid,
                  isMobile && styles.servicesGridMobile,
                ]}
              >
                {serviceCards.map((service) => (
                  <TouchableOpacity
                    key={service.title}
                    activeOpacity={0.84}
                    style={[
                      styles.serviceCard,
                      isMobile && styles.serviceCardMobile,
                      {
                        backgroundColor: pageTheme.card,
                        borderColor: pageTheme.cardBorder,
                      },
                    ]}
                  >
                    <View style={styles.serviceIcon}>
                      <Ionicons
                        name={service.icon}
                        size={23}
                        color="#38BDF8"
                      />
                    </View>
                    <Text
                      style={[
                        styles.serviceTitle,
                        { color: pageTheme.heading },
                      ]}
                    >
                      {service.title}
                    </Text>
                    <Text
                      style={[
                        styles.serviceDescription,
                        { color: pageTheme.mutedText },
                      ]}
                    >
                      {service.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View
            nativeID="contact-us"
            onLayout={(event) => {
              sectionOffsets.current["Contact Us"] =
                event.nativeEvent.layout.y;
            }}
            style={[
              styles.contactSection,
              isMobile && styles.infoSectionMobile,
              {
                backgroundColor: pageTheme.section,
                borderTopColor: pageTheme.border,
              },
            ]}
          >
            <View
              style={[
                styles.sectionInner,
                !isMobile && styles.contactInnerDesktop,
              ]}
            >
              <Text style={styles.sectionEyebrow}>WE’RE HERE TO HELP</Text>
              <Text
                style={[
                  styles.sectionTitle,
                  !isMobile && styles.contactTitleDesktop,
                  { color: pageTheme.heading },
                ]}
              >
                Contact Us
              </Text>
              <Text
                style={[
                  styles.sectionDescription,
                  !isMobile && styles.contactDescriptionDesktop,
                  { color: pageTheme.text },
                ]}
              >
                Have a question or suggestion? Send us a note using this demo
                form.
              </Text>

              <Animated.View
                style={[
                  styles.contactCard,
                  !isMobile && styles.contactCardDesktop,
                  {
                    backgroundColor: pageTheme.contactCard,
                    borderColor: contactCardHoverProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        pageTheme.cardBorder,
                        "rgba(34, 211, 238, 0.62)",
                      ],
                    }),
                    shadowColor: "#22D3EE",
                    shadowOpacity: contactCardHoverProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.2],
                    }),
                    shadowRadius: contactCardHoverProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 16],
                    }),
                    opacity: contactEntranceProgress,
                    transform: [
                      {
                        translateY: contactEntranceProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [18, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Pressable
                  onHoverIn={() => {
                    if (reduceMotion) {
                      contactCardHoverProgress.setValue(1);
                    } else {
                      Animated.timing(contactCardHoverProgress, {
                        toValue: 1,
                        duration: 220,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: false,
                      }).start();
                    }
                  }}
                  onHoverOut={() => {
                    if (reduceMotion) {
                      contactCardHoverProgress.setValue(0);
                    } else {
                      Animated.timing(contactCardHoverProgress, {
                        toValue: 0,
                        duration: 220,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: false,
                      }).start();
                    }
                  }}
                  style={styles.contactCardHoverArea}
                >
                <Text
                  style={[
                    styles.contactLabel,
                    { color: pageTheme.contactLabel },
                  ]}
                >
                  Name
                </Text>
                <View style={styles.contactInputWrap}>
                  <TextInput
                    value={contactName}
                    onChangeText={(value) => {
                      setContactName(value);
                      if (contactErrors.name && value.trim()) {
                        setContactErrors((current) => ({
                          ...current,
                          name: undefined,
                        }));
                      }
                      clearContactNotice();
                    }}
                    onFocus={() => animateContactFocus(0, true)}
                    onBlur={() => animateContactFocus(0, false)}
                    placeholder="Your name"
                    placeholderTextColor={pageTheme.contactPlaceholder}
                    style={[
                      styles.contactInput,
                      contactErrors.name && styles.contactInputError,
                      {
                        backgroundColor: pageTheme.contactInput,
                        color: pageTheme.contactInputText,
                        borderColor: pageTheme.cardBorder,
                      },
                    ]}
                    autoCapitalize="words"
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.contactInputFocusRing,
                      { opacity: contactFocusProgress[0] },
                    ]}
                  />
                </View>
                {!!contactErrors.name && (
                  <Text
                    style={[
                      styles.contactError,
                      { color: pageTheme.contactError },
                    ]}
                  >
                    {contactErrors.name}
                  </Text>
                )}

                <Text
                  style={[
                    styles.contactLabel,
                    { color: pageTheme.contactLabel },
                  ]}
                >
                  Email
                </Text>
                <View style={styles.contactInputWrap}>
                  <TextInput
                    value={contactEmail}
                    onChangeText={(value) => {
                      setContactEmail(value);
                      if (contactErrors.email) {
                        const trimmedEmail = value.trim();
                        setContactErrors((current) => ({
                          ...current,
                          email: !trimmedEmail
                            ? "Please enter your email address."
                            : emailPattern.test(trimmedEmail)
                              ? undefined
                              : "Please enter a valid email address.",
                        }));
                      }
                      clearContactNotice();
                    }}
                    onFocus={() => animateContactFocus(1, true)}
                    onBlur={() => animateContactFocus(1, false)}
                    placeholder="you@example.com"
                    placeholderTextColor={pageTheme.contactPlaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.contactInput,
                      contactErrors.email && styles.contactInputError,
                      {
                        backgroundColor: pageTheme.contactInput,
                        color: pageTheme.contactInputText,
                        borderColor: pageTheme.cardBorder,
                      },
                    ]}
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.contactInputFocusRing,
                      { opacity: contactFocusProgress[1] },
                    ]}
                  />
                </View>
                {!!contactErrors.email && (
                  <Text
                    style={[
                      styles.contactError,
                      { color: pageTheme.contactError },
                    ]}
                  >
                    {contactErrors.email}
                  </Text>
                )}

                <Text
                  style={[
                    styles.contactLabel,
                    { color: pageTheme.contactLabel },
                  ]}
                >
                  Message
                </Text>
                <View style={styles.contactInputWrap}>
                  <TextInput
                    value={contactMessage}
                    onChangeText={(value) => {
                      setContactMessage(value);
                      if (contactErrors.message && value.trim()) {
                        setContactErrors((current) => ({
                          ...current,
                          message: undefined,
                        }));
                      }
                      clearContactNotice();
                    }}
                    onFocus={() => animateContactFocus(2, true)}
                    onBlur={() => animateContactFocus(2, false)}
                    placeholder="How can we help?"
                    placeholderTextColor={pageTheme.contactPlaceholder}
                    multiline
                    textAlignVertical="top"
                    style={[
                      styles.contactInput,
                      styles.contactMessageInput,
                      contactErrors.message && styles.contactInputError,
                      {
                        backgroundColor: pageTheme.contactInput,
                        color: pageTheme.contactInputText,
                        borderColor: pageTheme.cardBorder,
                      },
                    ]}
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.contactInputFocusRing,
                      { opacity: contactFocusProgress[2] },
                    ]}
                  />
                </View>
                {!!contactErrors.message && (
                  <Text
                    style={[
                      styles.contactError,
                      { color: pageTheme.contactError },
                    ]}
                  >
                    {contactErrors.message}
                  </Text>
                )}

                <Animated.View
                  style={[
                    styles.contactSubmitOuter,
                    {
                      shadowOpacity: contactButtonHoverProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.38, 0.58],
                      }),
                      shadowRadius: contactButtonHoverProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 18],
                      }),
                      transform: [
                        {
                          scale: contactButtonPressProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.96],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateY: contactButtonHoverProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -2],
                          }),
                        },
                      ],
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ disabled: contactLoading, busy: contactLoading }}
                      disabled={contactLoading}
                      onPress={submitContactForm}
                      onPressIn={() => {
                        if (reduceMotion) {
                          contactButtonPressProgress.setValue(1);
                        } else {
                          Animated.timing(contactButtonPressProgress, {
                            toValue: 1,
                            duration: 90,
                            useNativeDriver: true,
                          }).start();
                        }
                      }}
                      onPressOut={() => {
                        if (reduceMotion) {
                          contactButtonPressProgress.setValue(0);
                        } else {
                          Animated.spring(contactButtonPressProgress, {
                            toValue: 0,
                            speed: 22,
                            bounciness: 5,
                            useNativeDriver: true,
                          }).start();
                        }
                      }}
                      onHoverIn={() => {
                        if (reduceMotion) {
                          contactButtonHoverProgress.setValue(1);
                        } else {
                          Animated.timing(contactButtonHoverProgress, {
                            toValue: 1,
                            duration: 220,
                            easing: Easing.out(Easing.cubic),
                            useNativeDriver: false,
                          }).start();
                        }
                      }}
                      onHoverOut={() => {
                        if (reduceMotion) {
                          contactButtonHoverProgress.setValue(0);
                        } else {
                          Animated.timing(contactButtonHoverProgress, {
                            toValue: 0,
                            duration: 220,
                            easing: Easing.out(Easing.cubic),
                            useNativeDriver: false,
                          }).start();
                        }
                      }}
                    >
                      <LinearGradient
                        colors={["#00B4D8", "#0EA5E9", "#0284C7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.contactSubmit,
                          contactLoading && styles.contactSubmitLoading,
                        ]}
                      >
                        {contactLoading ? (
                          <>
                            {reduceMotion ? (
                              <Ionicons
                                name="hourglass-outline"
                                size={17}
                                color="#FFFFFF"
                              />
                            ) : (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            )}
                            <Text style={styles.contactSubmitText}>Sending...</Text>
                          </>
                        ) : (
                          <>
                            <Text style={styles.contactSubmitText}>
                              Submit Message
                            </Text>
                            <Ionicons
                              name="arrow-forward"
                              size={17}
                              color="#FFFFFF"
                            />
                          </>
                        )}
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                </Animated.View>
                {!!contactNotice && (
                  <Animated.View
                    style={[
                      styles.contactSuccess,
                      {
                        opacity: contactSuccessProgress,
                        transform: [
                          {
                            translateY: contactSuccessProgress.interpolate({
                              inputRange: [0, 1],
                              outputRange: [8, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.contactSuccessText,
                        { color: pageTheme.contactSuccess },
                      ]}
                    >
                      {contactNotice}
                    </Text>
                  </Animated.View>
                )}
                </Pressable>
              </Animated.View>
            </View>
          </View>

          {/* ===================================================
              FOOTER BRAND STRIP
          =================================================== */}
          <View
            style={[
              styles.footerStrip,
              {
                backgroundColor: pageTheme.footer,
                borderTopColor: pageTheme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.footerText,
                { color: pageTheme.footerText },
              ]}
            >
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
    height: 62,
    backgroundColor: "rgba(7, 30, 38, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(56, 189, 248, 0.18)",
    zIndex: 30,
    justifyContent: "center",
    paddingHorizontal: 36,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 9,
  },

  navbarMobile: {
    height: 58,
    paddingHorizontal: 16,
  },

  navbarCompact: {
    height: 92,
    paddingHorizontal: 12,
  },

  navbarInner: {
    width: "100%",
    height: "100%",
    maxWidth: 1340,
    alignSelf: "center",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  navbarInnerCompact: {
    height: "100%",
    alignItems: "flex-start",
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
    transform: [
      { perspective: 700 },
      { rotateX: "8deg" },
      { rotateY: "-10deg" },
    ],
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

  brandTitleLight: {
    color: "#083344",
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

  brandSubTitleLight: {
    color: "#0D7490",
  },

  navigation: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
  },

  navigationMobile: {
    flex: 1,
    marginHorizontal: 6,
  },

  navigationCompact: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 2,
    height: 32,
    flex: 0,
    marginHorizontal: 0,
  },

  navigationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  navigationContentMobile: {
    gap: 1,
  },

  navItem: {
    position: "relative",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },

  navItemActive: {
    position: "relative",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.58)",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 9,
    elevation: 5,
  },

  navItemMobile: {
    paddingHorizontal: 7,
    paddingVertical: 7,
  },

  navItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  navLightTrail: {
    position: "absolute",
    top: 1,
    bottom: 1,
    left: 0,
    width: 16,
    borderRadius: 20,
    backgroundColor: "#67E8F9",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 9,
    elevation: 4,
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
    fontSize: 13,
    fontWeight: "600",
  },

  navTextActive: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  navTextMobile: {
    fontSize: 10,
  },

  navbarLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "rgba(14, 165, 233, 0.08)",
    borderWidth: 1.5,
    borderColor: "#16A8D8",
    borderRadius: 22,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.42,
    shadowRadius: 10,
    elevation: 5,
    transform: [
      { perspective: 700 },
      { rotateX: "7deg" },
      { translateY: -1 },
    ],
  },

  loginBtnIcon: {
    marginRight: 7,
  },

  navbarLoginText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  navbarLoginBtnLight: {
    backgroundColor: "rgba(14, 165, 233, 0.06)",
  },

  navbarLoginTextLight: {
    color: "#083344",
  },

  themeToggle: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.38)",
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
    overflow: "visible",
  },

  themeToggleLight: {
    borderColor: "rgba(13, 116, 144, 0.3)",
    backgroundColor: "rgba(14, 165, 233, 0.07)",
  },

  themeToggleMobile: {
    width: 32,
    height: 32,
    marginLeft: 4,
  },

  themeToggleGlow: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#67E8F9",
    shadowColor: "#22D3EE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
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

  infoSection: {
    paddingHorizontal: 64,
    paddingVertical: 88,
    backgroundColor: "#081F28",
    borderTopWidth: 1,
    borderTopColor: "rgba(56, 189, 248, 0.1)",
  },

  infoSectionMobile: {
    paddingHorizontal: 20,
    paddingVertical: 56,
  },

  servicesSection: {
    paddingHorizontal: 64,
    paddingVertical: 88,
    backgroundColor: "#0A2630",
    borderTopWidth: 1,
    borderTopColor: "rgba(56, 189, 248, 0.1)",
  },

  contactSection: {
    paddingHorizontal: 64,
    paddingVertical: 88,
    backgroundColor: "#081F28",
    borderTopWidth: 1,
    borderTopColor: "rgba(56, 189, 248, 0.1)",
  },

  sectionInner: {
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
  },

  contactInnerDesktop: {
    alignItems: "center",
  },

  contactTitleDesktop: {
    textAlign: "center",
  },

  contactDescriptionDesktop: {
    alignSelf: "center",
    textAlign: "center",
  },

  sectionEyebrow: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  sectionDescription: {
    maxWidth: 760,
    color: "rgba(224, 242, 254, 0.78)",
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 28,
  },

  aboutHighlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  aboutHighlightsMobile: {
    flexDirection: "column",
  },

  highlightCard: {
    flex: 1,
    minWidth: 210,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.18)",
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.045)",
  },

  highlightTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 6,
  },

  highlightDescription: {
    color: "rgba(224, 242, 254, 0.68)",
    fontSize: 13,
    lineHeight: 20,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  servicesGridMobile: {
    flexDirection: "column",
  },

  serviceCard: {
    width: "31.5%",
    minHeight: 190,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.17)",
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.045)",
  },

  serviceCardMobile: {
    width: "100%",
    minHeight: 0,
  },

  serviceIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.22)",
    marginBottom: 14,
  },

  serviceTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
    marginBottom: 8,
  },

  serviceDescription: {
    color: "rgba(224, 242, 254, 0.68)",
    fontSize: 12.5,
    lineHeight: 19,
  },

  contactCard: {
    width: "100%",
    maxWidth: 620,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },

  contactCardDesktop: {
    maxWidth: 760,
  },

  contactCardHoverArea: {
    flex: 1,
  },

  contactLabel: {
    color: "#E0F2FE",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  contactInput: {
    width: "100%",
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 194, 208, 0.35)",
    borderRadius: 11,
    backgroundColor: "rgba(4, 20, 26, 0.62)",
    color: "#FFFFFF",
    fontSize: 14,
  },

  contactInputWrap: {
    position: "relative",
  },

  contactInputFocusRing: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 14,
    left: 0,
    borderWidth: 1.5,
    borderColor: "#22D3EE",
    borderRadius: 11,
    shadowColor: "#22D3EE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 7,
  },

  contactInputError: {
    borderColor: "#F87171",
  },

  contactMessageInput: {
    minHeight: 120,
  },

  contactError: {
    color: "#FCA5A5",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },

  contactSubmitOuter: {
    alignSelf: "flex-start",
    borderRadius: 26,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
  },

  contactSubmit: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },

  contactSubmitLoading: {
    minWidth: 168,
  },

  contactSubmitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  contactSuccess: {
    marginTop: 16,
  },

  contactSuccessText: {
    color: "#86EFAC",
    fontSize: 13,
    lineHeight: 20,
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

  heroLight: {
    backgroundColor: "#F3FAFC",
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

  heroTitle3D: {
    transform: [
      { perspective: 1200 },
      { rotateY: "-2deg" },
      { rotateX: "1deg" },
    ],
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 54,
    lineHeight: 64,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginBottom: 22,
  },

  heroTitleLight: {
    color: "#0B2433",
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

  heroDescriptionLight: {
    color: "#334155",
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
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 20,
    elevation: 12,
    transform: [
      { perspective: 800 },
      { rotateX: "8deg" },
      { rotateY: "-3deg" },
    ],
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
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#064B78",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    transform: [
      { perspective: 700 },
      { rotateX: "6deg" },
      { translateY: -1 },
    ],
  },

  carouselLabel: {
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1,
  },

  carouselTextLight: {
    color: "#334155",
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
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
    backgroundColor: "rgba(3, 14, 18, 0.76)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  loginCard: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "96%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#DCECEF",
    borderBottomWidth: 6,
    borderBottomColor: "#C7DDE2",
    paddingHorizontal: 32,
    paddingVertical: 26,
    shadowColor: "#001820",
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.38,
    shadowRadius: 38,
    elevation: 24,
    position: "relative",
  },

  loginCardMobile: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 24,
  },

  modalScrollContent: {
    paddingBottom: 4,
  },

  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F8F9",
    borderWidth: 1,
    borderColor: "#E3EEF0",
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
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
    padding: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9ECEE",
    shadowColor: "#0D5367",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 9,
  },

  modalLogoGradient: {
    flex: 1,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.4,
  },

  modalSubtitle: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },

  inputLabel: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
    marginTop: 8,
    letterSpacing: 0.2,
  },

  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: "#DCE8EB",
    borderRadius: 13,
    paddingHorizontal: 14,
    color: "#0F172A",
    backgroundColor: "#F7FAFB",
    fontSize: 14,
    shadowColor: "#173A46",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  accountTypeInput: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#DCE8EB",
    borderRadius: 13,
    paddingHorizontal: 14,
    backgroundColor: "#F7FAFB",
    shadowColor: "#173A46",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  accountTypeValue: {
    color: "#0F172A",
    fontSize: 14,
  },

  accountTypeChevron: {
    color: "#0D5367",
    fontSize: 19,
    fontWeight: "700",
  },

  accountTypeOptions: {
    marginTop: 4,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "#DCE8EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  accountTypeOption: {
    minHeight: 42,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DCE8EB",
  },

  accountTypeOptionSelected: {
    backgroundColor: "#F0FAFB",
  },

  accountTypeOptionText: {
    color: "#1E293B",
    fontSize: 14,
  },

  accountTypeOptionTextSelected: {
    color: "#0D5367",
    fontWeight: "700",
  },

  accountTypeCheck: {
    color: "#168C68",
    fontSize: 15,
    fontWeight: "800",
  },

  signupSuccessRole: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "700",
    marginTop: -6,
    marginBottom: 14,
  },

  emailError: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 5,
  },

  passwordContainer: {
    height: 46,
    borderWidth: 1.5,
    borderColor: "#DCE8EB",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFB",
    shadowColor: "#173A46",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
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
    marginTop: 8,
    marginBottom: 10,
  },

  forgotText: {
    color: "#0A829A",
    fontSize: 13,
    fontWeight: "700",
  },

  modalPrimaryButton: {
    height: 49,
    backgroundColor: "#0D5367",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#0D5367",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.36,
    shadowRadius: 14,
    elevation: 9,
    transform: [
      { perspective: 700 },
      { rotateX: "5deg" },
    ],
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
    marginTop: 12,
    fontWeight: "500",
  },

  signupPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 14,
  },

  signupPromptText: {
    color: "#64748B",
    fontSize: 12,
  },

  signupLink: {
    color: "#0A829A",
    fontSize: 12,
    fontWeight: "800",
  },

  recoveryProgress: {
    height: 62,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignSelf: "center",
    marginBottom: 17,
    position: "relative",
  },

  progressRail: {
    position: "absolute",
    top: 17,
    left: "16.67%",
    right: "16.67%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E3ECEE",
    overflow: "hidden",
    transform: [{ perspective: 500 }, { rotateX: "8deg" }],
  },

  progressRailFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#1595A2",
  },

  progressStep: {
    flex: 1,
    alignItems: "center",
    zIndex: 1,
  },

  progressNode: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F6F7",
    borderWidth: 2,
    borderColor: "#E3ECEE",
    shadowColor: "#173A46",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ perspective: 500 }, { rotateX: "8deg" }],
  },

  progressNodeComplete: {
    backgroundColor: "#168B91",
    borderColor: "#D8F0EF",
    shadowColor: "#0D7180",
    shadowOpacity: 0.22,
    elevation: 5,
  },

  progressNodeActive: {
    backgroundColor: "#0D5367",
    borderColor: "#BDE8E9",
    borderWidth: 3,
    shadowColor: "#0D7180",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 7,
    transform: [
      { perspective: 500 },
      { rotateX: "10deg" },
      { translateY: -1 },
    ],
  },

  progressNodeText: {
    color: "#83969B",
    fontSize: 14,
    fontWeight: "800",
  },

  progressNodeTextActive: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  progressLabel: {
    color: "#87969B",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 5,
  },

  progressLabelCurrent: {
    color: "#0D5367",
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
    color: "#397DBB",
    fontSize: 13,
    fontWeight: "700",
    marginTop: -10,
    marginBottom: 20,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 20,
    gap: 10,
  },

  otpInput: {
    width: 54,
    height: 58,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: "#DDE7EF",
    borderBottomColor: "#CDD9E3",
    borderRadius: 13,
    textAlign: "center",
    fontSize: 23,
    fontWeight: "900",
    color: "#2378D1",
    backgroundColor: "#FFFFFF",
    shadowColor: "#3379B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  otpInputActive: {
    borderColor: "#3A8CE3",
    borderBottomColor: "#216CC0",
    backgroundColor: "#EAF4FF",
    shadowColor: "#327FD0",
    shadowOpacity: 0.2,
    elevation: 5,
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

  verificationSuccess: {
    alignItems: "center",
    paddingVertical: 12,
  },

  verificationSuccessIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#22B981",
    borderWidth: 3,
    borderColor: "#D7F7EA",
    shadowColor: "#17A873",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },

  verifiedSecure: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
  },

  verifiedSecureText: {
    color: "#168C68",
    fontSize: 12,
    fontWeight: "700",
  },
});