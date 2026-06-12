"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, KeyRound, Shield, ShieldOff, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import type { AuthUser, UserRole } from "@/lib/auth-types";
import { useUsers } from "@/hooks/use-users";
import { CreateUserDialog } from "./create-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

interface UserManagementProps {
  /** The currently logged-in admin (to mark "Sie" and avoid self-lockout in UI). */
  currentUserId: string;
}

type PendingAction =
  | { type: "deactivate"; user: AuthUser }
  | { type: "demote"; user: AuthUser }
  | null;

export function UserManagement({ currentUserId }: UserManagementProps) {
  const { users, loading, error, refresh } = useUsers();
  const [resetUser, setResetUser] = useState<AuthUser | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [working, setWorking] = useState(false);

  const activeAdminCount = useMemo(
    () => users.filter((u) => u.role === "admin" && u.active).length,
    [users]
  );

  /** Last-admin protection mirrored client-side (server enforces too). */
  function isLastAdmin(user: AuthUser): boolean {
    return user.role === "admin" && user.active && activeAdminCount <= 1;
  }

  async function runAction(
    label: string,
    fn: () => Promise<unknown>
  ): Promise<void> {
    setWorking(true);
    try {
      await fn();
      toast.success(label);
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiRequestError
          ? err.message
          : "Die Aktion konnte nicht ausgeführt werden."
      );
    } finally {
      setWorking(false);
      setPending(null);
    }
  }

  function setActive(user: AuthUser, active: boolean) {
    void runAction(
      active ? "Konto reaktiviert." : "Konto deaktiviert.",
      () =>
        apiFetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify({ active }),
        })
    );
  }

  function setRole(user: AuthUser, role: UserRole) {
    void runAction(
      role === "admin"
        ? "Rolle auf Administrator geändert."
        : "Rolle auf Mitglied geändert.",
      () =>
        apiFetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify({ role }),
        })
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Benutzerverwaltung
          </h1>
          <p className="text-sm text-muted-foreground">
            Konten anlegen, Rollen vergeben und Zugänge verwalten.
          </p>
        </div>
        <CreateUserDialog onCreated={refresh} />
      </div>

      {error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={refresh}>
              Erneut laden
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Anmeldung</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px] text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 && !error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Noch keine Benutzer vorhanden. Legen Sie den ersten Benutzer
                  an.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isSelf = user.id === currentUserId;
                const lastAdmin = isLastAdmin(user);
                return (
                  <TableRow key={user.id} className={user.active ? "" : "opacity-60"}>
                    <TableCell className="font-medium">
                      {user.displayName}
                      {isSelf ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Sie)
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.login}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Administrator" : "Mitglied"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? "outline" : "destructive"}>
                        {user.active ? "Aktiv" : "Deaktiviert"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={working}
                            aria-label={`Aktionen für ${user.displayName}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setResetUser(user)}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Passwort zurücksetzen
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.role === "member" ? (
                            <DropdownMenuItem
                              onSelect={() => setRole(user, "admin")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Zu Administrator machen
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              disabled={lastAdmin}
                              onSelect={() =>
                                setPending({ type: "demote", user })
                              }
                            >
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Zu Mitglied machen
                            </DropdownMenuItem>
                          )}
                          {user.active ? (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              disabled={lastAdmin}
                              onSelect={() =>
                                setPending({ type: "deactivate", user })
                              }
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deaktivieren
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onSelect={() => setActive(user, true)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Reaktivieren
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {activeAdminCount <= 1 && users.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Hinweis: Das letzte aktive Administrator-Konto kann nicht deaktiviert
          oder herabgestuft werden, damit die Benutzerverwaltung erreichbar
          bleibt.
        </p>
      ) : null}

      <ResetPasswordDialog
        user={resetUser}
        onClose={() => setResetUser(null)}
      />

      <AlertDialog
        open={pending !== null}
        onOpenChange={(o) => !o && !working && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.type === "deactivate"
                ? "Konto deaktivieren?"
                : "Rolle herabstufen?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.type === "deactivate"
                ? `„${pending.user.displayName}" kann sich danach nicht mehr anmelden. Aktive Sitzungen werden innerhalb einer Minute beendet. Die Daten bleiben erhalten.`
                : pending?.type === "demote"
                  ? `„${pending.user.displayName}" verliert die Administratorrechte und den Zugang zur Benutzerverwaltung.`
                  : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={working}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              disabled={working}
              onClick={(e) => {
                e.preventDefault();
                if (!pending) return;
                if (pending.type === "deactivate") {
                  setActive(pending.user, false);
                } else {
                  setRole(pending.user, "member");
                }
              }}
            >
              {pending?.type === "deactivate" ? "Deaktivieren" : "Herabstufen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
