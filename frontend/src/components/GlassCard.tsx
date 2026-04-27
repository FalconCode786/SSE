import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  children: ReactNode;
}

export function GlassCard({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(10, 29, 60, 0.72)",
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
});
