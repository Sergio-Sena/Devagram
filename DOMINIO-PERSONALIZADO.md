# 🌐 Domínio Personalizado com Route 53

## ✅ Sim! É Possível e Viável

### 💰 Custo Total:
- **Railway + Vercel**: $0/mês
- **Domínio (.com)**: ~$12/ano ($1/mês)
- **Route 53**: ~$0.50/mês
- **Total**: ~$1.50/mês

---

## 🎯 Arquitetura Final

```
devagram.com (Route 53)
├── api.devagram.com → Railway (Backend)
└── app.devagram.com → Vercel (Frontend)
```

**Ou subdomínios:**
```
devagram.com → Vercel (Frontend)
api.devagram.com → Railway (Backend)
```

---

## 📋 Implementação Passo a Passo

### Passo 1: Registrar Domínio
```bash
# Opções:
1. Route 53 (AWS): $12/ano
2. Namecheap: $8-10/ano  
3. GoDaddy: $10-15/ano
4. Registro.br (.com.br): R$ 40/ano
```

### Passo 2: Configurar Route 53
```bash
# 1. Criar Hosted Zone
aws route53 create-hosted-zone \
  --name devagram.com \
  --caller-reference $(date +%s)

# 2. Anotar Name Servers
aws route53 list-hosted-zones-by-name \
  --dns-name devagram.com
```

### Passo 3: Configurar DNS Records
```json
{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "devagram.com",
      "Type": "CNAME", 
      "TTL": 300,
      "ResourceRecords": [{"Value": "seu-app.vercel.app"}]
    }
  }, {
    "Action": "CREATE", 
    "ResourceRecordSet": {
      "Name": "api.devagram.com",
      "Type": "CNAME",
      "TTL": 300, 
      "ResourceRecords": [{"Value": "seu-app.railway.app"}]
    }
  }]
}
```

### Passo 4: Configurar Vercel
```bash
# Adicionar domínio no Vercel
vercel domains add devagram.com
vercel domains add www.devagram.com
```

### Passo 5: Configurar Railway
```bash
# No Railway Dashboard:
# Settings → Domains → Add Custom Domain
# Adicionar: api.devagram.com
```

---

## 🔧 Configuração Técnica

### Frontend (Vercel)
```javascript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.devagram.com'
  }
}
```

### Backend (Railway)
```javascript
// CORS atualizado
const corsOptions = {
  origin: [
    'https://devagram.com',
    'https://www.devagram.com',
    'http://localhost:3001'
  ]
}
```

---

## 💡 Opções de Domínio

### Opção 1: Domínio Próprio
```
Custo: $8-15/ano
Exemplos: devagram.com, ssphere.app
Vantagem: Profissional, memorável
```

### Opção 2: Subdomínio Gratuito
```
Custo: $0
Exemplos: devagram.vercel.app, devagram.railway.app  
Vantagem: Gratuito, funcional
```

### Opção 3: Domínio .tk/.ml (Gratuito)
```
Custo: $0
Exemplos: devagram.tk, devagram.ml
Vantagem: Gratuito
Desvantagem: Menos profissional
```

---

## 🎯 Recomendação para Didático

### Cenário 1: Orçamento Zero
```
Frontend: devagram.vercel.app
Backend: devagram-api.railway.app
Custo: $0/mês
```

### Cenário 2: Orçamento Mínimo ($1.50/mês)
```
Frontend: devagram.com
Backend: api.devagram.com  
Custo: ~$1.50/mês
Benefício: Muito mais profissional
```

---

## 📊 Comparação Final

| Solução | Custo/mês | Profissional | Didático |
|---------|-----------|--------------|----------|
| **Subdomínios grátis** | $0 | ⭐⭐⭐ | ✅ Bom |
| **Domínio + Route 53** | $1.50 | ⭐⭐⭐⭐⭐ | ✅ Excelente |
| **AWS completo** | $20+ | ⭐⭐⭐⭐⭐ | ❌ Caro |

---

## 🚀 Implementação Recomendada

### Fase 1: Deploy Gratuito (Hoje)
1. Railway + Vercel com subdomínios
2. Testar funcionamento completo
3. Validar todas as funcionalidades

### Fase 2: Domínio Personalizado (Opcional)
1. Registrar domínio
2. Configurar Route 53
3. Atualizar DNS records
4. Configurar SSL automático

---

## ✅ Próximos Passos

**Quer começar com qual opção?**

1. **Gratuito primeiro** (subdomínios) → depois domínio
2. **Direto com domínio** personalizado ($1.50/mês)

Ambas são viáveis e muito mais econômicas que AWS! 🎯

**Qual prefere implementar?**