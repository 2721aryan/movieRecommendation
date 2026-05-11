export interface User {
  id: string;
  email: string;
  name: string;
  profiles: Profile[];
  active_profile?: Profile;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string; // path to avatar image
  preferences?: {
    favorite_genres: number[];
    language: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
