import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

let accessToken: string | null = null;

export async function loadToken() {
  accessToken = await AsyncStorage.getItem("ACCESS_TOKEN");
}

export function setToken(token: string | null) {
  accessToken = token;
}

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  console.log("🚀 INTERCEPTOR REQUEST", config.url);
  console.log("🚀 AUTH HEADER BEFORE:", config.headers.Authorization);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
