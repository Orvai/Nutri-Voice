import axios from "axios";
import {
  clearAuthSessionTokens,
  getAuthSessionTokens,
  getAuthSessionVersion,
  notifyAuthFailure,
  setAuthSessionTokens,
} from "./authSession";

type AxiosConfig = Parameters<typeof axios.request>[0] & {
  signal?: AbortSignal;
  _retry?: boolean;
};

type RefreshPayload = {
  accessToken: string;
  refreshToken?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let inFlightRefresh: Promise<string> | null = null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isRefreshRoute = (url?: string): boolean =>
  Boolean(url?.includes("/api/auth/token/refresh"));

const isAuthRetryExcludedRoute = (url?: string): boolean =>
  Boolean(
    url?.includes("/api/auth/login") ||
      url?.includes("/api/auth/register") ||
      url?.includes("/api/auth/token/refresh")
  );

const parseRefreshPayload = (rawResponse: unknown): RefreshPayload | null => {
  if (!rawResponse || typeof rawResponse !== "object") {
    return null;
  }

  const candidate =
    "data" in rawResponse &&
    (rawResponse as { data?: unknown }).data &&
    typeof (rawResponse as { data?: unknown }).data === "object"
      ? (rawResponse as { data: unknown }).data
      : rawResponse;

  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const accessToken = (candidate as { accessToken?: unknown }).accessToken;
  const refreshToken = (candidate as { refreshToken?: unknown }).refreshToken;

  if (!isNonEmptyString(accessToken)) {
    return null;
  }

  return {
    accessToken,
    ...(isNonEmptyString(refreshToken) ? { refreshToken } : {}),
  };
};

const tryRefreshAccessToken = async (): Promise<string> => {
  const { refreshToken } = getAuthSessionTokens();

  if (!isNonEmptyString(refreshToken)) {
    clearAuthSessionTokens();
    notifyAuthFailure("missing_refresh_token");
    throw new Error("Missing refresh token");
  }

  const refreshVersion = getAuthSessionVersion();

  try {
    const response = await axios.request({
      baseURL: API_BASE_URL,
      withCredentials: true,
      method: "POST",
      url: "/api/auth/token/refresh",
      headers: { "Content-Type": "application/json" },
      data: { refreshToken },
    });

    const payload = parseRefreshPayload(response.data);

    if (!payload) {
      clearAuthSessionTokens();
      notifyAuthFailure("malformed_refresh_response");
      throw new Error("Malformed refresh response");
    }

    const currentTokens = getAuthSessionTokens();
    const sessionChanged =
      getAuthSessionVersion() !== refreshVersion ||
      currentTokens.refreshToken !== refreshToken;

    if (sessionChanged) {
      throw new Error("Session changed while refresh was in progress");
    }

    setAuthSessionTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken ?? refreshToken,
    });

    return payload.accessToken;
  } catch (error) {
    const currentTokens = getAuthSessionTokens();
    const sessionChanged =
      getAuthSessionVersion() !== refreshVersion ||
      currentTokens.refreshToken !== refreshToken;

    if (!sessionChanged) {
      clearAuthSessionTokens();

      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 401 || status === 403) {
        notifyAuthFailure("refresh_rejected");
      } else {
        notifyAuthFailure("refresh_failed");
      }
    }

    throw error;
  }
};

apiClient.interceptors.request.use((requestConfig) => {
  const { accessToken } = getAuthSessionTokens();

  if (!isNonEmptyString(accessToken) || isRefreshRoute(requestConfig.url)) {
    return requestConfig;
  }

  const hasAuthHeader =
    Boolean((requestConfig.headers as Record<string, unknown>)?.Authorization) ||
    Boolean((requestConfig.headers as Record<string, unknown>)?.authorization);

  if (hasAuthHeader) {
    return requestConfig;
  }

  requestConfig.headers = {
    ...(requestConfig.headers ?? {}),
    Authorization: `Bearer ${accessToken}`,
  };

  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as {
      response?: { status?: number };
      config?: AxiosConfig;
    };

    const status = axiosError.response?.status;
    const originalRequest = axiosError.config;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || isAuthRetryExcludedRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    const { refreshToken } = getAuthSessionTokens();
    if (!isNonEmptyString(refreshToken)) {
      clearAuthSessionTokens();
      notifyAuthFailure("missing_refresh_token");
      return Promise.reject(error);
    }

    try {
      if (!inFlightRefresh) {
        inFlightRefresh = tryRefreshAccessToken().finally(() => {
          inFlightRefresh = null;
        });
      }

      const accessToken = await inFlightRefresh;

      originalRequest._retry = true;
      originalRequest.headers = {
        ...(originalRequest.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      };

      return apiClient.request(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export const customFetcher = async <TData>(
  config: AxiosConfig
): Promise<TData> => {
  const { signal, ...rest } = config;

  const response = await apiClient.request({
    ...(signal && typeof signal.addEventListener === "function"
      ? { signal }
      : {}),
    ...rest,
  });

  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as { data: TData }).data;
  }

  return response.data as TData;
};
