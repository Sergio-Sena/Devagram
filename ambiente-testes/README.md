# Ambiente de Testes para Backend Python e Frontend

Este diretório contém a configuração do ambiente de testes para:
- Backend Python (FastAPI)
- Frontend (React/Next.js)

## Estrutura do Projeto

```
ambiente-testes/
├── backend-python/       # Ambiente de testes para Python
│   ├── app/              # Código fonte
│   │   ├── models/       # Modelos de dados
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Serviços
│   │   ├── middleware/   # Middlewares
│   │   └── main.py       # Arquivo principal
│   ├── tests/            # Testes unitários e de integração
│   ├── requirements.txt  # Dependências
│   ├── pytest.ini        # Configuração do pytest
│   └── .env.example      # Exemplo de variáveis de ambiente
│
└── frontend/             # Ambiente de testes para Frontend
    ├── pages/            # Páginas Next.js
    ├── components/       # Componentes React
    ├── styles/           # Estilos (SASS)
    ├── public/           # Arquivos estáticos
    ├── tests/            # Testes unitários e de integração
    ├── package.json      # Dependências
    ├── jest.config.js    # Configuração do Jest
    └── jest.setup.js     # Configuração adicional do Jest
```

## Como Executar

### Backend Python

```bash
cd backend-python
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Configure suas variáveis de ambiente
pytest                    # Executa os testes
python -m app.main        # Inicia o servidor em modo de desenvolvimento
```

### Frontend

```bash
cd frontend
npm install
npm run test          # Executa os testes
npm run dev           # Inicia o servidor de desenvolvimento
```