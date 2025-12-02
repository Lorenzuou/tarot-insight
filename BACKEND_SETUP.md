# Tarot Insight - Setup Backend

## Pré-requisitos
- Docker e Docker Compose instalados
- Conta no Mercado Pago (https://www.mercadopago.com.br/developers)
- Chave API do Google Gemini

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Backend
JWT_SECRET=sua-chave-secreta-muito-forte-aqui
MERCADOPAGO_ACCESS_TOKEN=seu-token-mercadopago
GEMINI_API_KEY=sua-chave-gemini

# URLs (ajuste conforme seu domínio)
VITE_API_URL=https://api.tarom.com.br
FRONTEND_URL=https://tarom.com.br
BACKEND_URL=https://api.tarom.com.br
```

### 2. Configurar Mercado Pago

1. Acesse https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Copie o **Access Token** (produção ou teste)
4. Configure o webhook em: `https://api.tarom.com.br/payments/webhook`
5. Selecione eventos: `payment` e `merchant_order`

### 3. Banco de Dados

O PostgreSQL será criado automaticamente pelo Docker Compose.

Para rodar migrações manualmente:
```bash
cd backend
npx prisma migrate dev
```

### 4. Build e Deploy

#### Desenvolvimento Local (sem SSL)
```bash
# Usando docker-compose.yml (padrão)
docker compose up --build -d

# Ver logs
docker compose logs -f

# Parar serviços
docker compose down

# Acessar aplicação
http://localhost
```

#### Produção com SSL
```bash
# 1. Certifique-se de ter os certificados SSL em ./ssl/
#    - cert.pem
#    - key.pem

# 2. Configure as variáveis de ambiente no .env
JWT_SECRET=sua-chave-super-secreta
MERCADOPAGO_ACCESS_TOKEN=seu-token-mercadopago
GEMINI_API_KEY=sua-chave-gemini
POSTGRES_PASSWORD=senha-segura-postgres
FRONTEND_URL=https://tarom.com.br
BACKEND_URL=https://api.tarom.com.br

# 3. Suba com docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up --build -d

# Ver logs
docker compose -f docker-compose.prod.yml logs -f

# Parar serviços
docker compose -f docker-compose.prod.yml down

# Acessar aplicação
https://tarom.com.br (ou seu domínio)
```

**Diferenças entre Dev e Prod:**
- **Dev**: HTTP na porta 80, sem SSL, `NODE_ENV=development`
- **Prod**: HTTPS na porta 443, com SSL, `NODE_ENV=production`, HTTP→HTTPS redirect

### 5. Configurar Nginx (se não usar Docker)

Se você quiser rodar sem Docker, configure seu Nginx para fazer proxy:

```nginx
# /api/ -> backend:3001
location /api/ {
    proxy_pass http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Sistema de Créditos

### Planos Disponíveis

1. **Pacote Básico - R$ 7,00**
   - 3 Consultas Rápidas
   - 1 Consulta Completa
   - Válido por 30 dias

2. **Pacote Premium - R$ 15,00**
   - 10 Consultas Rápidas
   - 3 Consultas Completas
   - Válido por 60 dias

3. **Pacote Ilimitado - R$ 30,00**
   - Consultas Rápidas Ilimitadas (999)
   - 10 Consultas Completas
   - Válido por 90 dias

### Fluxo de Pagamento

1. Usuário se cadastra (ganha 1 tiragem grátis)
2. Tenta fazer uma leitura sem créditos
3. É redirecionado para página de planos
4. Escolhe um plano e é redirecionado para Mercado Pago
5. Após pagamento, webhook atualiza créditos automaticamente
6. Usuário recebe os créditos e pode usar

## API Endpoints

### Autenticação
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Login
- `GET /auth/me` - Buscar dados do usuário

### Leituras
- `GET /readings/check?type=QUICK|COMPLETE` - Verificar disponibilidade
- `POST /readings/consume` - Consumir crédito

### Pagamentos
- `POST /payments/create` - Criar pagamento
- `POST /payments/webhook` - Webhook Mercado Pago

## Troubleshooting

### Backend não conecta ao banco
```bash
docker-compose logs postgres
docker-compose restart backend
```

### Erro de CORS
Verifique `FRONTEND_URL` e `BACKEND_URL` no `.env`

### Pagamentos não funcionam
1. Verifique o `MERCADOPAGO_ACCESS_TOKEN`
2. Confirme que o webhook está configurado
3. Teste com cartão de teste do Mercado Pago

## Cartões de Teste (Mercado Pago)

**Aprovado:**
- Número: 5031 4332 1540 6351
- CVV: 123
- Validade: 11/25

**Recusado:**
- Número: 5031 7557 3453 0604

Mais em: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

## Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas postgres
docker-compose logs -f postgres
```

## Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env`
- Use senhas fortes para `JWT_SECRET`
- Em produção, use Access Token de **produção** do Mercado Pago
- Configure SSL/HTTPS (já configurado no docker-compose)
