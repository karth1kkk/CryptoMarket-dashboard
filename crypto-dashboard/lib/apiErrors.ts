import { isAxiosError } from "axios";

const RATE_LIMIT_MESSAGE =
  "The market data service is rate-limited. Wait a minute and try again, or set COINGECKO_API_KEY in the API server (see crypto-backend).";

export function isApiRateLimitError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return error.response?.status === 429;
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    if (status === 429) {
      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message: string }).message === "string"
      ) {
        return (data as { message: string }).message;
      }
      return RATE_LIMIT_MESSAGE;
    }
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message?: unknown }).message;
      if (typeof m === "string" && m.length) return m;
    }
    if (data && typeof data === "object" && "error" in data) {
      const e = (data as { error?: unknown }).error;
      if (typeof e === "string" && e.length) return e;
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}
