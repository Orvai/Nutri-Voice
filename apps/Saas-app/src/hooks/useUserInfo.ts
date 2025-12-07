import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/user-api/userInfo.api";

export function useUserInfo(userId: string) {
  return useQuery({
    queryKey: ["userInfo", userId],
    enabled: !!userId,
    queryFn: () => fetchUserInfo(userId),
  });
}
