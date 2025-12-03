import axios from "axios";

export function createServiceClient(baseURL) {
  const client = axios.create({
    baseURL,
    headers: {
      "x-internal-token": process.env.INTERNAL_TOKEN
    },
    timeout: 5000 
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("❌ Service error:", error?.response?.data || error.message);
      throw error;
    }
  );

  return client;
}
