export type AppError = { message: string; cause?: unknown };

export function reportClientError(cause: unknown) {
  console.error("[Okoa Food]", cause);
}

export function toAppError(cause: unknown): AppError {
  reportClientError(cause);
  const code =
    typeof cause === "object" && cause && "code" in cause
      ? String(cause.code)
      : "";
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "This email already has an account.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/user-disabled": "This account is disabled. Please contact support.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "auth/network-request-failed": "Check your connection and try again.",
    "auth/operation-not-allowed":
      "Email sign-in is unavailable. Please contact the site administrator.",
    "auth/weak-password": "Choose a stronger password.",
    "permission-denied": "You do not have permission to do that.",
    unavailable: "The service is temporarily unavailable. Please try again.",
  };
  return {
    message: messages[code] ?? "Something went wrong. Please try again.",
    cause,
  };
}
