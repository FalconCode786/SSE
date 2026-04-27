import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { theme } from "../theme/theme";

interface LoadingProps {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export function Loading({
  size = "large",
  color = theme.colors.accentPrimary,
  fullScreen = false,
}: LoadingProps) {
  const containerStyle = fullScreen
    ? [styles.container, styles.fullScreen]
    : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  fullScreen: {
    flex: 1,
  },
});
