# 📱 Devagram - Rede Social Moderna

[![Status](https://img.shields.io/badge/Status-✅%20Funcional-brightgreen)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-S3%20%2B%20CloudFront-orange)](https://aws.amazon.com/)

> Rede social inspirada no Instagram com funcionalidades modernas e design responsivo.

---

## ✨ Features

### 🎨 **Interface Moderna**
- Design responsivo (mobile, tablet, desktop)
- Tema claro/escuro com gradientes épicos
- Header glassmorphism com gradiente
- Bottom navigation mobile
- Ícones Font Awesome coloridos

### 👤 **Sistema Social**
- Feed de publicações em tempo real
- Sistema de likes e comentários
- Seguir/deixar de seguir usuários
- Pesquisa de usuários
- Perfil personalizado

### 📤 **Upload de Mídia**
- Upload de imagens para AWS S3
- Redimensionamento automático (4:5)
- CDN global via CloudFront
- Exclusão automática de imagens

### 🔐 **Autenticação**
- JWT (JSON Web Tokens)
- Sessões seguras
- Controle de acesso por usuário

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - Framework React
- **React** - Biblioteca UI
- **SCSS** - Estilização
- **Font Awesome** - Ícones

### **Backend**
- **Node.js 18+** - Runtime
- **Next.js API Routes** - REST API
- **JWT** - Autenticação
- **Sharp** - Processamento de imagens

### **Database & Storage**
- **MongoDB Atlas** - Banco de dados NoSQL
- **AWS S3** - Armazenamento de imagens
- **AWS CloudFront** - CDN global

---

## 🚀 Quick Start

### **Pré-requisitos**
- Node.js 18+
- MongoDB Atlas account
- AWS Account (S3 + CloudFront)

### **1. Clone o repositório**
```bash
git clone https://github.com/Sergio-Sena/Devagram.git
cd Devagram
```

### **2. Configure o Backend**
```bash
cd Devagram-Node
npm install
cp .env.example .env.local
```

Edite `.env.local`:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket
CLOUDFRONT_DOMAIN=your-cloudfront-domain
```

### **3. Configure o Frontend**
```bash
cd ../Devagram-react
npm install
cp .env.example .env.local
```

Edite `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### **4. Execute o projeto**

**Backend (porta 3000):**
```bash
cd Devagram-Node
npm run dev
```

**Frontend (porta 3001):**
```bash
cd Devagram-react
npm run dev
```

Acesse: http://localhost:3001

---

## 📁 Estrutura do Projeto

```
Devagram/
├── Devagram-Node/           # Backend
│   ├── pages/api/           # API Routes
│   │   ├── login.js         # Autenticação
│   │   ├── usuario.js       # CRUD usuários
│   │   ├── publicacao.js    # CRUD publicações
│   │   ├── like.js          # Sistema de likes
│   │   ├── comentario.js    # Sistema de comentários
│   │   └── seguir.js        # Sistema de seguidores
│   ├── models/              # Modelos MongoDB
│   ├── middlewares/         # CORS, JWT, Upload
│   └── services/            # Lógica de negócio
├── Devagram-react/          # Frontend
│   ├── pages/               # Páginas Next.js
│   ├── componentes/         # Componentes React
│   ├── services/            # API Client
│   └── public/              # Assets estáticos
└── memoria/                 # Documentação técnica
```

---

## 🎯 Funcionalidades Implementadas

### **Autenticação**
- ✅ Login com JWT
- ✅ Registro de novos usuários
- ✅ Sessões persistentes
- ✅ Logout seguro

### **Feed Social**
- ✅ Feed de publicações
- ✅ Criar publicações com imagens
- ✅ Excluir publicações próprias
- ✅ Sistema de likes
- ✅ Sistema de comentários
- ✅ Ordenação por data

### **Perfil & Social**
- ✅ Perfil de usuário
- ✅ Editar perfil
- ✅ Seguir/deixar de seguir
- ✅ Pesquisa de usuários
- ✅ Contador de seguidores

### **Upload & Mídia**
- ✅ Upload para S3
- ✅ Redimensionamento automático
- ✅ CDN CloudFront
- ✅ Exclusão de imagens do S3

---

## 🧪 Testes

Execute os testes automatizados:

```bash
# Testar todas as APIs
node test-apis.js

# Testar problemas específicos
node test-problemas.js

# Teste completo
node test-completo.js
```

---

## 📊 Status das APIs

| Endpoint | Status | Funcionalidade |
|----------|--------|----------------|
| POST /api/login | 🟢 | Autenticação |
| POST /api/cadastro | 🟢 | Registro |
| GET /api/usuario | 🟢 | Perfil |
| PUT /api/usuario | 🟢 | Editar perfil |
| GET /api/feed | 🟢 | Feed |
| POST /api/publicacao | 🟢 | Criar post |
| DELETE /api/publicacao | 🟢 | Deletar post |
| PUT /api/like | 🟢 | Like/Unlike |
| PUT /api/comentario | 🟢 | Comentar |
| PUT /api/seguir | 🟢 | Seguir/Deixar |

**Status:** 10/10 APIs funcionando ✅

---

## 🚀 Deploy

### **Opção 1: Railway + Vercel (Recomendado)**

**Backend (Railway):**
```bash
cd Devagram-Node
railway login
railway init
railway up
```

**Frontend (Vercel):**
```bash
cd Devagram-react
vercel login
vercel --prod
```

### **Opção 2: AWS Serverless**

Consulte `DEPLOY-FRONTEND-AWS.md` para instruções detalhadas.

---

## 🔒 Segurança

### **Boas Práticas Implementadas**
- ✅ JWT com expiração
- ✅ Senhas hasheadas (bcrypt)
- ✅ CORS configurado
- ✅ Validação de input
- ✅ Presigned URLs para S3
- ✅ HTTPS em produção

### **Variáveis Sensíveis**
Nunca commite:
- `.env.local`
- Credenciais MongoDB
- Credenciais AWS
- JWT secrets

---

## 🗺️ Roadmap

- [ ] Deploy em produção (Railway + Vercel)
- [ ] Domínio personalizado (ssphere.sstechnologies-cloud.com)
- [ ] Stories e Reels
- [ ] Mensagens diretas
- [ ] Notificações push
- [ ] Mobile app (React Native)

---

## 🤝 Contribuição

Para continuar o desenvolvimento:
1. Leia `memoria/prompt-continuacao.md`
2. Execute os testes: `node test-apis.js`
3. Foque nas correções de prioridade alta

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨💻 Autor

**Sergio Sena**
- GitHub: [@Sergio-Sena](https://github.com/Sergio-Sena)
- LinkedIn: [Sergio Sena](https://linkedin.com/in/sergio-sena)
- Portfolio: [dev-cloud.sstechnologies-cloud.com](https://dev-cloud.sstechnologies-cloud.com)

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela!**

</div>
