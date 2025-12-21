// services/tools/updateMeal.service.js
import axios from "axios";
import {
  UpdateMealInputDto,
  UpdateMealResponseDto,
} from "../../dto/tools/updateMeal.dto.js";

const GATEWAY_URL = process.env.GATEWAY_URL;

export async function updateMeal(input, context) {
  const parsed = UpdateMealInputDto.parse(input);
  const { logId, ...payload } = parsed;

  if (payload.dayType) {
    const dailyDayType = context?.dailyState?.dayType;

    if (!dailyDayType) {
      throw new Error("Missing dailyState.dayType");
    }

    if (payload.dayType !== dailyDayType) {
      throw new Error(
        `dayType mismatch: payload=${payload.dayType}, dailyState=${dailyDayType}`
      );
    }
  }

  const res = await axios.put(
    `${GATEWAY_URL}/api/tracking/meal-log/${logId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${context.userToken}`,
      },
    }
  );

  return UpdateMealResponseDto.parse(res.data);
}
