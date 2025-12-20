// src/ai/clientTriageAI.js
// כרגע stub, בהמשך תחבר OpenAI / MCP

const clientTriageAI = async ({ text }) => {
    // לוגיקה זמנית / דמה
    if (!text || text.length < 5) {
      return {
        decision: "COACH_REPLY",
        suggestedReply: null,
      };
    }
  
    if (text.includes("תפריט") || text.includes("אוכל")) {
      return {
        decision: "AUTO_REPLY",
        suggestedReply: "מעולה, אני בודק לך את זה 👌",
      };
    }
  
    return {
      decision: "COACH_REPLY",
      suggestedReply: null,
    };
  };
  
  module.exports = { clientTriageAI };
  