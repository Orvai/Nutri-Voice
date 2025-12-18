import { ScrollView, View } from "react-native";
import ChatBubble from "./ChatBubble";
import { styles } from "./styles/ChatMessages.styles";

export default function ChatMessages({ messages }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.messages}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </View>
    </ScrollView>
  );
}