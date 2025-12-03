import { ScrollView, View } from "react-native";
import ChatBubble from "./ChatBubble";

export default function ChatMessages({ messages }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16 }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 14 }}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </View>
    </ScrollView>
  );
}
