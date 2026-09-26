import { Timestamp } from "firebase/firestore";
import type { UserProfile } from "./auth.types";

export function parseUserProfile(data: Record<string, unknown>): UserProfile {
  const username =
    typeof data.username === "string" ? data.username : data.full_name;
  const createdAt =
    typeof data.createdAt === "number"
      ? data.createdAt
      : data.created_at instanceof Timestamp
        ? data.created_at.toMillis()
        : undefined;
  const legacyProfile = data.created_at instanceof Timestamp;
  const role = legacyProfile
    ? data.role === "admin"
      ? "admin"
      : "user"
    : data.role;
  if (
    typeof username !== "string" ||
    validateUsername(username) !== null ||
    typeof data.email !== "string" ||
    (role !== "user" && role !== "admin") ||
    typeof createdAt !== "number" ||
    !Number.isFinite(createdAt) ||
    (data.organizationId !== undefined &&
      typeof data.organizationId !== "string")
  ) {
    throw new Error("Invalid user profile data");
  }
  return {
    username,
    email: data.email,
    role,
    createdAt,
    ...(data.organizationId ? { organizationId: data.organizationId } : {}),
  };
}

export function validateUsername(username: string): string | null {
  const length = username.trim().length;
  if (length < 2) return "Name must have at least 2 characters.";
  if (length > 60) return "Name must be 60 characters or fewer.";
  return null;
}

export function validateEmail(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? null
    : "Enter a valid email address.";
}

export function validateAccount(
  email: string,
  password: string,
  username?: string,
): string | null {
  const emailError = validateEmail(email);
  if (emailError) return emailError;
  if (!password) return "Enter your password.";
  if (username !== undefined) {
    if (password.length < 8) return "Password must have at least 8 characters.";
    return validateUsername(username);
  }
  return null;
}
