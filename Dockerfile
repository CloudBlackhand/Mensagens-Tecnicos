# Dockerfile simplificado para Railway
FROM node:18-alpine

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat wget

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

# Forçar geração do Prisma Client com engine correto
RUN npx prisma generate --force
RUN npm run build

# Verificar se o engine foi gerado corretamente
RUN ls -la node_modules/.prisma/client/ || true
RUN find node_modules/.prisma/client -name "*linux-musl*" -ls || true

# Instalar OpenSSL para resolver warning do Prisma
RUN apk add --no-cache openssl

# Regenerar Prisma Client com OpenSSL disponível
RUN npx prisma generate

# Baixar e instalar o engine correto manualmente
RUN wget -O /tmp/prisma-engine.gz "https://binaries.prisma.sh/all_commits/5.22.0/linux-musl-openssl-3.0.x/libquery_engine-linux-musl-openssl-3.0.x.so.node.gz" || true
RUN if [ -f "/tmp/prisma-engine.gz" ]; then \
      gunzip /tmp/prisma-engine.gz || true; \
      mv /tmp/prisma-engine /app/apps/backend/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node || true; \
    fi

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

# Copiar engines específicos para o diretório dist
RUN find /app/apps/backend/node_modules/.prisma/client -name "*.node" -exec cp {} /app/apps/backend/dist/ \; 2>/dev/null || true
RUN find /app/apps/backend/node_modules/.prisma/client -name "*.node" -exec cp {} /app/apps/backend/dist/node_modules/.prisma/client/ \; 2>/dev/null || true

# Encontrar e definir o caminho correto do engine
RUN ENGINE_PATH=$(find /app/apps/backend/node_modules/.prisma/client -name "libquery_engine-linux-musl-openssl-3.0.x.so.node" 2>/dev/null | head -1) && \
    if [ -n "$ENGINE_PATH" ]; then \
      echo "PRISMA_QUERY_ENGINE_LIBRARY=$ENGINE_PATH" >> /etc/environment; \
      echo "export PRISMA_QUERY_ENGINE_LIBRARY=$ENGINE_PATH" >> /etc/profile; \
    fi

# Verificar se o engine foi baixado e copiado corretamente
RUN echo "=== Verificando engine baixado ===" && \
    ls -la /app/apps/backend/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node || true
RUN echo "=== Verificando engines copiados ===" && \
    ls -la /app/apps/backend/dist/node_modules/.prisma/client/ || true && \
    ls -la /app/.prisma/client/ || true && \
    ls -la /tmp/prisma-engines/ || true
RUN echo "=== Buscando arquivos .node ===" && \
    find /app/apps/backend/dist -name "*.node" -ls || true && \
    find /app/apps/backend/node_modules/.prisma/client -name "*linux-musl-openssl-3.0.x*" -ls || true

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

# Configurar variáveis de ambiente para Prisma
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/apps/backend/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
CMD ["node", "apps/backend/dist/main.js"]
