import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL!;
const REFRESH_PATH = process.env.EXPO_PUBLIC_REFRESH_ENDPOINT || "/auth/token/refresh";

// Create a reusable Axios client
export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,          // <-- send/receive HttpOnly cookies
    xsrfCookieName: "XSRF-TOKEN",   // <-- if your backend sets CSRF cookie
    xsrfHeaderName: "X-XSRF-TOKEN", // axios echoes it back automatically
});

// Simple 401 -> refresh -> retry once
let refreshing: Promise<void> | null = null;// To avoid race condition
async function callRefresh() {
    await api.post(REFRESH_PATH);   // cookies flow automatically
}

api.interceptors.response.use((r) => r, async (error) => {
        const original = error.config || {};
        if (error?.response?.status === 401 && !original._retry) {
            original._retry = true;
            if (!refreshing) refreshing = callRefresh().finally(() => (refreshing = null));
            await refreshing;
            return api(original); // retry the failed request
        }
        return Promise.reject(error);
    }
);
