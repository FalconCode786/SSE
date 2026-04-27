import React, { useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AnimatedReveal,
  GradientBackground,
  Input,
  Button,
  Alert,
  StatsCard,
  SectionHeader,
  Badge,
} from "../components";
import { fetchPredictiveAlert } from "../services/api";
import { theme } from "../theme/theme";

type Params = { params: { token: string } };

/**
 * Admin Screen - Faculty/Admin Dashboard with Analytics & Alerts
 * Features: Student analytics, attendance review, predictive alerts, risk scoring
 */
export function AdminScreen() {
  const route = useRoute<RouteProp<Params, "params">>();
  const token = route.params?.token;

  const [studentId, setStudentId] = useState("stu-1001");
  const [studentIdError, setStudentIdError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"analytics" | "alerts">("analytics");

  const handleAnalyzeStudent = async () => {
    setStudentIdError("");
    setError("");
    setAnalysis(null);

    if (!studentId.trim()) {
      setStudentIdError("Student ID is required");
      return;
    }

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchPredictiveAlert(token, studentId);
      setAnalysis(response);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskScore: number) => {
    if (riskScore >= 70) return { color: theme.colors.danger, label: "Critical" };
    if (riskScore >= 50) return { color: theme.colors.warning, label: "High" };
    if (riskScore >= 30) return { color: "#FFA500", label: "Medium" };
    return { color: theme.colors.success, label: "Low" };
  };

  const topAtRiskStudents = [
    {
      id: "STU-1024",
      name: "Ahmed Ali",
      risk: 82,
      reason: "Attendance < 60%",
    },
    {
      id: "STU-1015",
      name: "Fatima Khan",
      risk: 71,
      reason: "Low assignment scores",
    },
    {
      id: "STU-1008",
      name: "Hassan Malik",
      risk: 65,
      reason: "Declining performance",
    },
  ];

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AnimatedReveal delay={0}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Analytics & Alerts</Text>
            <Text style={styles.subtitle}>Student performance insights</Text>
          </View>
        </AnimatedReveal>

        {/* Tabs */}
        <AnimatedReveal delay={50}>
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => setActiveTab("analytics")}
              style={[
                styles.tab,
                activeTab === "analytics" && styles.tabActive,
              ]}
            >
              <Ionicons
                name="analytics-outline"
                size={18}
                color={
                  activeTab === "analytics"
                    ? theme.colors.textInverse
                    : theme.colors.textSecondary
                }
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "analytics" && styles.tabTextActive,
                ]}
              >
                Analytics
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("alerts")}
              style={[styles.tab, activeTab === "alerts" && styles.tabActive]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={
                  activeTab === "alerts"
                    ? theme.colors.textInverse
                    : theme.colors.textSecondary
                }
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "alerts" && styles.tabTextActive,
                ]}
              >
                Alerts
              </Text>
            </Pressable>
          </View>
        </AnimatedReveal>

        {/* Content */}
        {activeTab === "analytics" ? (
          <>
            {/* Error Alert */}
            {error && (
              <AnimatedReveal delay={100}>
                <Alert
                  type="danger"
                  title="Error"
                  message={error}
                  onDismiss={() => setError("")}
                />
              </AnimatedReveal>
            )}

            {/* Student Search */}
            <AnimatedReveal delay={150}>
              <SectionHeader title="Student Analysis" />
            </AnimatedReveal>

            <View style={styles.formContainer}>
              <AnimatedReveal delay={200}>
                <Input
                  label="Student ID"
                  placeholder="Enter student ID"
                  value={studentId}
                  onChangeText={setStudentId}
                  error={studentIdError}
                  icon="person-outline"
                  containerStyle={styles.inputField}
                />
              </AnimatedReveal>

              <AnimatedReveal delay={250}>
                <Button
                  label="Analyze Student"
                  onPress={handleAnalyzeStudent}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                  size="lg"
                />
              </AnimatedReveal>
            </View>

            {/* Analysis Result */}
            {analysis && (
              <AnimatedReveal delay={300}>
                <View style={styles.analysisContainer}>
                  <View style={styles.riskCardHeader}>
                    <View>
                      <Text style={styles.studentName}>
                        {analysis.student_name || "Student " + studentId}
                      </Text>
                      <Text style={styles.studentId}>{studentId}</Text>
                    </View>
                    <Badge
                      label={getRiskLevelColor(analysis.risk_score).label}
                      variant={
                        analysis.risk_score >= 70
                          ? "danger"
                          : analysis.risk_score >= 50
                            ? "warning"
                            : "success"
                      }
                    />
                  </View>

                  <View style={styles.riskScoreContainer}>
                    <Text style={styles.riskScoreLabel}>Risk Score</Text>
                    <Text
                      style={[
                        styles.riskScoreValue,
                        {
                          color: getRiskLevelColor(analysis.risk_score).color,
                        },
                      ]}
                    >
                      {analysis.risk_score}%
                    </Text>
                  </View>

                  {analysis.message && (
                    <Text style={styles.analysisMessage}>
                      {analysis.message}
                    </Text>
                  )}
                </View>
              </AnimatedReveal>
            )}
          </>
        ) : (
          <>
            {/* At-Risk Students */}
            <AnimatedReveal delay={150}>
              <SectionHeader title="At-Risk Students" />
            </AnimatedReveal>

            <AnimatedReveal delay={200}>
              <View style={styles.alertsContainer}>
                {topAtRiskStudents.map((student, index) => (
                  <Pressable
                    key={student.id}
                    style={styles.alertItem}
                  >
                    <View style={styles.alertLeft}>
                      <View
                        style={[
                          styles.riskIndicator,
                          {
                            backgroundColor: `${getRiskLevelColor(student.risk).color}30`,
                          },
                        ]}
                      >
                        <Ionicons
                          name="alert"
                          size={20}
                          color={getRiskLevelColor(student.risk).color}
                        />
                      </View>
                      <View style={styles.alertDetails}>
                        <Text style={styles.alertName}>{student.name}</Text>
                        <Text style={styles.alertReason}>
                          {student.reason}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.alertRight}>
                      <Text
                        style={[
                          styles.alertScore,
                          {
                            color: getRiskLevelColor(student.risk).color,
                          },
                        ]}
                      >
                        {student.risk}%
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </AnimatedReveal>

            {/* Quick Actions */}
            <AnimatedReveal delay={300}>
              <SectionHeader title="Actions" />
            </AnimatedReveal>

            <AnimatedReveal delay={350}>
              <View style={styles.actionsContainer}>
                <Button
                  label="Send Mass Alert"
                  onPress={() => {}}
                  variant="primary"
                  icon={
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={theme.colors.textInverse}
                    />
                  }
                  fullWidth
                  style={styles.actionButton}
                />
                <Button
                  label="Generate Report"
                  onPress={() => {}}
                  variant="secondary"
                  icon={
                    <Ionicons
                      name="download-outline"
                      size={18}
                      color={theme.colors.textSecondary}
                    />
                  }
                  fullWidth
                  style={styles.actionButton}
                />
              </View>
            </AnimatedReveal>
          </>
        )}
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
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.accentPrimary,
  },
  tabIcon: {
    marginRight: theme.spacing.sm,
  },
  tabText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: theme.colors.textInverse,
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  analysisContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  riskCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  studentName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  studentId: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  riskScoreContainer: {
    backgroundColor: "rgba(215, 38, 61, 0.05)",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: "center",
  },
  riskScoreLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  riskScoreValue: {
    ...theme.typography.h1,
    fontWeight: "700",
    marginTop: theme.spacing.sm,
  },
  analysisMessage: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    lineHeight: 22,
  },
  alertsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  alertLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  riskIndicator: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  alertDetails: {
    flex: 1,
  },
  alertName: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
  },
  alertReason: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  alertRight: {
    marginLeft: theme.spacing.md,
  },
  alertScore: {
    ...theme.typography.h4,
    fontWeight: "700",
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
   message: {
    color: "#ECF2FD",
    lineHeight: 20,
  },
  risk: {
    color: "#FFD0D6",
    marginTop: 8,
    fontWeight: "700",
  },
});
 

