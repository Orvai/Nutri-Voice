import { gatewayClient } from "../../http/gatewayClient.js";
import { DailyStateToolDto } from "../../dtos/tools/dailyState.dto.js";

/**
 * GET DAILY STATE
 */
export async function getDailyState({ userToken }) {
  const res = await gatewayClient.get(
    "/api/tracking/daily-state",
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  const raw = res.data?.data;

  return DailyStateToolDto.parse(raw);
}
