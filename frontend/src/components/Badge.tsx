import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "primary";
  size?: "sm" | "md";
}

export function Badge({ label, variant = "info", size = "sm" }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return { background: theme.colors.success, text: theme.colors.textInverse };
      case "warning":
        return { background: theme.colors.warning, text: theme.colors.textInverse };
      case "danger":
        return { background: theme.colors.danger, text: theme.colors.textInverse };
      case "primary":
        return { background: theme.colors.accentPrimary, text: theme.colors.textInverse };
      default:
        return { background: theme.colors.surfaceSecondary, text: theme.colors.textSecondary };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyle = size === "sm" ? styles.sizeSm : styles.sizeMd;
  const textSize = size === "sm" ? styles.textSm : styles.textMd;

  return (
    <View
      style={[
        styles.badge,
        sizeStyle,
        { backgroundColor: variantStyles.background },
      ]}
    >
      <Text style={[styles.text, textSize, { color: variantStyles.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeSm: {
    paddingVertical: theme.spacing.sm,
    minHeight: 24,
  },
  sizeMd: {
    paddingVertical: theme.spacing.md,
    minHeight: 32,
  },
  text: {
    fontWeight: "600",
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 13,
  },
});
