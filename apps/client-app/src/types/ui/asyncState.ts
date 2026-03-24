export type LoadState = "idle" | "loading" | "success" | "empty" | "error";

export type AsyncViewState<T> = {
  status: LoadState;
  data: T | null;
  errorMessage?: string;
};
