import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

// Planos disponíveis
const PLANS = {
  BASIC: {
    title: 'Plano Básico',
    description: '3 tiragens rápidas + 1 tiragem completa',
    price: 7.00,
    quickCredits: 3,
    fullCredits: 1,
  },
  PREMIUM: {
    title: 'Plano Premium',
    description: '10 tiragens rápidas + 3 tiragens completas',
    price: 15.00,
    quickCredits: 10,
    fullCredits: 3,
  },
  UNLIMITED: {
    title: 'Plano Ilimitado',
    description: 'Tiragens ilimitadas por 30 dias',
    price: 25.00,
    quickCredits: 999,
    fullCredits: 999,
  },
};

// Criar preferência de pagamento
router.post('/create', authenticate, async (req: AuthRequest, res) => {
  try {
    const { planType } = req.body as { planType: keyof typeof PLANS };

    if (!PLANS[planType]) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    const plan = PLANS[planType];
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Criar transação pendente
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        planType: planType,
        amount: plan.price,
        status: 'PENDING',
      },
    });

    // Criar preferência no Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: transaction.id,
            title: plan.title,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failure`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/webhook`,
        metadata: {
          transaction_id: transaction.id,
          user_id: req.userId,
          plan_type: planType,
        },
      },
    });

    res.json({
      transactionId: transaction.id,
      initPoint: result.init_point,
      preferenceId: result.id,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

// Webhook do Mercado Pago
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    // Mercado Pago envia notificação de payment
    if (type === 'payment') {
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: data.id });

      const transactionId = payment.metadata?.transaction_id;
      if (!transactionId) {
        console.error('Transaction ID não encontrado no metadata');
        return res.status(400).json({ error: 'Transaction ID missing' });
      }

      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction) {
        console.error('Transação não encontrada:', transactionId);
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Atualizar status da transação
      if (payment.status === 'approved') {
        const planType = transaction.planType;
        const plan = PLANS[planType];

        await prisma.$transaction([
          // Atualizar transação
          prisma.transaction.update({
            where: { id: transactionId },
            data: {
              status: 'APPROVED',
              paymentId: payment.id?.toString(),
              paymentMethod: payment.payment_method_id || '',
            },
          }),
          // Adicionar créditos ao usuário
          prisma.user.update({
            where: { id: transaction.userId },
            data: {
              quickCredits: { increment: plan.quickCredits },
              fullCredits: { increment: plan.fullCredits },
            },
          }),
        ]);

        console.log(`✅ Pagamento aprovado: ${transactionId}`);
      } else if (payment.status === 'rejected') {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'REJECTED' },
        });
        console.log(`❌ Pagamento rejeitado: ${transactionId}`);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Error');
  }
});

// Verificar status de uma transação
router.get('/status/:transactionId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    if (transaction.userId !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
});

export default router;
