/**
 * Known error codes. Note that the server may also return other error codes
 * not included in this list (if the client library is older than the version
 * on the server).
 */
export type AuthErrorCode =
  | "unexpected_failure"
  | "validation_failed"
  | "no_authorization"
  | "user_not_found"
  | "session_not_found"
  | "invalid_token"
  | "unknown_error";
