export type AuthErrorCode =
  | "unexpected_failure"
  | "validation_failed"
  | "no_authorization"
  | "user_not_found"
  | "session_not_found"
  | "invalid_token"
  | "unknown_error"
  | "response_error";

export type AuthErrorName = "AuthApiError";
