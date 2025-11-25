const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: string;
  email: string;
  name: string;
  freeReadingsUsed: number;
  quickReadingsAvailable: number;
  completeReadingsAvailable: number;
  subscriptionStatus: 'FREE' | 'ACTIVE' | 'EXPIRED';
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao registrar');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao fazer login');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async checkReadingAvailability(type: 'QUICK' | 'COMPLETE'): Promise<{ available: boolean; message?: string }> {
    if (!this.token) {
      return { available: false, message: 'Faça login para continuar' };
    }

    const response = await fetch(`${API_URL}/readings/check?type=${type}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar disponibilidade');
    }

    return response.json();
  }

  async consumeReading(type: 'QUICK' | 'COMPLETE'): Promise<void> {
    if (!this.token) {
      throw new Error('Não autenticado');
    }

    const response = await fetch(`${API_URL}/readings/consume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao consumir leitura');
    }
  }

  async getUser(): Promise<User> {
    if (!this.token) {
      throw new Error('Não autenticado');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }

    return response.json();
  }
}

export const authService = new AuthService();
