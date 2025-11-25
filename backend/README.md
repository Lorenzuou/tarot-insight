# Backend API para Tarot Insight

Backend Node.js com TypeScript, Express, Prisma e PostgreSQL.

## 🚀 Setup Local

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 3. Configurar banco de dados
```bash
# Iniciar PostgreSQL (via Docker)
docker run -d --name tarot-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tarot_insight \
  -p 5432:5432 \
  postgres:16-alpine

# Rodar migrations
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```

API estará em `http://localhost:3001`

## 📋 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário (ganha 1 tiragem grátis)
- `POST /api/auth/login` - Login

### Leituras
- `GET /api/readings/credits` - Ver créditos disponíveis
- `POST /api/readings/check` - Verificar se pode fazer leitura
- `POST /api/readings/consume` - Consumir crédito e registrar leitura
- `GET /api/readings/history` - Histórico de leituras

### Pagamentos
- `POST /api/payments/create` - Criar pagamento (Mercado Pago)
- `POST /api/payments/webhook` - Webhook do Mercado Pago
- `GET /api/payments/status/:id` - Status de transação

## 💰 Planos Disponíveis

```typescript
BASIC: R$ 7,00 - 3 rápidas + 1 completa
PREMIUM: R$ 15,00 - 10 rápidas + 3 completas
UNLIMITED: R$ 25,00 - Ilimitadas por 30 dias
```

## 🔐 Mercado Pago

1. Crie uma conta em https://www.mercadopago.com.br/developers
2. Obtenha seu Access Token em "Suas integrações" > "Credenciais"
3. Adicione ao `.env`: `MERCADOPAGO_ACCESS_TOKEN=seu-token`
4. Configure a URL de notificação no painel do MP apontando para `/api/payments/webhook`

## 🐳 Deploy com Docker

O backend já está configurado no `docker-compose.yml` principal:

```bash
# Na raiz do projeto
docker-compose up -d backend postgres
```

## 📊 Database Schema

```prisma
User {
  id, email, password, name
  freeReadings: 1 (inicial)
  quickCredits, fullCredits
  readings[], transactions[]
}

Reading {
  id, userId, type, question
  cards (JSON), aiResult (JSON)
}

Transaction {
  id, userId, planType, amount
  status, paymentId, paymentMethod
}
```
