import { StatusView } from "@/components/ui/StatusView";

type CoachHelpFallbackProps = {
  onRetry?: () => void;
};

export function CoachHelpFallback({ onRetry }: CoachHelpFallbackProps) {
  return (
    <StatusView
      type="error"
      title="משהו השתבש"
      message="אם הבעיה נמשכת, פנה למאמן דרך העוזר לקבלת עזרה מיידית."
      actionLabel={onRetry ? "נסה שוב" : undefined}
      onActionPress={onRetry}
    />
  );
}
