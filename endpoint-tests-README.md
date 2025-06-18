# Testes de Endpoints do Devagram

Este diretório contém scripts para testar os endpoints do projeto Devagram (backend e frontend).

## Pré-requisitos

- Os servidores backend e frontend devem estar em execução
  - Backend: http://localhost:3000
  - Frontend: http://localhost:3001
- Credenciais de teste disponíveis:
  - Email: user1@devagram.com | Senha: 2700
  - Email: user2@devagram.com | Senha: 2700
  - Email: user3@devagram.com | Senha: 2700

## Scripts Disponíveis

Escolha o script que melhor se adapta ao seu ambiente:

### 1. Script Batch (Windows)

```
test-endpoints.bat
```

Um script simples para Windows que usa curl para testar os endpoints básicos.

### 2. Script PowerShell (Windows)

```
test-endpoints.ps1
```

Um script mais avançado para Windows que usa PowerShell para testar os endpoints com melhor formatação e organização dos resultados.

### 3. Script JavaScript (Node.js)

```
node test-endpoints.js
```

Um script completo em JavaScript que usa axios para testar todos os endpoints principais.

Requisitos:
- Node.js instalado
- Pacote axios (`npm install axios`)

### 4. Script Shell (Unix/Linux/macOS)

```
bash test-endpoints.sh
```

Um script para ambientes Unix/Linux/macOS que usa curl para testar os endpoints.

### 5. Script Python

```
python test-endpoints.py
```

Um script em Python que usa a biblioteca requests para testar os endpoints.

Requisitos:
- Python 3.x instalado
- Pacote requests (`pip install requests`)

## Resultados

Todos os scripts salvam os resultados dos testes na pasta `endpoint-tests/`. Cada arquivo contém a resposta de um endpoint específico.

## Endpoints Testados

### Backend (http://localhost:3000/api)

- `/login` - Autenticação de usuário
- `/feed` - Feed de publicações
- `/pesquisa` - Pesquisa de usuários
- `/usuario` - Informações do usuário
- `/seguidor` - Informações de seguidores
- `/comentario` - Verificação de endpoint de comentários
- `/like` - Verificação de endpoint de likes
- `/publicacao` - Verificação de endpoint de publicações

### Frontend (http://localhost:3001)

- `/` - Página inicial
- `/reset.html` - Página de reset de cache

## Notas

- Os scripts fazem login automaticamente com as credenciais de teste
- O token JWT obtido no login é usado para autenticar as requisições subsequentes
- Alguns endpoints são testados apenas com OPTIONS para verificar disponibilidade