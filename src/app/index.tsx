import { useRouter } from "expo-router";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const roles = ["Super Admin", "Admin", "Supplier", "Customer", "Doctor", "MR"];

export default function HomeScreen() {
  const router = useRouter();

  const openLogin = (role: string) => {
    router.push({
      pathname: "/Login/role",
      params: { role },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            <Text style={styles.logoPlus}>＋</Text>
          </View>

          <View>
            <Text style={styles.logoText}>MEDICARE</Text>
            <Text style={styles.logoSubText}>Medicine Management</Text>
          </View>
        </View>

        <Pressable
          style={styles.headerButton}
          onPress={() => openLogin("Customer")}
        >
          <Text style={styles.headerButtonText}>Login</Text>
        </Pressable>
      </View>

      {/* ================= HERO ================= */}
      <View style={styles.hero}>
        <View style={styles.heroTextContainer}>
          <View style={styles.smallBadge}>
            <Text style={styles.smallBadgeText}>
              ● SMART MEDICINE MANAGEMENT
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Manage Your{"\n"}
            <Text style={styles.heroHighlight}>Medicine Shop</Text>
            {"\n"}With Ease
          </Text>

          <Text style={styles.heroDescription}>
            A complete digital solution to manage medicines, inventory,
            customers, suppliers, prescriptions and orders in one place.
          </Text>

          <View style={styles.heroButtons}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => openLogin("Customer")}
            >
              <Text style={styles.primaryButtonText}>Get Started →</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Explore System</Text>
            </Pressable>
          </View>
        </View>

        {/* ================= 3D MEDICINE OBJECT ================= */}
        <View style={styles.medicineArea}>
          <View style={styles.glowCircle} />

          <View style={styles.medicineBottle}>
            <View style={styles.bottleCap} />

            <View style={styles.bottleBody}>
              <Text style={styles.bottleLogo}>+</Text>
              <Text style={styles.bottleTitle}>MEDICARE</Text>
              <Text style={styles.bottleText}>HEALTH CARE</Text>

              <View style={styles.bottleLine} />

              <Text style={styles.bottleSmall}>MEDICINE</Text>
            </View>
          </View>

          <View style={styles.capsule}>
            <View style={styles.capsuleBlue} />
            <View style={styles.capsuleWhite} />
          </View>

          <View style={styles.tablet}>
            <Text style={styles.tabletPlus}>+</Text>
          </View>
        </View>
      </View>

      {/* ================= SERVICES ================= */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complete Medicine Management</Text>

        <Text style={styles.sectionDescription}>
          Everything your medical shop needs to operate efficiently.
        </Text>

        <View style={styles.serviceGrid}>
          <ServiceCard
            title="Medicine Management"
            description="Manage medicines, categories and compositions."
          />

          <ServiceCard
            title="Stock Management"
            description="Track stock, batches, expiry and low inventory."
          />

          <ServiceCard
            title="Orders & Billing"
            description="Manage purchase orders, invoices and payments."
          />

          <ServiceCard
            title="Customer Management"
            description="Manage customers, prescriptions and orders."
          />
        </View>
      </View>

      {/* ================= ROLE SECTION ================= */}
      <View style={styles.roleSection}>
        <Text style={styles.sectionTitle}>Select Your Role</Text>

        <Text style={styles.sectionDescription}>
          Choose your role to access the medicine management system.
        </Text>

        <View style={styles.roleGrid}>
          {roles.map((role) => (
            <Pressable
              key={role}
              style={styles.roleCard}
              onPress={() => openLogin(role)}
            >
              <View style={styles.roleCircle}>
                <Text style={styles.roleCircleText}>+</Text>
              </View>

              <Text style={styles.roleTitle}>{role}</Text>

              <Text style={styles.roleLogin}>Login →</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ================= CTA ================= */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Ready to Manage Your Medicine Shop?</Text>

        <Text style={styles.ctaDescription}>
          Start using a simple and secure medicine management system.
        </Text>

        <Pressable style={styles.ctaButton} onPress={() => openLogin("Admin")}>
          <Text style={styles.ctaButtonText}>Login to System →</Text>
        </Pressable>
      </View>

      {/* ================= FOOTER ================= */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>MEDICARE</Text>

        <Text style={styles.footerText}>Secure • Simple • Reliable</Text>

        <Text style={styles.copyright}>
          © 2026 Medicine Shop Management System
        </Text>
      </View>
    </ScrollView>
  );
}

/* ================= SERVICE CARD ================= */

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceIcon}>
        <Text style={styles.serviceIconText}>+</Text>
      </View>

      <Text style={styles.serviceTitle}>{title}</Text>

      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FA",
  },

  content: {
    paddingBottom: 0,
  },

  /* HEADER */

  header: {
    backgroundColor: "#0D5367",
    minHeight: 82,
    paddingHorizontal: width > 800 ? 70 : 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoPlus: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#0D5367",
    lineHeight: 44,
    textAlign: "center",
    includeFontPadding: false,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  logoSubText: {
    color: "#CDE9EE",
    fontSize: 10,
    marginTop: 2,
  },

  headerButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingVertical: 11,
    borderRadius: 10,
  },

  headerButtonText: {
    color: "#0D5367",
    fontWeight: "700",
    fontSize: 14,
  },

  /* HERO */

  hero: {
    backgroundColor: "#0D5367",
    minHeight: 560,
    paddingHorizontal: width > 900 ? 80 : 25,
    paddingVertical: 65,
    flexDirection: width > 750 ? "row" : "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  heroTextContainer: {
    flex: 1,
    maxWidth: 650,
    justifyContent: "center",
  },

  smallBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#0A829A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 22,
  },

  smallBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: width > 900 ? 54 : 40,
    lineHeight: width > 900 ? 63 : 48,
    fontWeight: "800",
  },

  heroHighlight: {
    color: "#65D0D8",
  },

  heroDescription: {
    color: "#D5EDF1",
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 560,
    marginTop: 20,
  },

  heroButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30,
    gap: 12,
  },

  primaryButton: {
    backgroundColor: "#0A829A",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 11,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#80C9D1",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 11,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  /* 3D MEDICINE */

  medicineArea: {
    width: width > 900 ? 400 : width - 50,
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  glowCircle: {
    position: "absolute",
    width: 310,
    height: 310,
    borderRadius: 160,
    backgroundColor: "#0A829A",
    opacity: 0.28,
  },

  medicineBottle: {
    width: 155,
    height: 245,
    alignItems: "center",
    zIndex: 3,
  },

  bottleCap: {
    width: 90,
    height: 28,
    backgroundColor: "#DCEDEF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 4,
    borderBottomColor: "#A9CCD1",
  },

  bottleBody: {
    width: 150,
    height: 215,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: {
      width: 5,
      height: 8,
    },
  },

  bottleLogo: {
    fontSize: 40,
    fontWeight: "800",
    color: "#0D5367",
  },

  bottleTitle: {
    color: "#0D5367",
    fontSize: 18,
    fontWeight: "800",
  },

  bottleText: {
    color: "#0A829A",
    fontSize: 9,
    marginTop: 3,
  },

  bottleLine: {
    width: 80,
    height: 2,
    backgroundColor: "#D3E9ED",
    marginVertical: 15,
  },

  bottleSmall: {
    color: "#56747D",
    fontSize: 10,
    fontWeight: "600",
  },

  capsule: {
    position: "absolute",
    right: 30,
    bottom: 55,
    width: 95,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    overflow: "hidden",
    transform: [{ rotate: "-25deg" }],
    elevation: 10,
  },

  capsuleBlue: {
    flex: 1,
    backgroundColor: "#0A829A",
  },

  capsuleWhite: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  tablet: {
    position: "absolute",
    left: 35,
    bottom: 65,
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    transform: [{ rotate: "20deg" }],
  },

  tabletPlus: {
    color: "#0D5367",
    fontSize: 30,
    fontWeight: "800",
  },

  /* SERVICES */

  section: {
    paddingHorizontal: width > 900 ? 80 : 25,
    paddingVertical: 70,
    backgroundColor: "#F5F9FA",
  },

  sectionTitle: {
    color: "#153B47",
    fontSize: width > 900 ? 32 : 26,
    fontWeight: "800",
    textAlign: "center",
  },

  sectionDescription: {
    color: "#617A82",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
  },

  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginTop: 40,
  },

  serviceCard: {
    backgroundColor: "#FFFFFF",
    width: width > 900 ? 250 : width > 600 ? 280 : width - 50,
    minHeight: 190,
    padding: 25,
    borderRadius: 18,
    elevation: 5,
    shadowColor: "#0D5367",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#EAF6F8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  serviceIconText: {
    color: "#0D5367",
    fontSize: 30,
    fontWeight: "700",
  },

  serviceTitle: {
    color: "#153B47",
    fontSize: 17,
    fontWeight: "800",
  },

  serviceDescription: {
    color: "#70868D",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },

  /* ROLES */

  roleSection: {
    backgroundColor: "#EAF6F8",
    paddingHorizontal: width > 900 ? 80 : 25,
    paddingVertical: 70,
  },

  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 18,
    marginTop: 40,
  },

  roleCard: {
    width: width > 900 ? 180 : width > 600 ? 180 : width - 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#0D5367",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  roleCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#0D5367",
    alignItems: "center",
    justifyContent: "center",
  },

  roleCircleText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  roleTitle: {
    color: "#153B47",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
    textAlign: "center",
  },

  roleLogin: {
    color: "#0A829A",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },

  /* CTA */

  cta: {
    backgroundColor: "#0D5367",
    paddingHorizontal: 25,
    paddingVertical: 70,
    alignItems: "center",
  },

  ctaTitle: {
    color: "#FFFFFF",
    fontSize: width > 900 ? 32 : 25,
    fontWeight: "800",
    textAlign: "center",
  },

  ctaDescription: {
    color: "#CDE9EE",
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },

  ctaButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 11,
    marginTop: 25,
  },

  ctaButtonText: {
    color: "#0D5367",
    fontSize: 15,
    fontWeight: "800",
  },

  /* FOOTER */

  footer: {
    backgroundColor: "#083C4A",
    paddingVertical: 35,
    alignItems: "center",
  },

  footerLogo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2,
  },

  footerText: {
    color: "#B9DDE2",
    fontSize: 13,
    marginTop: 8,
  },

  copyright: {
    color: "#87AEB5",
    fontSize: 11,
    marginTop: 15,
  },
});
