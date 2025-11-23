import * as SecureStore from "expo-secure-store";

const AUTH_COMPLETED_KEY = "auth_completed";
const USER_ID_KEY = "user_id";

export async function hasCompletedAuth(): Promise<boolean> {
    try {
        const value = await SecureStore.getItemAsync(AUTH_COMPLETED_KEY);
        return value === "true";
    } catch (error) {
        console.warn("Failed to read auth completion flag", error);
        return false;
    }
}

export async function setAuthCompleted(): Promise<void> {
    try {
        await SecureStore.setItemAsync(AUTH_COMPLETED_KEY, "true");
    } catch (error) {
        console.warn("Failed to persist auth completion flag", error);
    }
}

export async function setUserId(userId: string): Promise<void> {
    try {
        await SecureStore.setItemAsync(USER_ID_KEY, userId);
    } catch (error) {
        console.warn("Failed to store user id", error);
    }
}

export async function getUserId(): Promise<string | null> {
    try {
        const value = await SecureStore.getItemAsync(USER_ID_KEY);
        return value ?? null;
    } catch (error) {
        console.warn("Failed to read user id", error);
        return null;
    }
}