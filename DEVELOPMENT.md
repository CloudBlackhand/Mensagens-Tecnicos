# Guia de Desenvolvimento - msgSYSTEC

## 🏗️ Arquitetura

### Backend (Nest.js)
```
apps/backend/src/
├── main.ts                 # Entry point da aplicação
├── app.module.ts           # Módulo raiz
├── modules/                # Módulos de funcionalidades
│   ├── auth/              # Autenticação OAuth2 + JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/    # Passport strategies
│   │   ├── guards/        # Auth guards
│   │   └── decorators/    # Custom decorators
│   ├── users/             # CRUD de usuários
│   ├── sheets/            # Google Sheets integration
│   └── waha/              # Waha API (futuro)
├── common/                # Utilitários compartilhados
│   ├── guards/            # Guards globais
│   ├── decorators/        # Decorators globais
│   └── filters/           # Exception filters
└── prisma/                # Serviço do Prisma
```

### Frontend (Next.js 14)
```
apps/web/src/
├── app/                   # App Router (Next.js 14)
│   ├── layout.tsx        # Layout raiz
│   ├── page.tsx          # Home (redirect)
│   ├── (auth)/           # Route group auth
│   │   ├── layout.tsx    # Layout auth
│   │   ├── login/        # Página de login
│   │   └── callback/     # OAuth callback
│   └── (dashboard)/      # Route group protegido
│       ├── layout.tsx    # Layout dashboard
│       └── dashboard/    # Página principal
├── components/           # Componentes React
│   ├── ui/              # Shadcn/ui components
│   ├── Header.tsx       # Header com user menu
│   └── SheetsTable.tsx  # Tabela de dados
└── lib/                 # Utilitários
    ├── utils.ts         # Funções helper
    └── api-client.ts    # Cliente HTTP (futuro)
```

## 🔧 Configuração de Desenvolvimento

### 1. Ambiente Local

```bash
# 1. Instalar dependências
npm run install:all

# 2. Configurar banco (PostgreSQL local ou Railway)
npm run db:generate
npm run db:push

# 3. Configurar variáveis de ambiente
cp apps/backend/env.example apps/backend/.env
cp apps/web/env.example apps/web/.env.local

# 4. Executar em desenvolvimento
npm run dev
```

### 2. Variáveis de Ambiente

**Backend (.env)**:
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/msgsystec"

# Google OAuth2
GOOGLE_CLIENT_ID="seu-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Google Sheets
GOOGLE_SHEET_ID="1islC9-Wt4y15Sfxc_SMmxAxjaYn92p7qssDPJJnKhBc"

# JWT
JWT_SECRET="super-secret-jwt-key-min-32-characters"

# App
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Fluxo de Desenvolvimento

### 1. Estrutura de Branches
```
main          # Produção
├── develop   # Desenvolvimento
├── feature/  # Novas funcionalidades
├── hotfix/   # Correções urgentes
└── release/  # Preparação de releases
```

### 2. Commit Convention
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação, sem mudança de código
refactor: refatoração de código
test: adiciona ou corrige testes
chore: mudanças em build, dependências
```

### 3. Pull Request Template
```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Não há breaking changes
```

## 🧪 Testes

### Estrutura de Testes
```
apps/backend/src/
├── modules/
│   └── auth/
│       ├── auth.controller.spec.ts
│       ├── auth.service.spec.ts
│       └── strategies/
│           └── google.strategy.spec.ts
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json

apps/web/src/
├── __tests__/
│   ├── components/
│   └── pages/
└── jest.config.js
```

### Executar Testes
```bash
# Backend
cd apps/backend
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage

# Frontend
cd apps/web
npm test              # Jest tests
npm run test:watch    # Watch mode
```

## 📊 Monitoramento e Logs

### Backend Logs
```typescript
// Usar Logger do Nest.js
import { Logger } from '@nestjs/common';

const logger = new Logger('ModuleName');

logger.log('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Frontend Logs
```typescript
// Console logs em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// Error boundaries para React
```

### Métricas de Performance
```typescript
// Backend - Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  });
});
```

## 🔍 Debugging

### Backend Debug
```bash
# Debug com VS Code
# .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "program": "${workspaceFolder}/apps/backend/src/main.ts",
  "env": {
    "NODE_ENV": "development"
  },
  "console": "integratedTerminal"
}
```

### Frontend Debug
```bash
# Next.js debug mode
npm run dev:frontend -- --inspect

# React DevTools
# Instalar extensão do browser
```

## 📦 Build e Deploy

### Build Local
```bash
# Build completo
npm run build

# Build específico
npm run build:backend
npm run build:frontend
```

### Docker (Produção)
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
# ... build steps

FROM node:18-alpine AS runner
# ... runtime setup
```

### Railway Deploy
```bash
# 1. Conectar repositório
# 2. Configurar variáveis de ambiente
# 3. Deploy automático
```

## 🔒 Segurança

### Checklist de Segurança
- [ ] Variáveis de ambiente protegidas
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] Validação de dados com Zod
- [ ] JWT com expiração adequada
- [ ] Headers de segurança (Helmet)
- [ ] HTTPS em produção
- [ ] Logs não expõem dados sensíveis

### Auditoria de Dependências
```bash
# Verificar vulnerabilidades
npm audit
npm audit fix

# Backend
cd apps/backend
npm audit

# Frontend
cd apps/web
npm audit
```

## 📚 Documentação

### API Documentation
- Swagger: http://localhost:3001/api/docs
- OpenAPI 3.0 spec
- Exemplos de requests/responses

### Código Documentation
```typescript
/**
 * Serviço para autenticação OAuth2 Google
 * @description Gerencia login, tokens e sessões
 * @example
 * ```typescript
 * const authService = new AuthService();
 * const user = await authService.validateGoogleUser(userData);
 * ```
 */
@Injectable()
export class AuthService {
  // ...
}
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS
```typescript
// apps/backend/src/main.ts
app.enableCors({
  origin: [process.env.FRONTEND_URL],
  credentials: true,
});
```

#### 2. Erro de Prisma
```bash
# Regenerar cliente
npm run db:generate

# Reset database
npm run db:push --force-reset
```

#### 3. Erro de Build
```bash
# Limpar builds
npm run clean

# Reinstalar dependências
rm -rf node_modules
npm run install:all
```

#### 4. Erro de OAuth2
- Verificar redirect URIs no Google Console
- Confirmar credenciais corretas
- Verificar scopes necessários

## 📈 Performance

### Otimizações Backend
- Connection pooling (Prisma)
- Cache em memória (Sheets)
- Compressão gzip
- Rate limiting
- Query optimization

### Otimizações Frontend
- Server Components (Next.js)
- Code splitting automático
- Image optimization
- Bundle analysis
- Lazy loading

### Monitoring
```bash
# Bundle analyzer
npm run analyze

# Memory usage
npm run dev:backend -- --max-old-space-size=512
```

## 🔄 CI/CD

### GitHub Actions (Futuro)
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm run install:all
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

---

**Este guia deve ser atualizado conforme o projeto evolui.**
