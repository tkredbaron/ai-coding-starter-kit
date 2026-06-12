"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { SessionResponse } from "@/lib/auth-types";

interface UseSessionResult extends SessionResponse {
  loading: boolean;
  /** Re-fetch the current session from the server. */
  refresh: () => Promise<void>;
}

const EMPTY: SessionResponse = {
  authenticated: false,
  setupRequired: false,
  user: null,
};

/**
 * Loads the current session from GET /api/auth/session.
 * Used by the app shell to gate access and react to deactivation/expiry.
 */
export function useSession(): UseSessionResult {
  const [state, setState] = useState<SessionResponse>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<SessionResponse>("/api/auth/session");
      setState(data);
    } catch {
      setState(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, loading, refresh };
}
