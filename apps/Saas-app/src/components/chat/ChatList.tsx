import { View, ScrollView } from "react-native";
import ChatListItem from "./ChatListItem";

interface Props {
  conversations: any[];
  activeId: string | null;
  onSelect: (conv: any) => void;
}

export default function ChatList({ conversations, activeId, onSelect }: Props) {
  return (
    <View
      style={{
        width: 300,
        backgroundColor: "#fff",
        borderLeftWidth: 1,
        borderLeftColor: "#e5e7eb",
        paddingVertical: 12,
      }}
    >
      <ScrollView>
        {conversations.map((conv) => (
          <ChatListItem
            key={conv.id}
            item={conv}
            active={conv.id === activeId}
            onPress={() => onSelect(conv)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
