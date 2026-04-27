import React from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../theme/theme";

interface DividerProps {
  style?: any;
  variant?: "light" | "default" | "heavy";
  vertical?: boolean;
}

export function Divider({ style, variant = "default", vertical = false }: DividerProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "light":
        return {
          borderColor: "rgba(255, 255, 255, 0.05)",
          borderWidth: 0.5,
        };
      case "heavy":
        return {
          borderColor: "rgba(255, 255, 255, 0.15)",
          borderWidth: 1.5,
        };
      default:
        return {
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
        };
    }
  };

  const variantStyle = getVariantStyle();

  if (vertical) {
    return (
      <View
        style={[
          styles.verticalDivider,
          variantStyle,
          { borderRightWidth: variantStyle.borderWidth },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.horizontalDivider,
        variantStyle,
        { borderBottomWidth: variantStyle.borderWidth },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontalDivider: {
    marginVertical: theme.spacing.md,
  },
  verticalDivider: {
    height: "100%",
  },
});
