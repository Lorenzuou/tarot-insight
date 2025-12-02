import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Configurar nodemailer (usando Gmail como exemplo, ajuste conforme necessário)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar email de verificação
const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifique seu email - Mystic Oracle Tarot',
    html: `
      <h1>Bem-vindo ao Mystic Oracle Tarot!</h1>
      <p>Por favor, clique no link abaixo para verificar seu email:</p>
      <a href="${verificationUrl}">Verificar Email</a>
      <p>Se você não solicitou esta conta, ignore este email.</p>
    `,
  });
};

// Registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Gerar token de verificação
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Criar usuário com 1 tiragem grátis
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          emailVerificationToken: verificationToken,
          freeReadings: 1,
        },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          freeReadings: true,
          quickCredits: true,
          fullCredits: true,
        },
      });

      // Enviar email de verificação
      try {
        await sendVerificationEmail(email, verificationToken);
      } catch (emailError) {
        console.error('Erro ao enviar email de verificação:', emailError);
        // Não falhar o registro por erro no email
      }

      // Gerar token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });

      res.status(201).json({ user, token });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar se email está verificado
      if (!user.emailVerified) {
        return res.status(403).json({ error: 'Por favor, verifique seu email antes de fazer login.' });
      }

      // Gerar token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });

      const { password: _, emailVerificationToken: __, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
);

// Verificar email
router.get('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    res.json({ message: 'Email verificado com sucesso!' });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({ error: 'Erro ao verificar email' });
  }
});

// Reenviar email de verificação
router.post('/resend-verification', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email já verificado' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken },
    });

    await sendVerificationEmail(email, verificationToken);
    res.json({ message: 'Email de verificação reenviado' });
  } catch (error) {
    console.error('Erro ao reenviar verificação:', error);
    res.status(500).json({ error: 'Erro ao reenviar email' });
  }
});

export default router;
