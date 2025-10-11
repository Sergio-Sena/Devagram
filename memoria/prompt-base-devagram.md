# 🎯 Prompt Base Universal - Devagram

## 📋 CONTEXTO DO PROJETO

### Identidade
**Projeto**: Devagram - Rede Social Completa
**Stack**: Node.js + React + Next.js + MongoDB + AWS
**Status**: 100% funcional, pronto para produção
**Metodologia**: C.E.R.T.O + Clean Architecture

### Arquitetura Atual
```
Frontend (React/Next.js) ←→ Backend (Node.js/Next.js API) ←→ MongoDB Atlas
                                        ↓
                                 AWS S3 + CloudFront
```

## 🎯 ANÁLISE C.E.R.T.O COMPLETA

### **C - Contexto Identificado**
Sistema de rede social inspirado no Instagram com:
- **10 APIs funcionais**: Login, cadastro, feed, publicações, likes, comentários, seguir, pesquisa, usuário, exclusão
- **Interface moderna**: Design system com glassmorphism, gradientes épicos, temas claro/escuro
- **Infraestrutura robusta**: CDN otimizada, upload de imagens, redimensionamento automático
- **Responsividade completa**: Mobile-first com bottom navigation

### **E - Expectativas Definidas**
- **Performance**: < 3s tempo de carregamento
- **Escalabilidade**: Suporte a 10k+ usuários simultâneos
- **Disponibilidade**: 99.9% uptime
- **Funcionalidades**: Todas as features de uma rede social moderna
- **Deploy**: Arquitetura serverless na AWS

### **R - Regras Estabelecidas**
- **Código limpo**: TypeScript, ESLint, comentários em português
- **Design system**: Gradientes padronizados, glassmorphism consistente
- **Segurança**: JWT, validação de dados, proteção CORS
- **Performance**: Lazy loading, code splitting, cache otimizado
- **Testes**: APIs testadas automaticamente

### **T - Tarefas Mapeadas**
1. **Sistema base** ✅ (100% concluído)
2. **Deploy produção** (Fase 1 - 2-3 semanas)
3. **Otimização** (Fase 2 - 2 semanas)
4. **Recursos avançados** (Fase 3 - 4-6 semanas)

### **O - Objetivo Final**
Rede social Devagram em produção com arquitetura serverless, interface épica e todas as funcionalidades modernas (stories, chat, notificações push).

## 🧠 RACIOCÍNIO TÉCNICO (Chain-of-Thought)

### 1. Arquitetura de Produção
```
Route 53 → CloudFront → S3 (Frontend)
                    ↓
              API Gateway → Lambda → MongoDB Atlas
                                ↓
                        S3 + CloudFront (Imagens)
```

### 2. Stack Otimizada
- **Frontend**: Next.js 14 + Service Worker + PWA
- **Backend**: AWS Lambda + API Gateway
- **Storage**: S3 + CloudFront + Redis Cache
- **Database**: MongoDB Atlas + backup automatizado
- **Monitoring**: CloudWatch + alertas customizados

### 3. Estrutura de Componentes
```
componentes/
├── ui/                 # Design system
├── feed/              # Feed principal
├── layout/            # Header, navigation
├── auth/              # Login, cadastro
└── stories/           # Recursos futuros
```

### 4. Integração de Serviços
- **Upload**: S3 com redimensionamento Lambda
- **CDN**: CloudFront com cache otimizado
- **Auth**: JWT com refresh tokens
- **Real-time**: WebSocket para chat/notificações

### 5. Estratégia de Deploy
- **CI/CD**: GitHub Actions
- **Staging**: Ambiente de teste
- **Produção**: Deploy blue-green
- **Rollback**: Automático em caso de erro

## 💻 ESTRUTURA DE DESENVOLVIMENTO

### APIs Funcionais (10/10)
```typescript
// Todas operacionais
POST /api/cadastro      - Criar usuário
POST /api/login         - Autenticar
GET  /api/usuario       - Dados do perfil
GET  /api/feed          - Publicações
POST /api/publicacao    - Criar post
PUT  /api/like          - Curtir/descurtir
PUT  /api/comentario    - Comentar
PUT  /api/seguir        - Seguir usuário
GET  /api/pesquisa      - Buscar usuários
DELETE /api/excluirPublicacao - Remover post
```

### Design System Implementado
```scss
// Gradientes padronizados
$gradient-bg: linear-gradient(135deg, #667eea, #764ba2, #ffffff);
$gradient-header: linear-gradient(90deg, #ffffff 0%, #764ba2 50%, #667eea 100%);
$gradient-logo: linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%);

// Glassmorphism
.glassmorphism {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Funcionalidades Completas
- ✅ **Autenticação**: JWT com middleware de proteção
- ✅ **Publicações**: Upload, visualização, exclusão
- ✅ **Interações**: Likes, comentários, seguir
- ✅ **Interface**: Responsiva com temas dinâmicos
- ✅ **Performance**: CDN, cache, otimizações

## 🚀 ROADMAP DE EVOLUÇÃO

### Fase 1: Deploy Produção (Prioridade Alta)
```bash
# Comandos de deploy
serverless deploy --stage prod
aws s3 sync out/ s3://devagram-frontend-prod
aws cloudfront create-invalidation --distribution-id E123456789 --paths "/*"
```

### Fase 2: Recursos Avançados
```typescript
// Stories temporários
interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  expiresAt: Date; // 24h
  viewers: string[];
}

// Chat em tempo real
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  readAt?: Date;
}
```

## 📊 MÉTRICAS DE SUCESSO

### Técnicas
- **Performance**: Core Web Vitals otimizados
- **Disponibilidade**: 99.9% uptime
- **Escalabilidade**: Auto-scaling serverless
- **Segurança**: 0 vulnerabilidades críticas

### Negócio
- **Usuários**: Crescimento 20%/mês
- **Engajamento**: 70% retenção em 7 dias
- **Performance**: < 3s carregamento
- **Custos**: < R$ 200/mês até 1k usuários

## 🔧 COMANDOS ESSENCIAIS

### Desenvolvimento
```bash
# Backend (porta 3000)
cd Devagram-Node && npm run dev

# Frontend (porta 3001)
cd Devagram-react && npm run dev

# Testes
node test-apis.js
```

### Produção
```bash
# Deploy completo
./deploy.sh

# Monitoramento
./monitor.sh

# Rollback
serverless rollback --timestamp 2025-01-15T10:30:00
```

## 📋 TEMPLATE DE CONTINUAÇÃO

Para qualquer desenvolvimento futuro no Devagram, use este template:

```markdown
## 🎯 CONTEXTO DEVAGRAM
- Sistema 100% funcional
- 10 APIs operacionais
- Interface moderna com gradientes
- Pronto para deploy serverless

## 🧠 RACIOCÍNIO
1. Analisar requisito no contexto atual
2. Verificar impacto na arquitetura
3. Implementar seguindo design system
4. Testar com APIs existentes
5. Documentar mudanças

## 💻 IMPLEMENTAÇÃO
[Código seguindo padrões estabelecidos]

## ✅ VALIDAÇÃO
- Testes automatizados
- Performance mantida
- Design system respeitado
- Documentação atualizada
```

---

**🎯 MISSÃO**: Manter o Devagram como referência de rede social moderna, escalável e performática, seguindo sempre a metodologia C.E.R.T.O e as melhores práticas estabelecidas.

**📅 Atualizado**: Janeiro 2025
**🔄 Próxima revisão**: Após cada fase de desenvolvimento