# msgSYSTEC - Sistema de Planilhas

Sistema moderno de autenticação Google OAuth2 com leitura de Google Sheets, construído com **Nest.js** e **Next.js 14**.

## 🚀 Stack Tecnológica

### Backend
- **Nest.js 10** - Framework empresarial para Node.js
- **Prisma 5** - ORM moderno para PostgreSQL
- **Passport.js** - Autenticação OAuth2 Google
- **JWT** - Tokens de autenticação
- **Google APIs** - Integração com Google Sheets

### Frontend
- **Next.js 14** - React framework com App Router
- **Shadcn/ui** - Componentes UI elegantes
- **Tailwind CSS** - Styling utility-first
- **TanStack Query** - Gerenciamento de estado/cache

### Database
- **PostgreSQL** - Banco de dados relacional (Railway)

## 📁 Estrutura do Projeto

```
msgSYSTEC/
├── apps/
│   ├── backend/              # Nest.js API
│   │   ├── src/
│   │   │   ├── modules/      # Módulos (auth, users, sheets, waha)
│   │   │   ├── common/       # Guards, decorators, filters
│   │   │   └── prisma/       # Serviço Prisma
│   │   ├── prisma/
│   │   │   └── schema.prisma # Schema do banco
│   │   └── package.json
│   │
│   └── web/                  # Next.js 14
│       ├── src/
│       │   ├── app/          # App Router
│       │   │   ├── (auth)/   # Páginas de autenticação
│       │   │   └── (dashboard)/ # Páginas protegidas
│       │   ├── components/   # Componentes React
│       │   └── lib/          # Utils e hooks
│       └── package.json
│
└── packages/
    └── shared/               # Tipos TypeScript compartilhados
        ├── src/
        │   ├── types.ts      # Schemas Zod
        │   └── index.ts
        └── package.json
```

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- PostgreSQL (ou usar Railway)
- Conta Google Cloud Console

### 1. Clone e instale dependências

```bash
git clone <repository-url>
cd msgSYSTEC
npm run install:all
```

### 2. Configurar banco de dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema (desenvolvimento)
npm run db:push

# Ou criar migração (produção)
npm run db:migrate
```

### 3. Configurar variáveis de ambiente

**Backend** (`apps/backend/config.env`):
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/msgsystec?schema=public"

# Google OAuth2
GOOGLE_CLIENT_ID="seu-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"
GOOGLE_PROJECT_ID="msgsystecnicos"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Google Sheets
GOOGLE_SHEET_ID="1islC9-Wt4y15Sfxc_SMmxAxjaYn92p7qssDPJJnKhBc"

# JWT
JWT_SECRET="super-secret-jwt-key-for-development-min-32-characters"
JWT_EXPIRES_IN="24h"

# App
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=30
```

**Frontend** (`apps/web/env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### 4. Executar em desenvolvimento

```bash
# Executar backend e frontend simultaneamente
npm run dev

# Ou executar separadamente:
npm run dev:backend  # Backend na porta 3001
npm run dev:frontend # Frontend na porta 3000
```

## 🌐 URLs de Desenvolvimento

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health

## 🔑 Configuração Google OAuth2

### 1. Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto `msgsystecnicos`
3. Vá em "APIs e Serviços" → "Credenciais"
4. Use as credenciais existentes ou crie novas para aplicação web

### 2. URIs de Redirecionamento
- **Desenvolvimento**: `http://localhost:3001/auth/google/callback`
- **Produção**: `https://seu-dominio.railway.app/auth/google/callback`

### 3. APIs Necessárias
- Google+ API
- Google Sheets API

## 📊 Funcionalidades

### ✅ Implementado
- ✅ Autenticação OAuth2 Google
- ✅ JWT tokens com sessões
- ✅ Leitura de Google Sheets
- ✅ Cache em memória (TTL 5min)
- ✅ Interface moderna com Shadcn/ui
- ✅ Dashboard responsivo
- ✅ Rate limiting
- ✅ Validação de dados com Zod
- ✅ TypeScript em todo projeto

### 🚧 Futuro (Waha Integration)
- 🔄 Integração com Waha API
- 📱 Envio de mensagens WhatsApp
- 👥 Gestão de sessões por usuário
- 📊 Analytics avançados

## 🚀 Deploy Railway

### 1. Configurar Railway
1. Conectar repositório ao Railway
2. Adicionar PostgreSQL plugin
3. Configurar variáveis de ambiente

### 2. Variáveis de Ambiente (Produção)
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_PROJECT_ID=msgsystecnicos
GOOGLE_CALLBACK_URL=https://seu-app.railway.app/auth/google/callback
GOOGLE_SHEET_ID=1islC9-Wt4y15Sfxc_SMmxAxjaYn92p7qssDPJJnKhBc
JWT_SECRET=sua-chave-jwt-segura-minimo-32-caracteres
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-app.railway.app
NEXT_PUBLIC_API_URL=https://seu-app.railway.app
```

### 3. Build e Deploy
```bash
npm run build
```

## 📈 Performance

### Recursos Otimizados
- **RAM**: ~1.5GB total (backend + frontend)
- **CPU**: 10-20% idle, 40-60% carga
- **Bundle**: ~200KB JS inicial (Next.js RSC)
- **Cache**: 5 minutos TTL para planilhas

### Otimizações
- Server Components (Next.js)
- Compressão gzip
- Connection pooling (máx 5 conexões)
- Rate limiting (30 req/60s)
- Bundle splitting automático

## 🔒 Segurança

- Helmet para headers HTTP
- CORS configurado
- Rate limiting
- Validação de dados (Zod)
- JWT com expiração
- HTTPS obrigatório (produção)
- Variáveis de ambiente protegidas

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Lint
npm run lint
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Backend + Frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend

# Build
npm run build            # Build completo
npm run build:shared     # Build shared types
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Database
npm run db:generate      # Gerar cliente Prisma
npm run db:push          # Aplicar schema (dev)
npm run db:migrate       # Criar migração (prod)
npm run db:studio        # Abrir Prisma Studio

# Limpeza
npm run clean            # Limpar todos os builds
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 🆘 Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ pela equipe msgSYSTEC**
