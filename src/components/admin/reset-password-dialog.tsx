"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth-types";

interface ResetPasswordResponse {
  temporaryPassword: string;
}

interface ResetPasswordDialogProps {
  /** The user whose password is being reset, or null when closed. */
  user: AuthUser | null;
  onClose: () => void;
}

/**
 * Confirms an admin password reset and then displays the generated temporary
 * password once, so the admin can hand it over in person (no email).
 */
export function ResetPasswordDialog({ user, onClose }: ResetPasswordDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset internal state whenever the targeted user changes.
  useEffect(() => {
    setLoading(false);
    setError(null);
    setTempPassword(null);
    setCopied(false);
  }, [user]);

  async function handleReset() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ResetPasswordResponse>(
        `/api/admin/users/${user.id}/reset-password`,
        { method: "POST" }
      );
      setTempPassword(data.temporaryPassword);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Das Passwort konnte nicht zurückgesetzt werden."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!tempPassword) return;
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      toast.success("Passwort kopiert.");
    } catch {
      toast.error("Kopieren nicht möglich. Bitte manuell notieren.");
    }
  }

  return (
    <Dialog open={user !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" aria-hidden />
            Passwort zurücksetzen
          </DialogTitle>
          <DialogDescription>
            {tempPassword
              ? "Übergeben Sie dieses temporäre Passwort persönlich. Der Benutzer muss es bei der nächsten Anmeldung ändern."
              : user
                ? `Für „${user.displayName}" (${user.login}) wird ein neues temporäres Passwort erzeugt. Bestehende Sitzungen dieses Benutzers werden ungültig.`
                : ""}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {tempPassword ? (
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={tempPassword}
              className="font-mono"
              aria-label="Temporäres Passwort"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Passwort kopieren"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : null}

        <DialogFooter>
          {tempPassword ? (
            <Button type="button" onClick={onClose}>
              Fertig
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button type="button" onClick={handleReset} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird zurückgesetzt…
                  </>
                ) : (
                  "Zurücksetzen"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
