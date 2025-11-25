const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  name: string;
  freeReadings: number;
  quickCredits: number;
  fullCredits: number;
  subscriptionStatus?: 'FREE' | 'ACTIVE' | 'EXPIRED';
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Support both 'authToken' and 'token' keys (some parts of app use different keys)
    this.token = localStorage.getItem('authToken') || localStorage.getItem('token');
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
    localStorage.removeItem('token');
  }

  setToken(token: string) {
    this.token = token;
    // keep both storage keys in sync
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    // always return the freshest token from memory or localStorage
    return this.token || localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async checkReadingAvailability(type: 'QUICK' | 'COMPLETE'): Promise<{
    available: boolean;
    message?: string;
    useFree?: boolean;
    credits?: { free: number; quick: number; full: number };
  }> {
    const token = this.getToken();
    if (!token) {
      return { available: false, message: 'Faça login para continuar' };
    }

    const normalizedType = type === 'COMPLETE' ? 'FULL' : 'QUICK';
    const response = await fetch(`${API_URL}/readings/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: normalizedType }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Erro ao verificar disponibilidade');
    }

    const data = await response.json();
    return {
      available: data.canRead,
      message: data.canRead ? undefined : 'Você não possui créditos suficientes',
      useFree: data.useFree,
      credits: data.credits,
    };
  }

  async consumeReading(params: {
    type: 'QUICK' | 'COMPLETE';
    question?: string;
    cards: any;
    aiResult?: any;
  }): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Não autenticado');
    }

    const normalizedType = params.type === 'COMPLETE' ? 'FULL' : 'QUICK';
    const response = await fetch(`${API_URL}/readings/consume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: normalizedType,
        question: params.question,
        cards: params.cards,
        aiResult: params.aiResult,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Erro ao consumir leitura');
    }
  }

  async getUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Não autenticado');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }

    return response.json();
  }
}

export const authService = new AuthService();
