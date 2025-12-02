import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação não encontrado.');
      return;
    }

    const verify = async () => {
      try {
        const result = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(result.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Erro ao verificar email.');
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed flex items-center justify-center p-4">
      <div className="bg-indigo-950/90 border border-amber-500/30 rounded-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-amber-200">Verificando seu email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <span className="text-6xl mb-4 block">✅</span>
            <h3 className="text-xl font-serif text-amber-300 mb-4">Email Verificado!</h3>
            <p className="text-blue-100/80 mb-6">{message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
            >
              Ir para o App
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <span className="text-6xl mb-4 block">❌</span>
            <h3 className="text-xl font-serif text-red-300 mb-4">Erro na Verificação</h3>
            <p className="text-blue-100/80 mb-6">{message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
            >
              Voltar ao Início
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;