import { useMemo, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { AdminScreen } from "../screens/AdminScreen";
import { AdmissionScreen } from "../screens/AdmissionScreen";
import { AttendanceScreen } from "../screens/AttendanceScreen";
import { ChatbotScreen } from "../screens/ChatbotScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { UserRole } from "../types/app";

const Stack = createNativeStackNavigator();

type TabParamList = {
  Dashboard: { token: string };
  Admissions: { token: string };
  Attendance: { token: string };
  "AI Tutor": { token: string };
  Admin: { token: string };
};

const Tabs = createBottomTabNavigator<TabParamList>();

interface Session {
  token: string;
  role: UserRole;
}

function MainTabs({ role, token }: Session) {
  const visibleScreens = useMemo(() => {
    const base = [
      { name: "Dashboard", component: DashboardScreen },
      { name: "Admissions", component: AdmissionScreen },
      { name: "Attendance", component: AttendanceScreen },
      { name: "AI Tutor", component: ChatbotScreen },
    ] as const;

    if (role === "admin" || role === "faculty") {
      return [...base, { name: "Admin", component: AdminScreen }] as const;
    }

    return base;
  }, [role]);

  return (
    <Tabs.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<TabParamList, keyof TabParamList>;
      }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#F16474",
        tabBarInactiveTintColor: "#9FB3D9",
        tabBarStyle: {
          backgroundColor: "#08172F",
          borderTopColor: "rgba(255,255,255,0.12)",
        },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: "grid-outline",
            Admissions: "document-text-outline",
            Attendance: "qr-code-outline",
            "AI Tutor": "chatbubble-ellipses-outline",
            Admin: "analytics-outline",
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      {visibleScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          initialParams={{ token }}
        />
      ))}
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onLogin={setSession} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main">
          {() => <MainTabs role={session.role} token={session.token} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
