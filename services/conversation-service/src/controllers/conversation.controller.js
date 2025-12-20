// src/controllers/conversation.controller.js

const {
    getConversationsByCoach,
    getConversationById,
  } = require("../services/conversation.service");
  

  const listCoachConversations = async (req, res, next) => {
    try {
      const { coachId } = req.params; // injected by gateway
  
      const conversations = await getConversationsByCoach({ coachId });
      return res.json({ data: conversations});
    } catch (err) {
      next(err);
    }
  };
  

  const getConversation = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const conversation = await getConversationById({ id });
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
  
      return res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    listCoachConversations,
    getConversation,
  };
  