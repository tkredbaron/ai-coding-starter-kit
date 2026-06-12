// Thin fetch wrapper for the local JSON API.
// All requests stay on the LAN / same origin — no external calls.

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

const GENERIC_ERROR = "Ein Fehler ist aufgetreten. Bitte erneut versuchen.";

/**
 * Performs a same-origin JSON request and throws ApiRequestError with the
 * server-provided German message on non-2xx responses.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      // Send the session cookie; never follow off-origin redirects.
      credentials: "same-origin",
    });
  } catch {
    // Network/offline error — still a local-only failure, no data leaves the box.
    throw new ApiRequestError(GENERIC_ERROR, 0);
  }

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : GENERIC_ERROR;
    throw new ApiRequestError(message, res.status);
  }

  return body as T;
}
