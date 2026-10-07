import { Redirect, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { normalizeRole } from "../../constants/roles";

export default function RoleDashboard() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const dashboardRole = normalizeRole(role);

  if (!dashboardRole) {
    return <Redirect href="/Login/role" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dashboardRole} Dashboard</Text>
      <Text style={styles.message}>Welcome to your dashboard</Text>
      <Text style={styles.role}>Role: {dashboardRole}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "#F5F9FA",
  },
  title: {
    color: "#0D5367",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    color: "#334155",
    fontSize: 16,
    textAlign: "center",
  },
  role: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
  },
});
