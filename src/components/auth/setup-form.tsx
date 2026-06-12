"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth-types";

const setupSchema = z
  .object({
    displayName: z.string().min(1, "Bitte einen Anzeigenamen eingeben."),
    login: z
      .string()
      .min(3, "Benutzername muss mindestens 3 Zeichen lang sein."),
    email: z
      .string()
      .email("Bitte eine gültige E-Mail-Adresse eingeben.")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

type SetupValues = z.infer<typeof setupSchema>;

interface SetupResponse {
  user: AuthUser;
}

interface SetupFormProps {
  /** Called after the initial admin is created and logged in. */
  onSuccess: (user: AuthUser) => void;
}

export function SetupForm({ onSuccess }: SetupFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SetupValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      displayName: "",
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: SetupValues) {
    setServerError(null);
    try {
      const data = await apiFetch<SetupResponse>("/api/auth/setup", {
        method: "POST",
        body: JSON.stringify({
          displayName: values.displayName,
          login: values.login,
          email: values.email || null,
          password: values.password,
        }),
      });
      onSuccess(data.user);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Die Einrichtung ist fehlgeschlagen. Bitte erneut versuchen.";
      setServerError(message);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
          <CardTitle className="text-2xl">Ersteinrichtung</CardTitle>
        </div>
        <CardDescription>
          Legen Sie das erste Administrator-Konto an. Dieser Schritt erscheint
          nur einmal und ist danach nicht mehr erreichbar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError ? (
          <Alert variant="destructive" className="mb-4" role="alert">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anzeigename</FormLabel>
                  <FormControl>
                    <Input autoFocus disabled={submitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benutzername</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
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
                  <FormLabel>Passwort wiederholen</FormLabel>
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
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird eingerichtet…
                </>
              ) : (
                "Administrator-Konto anlegen"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
