# Guia de Deploy - msgSYSTEC

## 🚀 Deploy no Railway

### 1. Preparação

#### Pré-requisitos
- Conta no [Railway](https://railway.app/)
- Repositório Git configurado
- Google Cloud Console configurado

#### Configuração Local
```bash
# 1. Build local para testar
npm run build

# 2. Testar Docker localmente (opcional)
docker build -t msgsystec .
docker run -p 3001:3001 msgsystec
```

### 2. Configuração Railway

#### 2.1 Criar Projeto
1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório `msgSYSTEC`

#### 2.2 Adicionar PostgreSQL
1. No projeto Railway, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde a criação do banco
4. Anote a `DATABASE_URL` gerada

#### 2.3 Configurar Variáveis de Ambiente

No Railway Dashboard, vá em "Variables" e configure:

```env
# Database (Railway gera automaticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Google OAuth2
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_PROJECT_ID=msgsystecnicos
GOOGLE_CALLBACK_URL=https://seu-app.railway.app/auth/google/callback

# Google Sheets
GOOGLE_SHEET_ID=1islC9-Wt4y15Sfxc_SMmxAxjaYn92p7qssDPJJnKhBc

# JWT (gerar uma chave segura)
JWT_SECRET=sua-chave-jwt-super-secreta-minimo-32-caracteres-para-producao
JWT_EXPIRES_IN=24h

# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-app.railway.app

# Frontend
NEXT_PUBLIC_API_URL=https://seu-app.railway.app

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=30

# Waha (futuro)
WAHA_API_KEY=
WAHA_BASE_URL=
```

#### 2.4 Configurar Google OAuth2

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em "APIs e Serviços" → "Credenciais"
3. Edite as credenciais OAuth2 existentes
4. Adicione URIs de redirecionamento autorizados:
   - `https://seu-app.railway.app/auth/google/callback`
5. Salve as alterações

### 3. Deploy

#### 3.1 Deploy Automático
1. Railway detecta automaticamente o `railway.json`
2. Deploy inicia quando você faz push para `main`
3. Monitore o build no dashboard Railway

#### 3.2 Deploy Manual
```bash
# 1. Fazer push das mudanças
git add .
git commit -m "feat: prepare for production deploy"
git push origin main

# 2. Monitorar deploy no Railway Dashboard
```

### 4. Pós-Deploy

#### 4.1 Configurar Banco de Dados
```bash
# 1. Acessar logs do Railway para ver se o banco está conectado
# 2. Executar migrações (se necessário)
# Railway CLI (opcional):
railway run npm run db:push
```

#### 4.2 Verificar Saúde
1. Acesse: `https://seu-app.railway.app/health`
2. Deve retornar status 200 com informações do sistema
3. Teste login Google OAuth2
4. Verifique se planilha carrega corretamente

#### 4.3 Monitoramento
- **Logs**: Railway Dashboard → Logs
- **Métricas**: CPU, RAM, Network
- **Uptime**: Status page automático

## 🔧 Configurações de Produção

### 1. Otimizações Railway

#### Recursos
- **RAM**: 1GB (padrão) - suficiente para < 2GB total
- **CPU**: 0.5 vCPU (padrão) - suficiente para carga normal
- **Storage**: 1GB (padrão) - suficiente para aplicação

#### Configurações Avançadas
```json
// railway.json
{
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "sleepApplication": false,
    "cronSchedule": null
  }
}
```

### 2. Domínio Customizado

#### 2.1 Configurar Domínio
1. Railway Dashboard → Settings → Domains
2. Adicionar domínio customizado
3. Configurar DNS conforme instruções
4. Atualizar variáveis de ambiente com novo domínio

#### 2.2 SSL/HTTPS
- Railway fornece HTTPS automaticamente
- Certificado Let's Encrypt gratuito
- Redirecionamento HTTP → HTTPS automático

### 3. Backup e Recovery

#### 3.1 Backup do Banco
```bash
# Railway CLI
railway run pg_dump $DATABASE_URL > backup.sql

# Restaurar
railway run psql $DATABASE_URL < backup.sql
```

#### 3.2 Backup de Código
- Git é o backup principal
- Tags para releases importantes
- Branches para versões estáveis

## 📊 Monitoramento

### 1. Métricas Importantes

#### Performance
- **Response Time**: < 500ms para APIs
- **Memory Usage**: < 1.5GB total
- **CPU Usage**: < 50% em carga normal
- **Uptime**: > 99.9%

#### Negócio
- **Login Success Rate**: > 95%
- **Sheet Load Time**: < 2s
- **Error Rate**: < 1%

### 2. Alertas

#### Configurar Alertas Railway
1. Dashboard → Settings → Alerts
2. Configurar alertas para:
   - High CPU usage (> 80%)
   - High memory usage (> 90%)
   - Deployment failures
   - Service downtime

### 3. Logs

#### Logs Importantes
```bash
# Acessar logs via Railway CLI
railway logs

# Filtrar logs específicos
railway logs --filter "error"
railway logs --filter "auth"
```

#### Logs de Aplicação
```typescript
// Backend - Logs estruturados
logger.log(`User ${user.email} logged in`);
logger.warn(`Rate limit exceeded for IP ${req.ip}`);
logger.error(`Database connection failed: ${error.message}`);
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Verificar logs de build
railway logs --filter "build"

# Possíveis causas:
# - Dependências não instaladas
# - Erro de TypeScript
# - Memória insuficiente
```

#### 2. Banco de Dados
```bash
# Verificar conexão
railway run npm run db:generate

# Reset banco (cuidado!)
railway run npm run db:push --force-reset
```

#### 3. OAuth2 Google
- Verificar redirect URIs no Google Console
- Confirmar credenciais corretas
- Verificar domínio autorizado

#### 4. Performance
```bash
# Verificar métricas
railway metrics

# Otimizar se necessário:
# - Aumentar recursos
# - Otimizar queries
# - Implementar cache
```

### Rollback

#### Rollback Rápido
```bash
# 1. Railway Dashboard → Deployments
# 2. Selecionar deployment anterior
# 3. Clicar em "Redeploy"

# Ou via CLI:
railway redeploy --deployment-id <id>
```

#### Rollback de Código
```bash
# 1. Reverter commit
git revert HEAD

# 2. Push para trigger novo deploy
git push origin main
```

## 🔒 Segurança

### Checklist de Segurança

#### Produção
- [ ] HTTPS habilitado
- [ ] Variáveis de ambiente protegidas
- [ ] JWT secret seguro (32+ caracteres)
- [ ] Rate limiting ativo
- [ ] CORS configurado corretamente
- [ ] Headers de segurança (Helmet)
- [ ] Logs não expõem dados sensíveis

#### Monitoramento
- [ ] Alertas configurados
- [ ] Logs monitorados
- [ ] Backup automático
- [ ] Plano de disaster recovery

## 📈 Escalabilidade

### Horizontal Scaling
```json
// railway.json - Múltiplas réplicas
{
  "deploy": {
    "numReplicas": 3,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Vertical Scaling
- Railway Dashboard → Settings → Resources
- Aumentar RAM/CPU conforme necessário
- Monitorar métricas antes de escalar

### Cache Strategy
- Redis para cache distribuído (futuro)
- CDN para assets estáticos
- Database connection pooling

## 🎯 Próximos Passos

### Melhorias Futuras
1. **CI/CD Pipeline** com GitHub Actions
2. **Staging Environment** para testes
3. **Monitoring** com Sentry/DataDog
4. **Backup Automático** do banco
5. **Load Balancer** para alta disponibilidade

### Otimizações
1. **Database Indexing** para queries frequentes
2. **Redis Cache** para dados de planilhas
3. **CDN** para assets estáticos
4. **Image Optimization** para avatars
5. **Bundle Splitting** mais agressivo

---

**Deploy bem-sucedido! 🎉**

Para suporte, consulte a documentação do Railway ou entre em contato com a equipe.
