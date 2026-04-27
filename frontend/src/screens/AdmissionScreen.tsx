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
  Badge,
  SectionHeader,
  Divider,
} from "../components";
import { checkEligibility } from "../services/api";
import { theme } from "../theme/theme";

type Params = { params: { token: string } };

/**
 * Admission Screen - Smart admission form with OCR and eligibility check
 * Features: Document scanning, form validation, eligibility checking, status tracking
 */
export function AdmissionScreen() {
  const route = useRoute<RouteProp<Params, "params">>();
  const token = route.params?.token;

  // Form state
  const [fullName, setFullName] = useState("");
  const [cnic, setCnic] = useState("");
  const [previousMarks, setPreviousMarks] = useState("");
  const [program, setProgram] = useState("");
  const [cgpa, setCgpa] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Result states
  const [loading, setLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState<"application" | "status">("application");

  const programs = [
    { id: 1, name: "Computer Science (BS)" },
    { id: 2, name: "Business Administration (BBA)" },
    { id: 3, name: "Engineering (BS)" },
    { id: 4, name: "Medicine (MBBS)" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!cnic.trim()) newErrors.cnic = "CNIC is required";
    if (!previousMarks) newErrors.previousMarks = "Previous marks are required";
    if (Number(previousMarks) < 0 || Number(previousMarks) > 100) {
      newErrors.previousMarks = "Marks must be between 0-100";
    }
    if (!program) newErrors.program = "Select a program";
    if (!cgpa) newErrors.cgpa = "CGPA is required";
    if (Number(cgpa) < 0 || Number(cgpa) > 4) {
      newErrors.cgpa = "CGPA must be between 0-4";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckEligibility = async () => {
    if (!validateForm()) return;

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await checkEligibility(
        token,
        Number(previousMarks),
        60
      );
      setEligibilityResult(response);
    } catch (err) {
      console.error("Eligibility check error:", err);
      setError("Could not check eligibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!validateForm()) return;
    setError("Application submitted successfully!");
    setTimeout(() => setError(""), 3000);
  };

  const handleScanDocument = async () => {
    // TODO: Implement camera/gallery access for OCR
    setError("Camera scanner would open here");
    setTimeout(() => setError(""), 2000);
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AnimatedReveal delay={0}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Smart Admission</Text>
            <Text style={styles.subtitle}>
              Apply to your favorite program
            </Text>
          </View>
        </AnimatedReveal>

        {/* Tabs */}
        <AnimatedReveal delay={50}>
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => setActiveTab("application")}
              style={[
                styles.tab,
                activeTab === "application" && styles.tabActive,
              ]}
            >
              <Ionicons
                name="document-outline"
                size={18}
                color={
                  activeTab === "application"
                    ? theme.colors.textInverse
                    : theme.colors.textSecondary
                }
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "application" && styles.tabTextActive,
                ]}
              >
                Application
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("status")}
              style={[styles.tab, activeTab === "status" && styles.tabActive]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={
                  activeTab === "status"
                    ? theme.colors.textInverse
                    : theme.colors.textSecondary
                }
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "status" && styles.tabTextActive,
                ]}
              >
                Status
              </Text>
            </Pressable>
          </View>
        </AnimatedReveal>

        {/* Content */}
        {activeTab === "application" ? (
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

            {/* Document Scanning */}
            <AnimatedReveal delay={150}>
              <SectionHeader title="Document Upload" />
            </AnimatedReveal>

            <AnimatedReveal delay={200}>
              <View style={styles.documentContainer}>
                <Pressable
                  style={styles.scanButton}
                  onPress={handleScanDocument}
                >
                  <Ionicons
                    name="camera-outline"
                    size={32}
                    color={theme.colors.accentPrimary}
                  />
                  <Text style={styles.scanButtonText}>
                    Scan Document with OCR
                  </Text>
                  <Text style={styles.scanButtonSubtext}>
                    CNIC / Education Certificate
                  </Text>
                </Pressable>
              </View>
            </AnimatedReveal>

            {/* Application Form */}
            <AnimatedReveal delay={250}>
              <SectionHeader title="Application Form" />
            </AnimatedReveal>

            <View style={styles.formContainer}>
              {/* Full Name */}
              <AnimatedReveal delay={300}>
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  error={errors.fullName}
                  icon="person-outline"
                  containerStyle={styles.inputField}
                />
              </AnimatedReveal>

              {/* CNIC */}
              <AnimatedReveal delay={350}>
                <Input
                  label="CNIC Number"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={cnic}
                  onChangeText={setCnic}
                  error={errors.cnic}
                  icon="card-outline"
                  containerStyle={styles.inputField}
                />
              </AnimatedReveal>

              {/* Previous Marks */}
              <AnimatedReveal delay={400}>
                <Input
                  label="Previous Marks (%)​"
                  placeholder="Enter percentage"
                  value={previousMarks}
                  onChangeText={setPreviousMarks}
                  error={errors.previousMarks}
                  icon="school-outline"
                  keyboardType="decimal-pad"
                  containerStyle={styles.inputField}
                />
              </AnimatedReveal>

              {/* CGPA */}
              <AnimatedReveal delay={450}>
                <Input
                  label="CGPA"
                  placeholder="Out of 4.0"
                  value={cgpa}
                  onChangeText={setCgpa}
                  error={errors.cgpa}
                  icon="star-outline"
                  keyboardType="decimal-pad"
                  containerStyle={styles.inputField}
                />
              </AnimatedReveal>

              {/* Program Selection */}
              <AnimatedReveal delay={500}>
                <View style={styles.inputField}>
                  <Text style={styles.programLabel}>Select Program</Text>
                  <View style={styles.programGrid}>
                    {programs.map((prog) => (
                      <Pressable
                        key={prog.id}
                        onPress={() => setProgram(prog.name)}
                        style={[
                          styles.programPill,
                          program === prog.name && styles.programPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.programText,
                            program === prog.name &&
                              styles.programTextActive,
                          ]}
                        >
                          {prog.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {errors.program && (
                    <Text style={styles.errorText}>{errors.program}</Text>
                  )}
                </View>
              </AnimatedReveal>

              {/* Eligibility Result */}
              {eligibilityResult && (
                <AnimatedReveal delay={550}>
                  <View style={styles.resultContainer}>
                    <View style={styles.resultHeader}>
                      <Ionicons
                        name={
                          eligibilityResult.eligible
                            ? "checkmark-circle"
                            : "close-circle"
                        }
                        size={24}
                        color={
                          eligibilityResult.eligible
                            ? theme.colors.success
                            : theme.colors.danger
                        }
                      />
                      <Text style={styles.resultTitle}>
                        {eligibilityResult.eligible
                          ? "Congratulations!"
                          : "Not Eligible"}
                      </Text>
                    </View>
                    <Divider style={styles.resultDivider} />
                    <Text style={styles.resultMessage}>
                      {eligibilityResult.message}
                    </Text>
                    <View style={styles.resultDetails}>
                      <View style={styles.resultDetail}>
                        <Text style={styles.resultLabel}>Required:</Text>
                        <Text style={styles.resultValue}>
                          {eligibilityResult.required_marks}%
                        </Text>
                      </View>
                      <View style={styles.resultDetail}>
                        <Text style={styles.resultLabel}>Your Score:</Text>
                        <Text style={styles.resultValue}>
                          {eligibilityResult.obtained_marks}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </AnimatedReveal>
              )}

              {/* Buttons */}
              <View style={styles.buttonGroup}>
                <AnimatedReveal delay={600}>
                  <Button
                    label="Check Eligibility"
                    onPress={handleCheckEligibility}
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    size="lg"
                    variant="primary"
                  />
                </AnimatedReveal>

                <AnimatedReveal delay={650}>
                  <Button
                    label="Submit Application"
                    onPress={handleSubmitApplication}
                    disabled={loading}
                    fullWidth
                    size="lg"
                    variant="secondary"
                  />
                </AnimatedReveal>
              </View>
            </View>
          </>
        ) : (
          // Status Tab
          <AnimatedReveal delay={100}>
            <View style={styles.statusContainer}>
              <View style={styles.statusCard}>
                <View style={styles.statusIndicator}>
                  <Ionicons
                    name="hourglass-outline"
                    size={48}
                    color={theme.colors.warning}
                  />
                </View>
                <Text style={styles.statusTitle}>Application Pending</Text>
                <Text style={styles.statusText}>
                  Your application is under review
                </Text>
                <Badge variant="warning" label="Pending Review" />
                <Text style={styles.statusDate}>
                  Submitted on: 15 March 2024
                </Text>
              </View>
            </View>
          </AnimatedReveal>
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
  documentContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  scanButton: {
    backgroundColor: "rgba(215, 38, 61, 0.1)",
    borderWidth: 2,
    borderColor: theme.colors.accentPrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonText: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  scanButtonSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  programLabel: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  programGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  programPill: {
    flex: 1,
    minWidth: "48%",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfacePrimary,
  },
  programPillActive: {
    backgroundColor: theme.colors.accentPrimary,
    borderColor: theme.colors.accentLight,
  },
  programText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
  programTextActive: {
    color: theme.colors.textInverse,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
  },
  resultContainer: {
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.md,
  },
  resultDivider: {
    marginVertical: theme.spacing.md,
  },
  resultMessage: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  resultDetails: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  resultDetail: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: theme.radius.md,
  },
  resultLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  resultValue: {
    ...theme.typography.h4,
    color: theme.colors.accentPrimary,
    marginTop: theme.spacing.xs,
  },
  buttonGroup: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statusContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  statusCard: {
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusIndicator: {
    marginBottom: theme.spacing.lg,
  },
  statusTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  statusText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  statusDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.lg,
  },
});
