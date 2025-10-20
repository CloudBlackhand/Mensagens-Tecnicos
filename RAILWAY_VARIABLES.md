# Variáveis de Ambiente Railway - msgSYSTEC

## 🔧 Configuração Completa

### Database (Railway PostgreSQL)
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Google OAuth2
```env
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_PROJECT_ID=msgsystecnicos
GOOGLE_CALLBACK_URL=https://seu-app.railway.app/auth/google/callback
```

### Google Sheets
```env
GOOGLE_SHEET_ID=1islC9-Wt4y15Sfxc_SMmxAxjaYn92p7qssDPJJnKhBc
```

### JWT e Segurança
```env
JWT_SECRET=sua-chave-jwt-super-secreta-minimo-32-caracteres-para-producao-segura
JWT_EXPIRES_IN=24h
```

### Aplicação
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-app.railway.app
NEXT_PUBLIC_API_URL=https://seu-app.railway.app
```

### Rate Limiting
```env
THROTTLE_TTL=60
THROTTLE_LIMIT=30
```

### Waha (Futuro)
```env
WAHA_API_KEY=
WAHA_BASE_URL=
```

## 🚀 Como Configurar

### 1. Railway Dashboard
1. Acesse seu projeto no Railway
2. Vá em "Variables" 
3. Adicione cada variável acima
4. Clique em "Add Variable"

### 2. Substituir Valores

#### IMPORTANTE: Substitua os seguintes valores:

1. **GOOGLE_CALLBACK_URL**:
   ```
   https://seu-app.railway.app/auth/google/callback
   ```
   Substitua `seu-app` pelo nome real do seu app Railway

2. **FRONTEND_URL** e **NEXT_PUBLIC_API_URL**:
   ```
   https://seu-app.railway.app
   ```

3. **JWT_SECRET**:
   Gere uma chave segura com:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 3. Verificação

Após configurar todas as variáveis:

1. **Redeploy** a aplicação
2. Verifique os logs: `railway logs`
3. Teste o health check: `https://seu-app.railway.app/health`
4. Teste o login Google OAuth2

## 🔒 Segurança

### Variáveis Sensíveis
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `JWT_SECRET` 
- ✅ `DATABASE_URL`
- ✅ `WAHA_API_KEY` (quando implementado)

### Variáveis Públicas
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_PROJECT_ID`
- ✅ `GOOGLE_SHEET_ID`
- ✅ `NEXT_PUBLIC_API_URL`

## 🧪 Teste Local

Para testar com as mesmas variáveis localmente:

```bash
# 1. Criar .env no backend
cp apps/backend/env.example apps/backend/.env

# 2. Editar com valores de produção
# 3. Executar
npm run dev:backend
```

## 📊 Monitoramento

### Variáveis de Monitoramento
```env
# Opcional - para debugging
LOG_LEVEL=info
DEBUG=false

# Opcional - para métricas
ENABLE_METRICS=true
```

### Health Check
A aplicação expõe um endpoint de health:
```
GET https://seu-app.railway.app/health
```

Retorna:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "memory": {
    "rss": 123456789,
    "heapTotal": 98765432,
    "heapUsed": 87654321
  }
}
```

## 🔄 Atualizações

### Para Atualizar Variáveis:
1. Railway Dashboard → Variables
2. Editar variável existente
3. Salvar alterações
4. Redeploy automático

### Para Adicionar Novas Variáveis:
1. Railway Dashboard → Variables
2. Add Variable
3. Configurar nome e valor
4. Redeploy se necessário

## 🚨 Troubleshooting

### Variáveis Não Carregadas
```bash
# Verificar logs
railway logs --filter "config"

# Verificar se variáveis estão definidas
railway run env | grep GOOGLE_CLIENT_ID
```

### Erro de Conexão com Banco
```bash
# Verificar DATABASE_URL
railway run env | grep DATABASE_URL

# Testar conexão
railway run npm run db:generate
```

### Erro de OAuth2
- Verificar `GOOGLE_CALLBACK_URL` no Railway
- Verificar URIs autorizados no Google Console
- Confirmar credenciais corretas

## 📝 Checklist

- [ ] DATABASE_URL configurado (Railway PostgreSQL)
- [ ] GOOGLE_CLIENT_ID configurado
- [ ] GOOGLE_CLIENT_SECRET configurado
- [ ] GOOGLE_CALLBACK_URL com domínio correto
- [ ] GOOGLE_SHEET_ID configurado
- [ ] JWT_SECRET gerado e configurado
- [ ] NODE_ENV=production
- [ ] PORT=3001
- [ ] FRONTEND_URL com domínio correto
- [ ] NEXT_PUBLIC_API_URL com domínio correto
- [ ] THROTTLE_TTL e THROTTLE_LIMIT configurados
- [ ] Health check funcionando
- [ ] Login Google OAuth2 funcionando
- [ ] Planilha carregando corretamente

---

**Configuração completa! ✅**

Todas as variáveis estão configuradas e a aplicação está pronta para produção.
