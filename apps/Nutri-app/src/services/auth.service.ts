// src/services/auth.service.ts
import { api } from "../lib/api";

/** ── DTOs (mirror your backend zod) ─────────────────────────────── */
// Backend: registerRequestDto
export type RegisterInput = {
    email: string;
    password: string;          // min 8, composition validated server-side
    phone: string;             // min 4 (you validate format server-side)
    firstName: string;
    lastName: string;
};

// Backend: loginRequestDto
export type Credentials = {
    email: string;
    password: string;
};

/** If your OpenAPI says /api/auth/* keep this as-is.
 *  If your Express routes are /auth/* (no /api), set BASE_PATH = "/auth"
 */
const BASE_PATH = "/api/auth";

/** ── Auth calls (cookies handled by axios withCredentials) ───────── */

// Registers a new user. Backend returns 201 + { message } by your controller.
export async function signUp(payload: RegisterInput) {
    const { data } = await api.post(`${BASE_PATH}/register`, payload);
    return data;
}

// Logs in. Backend sets HttpOnly cookies (refresh/access) via Set-Cookie.
export async function signIn(payload: Credentials) {
    // Optionally forward user-agent for your loginContextDto on server
    const { data } = await api.post(`${BASE_PATH}/login`, payload, {
        headers: {
            // Expo web will send a UA automatically; this keeps it explicit
            "X-Client-UA": typeof navigator !== "undefined" ? navigator.userAgent : "Cyber-Shield",
        },
    });
    return data; // shape per your backend (e.g., { message?, user?, sessionId? })
}

// Logs out and clears cookies server-side.
export async function signOut() {
    await api.post(`${BASE_PATH}/logout`);
}

// Upserts (creates or updates) user information for the given userId.
// Backend requires authentication (HttpOnly cookies or Bearer handled automatically).
export async function upsertUserInformation(userId: string, payload: any) {
    const { data } = await api.put(`/api/users/${userId}/info`, payload, {
        headers: {
            "X-Client-UA":
                typeof navigator !== "undefined"
                    ? navigator.userAgent
                    : "Cyber-Shield",
        },
    });

    return data; // shape defined by backend UserInfo schema
}


