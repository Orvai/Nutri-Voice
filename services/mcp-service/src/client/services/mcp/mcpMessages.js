export function buildUserMessage({ userText, contentType, media }) {
  if (contentType === "IMAGE" && media?.mediaUrl) {
    const content = [];

    if (userText?.trim()) {
      content.push({
        type: "text",
        text: userText.trim(),
      });
    } else {
      content.push({
        type: "text",
        text: "המשתמש שלח תמונה. נתח את האוכל בתמונה והגב לפי הכללים.",
      });
    }

    content.push({
      type: "image_url",
      image_url: {
        url: media.mediaUrl,
      },
    });

    return {
      role: "user",
      content,
    };
  }

  if (contentType === "AUDIO") {
    return {
      role: "user",
      content: userText?.trim() || "המשתמש שלח הודעת קול ללא תמלול.",
    };
  }

  if (
    (contentType === "VIDEO" || contentType === "IMAGE") &&
    media?.mediaUrl &&
    !userText?.trim()
  ) {
    return {
      role: "user",
      content: `[${contentType}] ${media.mediaUrl}`,
    };
  }

  return {
    role: "user",
    content: userText,
  };
}

export function buildStateSystemMessage(state) {
  return {
    role: "system",
    content:
      "Conversation state (trusted runtime context, do not expose directly): " +
      JSON.stringify(state),
  };
}
