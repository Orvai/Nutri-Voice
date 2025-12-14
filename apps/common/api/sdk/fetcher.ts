import axios from "axios";

type AxiosConfig = Parameters<typeof axios.request>[0] & {
  signal?: AbortSignal;
};

export const customFetcher = async <TData>(
  config: AxiosConfig
): Promise<TData> => {
  const response = await axios.request({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true,
    ...config,
  });
// NOTE:
// Gateway always returns { data: T }
// We unwrap it here so the SDK returns T directly.
// DO NOT unwrap in hooks or UI.
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as { data: TData }).data;
  }

  return response.data as TData;
};
