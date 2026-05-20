// services/auth.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wired to the FastAPI backend. Falls back to mock if backend is unreachable.
// ─────────────────────────────────────────────────────────────────────────────
import { LoginCredentials, SignupCredentials, User } from '@/types/auth';
import { mockLogin, mockSignup, mockLogout } from '@/lib/auth';
import { api } from '@/lib/api';

export const authService = {
  login: async (creds: LoginCredentials): Promise<User> => {
    try {
      // Backend returns a JWT token; fetch the user object separately
      const { access_token } = await api.post<{ access_token: string }>('/api/auth/login', creds);
      // Store token for subsequent requests
      if (typeof window !== 'undefined') {
        localStorage.setItem('nflix_token', access_token);
      }
      // Decode user info from token payload (or add a /api/auth/me endpoint later)
      return mockLogin(creds); // TODO: replace with api.get<User>('/api/auth/me') once /me is added
    } catch {
      // Fallback to mock during development if backend is offline
      return mockLogin(creds);
    }
  },

  signup: async (creds: SignupCredentials): Promise<User> => {
    try {
      return await api.post<User>('/api/auth/signup', creds);
    } catch {
      return mockSignup(creds);
    }
  },

  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nflix_token');
    }
    await api.post('/api/auth/logout', {}).catch(() => {});
    return mockLogout();
  },
};
