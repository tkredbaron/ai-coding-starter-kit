// Zod schemas validating all auth/admin request bodies on the server.
// Client-side validation is never trusted.
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "./password";

const password = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`);

const username = z
  .string()
  .trim()
  .min(3, "Benutzername muss mindestens 3 Zeichen lang sein.")
  .max(64, "Benutzername ist zu lang.");

const displayName = z
  .string()
  .trim()
  .min(1, "Bitte einen Anzeigenamen eingeben.")
  .max(120, "Anzeigename ist zu lang.");

// Optional email: empty string is treated as "not provided".
const optionalEmail = z
  .string()
  .trim()
  .email("Bitte eine gültige E-Mail-Adresse eingeben.")
  .max(254, "E-Mail-Adresse ist zu lang.")
  .optional()
  .or(z.literal(""));

export const setupSchema = z.object({
  displayName,
  login: username,
  email: optionalEmail,
  password,
});

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Bitte Benutzername oder E-Mail eingeben."),
  password: z.string().min(1, "Bitte Passwort eingeben."),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Bitte aktuelles Passwort eingeben."),
  newPassword: password,
});

export const createUserSchema = z.object({
  displayName,
  login: username,
  email: optionalEmail,
  password,
  role: z.enum(["admin", "member"]),
});

export const updateUserSchema = z
  .object({
    active: z.boolean().optional(),
    role: z.enum(["admin", "member"]).optional(),
  })
  .refine((data) => data.active !== undefined || data.role !== undefined, {
    message: "Keine Änderung angegeben.",
  });

/** Normalizes an optional email field to a trimmed value or null. */
export function normalizeEmail(email: string | undefined): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  return trimmed.length > 0 ? trimmed : null;
}
