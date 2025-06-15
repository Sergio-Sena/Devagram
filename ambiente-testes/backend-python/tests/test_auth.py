from fastapi.testclient import TestClient
from app.main import app
import pytest
from app.services.db_service import hash_senha

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

# Testes para autenticação
# Nota: Em um ambiente real, usaríamos mocks para o banco de dados
@pytest.mark.skip(reason="Requer configuração de banco de dados")
def test_cadastro_usuario():
    # Dados para o teste
    dados = {
        "nome": "Usuário Teste",
        "email": "teste@example.com",
        "senha": "senha123"
    }
    
    # Executa a requisição
    response = client.post(
        "/api/auth/cadastro",
        data=dados
    )
    
    # Verifica o resultado
    assert response.status_code == 200
    assert response.json() == {"msg": "Usuário cadastrado com sucesso!"}

@pytest.mark.skip(reason="Requer configuração de banco de dados")
def test_login_usuario():
    # Dados para o teste
    dados = {
        "email": "teste@example.com",
        "senha": "senha123"
    }
    
    # Executa a requisição
    response = client.post(
        "/api/auth/login",
        json=dados
    )
    
    # Verifica o resultado
    assert response.status_code == 200
    assert "token" in response.json()
    assert "nome" in response.json()
    assert "email" in response.json()