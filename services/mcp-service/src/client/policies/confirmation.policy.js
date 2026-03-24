const SHORT_CONFIRMATION_RE =
  /^(כן+|יאללה|סבבה|אשר|מאשר|אישור|תדווח(?:י)?|תעדכן(?:י)?|יאללה תדווח|כן תדווח|כן תעדכן)(\s|$|[.!?,])?/i;

export function isShortConfirmation(text) {
  return SHORT_CONFIRMATION_RE.test((text || "").trim());
}
