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
    title: 'Plano Super',
    description: '50 tiragens rápidas + 20 tiragens completas',
    price: 25.00,
    quickCredits: 50,
    fullCredits: 20,
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

    console.log(process.env.FRONTEND_URL)

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
        external_reference: transaction.id, // Importante para reconciliação
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/failure`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/pending`,
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

// Listar transações do usuário
router.get('/transactions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({ error: 'Erro ao listar transações' });
  }
});

// Reconciliar pagamentos pendentes diretamente no Mercado Pago
router.post('/reconcile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        status: 'PENDING',
      },
      take: 10,
    });

    if (!pendingTransactions.length) {
      return res.json({ updated: 0, message: 'Nenhuma transação pendente' });
    }

    const paymentClient = new Payment(client);
    let updatedCount = 0;

    for (const transaction of pendingTransactions) {
      let paymentResult = null;

      // Tentar buscar por external_reference primeiro
      try {
        const paymentsSearch = await paymentClient.search({
          options: {
            limit: 5,
            sort: 'date_created',
            criteria: 'desc',
            external_reference: transaction.id,
          },
        });
        paymentResult = paymentsSearch.results?.[0];
      } catch (searchError) {
        console.log('Busca por external_reference falhou:', searchError);
      }

      // Se não encontrou, buscar pagamentos recentes aprovados
      if (!paymentResult) {
        try {
          // Buscar pagamentos recentes (últimos 30 dias)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentPayments = await paymentClient.search({
            options: {
              limit: 20,
              sort: 'date_created',
              criteria: 'desc',
              begin_date: thirtyDaysAgo.toISOString(),
              end_date: new Date().toISOString(),
            },
          });

          // Procurar por pagamento com metadata correspondente
          paymentResult = recentPayments.results?.find((p: any) => {
            const metadata = p.metadata || {};
            return (
              metadata.transaction_id === transaction.id ||
              (p.additional_info?.items?.[0]?.id === transaction.id)
            );
          });
        } catch (recentSearchError) {
          console.log('Busca por pagamentos recentes falhou:', recentSearchError);
        }
      }

      if (!paymentResult) {
        continue;
      }

      const paymentStatus = paymentResult.status;
      if (paymentStatus === 'approved') {
        const plan = PLANS[transaction.planType];
        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: 'APPROVED',
              paymentId: paymentResult.id?.toString(),
              paymentMethod: paymentResult.payment_method_id || '',
            },
          }),
          prisma.user.update({
            where: { id: transaction.userId },
            data: {
              quickCredits: { increment: plan.quickCredits },
              fullCredits: { increment: plan.fullCredits },
            },
          }),
        ]);
        updatedCount++;
        console.log(`✅ Pagamento reconciliado: ${transaction.id}`);
      } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: paymentStatus.toUpperCase() as any },
        });
        updatedCount++;
      }
    }

    res.json({ updated: updatedCount });
  } catch (error) {
    console.error('Erro ao reconciliar pagamentos:', error);
    res.status(500).json({ error: 'Erro ao reconciliar pagamentos' });
  }
});

export default router;
