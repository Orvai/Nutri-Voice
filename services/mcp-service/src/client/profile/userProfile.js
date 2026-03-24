const FEMALE_GENDER_VALUES = new Set([
  "female",
  "f",
  "woman",
  "girl",
  "נקבה",
  "אישה",
  "אשה",
  "בת",
]);

const MALE_GENDER_VALUES = new Set([
  "male",
  "m",
  "man",
  "boy",
  "זכר",
  "גבר",
  "בן",
]);

export function normalizeUserGender(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;
  if (FEMALE_GENDER_VALUES.has(normalized)) return "female";
  if (MALE_GENDER_VALUES.has(normalized)) return "male";
  return null;
}
