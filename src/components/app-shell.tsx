"use client";

import { useState } from "react";
import { LogOut, KeyRound, Users, MessageSquare, Menu } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog";
import { apiFetch } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

export type AppView = "chat" | "admin";

interface AppShellProps {
  user: AuthUser;
  view: AppView;
  onViewChange: (view: AppView) => void;
  /** Called after logout so the parent can show the login page. */
  onLoggedOut: () => void;
  children: React.ReactNode;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell({
  user,
  view,
  onViewChange,
  onLoggedOut,
  children,
}: AppShellProps) {
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAdmin = user.role === "admin";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the call fails locally, treat as logged out client-side.
    } finally {
      setLoggingOut(false);
      toast.success("Sie wurden abgemeldet.");
      onLoggedOut();
    }
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Hauptnavigation">
      <NavButton
        active={view === "chat"}
        onClick={() => onViewChange("chat")}
        icon={<MessageSquare className="h-4 w-4" />}
        label="Assistent"
      />
      {isAdmin ? (
        <NavButton
          active={view === "admin"}
          onClick={() => onViewChange("admin")}
          icon={<Users className="h-4 w-4" />}
          label="Benutzerverwaltung"
        />
      ) : null}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4">
        {/* Mobile nav trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menü öffnen">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="px-4 pt-4 text-base">
              Lokaler KI-Assistent
            </SheetTitle>
            <div className="p-4">{nav}</div>
          </SheetContent>
        </Sheet>

        <span className="font-semibold">Lokaler KI-Assistent</span>

        <div className="ml-auto">
          <UserMenu
            user={user}
            isAdmin={isAdmin}
            loggingOut={loggingOut}
            onChangePassword={() => setChangePwOpen(true)}
            onLogout={handleLogout}
          />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r bg-background p-4 md:block">
          {nav}
        </aside>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      <ChangePasswordDialog
        open={changePwOpen}
        onOpenChange={setChangePwOpen}
      />
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function UserMenu({
  user,
  isAdmin,
  loggingOut,
  onChangePassword,
  onLogout,
}: {
  user: AuthUser;
  isAdmin: boolean;
  loggingOut: boolean;
  onChangePassword: () => void;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">
              {initials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">
            {user.displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="truncate">{user.displayName}</span>
          <span className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
            {user.login}
            <Badge variant="secondary" className="text-[10px]">
              {isAdmin ? "Administrator" : "Mitglied"}
            </Badge>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onChangePassword}>
          <KeyRound className="mr-2 h-4 w-4" />
          Passwort ändern
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={loggingOut}
          onSelect={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
