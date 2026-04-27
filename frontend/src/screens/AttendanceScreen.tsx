import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import {
  AnimatedReveal,
  GradientBackground,
  Button,
  Alert,
  StatsCard,
  SectionHeader,
} from "../components";
import { scanAttendance } from "../services/api";
import { theme } from "../theme/theme";

type Params = { params: { token: string } };

/**
 * Attendance Screen - QR Code & Geo-fence Based Attendance Tracking
 * Features: QR scanning, geofence verification, attendance history
 */
export function AttendanceScreen() {
  const route = useRoute<RouteProp<Params, "params">>();
  const token = route.params?.token;

  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attendance, setAttendance] = useState(85);

  const handleScanQR = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate QR scan
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess("Attendance marked successfully!");
      setAttendance((prev) => Math.min(prev + 2, 100));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeofenceVerification = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!token) {
        setError("Session expired. Please login again.");
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setError("Location permission denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const response = await scanAttendance(
        token,
        location.coords.latitude,
        location.coords.longitude
      );

      if (response.marked) {
        setSuccess("Attendance marked successfully!");
        setAttendance((prev) => Math.min(prev + 2, 100));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.reason || "Failed to mark attendance.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("Attendance service unavailable or location error.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const attendanceRecords = [
    { date: "Today", time: "09:45 AM", course: "Data Structures", status: "present" },
    { date: "Yesterday", time: "10:15 AM", course: "Web Dev", status: "present" },
    { date: "Mar 20", time: "N/A", course: "Algorithms", status: "absent" },
    { date: "Mar 19", time: "09:30 AM", course: "Database", status: "present" },
  ];

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AnimatedReveal delay={0}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Smart Attendance</Text>
            <Text style={styles.subtitle}>QR Code & Geofence Enabled</Text>
          </View>
        </AnimatedReveal>

        {/* Stats */}
        <AnimatedReveal delay={50}>
          <View style={styles.statsContainer}>
            <StatsCard
              icon="checkmark-circle-outline"
              label="Attendance Rate"
              value={attendance}
              unit="%"
              trend={attendance >= 75 ? "up" : "down"}
              trendValue={attendance >= 75 ? "Good Standing" : "At Risk"}
            />
          </View>
        </AnimatedReveal>

        {/* Alerts */}
        {error && (
          <AnimatedReveal delay={100}>
            <Alert
              type="danger"
              title="Verification Failed"
              message={error}
              onDismiss={() => setError("")}
            />
          </AnimatedReveal>
        )}

        {success && (
          <AnimatedReveal delay={100}>
            <Alert
              type="success"
              title="Success!"
              message={success}
              onDismiss={() => setSuccess("")}
            />
          </AnimatedReveal>
        )}

        {/* QR Scanner Section */}
        <AnimatedReveal delay={150}>
          <SectionHeader title="Mark Attendance" />
        </AnimatedReveal>

        <AnimatedReveal delay={200}>
          <View style={styles.actionContainer}>
            <Pressable
              style={styles.qrCard}
              onPress={handleScanQR}
              disabled={loading}
            >
              <Ionicons
                name="qr-code-outline"
                size={48}
                color={theme.colors.accentPrimary}
              />
              <Text style={styles.qrCardTitle}>Scan QR Code</Text>
              <Text style={styles.qrCardSubtext}>
                Ask your instructor for today's code
              </Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.locationCard}
              onPress={handleGeofenceVerification}
              disabled={loading}
            >
              <Ionicons
                name="location-outline"
                size={48}
                color={theme.colors.accentPrimary}
              />
              <Text style={styles.locationCardTitle}>Auto-Verify (Geofence)</Text>
              <Text style={styles.locationCardSubtext}>
                Must be on campus premises
              </Text>
            </Pressable>
          </View>
        </AnimatedReveal>

        {/* Attendance History */}
        <AnimatedReveal delay={300}>
          <SectionHeader title="Recent Attendance" />
        </AnimatedReveal>

        <AnimatedReveal delay={350}>
          <View style={styles.historyContainer}>
            {attendanceRecords.map((record, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          record.status === "present"
                            ? "rgba(43, 203, 138, 0.2)"
                            : "rgba(215, 38, 61, 0.2)",
                      },
                    ]}
                  >
                    <Ionicons
                      name={record.status === "present" ? "checkmark" : "close"}
                      size={16}
                      color={
                        record.status === "present"
                          ? theme.colors.success
                          : theme.colors.danger
                      }
                    />
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyDate}>{record.date}</Text>
                    <Text style={styles.historyCourse}>{record.course}</Text>
                  </View>
                </View>
                <Text style={styles.historyTime}>{record.time}</Text>
              </View>
            ))}
          </View>
        </AnimatedReveal>

        {/* Info Card */}
        <AnimatedReveal delay={400}>
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.colors.info}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Pro Tip</Text>
              <Text style={styles.infoText}>
                Keep your location enabled for geofence-based attendance marking.
              </Text>
            </View>
          </View>
        </AnimatedReveal>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  actionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  qrCard: {
    backgroundColor: "rgba(215, 38, 61, 0.1)",
    borderWidth: 2,
    borderColor: theme.colors.accentPrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  qrCardTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  qrCardSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    marginHorizontal: theme.spacing.md,
  },
  locationCard: {
    backgroundColor: "rgba(139, 155, 179, 0.1)",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  locationCardTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  locationCardSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  historyContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  historyCourse: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  historyTime: {
    ...theme.typography.bodySmall,
    color: theme.colors.accentPrimary,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  infoTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
