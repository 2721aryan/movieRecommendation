// lib/auth.ts
// Simple in-memory auth context helpers (no persistence for now).
// Swap these calls for real JWT/session logic when the backend is ready.

import { LoginCredentials, SignupCredentials, User } from '@/types/auth';

// Mock user for demo purposes
export const MOCK_USER: User = {
  id: 'user-1',
  email: 'aryan@nflix.com',
  name: 'Aryan',
  profiles: [
    { id: 'p1', name: 'Aryan',  avatar: '/images/profiles/avatar1.png' },
    { id: 'p2', name: 'Guest',  avatar: '/images/profiles/avatar3.png' },
    { id: 'p3', name: 'Kids',   avatar: '/images/profiles/avatar4.png' },
  ],
};

export async function mockLogin(_creds: LoginCredentials): Promise<User> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 800));
  return MOCK_USER;
}

export async function mockSignup(_creds: SignupCredentials): Promise<User> {
  await new Promise(r => setTimeout(r, 1000));
  return MOCK_USER;
}

export async function mockLogout(): Promise<void> {
  await new Promise(r => setTimeout(r, 300));
}
