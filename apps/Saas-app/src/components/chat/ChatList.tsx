import { Pressable, ScrollView, Text, View } from "react-native";
import ChatListItem from "./ChatListItem";
import { styles } from "./styles/ChatList.styles";

import type { UIConversation } from "@/types/ui/conversation/conversation.ui";
import type { ClientExtended } from "@/types/client";

interface Props {
  conversations: UIConversation[];
  clients: ClientExtended[];
  waitingConversationIds: Set<string>;
  activeId: string | null;
  clientFilter: "all" | "active" | "inactive";
  filterCounts: {
    all: number;
    active: number;
    inactive: number;
  };
  onClientFilterChange: (filter: "all" | "active" | "inactive") => void;
  onSelect: (conversationId: string) => void;
}

export default function ChatList({
  conversations,
  clients,
  waitingConversationIds,
  activeId,
  clientFilter,
  filterCounts,
  onClientFilterChange,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => onClientFilterChange("all")}
          style={[
            styles.filterButton,
            clientFilter === "all" && styles.filterButtonActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              clientFilter === "all" && styles.filterTextActive,
            ]}
          >
            הכל ({filterCounts.all})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onClientFilterChange("active")}
          style={[
            styles.filterButton,
            clientFilter === "active" && styles.filterButtonActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              clientFilter === "active" && styles.filterTextActive,
            ]}
          >
            פעיל ({filterCounts.active})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onClientFilterChange("inactive")}
          style={[
            styles.filterButton,
            clientFilter === "inactive" && styles.filterButtonActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              clientFilter === "inactive" && styles.filterTextActive,
            ]}
          >
            לא פעיל ({filterCounts.inactive})
          </Text>
        </Pressable>
      </View>

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
