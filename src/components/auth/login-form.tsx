"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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

const loginSchema = z.object({
  login: z.string().min(1, "Bitte Benutzername oder E-Mail eingeben."),
  password: z.string().min(1, "Bitte Passwort eingeben."),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  user: AuthUser;
}

interface LoginFormProps {
  /** Optional notice shown above the form (e.g. session expired). */
  notice?: string;
  /** Called after a successful login with the authenticated user. */
  onSuccess: (user: AuthUser) => void;
}

export function LoginForm({ notice, onSuccess }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      onSuccess(data.user);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Benutzername oder Passwort ist falsch.";
      setServerError(message);
      form.resetField("password");
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Anmelden</CardTitle>
        <CardDescription>
          Melden Sie sich mit Ihrem lokalen Konto an.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notice ? (
          <Alert className="mb-4">
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        ) : null}
        {serverError ? (
          <Alert variant="destructive" className="mb-4" role="alert">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benutzername oder E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      autoFocus
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
                      autoComplete="current-password"
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
                  Anmelden…
                </>
              ) : (
                "Anmelden"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
