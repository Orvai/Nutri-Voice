import { View, ScrollView } from "react-native";
import ChatListItem from "./ChatListItem";
import { styles } from "./styles/ChatList.styles";

interface Props {
  conversations: any[];
  activeId: string | null;
  onSelect: (conv: any) => void;
}

export default function ChatList({ conversations, activeId, onSelect }: Props) {
  return (
    <View style={styles.container}>
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