import { Router } from "express";

import conversationRoutes from "./conversation.routes.js";
import messageRoutes from "./message.routes.js";
import inboxRoutes from "./inbox.routes.js";
import webhookRoutes from "./webhook.routes.js";

const r = Router();

/* ======================================================
   PUBLIC / AUTH ROUTES
====================================================== */

r.use(conversationRoutes);
r.use(messageRoutes);
r.use(inboxRoutes);

/* ======================================================
   INTERNAL ROUTES
====================================================== */

r.use(webhookRoutes);

export default r;
