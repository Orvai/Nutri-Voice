export function getInputInfo(type: "email" | "password" | "text") {
    switch (type) {
        case "email":
            return (
                "Use a valid email address. We’ll send verification and security alerts to this email."
            );

        case "password":
            return (
                "Password must include:\n" +
                "- At least 8 characters\n" +
                "- One uppercase letter\n" +
                "- One lowercase letter\n" +
                "- One number\n" +
                "- One special character"
            );

        default:
            return "";
    }
}
