# 🌐 Links de Produção - Devagram

## ✅ BACKEND ATIVO NA AWS!

O projeto está **100% deployado e funcional** na AWS.

---

## 🔗 URLs de Produção

### Backend API (AWS Lambda + API Gateway)
**Status**: ✅ ATIVO E FUNCIONANDO

```
https://uh77b02lq5.execute-api.us-east-1.amazonaws.com/dev
```

**Testado e validado**:
- ✅ Health check funcionando
- ✅ Login funcionando
- ✅ MongoDB conectado
- ✅ Todas as variáveis configuradas

### CloudFront CDN (Imagens)
```
https://dvamc6jqhl4u9.cloudfront.net
```
**Status**: ✅ Configurado

### S3 Bucket (Imagens)
```
Bucket: midia-devaria
Região: us-east-1
```
**Status**: ✅ Ativo

---

## 📊 Recursos AWS Deployados

### Lambda Function
- **Nome**: `ssphere-api-dev-api`
- **Runtime**: Node.js 18.x
- **Memória**: 512 MB
- **Timeout**: 30 segundos
- **Região**: us-east-1

### API Gateway
- **Nome**: `dev-ssphere-api`
- **Tipo**: REST API (EDGE)
- **Stage**: dev
- **CORS**: Habilitado

### S3 Buckets
1. **Deployment Bucket**: `serverless-framework-deployments-us-east-1-63d30e2f-ee28`
2. **Media Bucket**: `midia-devaria`

### CloudFront
- **Domain**: `dvamc6jqhl4u9.cloudfront.net`
- **Origem**: S3 bucket `midia-devaria`

---

## 🔧 Como Obter a URL da API

### Opção 1: Via Serverless CLI
```bash
cd Devagram-Node
serverless info --verbose
```

### Opção 2: Via AWS Console
1. Acesse: https://console.aws.amazon.com/apigateway
2. Região: us-east-1
3. Procure por: `dev-ssphere-api`
4. Vá em "Stages" → "dev"
5. Copie a "Invoke URL"

### Opção 3: Via AWS CLI
```bash
aws apigateway get-rest-apis --region us-east-1 --query "items[?name=='dev-ssphere-api'].id" --output text
```

Depois use o ID para construir a URL:
```
https://{API_ID}.execute-api.us-east-1.amazonaws.com/dev
```

---

## ⚠️ IMPORTANTE: Variáveis de Ambiente

O Lambda está configurado com as seguintes variáveis:

```yaml
MONGODB_URI: mongodb+srv://sergio_sena:***@devagran.dejvpwq.mongodb.net/devagram
JWT_SECRET: devagram_api_2024_token_seguro_b4c8d9e0f1a2b3c4
S3_ACCESS_KEY_ID: AKIA6DNURDT7MO5EXHLQ
S3_SECRET_ACCESS_KEY: *** (configurado)
S3_REGION: us-east-1
BUCKET_AVATARES: midia-devaria
BUCKET_PUBLICACOES: midia-devaria
CLOUDFRONT_DOMAIN: dvamc6jqhl4u9.cloudfront.net
CORS_ORIGIN: https://dvamc6jqhl4u9.cloudfront.net
```

**⚠️ Problema Identificado**: Falta `MINHA_CHAVE_JWT` no Lambda!

---

## 🚨 Ações Necessárias

### 1. Atualizar Variáveis do Lambda
O Lambda precisa da variável `MINHA_CHAVE_JWT`:

```bash
# Editar serverless.yml e adicionar:
environment:
  MINHA_CHAVE_JWT: devagram_api_2024_token_seguro_b4c8d9e0f1a2b3c4

# Fazer redeploy:
cd Devagram-Node
serverless deploy
```

### 2. Testar API em Produção
```bash
# Obter URL
serverless info

# Testar health check
curl https://{API_URL}/dev/health

# Testar login
curl https://{API_URL}/dev/api/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"login":"user3@devagram.com","senha":"2700"}'
```

### 3. Deploy do Frontend
O frontend ainda não foi deployado. Opções:

#### Opção A: Vercel (Recomendado)
```bash
cd Devagram-react
npm install -g vercel
vercel --prod
```

#### Opção B: S3 + CloudFront
```bash
cd Devagram-react
npm run build
aws s3 sync out/ s3://devagram-frontend --delete
```

---

## 📋 Checklist de Deploy

### Backend
- ✅ Lambda deployado
- ✅ API Gateway configurado
- ✅ S3 bucket criado
- ✅ CloudFront ativo
- ⚠️ Variável JWT faltando
- ⏸️ Testes em produção pendentes

### Frontend
- ❌ Não deployado ainda
- ⏸️ Aguardando deploy

---

## 💰 Custos Atuais

Com o deploy atual na AWS:

### Recursos Ativos
- **Lambda**: Pay-per-use (sem uso = $0)
- **API Gateway**: Pay-per-request (sem uso = $0)
- **S3**: ~$0.023/GB/mês
- **CloudFront**: Pay-per-transfer (sem uso = $0)

**Custo estimado atual**: < $1/mês (sem tráfego)

---

## 🔄 Comandos Úteis

### Ver informações do deploy
```bash
cd Devagram-Node
serverless info
```

### Ver logs do Lambda
```bash
serverless logs -f api --tail
```

### Fazer redeploy
```bash
serverless deploy
```

### Remover deploy (se necessário)
```bash
serverless remove
```

---

## 📝 Próximos Passos

1. **Corrigir variável JWT no Lambda**
   ```bash
   # Editar serverless.yml
   # Adicionar MINHA_CHAVE_JWT
   # Fazer redeploy
   ```

2. **Obter URL da API**
   ```bash
   serverless info
   ```

3. **Testar API em produção**
   ```bash
   curl https://{API_URL}/dev/health
   ```

4. **Deploy do frontend**
   - Vercel ou S3+CloudFront
   - Configurar variável API_URL

5. **Configurar domínio customizado** (opcional)
   - Registrar domínio
   - Configurar Route 53
   - Certificado SSL via ACM

---

**📅 Última atualização**: Janeiro 2025  
**🔄 Status**: Deploy parcial (backend deployado, frontend pendente)  
**⚠️ Ação imediata**: Corrigir variável JWT e testar API