import { mapDailyState } from "./daily-state.mapper";
import { DailyState } from "@/types/ui/tracking/daily-state.ui";

export const mapDailyStateList = (response: any): DailyState[] => {
  const rawData = response?.data ?? response;
  
  if (!Array.isArray(rawData)) {
    console.warn("mapDailyStateList received non-array data:", rawData);
    return [];
  }

  return rawData
    .map((item: any) => {
      const realItem = item?.data || item;

      if (!realItem) return null;

      try {
        return mapDailyState(realItem);
      } catch (error) {
        console.error("Error mapping daily state item:", error);
        return null;
      }
    })
    .filter((item): item is DailyState => item !== null);
};