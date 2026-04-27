import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AnimatedReveal,
  GradientBackground,
  Hero3D,
  Input,
  Button,
  Alert,
} from "../components";
import { login } from "../services/api";
import { theme } from "../theme/theme";
import { UserRole } from "../types/app";

interface Session {
  token: string;
  role: UserRole;
}

interface Props {
  onLogin: (session: Session) => void;
}

/**
 * Login Screen - Enterprise-level authentication UI
 * Features: Email validation, role selection, error handling, animations
 */
export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState("student@example.com");
  const [emailError, setEmailError] = useState("");
  const [role, setRole] = useState<UserRole>("enrolled_student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const roles: { value: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "prospective_student", label: "Applicant", icon: "document-text-outline" },
    { value: "enrolled_student", label: "Student", icon: "school-outline" },
    { value: "faculty", label: "Faculty", icon: "person-outline" },
    { value: "admin", label: "Admin", icon: "shield-outline" },
  ];

  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && validateEmail(text)) {
      setEmailError("");
    }
  };

  const handleLogin = async () => {
    setError("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, role);
      onLogin({ token: result.access_token, role: result.role as UserRole });
    } catch (err) {
      setError("Unable to connect to backend. Please check if the Flask server is running.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AnimatedReveal delay={0}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Smart Portal</Text>
            <Text style={styles.subtitle}>
              AI-driven campus experience in one app
            </Text>
          </View>
        </AnimatedReveal>

        {/* 3D Hero */}
        <AnimatedReveal delay={100}>
          <Hero3D />
        </AnimatedReveal>

        {/* Form Container */}
        <AnimatedReveal delay={200}>
          <View style={styles.formContainer}>
            {/* Error Alert */}
            {error && (
              <Alert
                type="danger"
                title="Login Failed"
                message={error}
                onDismiss={() => setError("")}
              />
            )}

            {/* Email Input */}
            <View style={styles.formSection}>
              <Input
                label="Email Address"
                placeholder="name@college.edu"
                value={email}
                onChangeText={handleEmailChange}
                error={emailError}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Role Selection */}
            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Select Your Role</Text>
              <View style={styles.roleGrid}>
                {roles.map((item) => (
                  <Pressable
                    key={item.value}
                    onPress={() => setRole(item.value)}
                    style={[
                      styles.rolePill,
                      role === item.value && styles.rolePillActive,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={
                        role === item.value
                          ? theme.colors.textInverse
                          : theme.colors.textSecondary
                      }
                      style={styles.roleIcon}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        role === item.value && styles.roleTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Remember Me */}
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberRow}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxActive,
                ]}
              >
                {rememberMe && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={theme.colors.textInverse}
                  />
                )}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            {/* Login Button */}
            <Button
              label={loading ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              fullWidth
              size="lg"
              style={styles.loginButton}
            />

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Need help?{" "}
                <Text style={styles.footerLink}>Contact support</Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  headerContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  formContainer: {
    backgroundColor: `rgba(${13}, ${42}, ${87}, 0.5)`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  formSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  rolePill: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfacePrimary,
    ...theme.shadows.sm,
  },
  rolePillActive: {
    backgroundColor: theme.colors.accentPrimary,
    borderColor: theme.colors.accentLight,
  },
  roleIcon: {
    marginRight: theme.spacing.sm,
  },
  roleText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  roleTextActive: {
    color: theme.colors.textInverse,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  checkboxActive: {
    backgroundColor: theme.colors.accentPrimary,
    borderColor: theme.colors.accentPrimary,
  },
  rememberText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    color: theme.colors.accentPrimary,
    fontWeight: "600",
  },
});
