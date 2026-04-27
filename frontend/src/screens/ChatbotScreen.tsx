import React, { useState, useRef, useEffect } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AnimatedReveal,
  GradientBackground,
  Input,
  Button,
  Alert,
  Loading,
  SectionHeader,
} from "../components";
import { askChatbot } from "../services/api";
import { theme } from "../theme/theme";

type Params = { params: { token: string } };

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

/**
 * Chatbot Screen - AI Study Companion with Course Context
 * Features: Real-time chat, course-specific answers, conversation history
 */
export function ChatbotScreen() {
  const route = useRoute<RouteProp<Params, "params">>();
  const token = route.params?.token;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Hello! I'm your AI Study Companion. Ask me anything about your courses!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Data Structures");
  const scrollRef = useRef<FlatList>(null);

  const courses = [
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Database Systems",
  ];

  const suggestedQuestions = [
    "What is Big O notation?",
    "Explain binary trees",
    "How do algorithms work?",
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await askChatbot(token, input, selectedCourse);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    setInput(question);
    // Trigger send after setting input
    setTimeout(handleSendMessage, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.type === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser && styles.messageContainerUser,
        ]}
      >
        {!isUser && (
          <Ionicons
            name="chatbubbles-outline"
            size={20}
            color={theme.colors.accentPrimary}
            style={styles.messageIcon}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isUser && styles.messageBubbleUser,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser && styles.messageTextUser,
            ]}
          >
            {item.text}
          </Text>
          <Text style={styles.messageTime}>
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <AnimatedReveal delay={0}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>AI Study Companion</Text>
            <Text style={styles.subtitle}>
              Get instant answers to your questions
            </Text>
          </View>
        </AnimatedReveal>

        {/* Course Selector */}
        <AnimatedReveal delay={50}>
          <View style={styles.courseSelector}>
            <Text style={styles.sectionLabel}>Course</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.courseScroll}
            >
              {courses.map((course) => (
                <Pressable
                  key={course}
                  onPress={() => setSelectedCourse(course)}
                  style={[
                    styles.coursePill,
                    selectedCourse === course && styles.coursePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.coursePillText,
                      selectedCourse === course &&
                        styles.coursePillTextActive,
                    ]}
                  >
                    {course}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </AnimatedReveal>

        {/* Chat Messages */}
        <AnimatedReveal delay={100}>
          <View style={styles.chatContainer}>
            {error && (
              <Alert
                type="danger"
                title="Error"
                message={error}
                onDismiss={() => setError("")}
              />
            )}

            {messages.length === 1 && !loading && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={48}
                  color={theme.colors.textTertiary}
                />
                <Text style={styles.emptyText}>
                  Start a conversation!
                </Text>
                <Text style={styles.emptySubtext}>
                  Ask anything about {selectedCourse}
                </Text>
              </View>
            )}

            <FlatList
              ref={scrollRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.messagesList}
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color={theme.colors.accentPrimary}
                />
              </View>
            )}
          </View>
        </AnimatedReveal>

        {/* Suggested Questions */}
        {messages.length === 1 && !loading && (
          <AnimatedReveal delay={150}>
            <View style={styles.suggestedContainer}>
              <Text style={styles.suggestedLabel}>Suggested Questions</Text>
              <View style={styles.suggestedGrid}>
                {suggestedQuestions.map((question, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSuggestedQuestion(question)}
                    style={styles.suggestedPill}
                  >
                    <Ionicons
                      name="bulb-outline"
                      size={16}
                      color={theme.colors.accentPrimary}
                    />
                    <Text style={styles.suggestedText}>{question}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </AnimatedReveal>
        )}

        {/* Input Area */}
        <AnimatedReveal delay={200}>
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type your question..."
                placeholderTextColor={theme.colors.textTertiary}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
              />
              <Pressable
                onPress={handleSendMessage}
                disabled={!input.trim() || loading}
                style={[
                  styles.sendButton,
                  (!input.trim() || loading) && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    !input.trim() || loading
                      ? theme.colors.textTertiary
                      : theme.colors.textInverse
                  }
                />
              </Pressable>
            </View>
            <Text style={styles.characterCount}>
              {input.length}/500
            </Text>
          </View>
        </AnimatedReveal>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  headerSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  courseSelector: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  courseScroll: {
    marginRight: -theme.spacing.lg,
  },
  coursePill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfacePrimary,
    marginRight: theme.spacing.sm,
  },
  coursePillActive: {
    backgroundColor: theme.colors.accentPrimary,
    borderColor: theme.colors.accentLight,
  },
  coursePillText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  coursePillTextActive: {
    color: theme.colors.textInverse,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  messagesList: {
    paddingVertical: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
    alignItems: "flex-end",
  },
  messageContainerUser: {
    justifyContent: "flex-end",
  },
  messageIcon: {
    marginRight: theme.spacing.sm,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "80%",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageBubbleUser: {
    backgroundColor: theme.colors.accentPrimary,
    borderColor: theme.colors.accentPrimary,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  messageTextUser: {
    color: theme.colors.textInverse,
  },
  messageTime: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  suggestedContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  suggestedLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  suggestedGrid: {
    gap: theme.spacing.sm,
  },
  suggestedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  suggestedText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  inputSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: "rgba(7, 22, 46, 0.5)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: theme.colors.surfacePrimary,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.accentPrimary,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(139, 155, 179, 0.3)",
  },
  characterCount: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    textAlign: "right",
  },
});
