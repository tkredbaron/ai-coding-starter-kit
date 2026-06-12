"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

const schema = z
  .object({
    currentPassword: z.string().min(1, "Bitte aktuelles Passwort eingeben."),
    newPassword: z
      .string()
      .min(8, "Das neue Passwort muss mindestens 8 Zeichen lang sein."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Das neue Passwort muss sich vom aktuellen unterscheiden.",
    path: ["newPassword"],
  });

type ChangePasswordValues = z.infer<typeof schema>;

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Forced mode: the user must change the password before continuing
   * (admin reset). The dialog cannot be dismissed in this mode.
   */
  forced?: boolean;
  /** Called after a successful change. */
  onSuccess?: () => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  forced = false,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Reset fields whenever the dialog opens.
  useEffect(() => {
    if (open) {
      form.reset();
      setServerError(null);
    }
  }, [open, form]);

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: ChangePasswordValues) {
    setServerError(null);
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      toast.success("Passwort wurde geändert.");
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Das Passwort konnte nicht geändert werden.";
      setServerError(message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // In forced mode the dialog must stay open until success.
        if (forced && !next) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        // Block dismiss-by-overlay/escape in forced mode.
        onInteractOutside={(e) => forced && e.preventDefault()}
        onEscapeKeyDown={(e) => forced && e.preventDefault()}
        showCloseButton={!forced}
      >
        <DialogHeader>
          <DialogTitle>Passwort ändern</DialogTitle>
          <DialogDescription>
            {forced
              ? "Aus Sicherheitsgründen müssen Sie jetzt ein neues Passwort festlegen, bevor Sie fortfahren können."
              : "Geben Sie Ihr aktuelles Passwort und zweimal das neue Passwort ein."}
          </DialogDescription>
        </DialogHeader>
        {serverError ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aktuelles Passwort</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Neues Passwort</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Mindestens 8 Zeichen.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Neues Passwort wiederholen</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {!forced ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Abbrechen
                </Button>
              ) : null}
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern…
                  </>
                ) : (
                  "Passwort ändern"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
