# Dockerfile otimizado para Railway com compatibilidade Prisma
FROM node:18-slim

# Instalar dependências necessárias para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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

# Gerar Prisma Client (deve funcionar melhor com Debian slim)
RUN npx prisma generate
RUN npm run build

# Verificar se o engine foi gerado corretamente
RUN echo "=== Verificando engines gerados ===" && \
    ls -la node_modules/.prisma/client/ || true && \
    find node_modules/.prisma/client -name "*.node" -ls || true

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

# Configurar variáveis de ambiente para Prisma (Debian)
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/apps/backend/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
CMD ["node", "apps/backend/dist/main.js"]
