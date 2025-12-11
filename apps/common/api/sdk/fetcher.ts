import axios from "axios";

export const customFetcher = async <TData>(config: any): Promise<TData> => {
  const response = await axios.request<TData>(config);
  return response.data;
};
