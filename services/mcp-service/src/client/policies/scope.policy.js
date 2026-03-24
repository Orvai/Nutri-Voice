import { normalizeUserGender } from "../profile/userProfile.js";

function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[!?.,]/g, " ")
    .replace(/\s+/g, " ");
}

function isSmallTalk(text) {
  const normalized = normalize(text);

  return /^(מה קורה|מה נשמע|מה הולך)(?:\s|$)/.test(normalized);
}

function isInDomain(text) {
  return /תזונה|קלור|ארוחה|תפריט|חלבון|פחמ|שומן|אכל|אימון|מתאמן|תרגיל|סטים|חזרות|משקל|כושר|צעדים|מים|שינה|מנוחה|חיטוב|מסה|workout|nutrition/i.test(
    String(text || "")
  );
}

export function isOutOfScopeMessage(text) {
  const normalized = String(text || "").trim();
  if (!normalized) return false;
  if (isSmallTalk(normalized)) return false;
  if (isInDomain(normalized)) return false;

  const looksLikeQuestion =
    /[?？]/.test(normalized) ||
    /^(מה|מי|איפה|מתי|למה|איך|כמה|אפשר|תסביר|תספר|איזה|what|who|when|where|why|how)\b/i.test(
      normalized
    );

  return looksLikeQuestion;
}

export function buildSmallTalkReply(text, userGender) {
  if (!isSmallTalk(text)) return null;

  const normalizedGender = normalizeUserGender(userGender);

  if (normalizedGender === "female") {
    return "מה קורה חיים שלי, איזה כיף שכתבת. רוצה שנבדוק מה מצב הקלוריות שלך היום או שנתכנן אימון?";
  }

  if (normalizedGender === "male") {
    return "הכל טוב אח יקר, איזה כיף שכתבת. רוצה שנבדוק מה מצב הקלוריות שלך היום או שנתכנן אימון?";
  }

  return "הכל טוב, איזה כיף שכתבת. רוצה שנבדוק מה מצב הקלוריות שלך היום או שנתכנן אימון?";
}
