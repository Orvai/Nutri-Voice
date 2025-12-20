import axios from "axios";

type AxiosConfig = Parameters<typeof axios.request>[0] & {
  signal?: AbortSignal;
};

export const customFetcher = async <TData>(
  config: AxiosConfig
): Promise<TData> => {
  const { signal, ...rest } = config;

  const response = await axios.request({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true,

    ...(signal && typeof signal.addEventListener === "function"
      ? { signal }
      : {}),

    ...rest,
  });

  // unwrap gateway { data: T }
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return (response.data as { data: TData }).data;
  }

  return response.data as TData;
};
