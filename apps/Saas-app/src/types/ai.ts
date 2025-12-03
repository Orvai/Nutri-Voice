export type AiTextMessage = {
    id: string;
    from: "ai" | "user";
    type: "text";
    text: string;
    time: string;
  };
  
  export type AiStatsMessage = {
    id: string;
    from: "ai";
    type: "stats";
    data: {
      label: string;
      value: string | number;
      color: string;
      textColor: string;
      icon: string;
    }[];
    time: string;
  };
  
  export type AiMessage = AiTextMessage | AiStatsMessage;
  