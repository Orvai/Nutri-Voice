import { View } from "react-native";
import ChatList from "../../../src/components/chat/ChatList";
import ChatMessages from "../../../src/components/chat/ChatMessages";
import ChatHeader from "../../../src/components/chat/ChatHeader";
import ChatInput from "../../../src/components/chat/ChatInput";
import ClientDetails from "../../../src/components/chat/ClientDetails";
import { useChatData } from "../../../src/hooks/useChatData";

export default function ChatScreen() {
  const { conversations, activeConversation, setActiveConversation } = useChatData();

  return (
    <View style={{ flex: 1, flexDirection: "row-reverse", backgroundColor: "#f3f4f6" }}>

      <ChatList
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelect={setActiveConversation}
      />

      <View style={{ flex: 1, flexDirection: "column" }}>

        <ChatHeader conversation={activeConversation} />

        <ChatMessages messages={activeConversation?.messages || []} />

        <ChatInput />
      </View>

      <ClientDetails conversation={activeConversation} />
    </View>
  );
}
