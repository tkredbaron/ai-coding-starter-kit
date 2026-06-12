"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useSession } from "@/hooks/use-session";
import { LoginForm } from "@/components/auth/login-form";
import { SetupForm } from "@/components/auth/setup-form";
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog";
import { AppShell, type AppView } from "@/components/app-shell";
import { UserManagement } from "@/components/admin/user-management";

export default function Home() {
  const session = useSession();
  const [view, setView] = useState<AppView>("chat");

  // Initial session check.
  if (session.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Lädt" />
      </div>
    );
  }

  // First-run: no admin exists yet → Ersteinrichtung.
  if (session.setupRequired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <SetupForm onSuccess={() => session.refresh()} />
      </div>
    );
  }

  // Not logged in → Anmelden.
  if (!session.authenticated || !session.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <LoginForm onSuccess={() => session.refresh()} />
      </div>
    );
  }

  const user = session.user;

  // Logged in but must set a new password (after admin reset).
  if (user.mustChangePassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <ChangePasswordDialog
          open
          forced
          onOpenChange={() => {}}
          onSuccess={() => session.refresh()}
        />
      </div>
    );
  }

  // Members never see the admin view, even if state were tampered with.
  const effectiveView = view === "admin" && user.role !== "admin" ? "chat" : view;

  return (
    <AppShell
      user={user}
      view={effectiveView}
      onViewChange={setView}
      onLoggedOut={() => {
        setView("chat");
        void session.refresh();
      }}
    >
      {effectiveView === "admin" ? (
        <UserManagement currentUserId={user.id} />
      ) : (
        <ChatPlaceholder displayName={user.displayName} />
      )}
    </AppShell>
  );
}

function ChatPlaceholder({ displayName }: { displayName: string }) {
  return (
    <div className="rounded-lg border bg-background p-8 text-center">
      <h1 className="text-xl font-semibold">Willkommen, {displayName}!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Der KI-Assistent (PROJ-2) wird hier erscheinen. Ihr Konto und Ihre
        Anmeldung sind bereits eingerichtet.
      </p>
    </div>
  );
}
