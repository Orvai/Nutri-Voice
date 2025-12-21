// services/tools/reportMeal.service.js
import axios from "axios";
import {
  ReportMealInputDto,
  ReportMealResponseDto,
} from "../../dto/tools/reportMeal.dto.js";

const GATEWAY_URL = process.env.GATEWAY_URL;

export async function reportMeal(input, context) {
  const payload = ReportMealInputDto.parse(input);

  const dailyDayType = context?.dailyState?.dayType;

  if (!dailyDayType) {
    throw new Error("Missing dailyState.dayType");
  }

  if (payload.dayType !== dailyDayType) {
    throw new Error(
      `dayType mismatch: payload=${payload.dayType}, dailyState=${dailyDayType}`
    );
  }

  const res = await axios.post(
    `${GATEWAY_URL}/api/tracking/meal-log`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${context.userToken}`,
      },
    }
  );

  return ReportMealResponseDto.parse(res.data);
}
