# 🔮 Tarot Insight - Guia Rápido

Sistema completo de consultas de tarô com autenticação, pagamentos e IA.

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```bash
cp .env.example .env
```

Edite o `.env` e configure:
- **GEMINI_API_KEY**: Obrigatório (obtenha em https://aistudio.google.com/apikey)
- **JWT_SECRET**: Qualquer string aleatória para desenvolvimento

### 2. Subir Ambiente de Desenvolvimento

```bash
# Desenvolvimento (HTTP, sem SSL)
docker compose up --build -d

# Ver logs
docker compose logs -f

# Acessar aplicação
http://localhost
```

### 3. Subir Ambiente de Produção

```bash
# 1. Configure SSL (coloque certificados em ./ssl/)
mkdir -p ssl
cp seu-cert.pem ssl/cert.pem
cp sua-key.pem ssl/key.pem

# 2. Configure .env com valores de produção
JWT_SECRET=chave-super-secreta-aleatoria
MERCADOPAGO_ACCESS_TOKEN=seu-token-prod
POSTGRES_PASSWORD=senha-forte
GEMINI_API_KEY=sua-chave

# 3. Suba com compose de produção
docker compose -f docker-compose.prod.yml up --build -d

# Acessar
https://seu-dominio.com
```

## 📊 Sistema de Créditos

### Novo Usuário
- Cadastro grátis
- **1 tiragem grátis** (rápida ou completa)

### Planos Disponíveis

| Plano | Preço | Rápidas | Completas | Validade |
|-------|-------|---------|-----------|----------|
| **Básico** | R$ 7 | 3 | 1 | 30 dias |
| **Premium** | R$ 15 | 10 | 3 | 60 dias |
| **Ilimitado** | R$ 30 | ∞ | 10 | 90 dias |

## 🎯 Funcionalidades

### Frontend
- ✅ 2 modos de leitura (Rápida 3 cartas / Completa 9 cartas)
- ✅ Login/Cadastro com JWT
- ✅ Sistema de créditos em tempo real
- ✅ Integração com Google Gemini AI
- ✅ Interface mística responsiva
- ✅ Animações 3D nas cartas

### Backend
- ✅ API REST com Express + TypeScript
- ✅ PostgreSQL + Prisma ORM
- ✅ Autenticação JWT
- ✅ Integração Mercado Pago
- ✅ Webhook para confirmação de pagamento
- ✅ Sistema de créditos automático

## 🛠️ Comandos Úteis

```bash
# Ver status dos containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Reiniciar apenas backend
docker compose restart backend

# Parar tudo
docker compose down

# Limpar tudo (incluindo volumes)
docker compose down -v

# Rodar migrations manualmente
docker compose exec backend npx prisma migrate dev

# Acessar banco de dados
docker compose exec postgres psql -U postgres -d tarot_insight
```

## 🔍 Troubleshooting

### Backend não inicia
```bash
# Verificar logs
docker compose logs backend

# Verificar se Postgres está healthy
docker compose ps postgres
```

### Erro de SSL em produção
```bash
# Verificar certificados
ls -la ssl/

# Certificados devem ser:
# - cert.pem (certificado + cadeia CA)
# - key.pem (chave privada)
```

### Erro "JWT_SECRET not set"
```bash
# Adicione no .env
JWT_SECRET=qualquer-string-aqui
```

### Pagamentos não funcionam
1. Verifique `MERCADOPAGO_ACCESS_TOKEN` no `.env`
2. Configure webhook em https://www.mercadopago.com.br/developers
3. URL do webhook: `https://seu-dominio.com/api/payments/webhook`
4. Eventos: `payment` e `merchant_order`

## 📁 Estrutura do Projeto

```
tarot-insight/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Rotas (auth, readings, payments)
│   │   ├── middleware/     # Auth middleware
│   │   └── server.ts       # Servidor Express
│   ├── prisma/             # Schema do banco
│   └── Dockerfile
├── components/             # Componentes React
├── services/              # Serviços (Gemini, Auth)
├── contexts/              # React Context (Auth)
├── public/cards/          # Imagens das cartas (WebP)
├── nginx.dev.conf         # Nginx para desenvolvimento
├── nginx.prod.conf        # Nginx para produção
├── docker-compose.yml     # Compose de desenvolvimento
├── docker-compose.prod.yml # Compose de produção
└── Dockerfile             # Build do frontend
```

## 🔐 Segurança

**⚠️ IMPORTANTE em Produção:**

1. Use `JWT_SECRET` forte e aleatório
2. Use `POSTGRES_PASSWORD` seguro
3. Configure SSL com certificados válidos
4. Use Access Token de **produção** do Mercado Pago
5. Nunca commite o arquivo `.env`

## 📞 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Leituras
- `GET /api/readings/credits` - Ver créditos
- `POST /api/readings/check` - Verificar se pode ler
- `POST /api/readings/consume` - Consumir crédito
- `GET /api/readings/history` - Histórico

### Pagamentos
- `POST /api/payments/create` - Criar pagamento
- `POST /api/payments/webhook` - Webhook Mercado Pago

## 📦 Deploy em Produção

### VM/VPS (Ubuntu/Debian)

```bash
# 1. Clone o repo
git clone https://github.com/seu-usuario/tarot-insight.git
cd tarot-insight

# 2. Configure .env
nano .env

# 3. Adicione certificados SSL
mkdir ssl
# Copie cert.pem e key.pem para ./ssl/

# 4. Suba produção
docker compose -f docker-compose.prod.yml up --build -d

# 5. Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🎨 Customização

### Mudar planos de pagamento
Edite `backend/src/routes/payments.ts`:
```typescript
const PLANS = {
  BASIC: { price: 7.00, quickCredits: 3, fullCredits: 1 },
  // Adicione mais planos aqui
}
```

### Mudar cores/tema
Edite `index.html` (Tailwind config) ou adicione CSS customizado.

---

**Desenvolvido com 🔮 para insights místicos**
