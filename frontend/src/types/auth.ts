export type UserRole = 'first_responder' | 'volunteer' | 'affected_individual' | 'government';

export interface User {
  email: string;
  role: UserRole;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  fullName: string;
  location: string;
}
