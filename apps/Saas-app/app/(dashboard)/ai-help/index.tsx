import { ScrollView, View } from "react-native";
import { useAiHelpData } from "../../../src/hooks/useAiHelpData";

import AiWelcome from "../../../src/components/ai/AiWelcome";
import AiQuickActions from "../../../src/components/ai/AiQuickActions";
import AiMessageBubble from "../../../src/components/ai/AiMessageBubble";
import AiUserBubble from "../../../src/components/ai/AiUserBubble";
import AiStatsCard from "../../../src/components/ai/AiStatsCard";
import AiInput from "../../../src/components/ai/AiInput";
import AiSuggestedPrompts from "../../../src/components/ai/AiSuggestedPrompts";

export default function AiHelpScreen() {
  const { messages, sendMessage } = useAiHelpData();

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 10,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 20,
          }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <AiWelcome />

          <AiQuickActions />

          {messages.map((msg) =>
            msg.from === "ai" ? (
              msg.type === "stats" ? (
                <AiStatsCard key={msg.id} data={msg.data} />
              ) : (
                <AiMessageBubble key={msg.id} message={msg} />
              )
            ) : (
              <AiUserBubble key={msg.id} message={msg} />
            )
          )}
        </ScrollView>

        <AiInput onSend={sendMessage} />

        <AiSuggestedPrompts onChoose={sendMessage} />
      </View>
    </View>
  );
}
