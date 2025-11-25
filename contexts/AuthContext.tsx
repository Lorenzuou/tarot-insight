import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  freeReadings: number;
  quickCredits: number;
  fullCredits: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshCredits: () => Promise<void>;
  reconcilePayments: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Carregar do localStorage ao iniciar e reconciliar pagamentos
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Reconciliar pagamentos pendentes automaticamente ao carregar
      const reconcileOnLoad = async () => {
        try {
          const response = await fetch(`${API_URL}/payments/reconcile`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${storedToken}` },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.updated > 0) {
              console.log(`✅ ${result.updated} pagamento(s) reconciliado(s) automaticamente`);
              // Atualizar créditos do usuário
              const creditsResponse = await fetch(`${API_URL}/readings/credits`, {
                headers: { 'Authorization': `Bearer ${storedToken}` },
              });
              if (creditsResponse.ok) {
                const credits = await creditsResponse.json();
                const parsedUser = JSON.parse(storedUser);
                const updatedUser = { ...parsedUser, ...credits };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }
            }
          }
        } catch (error) {
          console.error('Erro ao reconciliar pagamentos:', error);
        }
      };
      
      reconcileOnLoad();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao registrar');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const refreshCredits = async () => {
    const authToken = token || localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!authToken) return;

    const response = await fetch(`${API_URL}/readings/credits`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    if (response.ok) {
      const credits = await response.json();
      setUser(prev => {
        const baseUser = prev || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null);
        if (!baseUser) return prev;
        const updatedUser = { ...baseUser, ...credits };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    }
  };

  // Reconciliar pagamentos pendentes no Mercado Pago
  const reconcilePayments = async () => {
    const authToken = token || localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!authToken) return;

    try {
      const response = await fetch(`${API_URL}/payments/reconcile`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.updated > 0) {
          console.log(`✅ ${result.updated} pagamento(s) reconciliado(s)`);
          // Atualizar créditos após reconciliação
          await refreshCredits();
        }
      }
    } catch (error) {
      console.error('Erro ao reconciliar pagamentos:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token,
      refreshCredits,
      reconcilePayments,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
