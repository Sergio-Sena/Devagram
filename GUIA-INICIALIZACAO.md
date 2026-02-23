# 🚀 Guia de Inicialização - SSphere

## 📋 Ordem de Inicialização

### 1️⃣ Backend (Porta 3000)
```bash
cd Devagram-Node
npm run dev
```
✅ Aguarde a mensagem: `ready - started server on 0.0.0.0:3000`

### 2️⃣ Frontend (Porta 3001)
```bash
cd Devagram-react
npm run dev
```
✅ Aguarde a mensagem: `ready - started server on 0.0.0.0:3001`

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api

## ✅ Verificação

### Testar Backend:
```bash
node test-backend-apis.js
```

### Testar Frontend:
Acesse: http://localhost:3001

## ⚠️ Problemas Comuns

### Erro de CORS
- **Causa**: Backend não está rodando ou está em porta diferente
- **Solução**: Certifique-se que o backend está na porta 3000

### Porta já em uso
```bash
# Windows - Liberar porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Windows - Liberar porta 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

## 📊 Status das APIs

Todas as 11 rotas estão funcionando:
- ✅ POST /api/cadastro
- ✅ POST /api/login
- ✅ GET /api/usuario
- ✅ PUT /api/usuario
- ✅ GET /api/feed
- ✅ POST /api/publicacao
- ✅ POST /api/like
- ✅ POST /api/comentario
- ✅ GET /api/pesquisa
- ✅ PUT /api/seguir
- ✅ DELETE /api/excluirPublicacao

## 🔧 Configurações

### Backend (.env)
- MongoDB: Configurado
- Cosmic (Upload): Configurado
- CORS: Habilitado para todas as origens

### Frontend (.env.local)
- API URL: http://localhost:3000
