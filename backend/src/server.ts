import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import readingRoutes from './routes/readings';
import paymentRoutes from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Support multiple allowed origins via FRONTEND_URLS (comma-separated) or single FRONTEND_URL
const rawAllowed = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
const allowedOrigins = rawAllowed ? rawAllowed.split(',').map(s => s.trim()).filter(Boolean) : [];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow non-browser requests like curl/postman (no origin)
    if (!origin) return callback(null, true);

    // Allow explicitly configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow localhost/127.0.0.1 origins (useful for dev + docker)
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        console.debug(`CORS: allowing local origin ${origin}`);
        return callback(null, true);
      }
    } catch (e) {
      // ignore malformed origin
    }

    // For debugging, log rejected origins
    console.warn(`CORS blocked for origin: ${origin}. Allowed: ${allowedOrigins.join(',')}`);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

export default app;
