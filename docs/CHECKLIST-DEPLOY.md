# ✅ CHECKLIST DE DEPLOY - SSphere

## 🎯 OBJETIVO
Colocar SSphere online em: **ssphere.sstechnologies-cloud.com**

---

## 📋 PROGRESSO

### PASSO 1: Backend no Railway (20 min)
- [ ] 1.1 Criar conta Railway (https://railway.app)
- [ ] 1.2 Conectar GitHub
- [ ] 1.3 Importar Devagram-Node
- [ ] 1.4 Adicionar variáveis de ambiente (10 variáveis)
- [ ] 1.5 Aguardar deploy
- [ ] 1.6 Gerar domínio Railway
- [ ] 1.7 Copiar URL: `https://____________.railway.app`
- [ ] 1.8 Testar: `/api/feed` retorna JSON

**Status:** ⏳ Aguardando

---

### PASSO 2: Frontend na Vercel (15 min)
- [ ] 2.1 Criar conta Vercel (https://vercel.com)
- [ ] 2.2 Conectar GitHub
- [ ] 2.3 Importar Devagram-react
- [ ] 2.4 Configurar NEXT_PUBLIC_API_URL
- [ ] 2.5 Aguardar deploy
- [ ] 2.6 Copiar URL: `https://____________.vercel.app`
- [ ] 2.7 Testar login: user1@devagram.com / 2700

**Status:** ⏳ Aguardando

---

### PASSO 3: Domínio Personalizado (15 min)
- [ ] 3.1 Na Vercel: Adicionar domínio ssphere.sstechnologies-cloud.com
- [ ] 3.2 Copiar CNAME da Vercel
- [ ] 3.3 No Route53: Criar registro CNAME
- [ ] 3.4 Aguardar propagação DNS (5 min)
- [ ] 3.5 Testar: https://ssphere.sstechnologies-cloud.com

**Status:** ⏳ Aguardando

---

### PASSO 4: Configurar API Subdomain (10 min)
- [ ] 4.1 No Railway: Adicionar domínio personalizado
- [ ] 4.2 Copiar CNAME do Railway
- [ ] 4.3 No Route53: Criar registro para api.ssphere
- [ ] 4.4 Atualizar CORS_ORIGIN no Railway
- [ ] 4.5 Testar: https://api.ssphere.sstechnologies-cloud.com/api/feed

**Status:** ⏳ Aguardando

---

## 🎯 RESULTADO FINAL

Quando tudo estiver ✅:

```
✅ https://ssphere.sstechnologies-cloud.com
   └─► Frontend (Vercel)
       └─► https://api.ssphere.sstechnologies-cloud.com
           └─► Backend (Railway)
               └─► MongoDB Atlas + AWS S3
```

---

## 📊 RESUMO

| Item | Tempo | Custo | Status |
|------|-------|-------|--------|
| Railway | 20 min | $0 | ⏳ |
| Vercel | 15 min | $0 | ⏳ |
| Route53 | 15 min | $0 | ⏳ |
| Testes | 10 min | $0 | ⏳ |
| **TOTAL** | **1h** | **$0** | ⏳ |

---

## 🚀 COMEÇAR AGORA

**Abra o arquivo:** `PASSO-1-RAILWAY.md`

Siga as instruções passo a passo e marque cada item concluído!

---

## 📞 SUPORTE

Se tiver dúvidas em qualquer passo, me avise!

**Boa sorte! 🎉**
