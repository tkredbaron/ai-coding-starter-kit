"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import type { UserRole } from "@/lib/auth-types";

const schema = z
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
    role: z.enum(["admin", "member"]),
  });

type CreateUserValues = z.infer<typeof schema>;

interface CreateUserDialogProps {
  /** Called after a user was created so the list can refresh. */
  onCreated: () => void;
}

export function CreateUserDialog({ onCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      login: "",
      email: "",
      password: "",
      role: "member",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
      setServerError(null);
    }
  }, [open, form]);

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: CreateUserValues) {
    setServerError(null);
    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          displayName: values.displayName,
          login: values.login,
          email: values.email || null,
          password: values.password,
          role: values.role,
        }),
      });
      toast.success("Benutzer wurde angelegt.");
      onCreated();
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Der Benutzer konnte nicht angelegt werden.";
      setServerError(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Benutzer anlegen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Benutzer anlegen</DialogTitle>
          <DialogDescription>
            Erstellen Sie ein neues lokales Konto. Der Benutzer kann sich sofort
            anmelden.
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                  <FormLabel>Initiales Passwort</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mindestens 8 Zeichen. Wird dem Benutzer persönlich
                    übergeben.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolle</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v as UserRole)}
                    value={field.value}
                    disabled={submitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Mitglied</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Anlegen…
                  </>
                ) : (
                  "Anlegen"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
