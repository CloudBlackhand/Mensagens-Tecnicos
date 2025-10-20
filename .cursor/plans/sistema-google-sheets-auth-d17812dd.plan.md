<!-- d17812dd-6b34-4a73-886d-10fa1818460d 195e2b24-58a6-4e64-b885-02e04ca355c9 -->
# Sistema de Autenticação Google e Leitura de Planilhas

## Arquitetura Modular

### Estrutura de Pastas

```
/frontend          # React + Vite + Shadcn/ui + Tailwind
/backend           # Fastify + Google APIs + Prisma
/shared            # Tipos TypeScript compartilhados
```

## Stack Tecnológica

### Backend (`/backend`)

- **Fastify** - Framework performático
- **Prisma** - ORM para PostgreSQL
- **Passport.js** - OAuth2 Google
- **Google APIs** - Leitura de Sheets
- **TypeScript** - Tipagem forte

### Frontend (`/frontend`)

- **React** + **Vite** - Build rápido e moderno
- **Shadcn/ui** - Componentes elegantes e customizáveis
- **Tailwind CSS** - Design inovador
- **TanStack Query** - Gerenciamento de estado/cache
- **React Router** - Navegação
- **TypeScript** - Tipagem forte

### Database

- **PostgreSQL** - Apenas para usuários e autenticação
- Railway Postgres plugin

## Módulos Principais

### 1. Autenticação (`/backend/src/modules/auth`)

- OAuth2 Google (login social)
- Gestão de sessões JWT
- Middleware de autenticação
- Rotas: `/auth/google`, `/auth/callback`, `/auth/logout`

### 2. Usuários (`/backend/src/modules/users`)

- CRUD de usuários (Prisma + PostgreSQL)
- Perfil do usuário
- Rotas: `/api/users/me`, `/api/users/:id`

### 3. Google Sheets (`/backend/src/modules/sheets`)

- Leitura sob demanda (botão "atualizar")
- Service account ou user token
- Cache em memória (opcional, configurável)
- Rotas: `/api/sheets/read`, `/api/sheets/refresh`

### 4. Waha Integration (`/backend/src/modules/waha`) 

- **Para implementação futura**
- Estrutura preparada para sessões por usuário
- Placeholder para gerenciamento de sessões

## Features Principais

### Frontend

1. **Página de Login** - Design moderno com Google OAuth
2. **Dashboard** - Visualização da planilha com tabela elegante
3. **Botão Atualizar** - Recarrega dados da planilha sob demanda
4. **Perfil** - Informações do usuário logado
5. **Design Responsivo** - Mobile-first

### Backend

1. **OAuth2 Flow** completo com Google
2. **API RESTful** documentada
3. **Middleware de autenticação** em todas rotas protegidas
4. **Leitura otimizada** de Google Sheets
5. **Configuração via variáveis de ambiente**

## Configuração Railway

### Variáveis de Ambiente

```
# Backend
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
GOOGLE_SHEET_ID=...
JWT_SECRET=...
WAHA_API_KEY=...
FRONTEND_URL=...

# Frontend
VITE_API_URL=...
```

### Deploy

- Backend e Frontend como serviços separados no Railway
- PostgreSQL via Railway plugin
- Build commands configurados
- Health checks implementados

## Segurança

- JWT para sessões
- CORS configurado
- Variáveis sensíveis em .env
- Validação de dados com Zod
- Rate limiting (opcional)

## Próximos Passos (Futuro)

- Integração Waha com sessões por usuário
- Sistema de permissões avançado
- Logs e auditoria

### To-dos

- [ ] Configurar estrutura de pastas e dependências iniciais (frontend, backend, shared)
- [ ] Configurar Fastify, Prisma, PostgreSQL e estrutura modular do backend
- [ ] Implementar módulo de autenticação OAuth2 Google com JWT
- [ ] Criar módulo de usuários com Prisma e rotas de API
- [ ] Implementar módulo de leitura Google Sheets sob demanda
- [ ] Criar estrutura placeholder para integração Waha futura
- [ ] Configurar React, Vite, Tailwind, Shadcn/ui e estrutura modular
- [ ] Implementar páginas de login e callback OAuth2
- [ ] Criar dashboard com visualização da planilha e botão atualizar
- [ ] Configurar arquivos para deploy no Railway (railway.json, Dockerfiles, etc)