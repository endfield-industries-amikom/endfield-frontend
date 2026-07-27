import type { IResponse } from "~/types/IResponse";

// SSR-safe API client for Mista API Gateway
const API_BASE = process.env.API_GATEWAY_URL || "";
const FETCH_TIMEOUT_MS = 8000;

export interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  cookie?: string;
  /** Set true for file uploads — sends body as FormData, skips Content-Type */
  isMultipart?: boolean;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, token, cookie, isMultipart } = options;

  if (!API_BASE) {
    throw new Error("API_GATEWAY_URL not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const requestHeaders: Record<string, string> = {
      ...headers,
    };
    // Only set Content-Type when we have a body (empty JSON body with Content-Type header
    // can cause servers to choke on an empty parse attempt)
    if (body && !isMultipart) requestHeaders["Content-Type"] = "application/json";
    if (token) requestHeaders["Authorization"] = `Bearer ${token}`;
    if (cookie) requestHeaders["Cookie"] = cookie;

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body: body
        ? isMultipart
          ? (body as FormData)
          : JSON.stringify(body)
        : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const error: IResponse = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw error;
    }

    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

export function get<T = unknown>(
  path: string,
  token?: string,
  cookie?: string,
): Promise<T> {
  return apiRequest<T>(path, { token, cookie });
}

export function post<T = unknown>(
  path: string,
  body: unknown,
  token?: string,
  cookie?: string,
): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body, token, cookie });
}

export function put<T = unknown>(
  path: string,
  body: unknown,
  token?: string,
  cookie?: string,
): Promise<T> {
  return apiRequest<T>(path, { method: "PUT", body, token, cookie });
}

export function patch<T = unknown>(
  path: string,
  body: unknown,
  token?: string,
  cookie?: string,
): Promise<T> {
  return apiRequest<T>(path, { method: "PATCH", body, token, cookie });
}

export function del<T = unknown>(
  path: string,
  token?: string,
  cookie?: string,
): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE", token, cookie });
}

export function deleteEntity<T = unknown>(
  path: string,
  token?: string,
  cookie?: string,
): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE", token, cookie });
}
// ---------------------------------------------------------------------------
// Full‑response variant — returns headers so SSR actions can forward
// Set‑Cookie headers from the backend to the browser.
// ---------------------------------------------------------------------------

export interface ApiFullResponse<T = unknown> {
  data: T;
  headers: Headers;
  status: number;
}

export async function apiRequestFull<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<ApiFullResponse<T>> {
  const { method = "GET", body, headers = {}, token, cookie } = options;

  if (!API_BASE) {
    throw new Error("API_GATEWAY_URL not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const requestHeaders: Record<string, string> = {
      ...headers,
    };
    if (body) requestHeaders["Content-Type"] = "application/json";
    if (token) requestHeaders["Authorization"] = `Bearer ${token}`;
    if (cookie) requestHeaders["Cookie"] = cookie;

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { data, headers: response.headers, status: response.status };
  } finally {
    clearTimeout(timer);
  }
}
