// services/auth.service.ts
import { LoginCredentials, SignupCredentials, User } from '@/types/auth';
import { mockLogin, mockSignup, mockLogout } from '@/lib/auth';
import { api } from '@/lib/api';

export const authService = {
  login: async (creds: LoginCredentials): Promise<User> => {
    return mockLogin(creds);
    // Backend: return api.post<User>('/api/auth/login', creds);
  },
  signup: async (creds: SignupCredentials): Promise<User> => {
    return mockSignup(creds);
    // Backend: return api.post<User>('/api/auth/signup', creds);
  },
  logout: async (): Promise<void> => {
    return mockLogout();
    // Backend: await api.post('/api/auth/logout', {});
  },
};
