export function detectCoachCriticalMessage(text) {
  const normalized = String(text || "").trim().toLowerCase();
  if (!normalized) return { isCritical: false, mentionsMedical: false };

  const distress =
    /קשה לי|נשברתי|אין לי כוח|לא מצליח|לא מצליחה|ויתרתי|מתוסכל|מיואש|אני לא עומד בזה/.test(
      normalized
    );
  const medical =
    /כאב|כאבים|סחרחורת|בחילה|הקאה|התעלפתי|פציעה|דימום|לחץ בחזה|חרדה|דיכאון|בולמוס|הפרעת אכילה/.test(
      normalized
    );

  return {
    isCritical: distress || medical,
    mentionsMedical: medical,
  };
}

export function buildCoachSuggestedReply({ mentionsMedical }) {
  if (mentionsMedical) {
    return "תודה ששיתפת, זה חשוב. אני ממליץ שנעצור רגע ושהמאמן יחזור אליך אישית כדי לתת מענה בטוח ומדויק.";
  }
  return "אני איתך, תודה ששיתפת. המאמן שלך יחזור אליך אישית עם מענה מותאם, ובינתיים אפשר ללכת על צעד קטן וקל להמשך.";
}
