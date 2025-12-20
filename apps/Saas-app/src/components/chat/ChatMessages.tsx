import { ScrollView, View } from "react-native";
import ChatBubble from "./ChatBubble";
import ChatSuggestionBox from "./ChatSuggestionBox";
import { styles } from "./styles/ChatMessages.styles";

import type { UIMessage } from "@/types/ui/conversation/message.ui";

interface Props {
  messages: UIMessage[];

  aiSuggestedText?: string;
  showSuggestion: boolean;

  onSend: (text: string) => void;
}

export default function ChatMessages({
  messages,
  aiSuggestedText,
  showSuggestion,
  onSend,
}: Props) {
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

      {showSuggestion && aiSuggestedText && (
        <ChatSuggestionBox
          initialText={aiSuggestedText}
          onSend={onSend}
        />
      )}
    </ScrollView>
  );
}
