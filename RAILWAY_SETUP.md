# 🚀 Configuração do Railway - PostgreSQL

## ⚠️ **AÇÃO NECESSÁRIA: Configurar Banco de Dados**

O sistema está falhando porque não há banco PostgreSQL configurado no Railway.

### 📋 **Passos para Configurar:**

#### 1. **Adicionar Plugin PostgreSQL no Railway:**
1. Acesse seu projeto no Railway
2. Clique em **"New"** → **"Database"**
3. Selecione **"PostgreSQL"**
4. Clique em **"Deploy Database"**

#### 2. **Configurar Variáveis de Ambiente:**
O Railway criará automaticamente a variável `DATABASE_URL`, mas você precisa adicionar:

```env
DATABASE_URL=postgresql://postgres:senha@host:porta/banco
```

#### 3. **Variáveis Obrigatórias para o Sistema:**

```env
# Database (será criado automaticamente pelo Railway)
DATABASE_URL=postgresql://postgres:senha@host:porta/banco

# Google OAuth2
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_PROJECT_ID=msgsystecnicos
GOOGLE_CALLBACK_URL=https://seu-dominio-railway.app/auth/google/callback

# Google Sheets
GOOGLE_SHEET_ID=1islC9-Wt4y15Sfxc_SMmxAxjaYn92p7qssDPJJnKhBc

# JWT
JWT_SECRET=sua-chave-secreta-jwt-muito-segura

# App
NODE_ENV=production
PORT=3001
```

### 🔧 **O que o Sistema Faz Automaticamente:**

1. **Executa migrações** do Prisma no startup
2. **Cria tabelas** necessárias (users, sessions, sheet_data)
3. **Conecta ao banco** PostgreSQL
4. **Inicia aplicação** Nest.js

### 📊 **Estrutura do Banco Criada:**

- **users**: Dados dos usuários (Google OAuth2)
- **sessions**: Tokens JWT e sessões
- **sheet_data**: Cache dos dados da planilha

### 🚨 **Status Atual:**

- ✅ **Prisma Client**: Gerado corretamente
- ✅ **Migrações**: Criadas e prontas
- ✅ **Script de Inicialização**: Configurado
- ❌ **Banco PostgreSQL**: Precisa ser criado no Railway
- ❌ **DATABASE_URL**: Precisa ser configurada

### 🎯 **Após Configurar o Banco:**

1. Railway detectará automaticamente as mudanças
2. Container será reconstruído
3. Migrações serão executadas
4. Aplicação iniciará normalmente

---

**⚠️ IMPORTANTE: Sem o banco PostgreSQL configurado, a aplicação não conseguirá iniciar.**
