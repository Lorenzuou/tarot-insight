import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  if (!isOpen) return null;

  const plans = [
    {
      id: 'basic',
      name: 'Pacote Básico',
      price: 7.00,
      quickReadings: 3,
      completeReadings: 1,
      description: 'Perfeito para começar',
      features: [
        '3 Consultas Rápidas',
        '1 Consulta Completa',
        'Respostas assertivas da IA',
        'Válido por 30 dias'
      ]
    },
    {
      id: 'premium',
      name: 'Pacote Premium',
      price: 15.00,
      quickReadings: 10,
      completeReadings: 3,
      description: 'Mais popular',
      popular: true,
      features: [
        '10 Consultas Rápidas',
        '3 Consultas Completas',
        'Respostas assertivas da IA',
        'Insights profundos',
        'Válido por 60 dias'
      ]
    },
    {
      id: 'unlimited',
      name: 'Pacote Ilimitado',
      price: 30.00,
      quickReadings: 999,
      completeReadings: 10,
      description: 'Máximo poder místico',
      features: [
        'Consultas Rápidas Ilimitadas',
        '10 Consultas Completas',
        'Respostas assertivas da IA',
        'Suporte prioritário',
        'Válido por 90 dias'
      ]
    }
  ];

  const handlePurchase = async (planId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      
      if (data.initPoint) {
        window.location.href = data.initPoint;
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-indigo-950 to-purple-950 border border-amber-500/30 rounded-2xl p-8 max-w-5xl w-full shadow-2xl my-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif text-amber-200 mb-2">Escolha Seu Plano</h2>
          <p className="text-amber-100/60">
            {user ? `Olá, ${user.name}! ` : ''}
            Selecione o pacote ideal para suas consultas místicas
          </p>
          
          {user && (
            <div className="mt-4 inline-block bg-indigo-900/50 border border-amber-500/30 rounded-lg px-6 py-3">
              <p className="text-sm text-amber-200">
                Créditos disponíveis: <span className="font-bold text-amber-400">{user.quickReadingsAvailable} rápidas</span> | <span className="font-bold text-amber-400">{user.completeReadingsAvailable} completas</span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-indigo-900/30 border rounded-xl p-6 flex flex-col ${
                plan.popular
                  ? 'border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                  : 'border-amber-500/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MAIS POPULAR
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-2xl font-serif text-amber-200 mb-1">{plan.name}</h3>
                <p className="text-xs text-amber-100/60 mb-3">{plan.description}</p>
                <div className="text-4xl font-bold text-amber-400 mb-1">
                  R$ {plan.price.toFixed(2)}
                </div>
              </div>

              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-amber-100/80">
                    <span className="text-amber-400 mr-2">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg'
                    : 'bg-indigo-800/50 hover:bg-indigo-800 text-amber-200 border border-amber-500/30'
                }`}
              >
                Comprar Agora
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-amber-100/40 mb-4">
          <p>Pagamento seguro via Mercado Pago • Ativação instantânea</p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-200/60 hover:text-amber-200 text-3xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PricingModal;
