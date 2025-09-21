# 📱 Devagram - Rede Social

Uma rede social inspirada no Instagram, desenvolvida com tecnologias modernas.

## 🚀 Tecnologias

- **Backend**: Node.js + Next.js API Routes + MongoDB
- **Frontend**: React + Next.js + SCSS
- **Cloud**: AWS S3 + CloudFront
- **Autenticação**: JWT

## 📊 Status Atual

| Componente | Status | Detalhes |
|------------|--------|----------|
| **Backend APIs** | 🟡 8/10 funcionando | 2 APIs precisam correção |
| **Frontend** | 🟢 Funcional | Interface completa |
| **Infraestrutura** | 🟢 Operacional | Servidores rodando |
| **Sistema Geral** | 🟡 85% pronto | Usável com limitações |

## 🏃‍♂️ Como Executar

### Backend (Porta 3000)
```bash
cd Devagram-Node
npm install
npm run dev
```

### Frontend (Porta 3001)
```bash
cd Devagram-react
npm install
npm run dev
```

## ✅ Funcionalidades Implementadas

- ✅ Login e autenticação JWT
- ✅ Feed de publicações
- ✅ Sistema de likes
- ✅ Sistema de comentários
- ✅ Seguir/deixar de seguir usuários
- ✅ Pesquisa de usuários
- ✅ Exclusão de publicações próprias
- ✅ Interface responsiva
- ✅ Header moderno com logo SSphere
- ✅ Navegação bottom navigation mobile
- ✅ Sistema de troca de tema claro/escuro
- ✅ Design system com gradientes consistentes

## ❌ Problemas Conhecidos

1. **API Cadastro**: Erro no parsing de dados
2. **API Publicação**: Endpoint não encontrado (404)
3. **Imagens CDN**: URLs CloudFront não resolvem

## 🧪 Testes

Execute os testes automatizados:
```bash
node test-apis.js        # Testa todas as APIs
node test-problemas.js   # Testes específicos dos problemas
```

## 📁 Estrutura do Projeto

```
Devaria/
├── Devagram-Node/          # Backend
│   ├── pages/api/          # Endpoints da API
│   ├── models/             # Modelos MongoDB
│   └── middlewares/        # Middlewares (CORS, JWT, etc)
├── Devagram-react/         # Frontend
│   ├── pages/              # Páginas Next.js
│   ├── componentes/        # Componentes React
│   └── services/           # Serviços de API
├── memoria/                # Documentação técnica
└── test-*.js              # Scripts de teste
```

## 📈 Evolução do Projeto

### ✅ Concluído
- [x] Configuração inicial do ambiente
- [x] Implementação do sistema de autenticação
- [x] Desenvolvimento do feed principal
- [x] Sistema de interações sociais
- [x] Testes automatizados das APIs
- [x] Identificação e documentação de problemas
- [x] Redesign completo do header
- [x] Implementação de bottom navigation moderno
- [x] Sistema de temas claro/escuro
- [x] Padronização visual com gradientes

### 🔄 Em Andamento
- [ ] Correção da API de cadastro
- [ ] Correção da API de publicação
- [ ] Resolução dos problemas de CDN

### 📋 Próximos Passos
- [ ] Implementar upload de imagens local
- [ ] Melhorar tratamento de erros
- [ ] Adicionar testes unitários
- [ ] Deploy em produção

## 🤝 Contribuição

Para continuar o desenvolvimento:
1. Leia o contexto em `memoria/prompt-continuacao.md`
2. Execute os testes para verificar o status atual
3. Foque nas correções de prioridade alta

## 📞 Suporte

Para dúvidas sobre o projeto, consulte a documentação em `memoria/` que contém:
- Relatório detalhado das APIs
- Checklist de funcionalidades
- Contexto para continuação do desenvolvimento