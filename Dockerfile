# Dockerfile simplificado para Railway
FROM node:18-alpine

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

# Instalar dependências
RUN npm install --workspace=apps/backend --workspace=packages/shared

# Copiar código fonte
COPY apps/backend/ ./apps/backend/
COPY packages/shared/ ./packages/shared/

# Build shared package
WORKDIR /app/packages/shared
RUN npm run build

# Build backend
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN npm run build

# Instalar OpenSSL para resolver warning do Prisma
RUN apk add --no-cache openssl

# Regenerar Prisma Client com OpenSSL disponível
RUN npx prisma generate

# Copiar engines do Prisma para múltiplos locais
RUN mkdir -p /app/apps/backend/dist/node_modules/.prisma/client
RUN mkdir -p /app/.prisma/client
RUN mkdir -p /tmp/prisma-engines

# Copiar engines para todos os locais possíveis
RUN if [ -d "/app/apps/backend/node_modules/.prisma/client" ]; then \
      cp -r /app/apps/backend/node_modules/.prisma/client/* /app/apps/backend/dist/node_modules/.prisma/client/ 2>/dev/null || true; \
      cp -r /app/apps/backend/node_modules/.prisma/client/* /app/.prisma/client/ 2>/dev/null || true; \
      cp -r /app/apps/backend/node_modules/.prisma/client/* /tmp/prisma-engines/ 2>/dev/null || true; \
    fi

# Verificar se o engine foi copiado corretamente
RUN ls -la /app/apps/backend/dist/node_modules/.prisma/client/ || true
RUN ls -la /app/.prisma/client/ || true
RUN ls -la /tmp/prisma-engines/ || true

# Voltar para diretório raiz e configurar usuário não-root
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expor porta
EXPOSE 3001

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
CMD ["node", "apps/backend/dist/main.js"]
