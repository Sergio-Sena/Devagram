# Arquivos Essenciais do Backend

## Endpoints

- pages/api/cadastro.ts
- pages/api/comentario.ts
- pages/api/excluirPublicacao.ts
- pages/api/feed.ts
- pages/api/like.ts
- pages/api/login.ts
- pages/api/pesquisa.ts
- pages/api/publicacao.ts
- pages/api/seguir.ts
- pages/api/seguidor.ts
- pages/api/usuario.ts

## Middlewares

- middlewares/conectarMongoDB.ts
- middlewares/validarTokenJWT.ts
- middlewares/politicaCORS.ts
- middlewares/corsMiddleware.ts

## Models

- models/UsuarioModel.ts
- models/PublicacaoModel.ts
- models/SeguidorModel.ts

## Services

- services/uploadImagensS3.ts
- services/redimensionarImagem.ts

## Types

- types/respostaPadraoMsg.ts
- types/cadastroRequisicao.ts
- types/loginResposta.ts

## Configuração

- next.config.js
- package.json
- tsconfig.json
- .env
- .env.exemple
