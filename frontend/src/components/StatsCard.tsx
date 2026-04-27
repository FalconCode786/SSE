import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

interface StatsCardProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function StatsCard({
  icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  backgroundColor,
  style,
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return theme.colors.success;
      case "down":
        return theme.colors.danger;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "arrow-up";
      case "down":
        return "arrow-down";
      default:
        return "remove";
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor || theme.colors.surfacePrimary },
        style,
      ]}
    >
      <View style={styles.header}>
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={theme.colors.accentPrimary}
            style={styles.icon}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>

        {trend && (
          <View style={[styles.trend, { backgroundColor: `${getTrendColor()}20` }]}>
            <Ionicons
              name={getTrendIcon() as any}
              size={14}
              color={getTrendColor()}
              style={styles.trendIcon}
            />
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  content: {
    justifyContent: "space-between",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: theme.spacing.md,
  },
  value: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  unit: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  trend: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignSelf: "flex-start",
  },
  trendIcon: {
    marginRight: theme.spacing.xs,
  },
  trendValue: {
    ...theme.typography.caption,
    fontWeight: "600",
  },
});
