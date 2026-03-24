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

export function buildStateSystemMessage(state, userProfile = {}) {
  const trustedContext = {
    conversationState: state,
    userProfile: {
      gender: userProfile?.gender || null,
    },
  };

  return {
    role: "system",
    content:
      "Runtime context (trusted, do not expose directly): " +
      JSON.stringify(trustedContext),
  };
}

export function buildToolResultMessage(callId, toolResult) {
  return {
    role: "tool",
    tool_call_id: callId,
    content: JSON.stringify(toolResult),
  };
}
