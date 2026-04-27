import React, { ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { theme } from "../theme/theme";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

/**
 * ErrorBoundary component wraps the app to catch and display errors gracefully
 * Prevents white screen of death and allows users to retry
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);

    this.setState({
      error,
      errorInfo: errorInfo.componentStack || "",
    });

    // Log to external error tracking service here
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: any) => {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    console.log("Would log error to external service:", {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: "",
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
              <Text style={styles.errorMessage}>
                An unexpected error occurred. Our team has been notified.
              </Text>

              {__DEV__ && this.state.error && (
                <>
                  <View style={styles.devSection}>
                    <Text style={styles.devTitle}>Development Info:</Text>
                    <Text style={styles.errorDetail}>
                      {this.state.error.toString()}
                    </Text>
                    {this.state.errorInfo && (
                      <Text style={styles.errorDetail}>
                        {this.state.errorInfo}
                      </Text>
                    )}
                  </View>
                </>
              )}

              <Button
                label="Try Again"
                onPress={this.handleRetry}
                variant="primary"
                fullWidth
                style={styles.button}
              />
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  errorBox: {
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accentDark,
  },
  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.accentDark,
    marginBottom: theme.spacing.md,
  },
  errorMessage: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  devSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  devTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  errorDetail: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontFamily: "monospace",
    marginTop: theme.spacing.sm,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});
