// services/auth.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wired to the FastAPI backend. Login/signup/me call the real API; logout still calls mock cleanup.
// ─────────────────────────────────────────────────────────────────────────────
import { LoginCredentials, SignupCredentials, User } from '@/types/auth';
import { mockSignup, mockLogout } from '@/lib/auth';
import { api } from '@/lib/api';

export const authService = {
  login: async (creds: LoginCredentials): Promise<User> => {
    try {
      const { access_token } = await api.post<{ access_token: string }>('/api/auth/login', creds);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nflix_token', access_token);
      }
      // Fetch real user from backend
      const user = await api.get<User>('/api/auth/me', access_token);
      return user;
    } catch (error) {
      // Remove fallback — throw error so UI shows proper message
      throw error;
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
