import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await onLogin(email, password);
      } else {
        if (!name.trim()) {
          setError('Nome é obrigatório');
          setLoading(false);
          return;
        }
        await onRegister(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao processar requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-950 to-purple-950 border border-amber-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-amber-100">
            {isLoginMode ? 'Entrar' : 'Criar Conta'}
          </h2>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 text-2xl"
          >
            ×
          </button>
        </div>

        {!isLoginMode && (
          <div className="bg-indigo-900/40 border border-amber-500/20 rounded-lg p-4 mb-6">
            <p className="text-amber-200 text-sm text-center">
              🎁 Ganhe <strong>1 tiragem grátis</strong> ao se cadastrar!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-amber-200 text-sm mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-indigo-900/50 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-400"
                placeholder="Seu nome"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-amber-200 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-indigo-900/50 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-400"
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-amber-200 text-sm mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-indigo-900/50 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-400"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : isLoginMode ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-amber-400 hover:text-amber-300 text-sm"
            disabled={loading}
          >
            {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
