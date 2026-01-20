// types/auth.ts
export interface LoginUserResponse {
  user: User;
  token: string;
}

export interface RegisterUserResponse {
  user: {
    id: number;
    name: string;
    email: string;
    updated_at: string;
    created_at: string;
  };
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
