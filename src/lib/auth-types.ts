// Shared types for PROJ-1 (User Accounts & Login).
// These define the API contract the backend (/backend) implements.

export type UserRole = "admin" | "member";

export interface AuthUser {
  id: string;
  displayName: string;
  /** Username or email used to log in. */
  login: string;
  email: string | null;
  role: UserRole;
  active: boolean;
  /** True when the user must set a new password before continuing. */
  mustChangePassword: boolean;
  createdAt: string;
}

/** Shape returned by GET /api/auth/session */
export interface SessionResponse {
  authenticated: boolean;
  setupRequired: boolean;
  user: AuthUser | null;
}

/** Generic API error body. */
export interface ApiError {
  error: string;
}
