# Endpoints do Backend Utilizados pelo Frontend

## Endpoints Principais

| Endpoint | Método | Descrição | Utilizado pelo Frontend | Arquivos Relacionados |
|----------|--------|-----------|------------------------|----------------------|
| `/login` | POST | Autenticação de usuário | ✅ | `pages/api/login.ts` |
| `/cadastro` | POST | Cadastro de novo usuário | ✅ | `pages/api/cadastro.ts` |
| `/usuario` | GET/PUT | Obter/atualizar dados do usuário | ✅ | `pages/api/usuario.ts` |
| `/feed` | GET | Obter feed de publicações | ✅ | `pages/api/feed.ts` |
| `/publicacao` | POST | Criar nova publicação | ✅ | `pages/api/publicacao.ts` |
| `/excluirPublicacao` | DELETE | Excluir uma publicação | ✅ | `pages/api/excluirPublicacao.ts` |
| `/pesquisa` | GET | Pesquisar usuários | ✅ | `pages/api/pesquisa.ts` |
| `/seguir` | PUT | Seguir/deixar de seguir usuário | ✅ | `pages/api/seguir.ts` |
| `/seguidor` | GET | Verificar se segue um usuário | ✅ | `pages/api/seguidor.ts` |
| `/comentario` | PUT | Adicionar comentário | ✅ | `pages/api/comentario.ts` |
| `/like` | PUT | Curtir/descurtir publicação | ✅ | `pages/api/like.ts` |

## Arquivos Essenciais do Backend

### Endpoints
- `pages/api/login.ts` - Autenticação de usuários
- `pages/api/cadastro.ts` - Cadastro de novos usuários
- `pages/api/usuario.ts` - Gerenciamento de perfil de usuário
- `pages/api/feed.ts` - Feed de publicações
- `pages/api/publicacao.ts` - Criação de publicações
- `pages/api/excluirPublicacao.ts` - Exclusão de publicações
- `pages/api/pesquisa.ts` - Pesquisa de usuários
- `pages/api/seguir.ts` - Seguir/deixar de seguir usuários
- `pages/api/seguidor.ts` - Verificação de seguidores
- `pages/api/comentario.ts` - Gerenciamento de comentários
- `pages/api/like.ts` - Gerenciamento de curtidas

### Middlewares
- `middlewares/conectarMongoDB.ts` - Conexão com o banco de dados
- `middlewares/validarTokenJWT.ts` - Validação de autenticação
- `middlewares/politicaCORS.ts` - Configuração de CORS
- `middlewares/corsMiddleware.ts` - Middleware de CORS

### Models
- `models/UsuarioModel.ts` - Modelo de usuário
- `models/PublicacaoModel.ts` - Modelo de publicação
- `models/SeguidorModel.ts` - Modelo de seguidor

### Services
- `services/uploadImagensS3.ts` - Upload de imagens
- `services/redimensionarImagem.ts` - Redimensionamento de imagens

### Types
- `types/respostaPadraoMsg.ts` - Tipo de resposta padrão
- `types/cadastroRequisicao.ts` - Tipo para requisição de cadastro
- `types/loginResposta.ts` - Tipo para resposta de login

## Arquivos Essenciais do Frontend

### Services
- `services/httpServices.js` - Serviço base para requisições HTTP
- `services/UsuarioService.js` - Serviço para gerenciamento de usuários
- `services/FeedService.js` - Serviço para gerenciamento do feed

### Componentes Principais
- `componentes/feed/index.js` - Componente de feed
- `componentes/login/index.js` - Componente de login
- `componentes/feed/Postagem.js` - Componente de postagem
- `componentes/cabecalhoPerfil/index.js` - Cabeçalho de perfil

### Páginas
- `pages/index.js` - Página inicial
- `pages/cadastro/index.js` - Página de cadastro
- `pages/perfil/[id].js` - Página de perfil
- `pages/publicacao/index.js` - Página de criação de publicação

## Conclusão

Todos os endpoints do backend testados anteriormente estão sendo consumidos pelo frontend. Os arquivos listados acima são essenciais para manter a funcionalidade do sistema e devem ser mantidos no projeto.