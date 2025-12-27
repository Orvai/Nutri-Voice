import type { UIConversation } from "@/types/ui/conversation.ui";
import type { DailyState } from "@/types/ui/tracking/daily-state.ui";

export function formatShortDateTime(ts?: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return `${d.toLocaleDateString("he-IL")} ${d.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function timeAgo(ts?: string | null) {
  if (!ts) return "—";
  const diffMs = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "עכשיו";
  if (min < 60) return `לפני ${min} דק׳`;
  const h = Math.floor(min / 60);
  if (h < 24) return `לפני ${h} ש׳`;
  const days = Math.floor(h / 24);
  return `לפני ${days} ימים`;
}

export function channelLabel(channel: UIConversation["channel"]) {
  if (channel === "WHATSAPP") return "וואטסאפ";
  if (channel === "TELEGRAM") return "טלגרם";
  return "אפליקציה";
}

export function channelIcon(channel: UIConversation["channel"]) {
  if (channel === "WHATSAPP") return "logo-whatsapp";
  if (channel === "TELEGRAM") return "paper-plane";
  return "chatbubbles";
}

export function isDayLogged(state: DailyState | null | undefined) {
  if (!state) return false;
  const hasNutrition = (state.meals?.length || 0) > 0 || (state.consumedCalories || 0) > 0;
  const hasWorkouts = (state.workouts?.length || 0) > 0;
  const hasMetrics = !!state.metrics;
  const hasWeight = !!state.weight;
  return hasNutrition || hasWorkouts || hasMetrics || hasWeight;
}
