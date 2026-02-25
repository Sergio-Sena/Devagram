# ▲ PASSO 2: Deploy Frontend na Vercel

## 📋 O QUE VOCÊ VAI FAZER AGORA

Vamos colocar o frontend online na Vercel (grátis, 100GB bandwidth/mês).

---

## 🎯 INSTRUÇÕES PASSO A PASSO

### 1️⃣ Criar Conta na Vercel

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seus repositórios

---

### 2️⃣ Importar Projeto

1. No dashboard, clique em **"Add New..."** → **"Project"**
2. Procure por: **"Sphere rede social"** ou **"Devagram-react"**
3. Clique em **"Import"**

---

### 3️⃣ Configurar Projeto

Na tela de configuração:

**Framework Preset:** Next.js (detectado automaticamente)

**Root Directory:** `Devagram-react` (se necessário)

**Build Command:** `npm run build`

**Output Directory:** `.next`

---

### 4️⃣ Adicionar Variável de Ambiente

1. Clique em **"Environment Variables"**
2. Adicione:

**Name:**
```
NEXT_PUBLIC_API_URL
```

**Value:** (Cole a URL do Railway que você copiou)
```
https://sua-url.railway.app
```

3. Marque: **Production**, **Preview**, **Development**
4. Clique em **"Add"**

---

### 5️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Quando aparecer **"Congratulations!"**, clique em **"Visit"**

---

### 6️⃣ Testar Frontend

Você verá a tela de login do SSphere!

**Teste:**
- Email: `user1@devagram.com`
- Senha: `2700`

---

### 7️⃣ Copiar URL da Vercel

Você verá algo como:
```
https://ssphere-xxxx.vercel.app
```

**COPIE ESSA URL!** Você vai precisar dela no próximo passo.

---

## ✅ CHECKLIST

- [ ] Conta Vercel criada
- [ ] Projeto importado
- [ ] Variável NEXT_PUBLIC_API_URL configurada
- [ ] Deploy com sucesso
- [ ] Login funcionando
- [ ] Feed carregando

---

## 🐛 PROBLEMAS COMUNS

### Build falhou?
- Verifique se selecionou a pasta `Devagram-react`
- Verifique logs do build

### Login não funciona?
- Verifique se NEXT_PUBLIC_API_URL está correto
- Verifique se Railway está online

### CORS Error?
- Volte no Railway
- Atualize CORS_ORIGIN com a URL da Vercel
- Aguarde redeploy

---

## 📝 ANOTE AQUI SUA URL

```
Minha URL da Vercel:
https://_________________________________.vercel.app
```

---

## ➡️ PRÓXIMO PASSO

Quando terminar, me avise e vamos para o **PASSO 3: Configurar Domínio Personalizado**!

---

**Tempo estimado:** 10-15 minutos
**Custo:** $0
