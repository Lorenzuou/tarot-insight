import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Verificar créditos disponíveis
router.get('/credits', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        freeReadings: true,
        quickCredits: true,
        fullCredits: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar créditos:', error);
    res.status(500).json({ error: 'Erro ao buscar créditos' });
  }
});

// Verificar se pode fazer uma leitura
router.post('/check', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body; // 'QUICK' ou 'FULL'

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let canRead = false;
    let useFree = false;

    // Prioridade: 1) Tiragem grátis, 2) Créditos pagos
    if (user.freeReadings > 0) {
      canRead = true;
      useFree = true;
    } else if (type === 'QUICK' && user.quickCredits > 0) {
      canRead = true;
    } else if (type === 'FULL' && user.fullCredits > 0) {
      canRead = true;
    }

    res.json({ 
      canRead, 
      useFree,
      credits: {
        free: user.freeReadings,
        quick: user.quickCredits,
        full: user.fullCredits,
      }
    });
  } catch (error) {
    console.error('Erro ao verificar leitura:', error);
    res.status(500).json({ error: 'Erro ao verificar leitura' });
  }
});

// Consumir crédito e registrar leitura
router.post('/consume', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { type, question, cards, aiResult } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    let updateData: any = {};
    let readingType: 'FREE_FIRST' | 'QUICK' | 'FULL' = type;

    // Determinar qual crédito consumir
    if (user.freeReadings > 0) {
      updateData.freeReadings = { decrement: 1 };
      readingType = 'FREE_FIRST';
    } else if (type === 'QUICK' && user.quickCredits > 0) {
      updateData.quickCredits = { decrement: 1 };
    } else if (type === 'FULL' && user.fullCredits > 0) {
      updateData.fullCredits = { decrement: 1 };
    } else {
      return res.status(403).json({ error: 'Créditos insuficientes' });
    }

    // Atualizar créditos e criar registro de leitura
    const [updatedUser, reading] = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: updateData,
      }),
      prisma.reading.create({
        data: {
          userId: req.userId!,
          type: readingType,
          question,
          cards,
          aiResult,
        },
      }),
    ]);

    res.json({ 
      success: true,
      reading,
      remainingCredits: {
        free: updatedUser.freeReadings,
        quick: updatedUser.quickCredits,
        full: updatedUser.fullCredits,
      }
    });
  } catch (error) {
    console.error('Erro ao consumir crédito:', error);
    res.status(500).json({ error: 'Erro ao processar leitura' });
  }
});

// Histórico de leituras
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const readings = await prisma.reading.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(readings);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

export default router;
