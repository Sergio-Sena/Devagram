# Devagram Python

API do Devagram desenvolvida em Python utilizando FastAPI - Clone do Instagram.

## Tecnologias Utilizadas

- Python 3.8+
- FastAPI
- MongoDB
- JWT para autenticação

## Estrutura do Projeto

- `middlewares/`: Middlewares para autenticação e validação
- `models/`: Modelos de dados para interação com o MongoDB
- `routes/`: Rotas da API
- `schemas/`: Schemas para validação de dados
- `services/`: Serviços para upload de imagens e outras funcionalidades
- `utils/`: Funções utilitárias

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
3. Configure o arquivo `.env` baseado no `.env.exemplo`

## Executando o Projeto

```
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`

## Documentação da API

A documentação interativa da API estará disponível em:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints Principais

- **Autenticação**
  - `/api/login`: Login de usuário
  - `/api/cadastro`: Cadastro de usuário

- **Usuário**
  - `/api/usuario`: Obter/atualizar usuário logado
  - `/api/usuario/{id}`: Obter usuário específico
  - `/api/pesquisa`: Pesquisar usuários

- **Publicações**
  - `/api/publicacao`: Criar publicação
  - `/api/publicacao/{id}`: Obter publicação específica
  - `/api/publicacao/{id}/like`: Curtir/descurtir publicação
  - `/api/publicacao/{id}/comentario`: Comentar em publicação

- **Feed**
  - `/api/feed`: Obter feed do usuário logado
  - `/api/feed/{id}`: Obter feed de um usuário específico

- **Seguidores**
  - `/api/seguir/{id}`: Seguir/deixar de seguir usuário
  - `/api/seguidor/{id}`: Obter seguidores de um usuário