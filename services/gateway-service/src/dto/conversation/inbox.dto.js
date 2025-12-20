const { z } = require("zod");
const { MessageDto } = require("./message.dto");

/* =========================
   RESPONSES
========================= */

const PendingClientMessageResponseDto = z.object({
  data: z.array(MessageDto),
});

module.exports = {
  PendingClientMessageResponseDto,
};
