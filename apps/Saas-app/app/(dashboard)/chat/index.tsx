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

      {/* רשימת שיחות */}
      <ChatList
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelect={setActiveConversation}
      />

      {/* אזור מרכזי */}
      <View style={{ flex: 1, flexDirection: "column" }}>

        {/* Header */}
        <ChatHeader conversation={activeConversation} />

        {/* הודעות */}
        <ChatMessages messages={activeConversation?.messages || []} />

        {/* קלט */}
        <ChatInput />
      </View>

      {/* פרטי לקוח */}
      <ClientDetails conversation={activeConversation} />
    </View>
  );
}
