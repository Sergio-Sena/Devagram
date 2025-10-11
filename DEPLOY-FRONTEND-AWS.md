# 🚀 Deploy Frontend na AWS

## 📋 Situação Atual

### Backend AWS ✅
```
URL: https://uh77b02lq5.execute-api.us-east-1.amazonaws.com/dev
Status: 3/10 APIs funcionando (login, feed, health)
```

### Frontend AWS ❌
```
Status: Não deployado
Necessário: Deploy em S3 + CloudFront
```

---

## 🎯 Plano de Deploy Frontend

### Opção 1: S3 + CloudFront (Recomendado)

#### Passo 1: Build do Frontend
```bash
cd Devagram-react

# Configurar variável de produção
echo NEXT_PUBLIC_API_URL=https://uh77b02lq5.execute-api.us-east-1.amazonaws.com/dev > .env.production

# Build
npm run build
```

#### Passo 2: Criar Bucket S3
```bash
aws s3 mb s3://devagram-frontend-prod --region us-east-1

# Configurar como site estático
aws s3 website s3://devagram-frontend-prod \
  --index-document index.html \
  --error-document 404.html
```

#### Passo 3: Política Pública do Bucket
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::devagram-frontend-prod/*"
  }]
}
```

Aplicar:
```bash
aws s3api put-bucket-policy \
  --bucket devagram-frontend-prod \
  --policy file://bucket-policy.json
```

#### Passo 4: Upload do Build
```bash
cd Devagram-react
aws s3 sync out/ s3://devagram-frontend-prod --delete
```

#### Passo 5: Criar CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --origin-domain-name devagram-frontend-prod.s3.amazonaws.com \
  --default-root-object index.html
```

---

## ⚠️ PROBLEMA: Backend Incompleto

O backend AWS atual só tem 3 APIs:
- ✅ Login
- ✅ Feed  
- ❌ Usuário, Pesquisa, Publicação, Like, Comentário, Seguir, Excluir

### Solução: Deploy Backend Completo

Precisamos fazer deploy do Next.js completo no Lambda.

---

## 🎯 Recomendação

### Opção A: Deploy Completo AWS (Complexo)
1. Implementar todas as APIs no Lambda
2. Deploy frontend em S3+CloudFront
3. Configurar domínio customizado

**Tempo estimado:** 4-6 horas
**Complexidade:** Alta

### Opção B: Backend em EC2/ECS (Mais Simples)
1. Deploy Next.js completo em EC2
2. Frontend em S3+CloudFront
3. Mais fácil de manter

**Tempo estimado:** 2-3 horas
**Complexidade:** Média

### Opção C: Manter Local (Atual)
1. Backend: localhost:3000 (10/10 APIs)
2. Frontend: localhost:3001
3. Totalmente funcional

**Tempo estimado:** 0 (já funciona)
**Complexidade:** Zero

---

## 💡 Minha Recomendação

**Para agora:** Continue usando local (tudo funciona)

**Para produção futura:**
1. Use **Vercel** para frontend (grátis, simples)
2. Use **Railway/Render** para backend (grátis, Next.js completo)
3. Ou migre backend para **EC2** na AWS

---

## 🚀 Deploy Rápido (Se quiser testar)

### Frontend Estático Simples
```bash
cd Devagram-react
npm run build

# Upload para S3
aws s3 sync out/ s3://devagram-frontend-prod

# URL temporária
http://devagram-frontend-prod.s3-website-us-east-1.amazonaws.com
```

**Limitação:** Só funcionará login e feed (backend incompleto)

---

## 📊 Custos AWS

### S3 + CloudFront (Frontend)
- S3: ~$0.023/GB/mês
- CloudFront: ~$0.085/GB transferido
- **Total estimado:** $1-5/mês

### Lambda (Backend atual)
- Invocações: Primeiras 1M grátis
- **Total estimado:** $0-2/mês

### EC2 (Backend completo)
- t2.micro: $8.50/mês
- t3.micro: $7.50/mês
- **Total estimado:** $7-10/mês

---

## ❓ O que você prefere?

1. **Manter local** (tudo funciona, zero custo)
2. **Deploy AWS completo** (4-6h trabalho, $10-15/mês)
3. **Deploy híbrido** (Vercel + Railway, grátis, 1h trabalho)

Qual opção você quer seguir?
