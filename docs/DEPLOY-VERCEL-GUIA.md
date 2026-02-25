# 🚀 Guia de Deploy SSphere no Vercel

## 📋 Pré-requisitos
- ✅ Conta Vercel (https://vercel.com)
- ✅ GitHub com repositório atualizado (branch develop)
- ✅ Domínio sstechnologies-cloud.com configurado

---

## 🎯 PARTE 1: Deploy do Backend (API)

### 1️⃣ Importar Projeto no Vercel

```bash
# Acesse: https://vercel.com/new
# Clique em "Import Git Repository"
# Selecione: Sergio-Sena/Devagram
# Branch: develop
```

### 2️⃣ Configurar Projeto Backend

**Framework Preset:** Next.js
**Root Directory:** `Devagram-Node`
**Build Command:** `npm run build`
**Output Directory:** `.next`

### 3️⃣ Adicionar Variáveis de Ambiente

No painel do Vercel, vá em **Settings → Environment Variables** e adicione:

```env
MONGODB_URI=mongodb+srv://seu_usuario:senha@cluster.mongodb.net/devagram
JWT_SECRET=sua_chave_secreta_jwt
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_BUCKET_NAME=ssphere-uploads
AWS_REGION=us-east-1
CORS_ORIGIN=https://ssphere.sstechnologies-cloud.com
```

**⚠️ IMPORTANTE:** Marque todas como **Production**, **Preview** e **Development**

### 4️⃣ Deploy Inicial

Clique em **Deploy** e aguarde o build completar.

### 5️⃣ Configurar Domínio Personalizado

1. Vá em **Settings → Domains**
2. Adicione: `api.ssphere.sstechnologies-cloud.com`
3. Configure DNS (veja seção DNS abaixo)

---

## 🎨 PARTE 2: Deploy do Frontend

### 1️⃣ Criar Novo Projeto no Vercel

```bash
# Acesse: https://vercel.com/new
# Clique em "Import Git Repository"
# Selecione: Sergio-Sena/Devagram (novamente)
# Branch: develop
```

### 2️⃣ Configurar Projeto Frontend

**Framework Preset:** Next.js
**Root Directory:** `Devagram-react`
**Build Command:** `npm run build`
**Output Directory:** `.next`

### 3️⃣ Adicionar Variável de Ambiente

```env
NEXT_PUBLIC_API_URL=https://api.ssphere.sstechnologies-cloud.com
```

### 4️⃣ Deploy Inicial

Clique em **Deploy** e aguarde o build completar.

### 5️⃣ Configurar Domínio Personalizado

1. Vá em **Settings → Domains**
2. Adicione: `ssphere.sstechnologies-cloud.com`
3. Configure DNS (veja seção DNS abaixo)

---

## 🌐 PARTE 3: Configuração DNS

### No seu provedor de DNS (ex: Cloudflare, Route53, etc):

**Para o Backend (API):**
```
Tipo: CNAME
Nome: api.ssphere
Valor: cname.vercel-dns.com
TTL: Auto
```

**Para o Frontend:**
```
Tipo: CNAME
Nome: ssphere
Valor: cname.vercel-dns.com
TTL: Auto
```

**OU se usar A Record:**
```
Tipo: A
Nome: ssphere
Valor: 76.76.21.21
TTL: Auto
```

---

## ✅ PARTE 4: Verificação

### 1️⃣ Testar Backend
```bash
curl https://api.ssphere.sstechnologies-cloud.com/api/usuario
```

### 2️⃣ Testar Frontend
Acesse: https://ssphere.sstechnologies-cloud.com

### 3️⃣ Testar Login
1. Acesse o frontend
2. Faça login com credenciais de teste
3. Verifique se o feed carrega

---

## 🔧 Troubleshooting

### ❌ Erro: "Module not found"
**Solução:** Verifique se o `Root Directory` está correto

### ❌ Erro: CORS
**Solução:** Verifique se `CORS_ORIGIN` no backend aponta para o domínio do frontend

### ❌ Erro: 500 Internal Server Error
**Solução:** Verifique as variáveis de ambiente no Vercel

### ❌ Domínio não resolve
**Solução:** Aguarde propagação DNS (até 48h, geralmente 5-10min)

---

## 📊 Monitoramento

### Logs em Tempo Real
```bash
# Acesse no Vercel:
# Projeto → Deployments → [último deploy] → View Function Logs
```

### Verificar Status
- Backend: https://api.ssphere.sstechnologies-cloud.com/api/usuario
- Frontend: https://ssphere.sstechnologies-cloud.com

---

## 🔄 Atualizações Futuras

Após o deploy inicial, qualquer push para a branch `develop` no GitHub irá:
1. ✅ Trigger automático de build
2. ✅ Deploy automático
3. ✅ Atualização em produção

---

## 📝 Checklist Final

- [ ] Backend deployado no Vercel
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Domínios personalizados adicionados
- [ ] DNS configurado
- [ ] Teste de login funcionando
- [ ] Feed carregando publicações
- [ ] Upload de imagens funcionando
- [ ] Sistema de likes/comentários operacional

---

## 🎉 Pronto!

Seu SSphere está no ar em:
- 🌐 **Frontend:** https://ssphere.sstechnologies-cloud.com
- 🔌 **API:** https://api.ssphere.sstechnologies-cloud.com

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel
2. Teste as APIs individualmente
3. Valide as variáveis de ambiente
4. Confirme a propagação DNS
