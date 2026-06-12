"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth-types";

interface UsersResponse {
  users: AuthUser[];
}

interface UseUsersResult {
  users: AuthUser[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Loads the managed user list from GET /api/admin/users (Admins only). */
export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<UsersResponse>("/api/admin/users");
      setUsers(data.users);
    } catch {
      setError("Die Benutzerliste konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { users, loading, error, refresh };
}
