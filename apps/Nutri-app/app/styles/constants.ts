export const MIN_PHONE_LENGTH = 4;

export const PASSWORD_RULES = [
    { regex: /[a-z]/, description: "one lowercase letter" },
    { regex: /[A-Z]/, description: "one uppercase letter" },
    { regex: /\d/, description: "one number" },
    { regex: /[^A-Za-z0-9]/, description: "one special character" },
];

export const COUNTRY_OPTIONS = [
    { code: "US", name: "United States", callingCode: "+1", flag: "🇺🇸" },
    { code: "CA", name: "Canada", callingCode: "+1", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", callingCode: "+44", flag: "🇬🇧" },
    { code: "AU", name: "Australia", callingCode: "+61", flag: "🇦🇺" },
    { code: "DE", name: "Germany", callingCode: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", callingCode: "+33", flag: "🇫🇷" },
    { code: "BR", name: "Brazil", callingCode: "+55", flag: "🇧🇷" },
    { code: "IL", name: "Israel", callingCode: "+972", flag: "🇮🇱" },
    { code: "IN", name: "India", callingCode: "+91", flag: "🇮🇳" },
    { code: "ZA", name: "South Africa", callingCode: "+27", flag: "🇿🇦" },
    { code: "NG", name: "Nigeria", callingCode: "+234", flag: "🇳🇬" },
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
    US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    GB: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
    AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    FR: ["Paris", "Lyon", "Marseille", "Nice", "Toulouse"],
    BR: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"],
    IL: ["Tel Aviv", "Jerusalem", "Haifa", "Beer Sheva", "Eilat"],
    IN: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai"],
    ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth"],
    NG: ["Lagos", "Abuja", "Kano", "Ibadan", "Benin City"],
};

export const GENDERS = [
    { key: "male", label: "Male", icon: "male" },
    { key: "female", label: "Female", icon: "female" },
    { key: "other", label: "Other", icon: "person" },
];

export const PASSWORD_ERROR_MESSAGE = "Please enter a strong password.";
export const EMAIL_REQUIRED_MESSAGE = "Email is required.";
export const PASSWORD_REQUIRED_MESSAGE = "Password is required.";
export const VERIFICATION_CODE_LENGTH = 6;