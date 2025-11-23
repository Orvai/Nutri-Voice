import { DIGIT_REGEX, EMAIL_REGEX, PASSWORD_REGEX } from "./regex";
import { MIN_PHONE_LENGTH, PASSWORD_RULES, VERIFICATION_CODE_LENGTH } from "./constants";
import { cleanPhoneInput, trimInput } from "./format";

export const validateEmail = (value: string): string => {
    const trimmed = trimInput(value);
    if (!trimmed) return "Email is required.";
    if (!EMAIL_REGEX.test(trimmed)) {
        return "Please enter a valid email address (example: name@example.com).";
    }
    return "";
};

export const validatePassword = (value: string): string => {
    if (!value) return "Password is required.";
    if (value.length < 8 || !PASSWORD_REGEX.test(value)) {
        const missing: string[] = [];
        if (value.length < 8) missing.push("at least 8 characters");
        PASSWORD_RULES.forEach((rule) => {
            if (!rule.regex.test(value)) missing.push(rule.description);
        });
        return `Password must contain ${missing.join(", ")}.`;
    }
    return "";
};

export const validatePhone = (value: string): string => {
    const cleaned = cleanPhoneInput(value);
    if (cleaned.length < MIN_PHONE_LENGTH) {
        return "Please enter a valid phone number.";
    }
    return "";
};

export const validateRequiredFields = (
    phone: string,
    firstName: string,
    lastName: string
): string => {
    if (validatePhone(phone)) {
        return "Please complete all required fields (phone, first name, last name).";
    }
    if (!trimInput(firstName) || !trimInput(lastName)) {
        return "Please complete all required fields (phone, first name, last name).";
    }
    return "";
};

export const validateVerificationCode = (code: string): string => {
    if (code.length !== VERIFICATION_CODE_LENGTH || !DIGIT_REGEX.test(code)) {
        return "Enter the 6-digit verification code.";
    }
    return "";
};