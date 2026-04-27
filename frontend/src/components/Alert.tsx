import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

interface AlertProps {
  type?: "success" | "warning" | "danger" | "info";
  title?: string;
  message: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function Alert({
  type = "info",
  title,
  message,
  onDismiss,
  actionLabel,
  onAction,
}: AlertProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          background: "rgba(43, 203, 138, 0.1)",
          border: theme.colors.success,
          icon: "checkmark-circle",
          iconColor: theme.colors.success,
        };
      case "warning":
        return {
          background: "rgba(247, 185, 85, 0.1)",
          border: theme.colors.warning,
          icon: "alert-circle",
          iconColor: theme.colors.warning,
        };
      case "danger":
        return {
          background: "rgba(215, 38, 61, 0.1)",
          border: theme.colors.danger,
          icon: "close-circle",
          iconColor: theme.colors.danger,
        };
      default:
        return {
          background: "rgba(139, 155, 179, 0.1)",
          border: theme.colors.info,
          icon: "information-circle",
          iconColor: theme.colors.info,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: typeStyles.background,
          borderColor: typeStyles.border,
        },
      ]}
    >
      <Ionicons
        name={typeStyles.icon as any}
        size={20}
        color={typeStyles.iconColor}
        style={styles.icon}
      />
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
        {actionLabel && (
          <Pressable onPress={onAction} style={styles.actionButton}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
      {onDismiss && (
        <Pressable onPress={onDismiss} style={styles.closeButton}>
          <Ionicons name="close" size={18} color={theme.colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderLeftWidth: 4,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actionButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  actionText: {
    ...theme.typography.button,
    color: theme.colors.accentPrimary,
  },
  closeButton: {
    marginLeft: theme.spacing.md,
    justifyContent: "flex-start",
  },
});
