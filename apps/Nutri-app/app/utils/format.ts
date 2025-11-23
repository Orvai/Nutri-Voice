import { DIGIT_REGEX } from "./regex";

export const trimInput = (value: string) => value.trim();

export const cleanPhoneInput = (value: string) => value.replace(/\D/g, "");

export const formatDobInput = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const parseDob = (dob: string) => {
    const parts = dob.split("/");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!dd || !mm || !yyyy) return null;
    if (mm < 1 || mm > 12) return null;
    if (dd < 1 || dd > 31) return null;

    const date = new Date(yyyy, mm - 1, dd);
    if (isNaN(date.getTime())) return null;
    return date;
};

export const cleanNumericInput = (value: string, maxLength?: number) => {
    const digitsOnly = value.replace(/\D/g, "");
    return typeof maxLength === "number" ? digitsOnly.slice(0, maxLength) : digitsOnly;
};
