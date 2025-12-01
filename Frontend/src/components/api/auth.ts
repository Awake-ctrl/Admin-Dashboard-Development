// api/auth.ts
export interface LoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  password: string;
  confirm_password: string;
  agree_to_terms: boolean;
  subscribe_newsletter?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

class AuthApi {
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Login failed');
      // console.log(response);
    }

    return response.json();
  }

  async signup(signupData: SignupData): Promise<UserResponse> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  }

  async forgotPassword(email: string): Promise<{ message: string; success: boolean }> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Password reset request failed');
    }

    return response.json();
  }

  async resetPassword(resetData: any): Promise<{ message: string; success: boolean }> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }

    return response.json();
  }

  async getCurrentUser(token: string): Promise<UserResponse> {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  }
}

export const authApi = new AuthApi();