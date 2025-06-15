# Backend Python para o Devagram

Este é o backend em Python para o Devagram, utilizando FastAPI e MongoDB.

## Requisitos

- Python 3.8+
- MongoDB (local ou Atlas)
- Pip (gerenciador de pacotes Python)

## Configuração

1. Crie um ambiente virtual:
```bash
python -m venv venv
```

2. Ative o ambiente virtual:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

## Banco de Dados

### Opção 1: MongoDB Local

1. Instale o MongoDB Community Edition:
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

2. Inicie o serviço MongoDB:
```bash
# Windows (como administrador)
net start MongoDB

# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

3. Configure a URL no arquivo .env:
```
MONGODB_URL=mongodb://localhost:27017/devagram-python-test
```

### Opção 2: MongoDB Atlas (Nuvem)

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure um usuário e senha para o banco de dados
4. Adicione seu IP à lista de IPs permitidos (ou use 0.0.0.0/0 para permitir qualquer IP)
5. Obtenha a string de conexão e configure no arquivo .env:
```
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/devagram?retryWrites=true&w=majority
```

## Executando o Servidor

```bash
# Modo de desenvolvimento
python -m app.main

# Ou usando uvicorn diretamente
uvicorn app.main:app --reload
```

## Documentação da API

Após iniciar o servidor, acesse a documentação interativa da API:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testes

```bash
# Executar todos os testes
pytest

# Executar testes com cobertura
pytest --cov=app
```