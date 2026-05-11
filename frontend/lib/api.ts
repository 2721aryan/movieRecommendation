// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Thin HTTP client wrapper — all service calls go through here.
// When the backend is ready, just set NEXT_PUBLIC_API_URL in .env.local.
// ─────────────────────────────────────────────────────────────────────────────

import { API_BASE_URL } from './constants';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(endpoint: string)                     => request<T>(endpoint),
  post:   <T>(endpoint: string, body: unknown)      => request<T>(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(endpoint: string, body: unknown)      => request<T>(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(endpoint: string)                     => request<T>(endpoint, { method: 'DELETE' }),
};
