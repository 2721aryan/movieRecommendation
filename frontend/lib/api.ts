// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Thin HTTP client wrapper — all service calls go through here.
// Automatically attaches the JWT Bearer token stored in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import { API_BASE_URL } from './constants';

function getAuthHeaders(token?: string): Record<string, string> {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('nflix_token') : null;
  const resolved = token ?? stored;
  return resolved ? { Authorization: `Bearer ${resolved}` } : {};
}

async function request<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(endpoint: string, token?: string)            => request<T>(endpoint, {}, token),
  post:   <T>(endpoint: string, body: unknown)             => request<T>(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(endpoint: string, body: unknown)             => request<T>(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(endpoint: string)                            => request<T>(endpoint, { method: 'DELETE' }),
};
