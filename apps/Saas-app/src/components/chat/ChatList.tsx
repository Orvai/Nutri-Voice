import { View, ScrollView } from "react-native";
import ChatListItem from "./ChatListItem";
import { styles } from "./styles/ChatList.styles";

import type { UIConversation } from "@/types/ui/conversation/conversation.ui";
import type { ClientExtended } from "@/types/client";

interface Props {
  conversations: UIConversation[];
  clients: ClientExtended[];
  waitingConversationIds: Set<string>;
  activeId: string | null;
  onSelect: (conversationId: string) => void;
}

export default function ChatList({
  conversations,
  clients,
  waitingConversationIds,
  activeId,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView>
        {conversations.map((conv) => {
          const client =
            clients.find((c) => c.id === conv.clientId) ?? null;

          return (
            <ChatListItem
              key={conv.id}
              conversation={conv}
              client={client}
              waitingForReply={waitingConversationIds.has(conv.id)}
              active={conv.id === activeId}
              onPress={() => onSelect(conv.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
