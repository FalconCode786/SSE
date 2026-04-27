import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View, Text, Pressable, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AnimatedReveal,
  GradientBackground,
  StatsCard,
  Alert,
  Loading,
  Divider,
  SectionHeader,
  Badge,
} from "../components";
import { fetchDashboard } from "../services/api";
import { theme } from "../theme/theme";
import { DashboardData } from "../types/app";

type Params = { params: { token: string } };

/**
 * Dashboard Screen - Student/Faculty Dashboard with real-time stats
 * Features: Attendance tracking, assignments, schedule, predictive alerts
 */
export function DashboardScreen() {
  const route = useRoute<RouteProp<Params, "params">>();
  const token = route.params?.token;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    if (!token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const result = await fetchDashboard(token);
      setData(result);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <GradientBackground>
        <Loading fullScreen />
      </GradientBackground>
    );
  }

  const attendanceStatus =
    (data?.attendance_percentage ?? 0) >= 75
      ? "good"
      : (data?.attendance_percentage ?? 0) >= 60
        ? "warning"
        : "danger";

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accentPrimary}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <AnimatedReveal>
            <Text style={styles.greeting}>Welcome Back!</Text>
            <Text style={styles.subheading}>Here's your daily overview</Text>
          </AnimatedReveal>
        </View>

        {/* Error Alert */}
        {error && (
          <AnimatedReveal delay={50}>
            <Alert
              type="danger"
              title="Load Error"
              message={error}
              onDismiss={() => setError("")}
            />
          </AnimatedReveal>
        )}

        {/* Key Stats Section */}
        <AnimatedReveal delay={100}>
          <SectionHeader
            title="Today's Overview"
            subtitle="Your current status & metrics"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={150}>
          <View style={styles.statsGrid}>
            <StatsCard
              icon="checkmark-circle-outline"
              label="Attendance"
              value={data?.attendance_percentage ?? 0}
              unit="%"
              trend={attendanceStatus === "good" ? "up" : "down"}
              trendValue={
                attendanceStatus === "good"
                  ? "+2% this week"
                  : attendanceStatus === "warning"
                    ? "At risk"
                    : "Critical"
              }
              backgroundColor={
                attendanceStatus === "good"
                  ? "rgba(43, 203, 138, 0.1)"
                  : attendanceStatus === "warning"
                    ? "rgba(247, 185, 85, 0.1)"
                    : "rgba(215, 38, 61, 0.1)"
              }
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={200}>
          <View style={styles.statsGrid}>
            <StatsCard
              icon="document-text-outline"
              label="Pending Tasks"
              value={data?.pending_assignments ?? 0}
              unit="due"
              trend={
                (data?.pending_assignments ?? 0) > 0 ? "down" : undefined
              }
              trendValue={
                (data?.pending_assignments ?? 0) > 0
                  ? "1 due today"
                  : "None due"
              }
            />
          </View>
        </AnimatedReveal>

        {/* Alerts Section */}
        <AnimatedReveal delay={250}>
          <View style={styles.alertsSection}>
            {(data?.attendance_percentage ?? 100) < 75 && (
              <Alert
                type="warning"
                title="Low Attendance Alert"
                message={`Your attendance is ${data?.attendance_percentage}%. Maintain 75% to remain eligible.`}
              />
            )}
            {(data?.pending_assignments ?? 0) > 0 && (
              <Alert
                type="info"
                title="Assignments Pending"
                message={`You have ${data?.pending_assignments} assignment(s) to submit.`}
              />
            )}
          </View>
        </AnimatedReveal>

        {/* Schedule Section */}
        <AnimatedReveal delay={300}>
          <SectionHeader title="Today's Schedule" />
        </AnimatedReveal>

        <AnimatedReveal delay={350}>
          <View style={styles.scheduleContainer}>
            {(data?.today_schedule ?? []).length > 0 ? (
              (data?.today_schedule ?? []).map((item, index) => (
                <Pressable key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleTime}>
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={theme.colors.accentPrimary}
                    />
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleTitle}>{item}</Text>
                    <Text style={styles.scheduleSubtitle}>
                      In 2 hours • Room 305
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textTertiary}
                  />
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={48}
                  color={theme.colors.textTertiary}
                />
                <Text style={styles.emptyStateText}>No classes today</Text>
              </View>
            )}
          </View>
        </AnimatedReveal>

        {/* Quick Actions */}
        <AnimatedReveal delay={400}>
          <View style={styles.actionSection}>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="download-outline"
                  size={24}
                  color={theme.colors.textInverse}
                />
              </View>
              <Text style={styles.actionLabel}>Download Report</Text>
            </Pressable>

            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={theme.colors.textInverse}
                />
              </View>
              <Text style={styles.actionLabel}>Message Faculty</Text>
            </Pressable>
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
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statsGrid: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  alertsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
  },
  scheduleContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  scheduleTime: {
    marginRight: theme.spacing.md,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  scheduleSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.md,
  },
  actionSection: {
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.accentPrimary,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.md,
  },
  actionIcon: {
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    ...theme.typography.caption,
    color: theme.colors.textInverse,
    fontWeight: "600",
    textAlign: "center",
  },
});
