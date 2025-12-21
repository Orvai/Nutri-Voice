export const llmTools = [
    {
      type: "function",
      function: {
        name: "get_daily_state",
        description: `
  Use this tool to get the single source of truth for today's client state.
  
  You MUST call this tool before answering any question related to:
  - calories (allowed, eaten, remaining)
  - meals reported today
  - workouts reported today
  - today's weight
  - whether today is a training or rest day
  
  Never guess or assume daily data.
  If the user asks:
  - "כמה נשאר לי?"
  - "אכלתי כבר?"
  - "חרגתי?"
  - "זה יום אימון?"
  You must first call this tool.
  
  This tool has no parameters and always returns today's data.
        `.trim(),
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
  ];
  