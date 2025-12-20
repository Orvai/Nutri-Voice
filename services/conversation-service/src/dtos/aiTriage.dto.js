const { z } = require("zod");

const AiTriageInputDto = z.object({
  messageId: z.string().min(1),
});

module.exports = { AiTriageInputDto };
