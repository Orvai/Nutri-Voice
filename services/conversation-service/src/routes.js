const express = require("express");
const router = express.Router();

/* ===============================
   Controllers
================================ */

const Conversation = require("../src/controllers/conversation.controller");
const Message = require("../src/controllers/message.controller");
const Inbox = require("../src/controllers/inbox.controller");
const Webhook = require("../src/controllers/webhook.controller");

/* ===============================
   Middleware
================================ */

const  verifyInternalToken  = require("../src/middlewares/verifyInternalToken");

/* ============================================================
   WEBHOOK – external incoming messages
============================================================ */

router.post(
  "/internal/webhook/incoming",
  verifyInternalToken,
  Webhook.incoming
);

/* ============================================================
   CONVERSATIONS – coach UI
============================================================ */

router.get(
  "/internal/coaches/:coachId/conversations",
  verifyInternalToken,
  Conversation.listCoachConversations
);

router.get(
  "/internal/conversations/:id",
  verifyInternalToken,
  Conversation.getConversation
);

/* ============================================================
   MESSAGES – coach UI
============================================================ */

router.get(
  "/internal/conversations/:id/messages",
  verifyInternalToken,
  Message.listMessages
);

router.post(
  "/internal/conversations/:id/messages",
  verifyInternalToken,
  Message.sendCoachMessage
);

router.post(
  "/internal/messages/:id/handled",
  verifyInternalToken,
  Message.markHandled
);

/* ============================================================
   INBOX – coach dashboard
============================================================ */

router.get(
  "/internal/inbox/pending",
  verifyInternalToken,
  Inbox.getPending
);

module.exports = router;
