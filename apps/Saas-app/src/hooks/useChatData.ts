import { useState, useEffect } from "react";

export function useChatData() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    // בעתיד זה יבוא מה-API שלך
    setConversations([
      {
        id: "1",
        name: "דוד כהן",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
        lastMessage: "תודה על העזרה! אני מרגיש הרבה יותר טוב",
        time: "10:30",
        unread: 2,
        status: "דחוף",
        online: true,
      },
      {
        id: "2",
        name: "שרה לוי",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
        lastMessage: "האם אני יכולה להחליף את הסלמון בדג אחר?",
        time: "אתמול",
        unread: 1,
        status: "ממתין",
        online: true,
      },
      {
        id: "3",
        name: "מיכאל אברהם",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
        lastMessage: "בסדר, אני אתחיל מחר",
        time: "לפני יומיים",
        status: "נענה",
        unread: 0,
        online: false,
      },
    ]);

    setActiveConversation({
      id: "1",
      name: "דוד כהן",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      online: true,
      messages: [
        {
          id: "m1",
          from: "client",
          text: "שלום! אני לא מרגיש טוב...",
          time: "08:45",
        },
        {
          id: "m2",
          from: "coach",
          text: "כמובן, בוא נתאים...",
          time: "08:47",
        },
      ],
    });
  }, []);

  return { conversations, activeConversation, setActiveConversation };
}
