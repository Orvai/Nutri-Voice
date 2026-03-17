function getOpenAiKey() {
  return process.env.OPENAI_API_KEY || "";
}

function getTranscribeModel() {
  return process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1";
}

function normalizeAudioMime(inputMimeType = "") {
  if (typeof inputMimeType !== "string") return "audio/ogg";
  const trimmed = inputMimeType.trim();
  return trimmed || "audio/ogg";
}

function extensionForMime(mimeType) {
  const lower = (mimeType || "").toLowerCase();
  if (lower.includes("mpeg")) return "mp3";
  if (lower.includes("mp4")) return "m4a";
  if (lower.includes("wav")) return "wav";
  if (lower.includes("ogg")) return "ogg";
  return "ogg";
}

async function transcribeAudioFromUrl({ mediaUrl, mediaMimeType }) {
  const key = getOpenAiKey();
  if (!key || !mediaUrl) {
    return null;
  }

  const audioRes = await fetch(mediaUrl);
  if (!audioRes.ok) {
    throw new Error(`Failed to download audio: ${audioRes.status}`);
  }

  const audioBuffer = await audioRes.arrayBuffer();
  const mimeType = normalizeAudioMime(mediaMimeType);

  const formData = new FormData();
  formData.append("model", getTranscribeModel());
  formData.append(
    "file",
    new Blob([audioBuffer], { type: mimeType }),
    `voice.${extensionForMime(mimeType)}`
  );

  const transcribeRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: formData,
  });

  const body = await transcribeRes.json();
  if (!transcribeRes.ok) {
    const message = body?.error?.message || "OpenAI transcription failed";
    throw new Error(message);
  }

  return (body?.text || "").trim() || null;
}

module.exports = {
  transcribeAudioFromUrl,
};
