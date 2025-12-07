import { api } from "../api";
import { UserInfo } from "../../types/api/user-types/userInfo.types";

export async function fetchUserInfo(userId: string): Promise<UserInfo> {
  const res = await api.get<UserInfo>(`/users/${userId}/info`);
  return res.data;
}