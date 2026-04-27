import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from "react-native";
import { theme } from "../theme/theme";

interface ButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  labelStyle,
}: ButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStyles = () => {
    const baseStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
      ...style,
    };

    const sizeStyles = {
      sm: styles.buttonSm,
      md: styles.buttonMd,
      lg: styles.buttonLg,
    };

    const variantStyles = {
      primary: styles.variantPrimary,
      secondary: styles.variantSecondary,
      outline: styles.variantOutline,
      danger: styles.variantDanger,
      ghost: styles.variantGhost,
    };

    return {
      container: {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
      },
      text: {
        ...styles.label,
        ...getTextStyle(variant),
        ...getLabelSizeStyle(size),
        ...labelStyle,
      },
    };
  };

  const getTextStyle = (variant: string): TextStyle => {
    switch (variant) {
      case "primary":
      case "danger":
        return { color: theme.colors.textInverse };
      case "secondary":
        return { color: theme.colors.textPrimary };
      case "outline":
        return { color: theme.colors.accentPrimary };
      case "ghost":
        return { color: theme.colors.accentPrimary };
      default:
        return { color: theme.colors.textPrimary };
    }
  };

  const getLabelSizeStyle = (size: string): TextStyle => {
    switch (size) {
      case "sm":
        return { fontSize: 12, fontWeight: "600" };
      case "lg":
        return { fontSize: 16, fontWeight: "600" };
      default:
        return { fontSize: 14, fontWeight: "600" };
    }
  };

  const finalStyles = getStyles();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          finalStyles.container,
          (disabled || loading) && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          {icon && !loading && <View style={styles.iconContainer}>{icon}</View>}
          {loading ? (
            <ActivityIndicator color={finalStyles.text.color} size="small" />
          ) : (
            <Text style={finalStyles.text}>{label}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  fullWidth: {
    width: "100%",
  },
  buttonSm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 32,
  },
  buttonMd: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 44,
  },
  buttonLg: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    minHeight: 52,
  },
  variantPrimary: {
    backgroundColor: theme.colors.accentPrimary,
    borderWidth: 0,
  },
  variantSecondary: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
  },
  variantOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: theme.colors.accentPrimary,
  },
  variantDanger: {
    backgroundColor: theme.colors.danger,
    borderWidth: 0,
  },
  variantGhost: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.button,
  },
  iconContainer: {
    marginRight: 4,
  },
});
