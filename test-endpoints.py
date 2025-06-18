#!/usr/bin/env python3
import os
import json
import requests
from datetime import datetime

# Configurações
BACKEND_URL = 'http://localhost:3000/api'
FRONTEND_URL = 'http://localhost:3001'
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'endpoint-tests')
TEST_USER = {
    'email': 'user1@devagram.com',
    'password': '2700'
}

# Criar diretório de saída se não existir
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Função para salvar resposta em arquivo
def save_response(filename, data):
    file_path = os.path.join(OUTPUT_DIR, filename)
    
    if isinstance(data, requests.Response):
        try:
            content = data.json()
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'status': data.status_code,
                    'headers': dict(data.headers),
                    'data': content
                }, f, indent=2)
        except:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(data.text)
    else:
        with open(file_path, 'w', encoding='utf-8') as f:
            if isinstance(data, dict):
                json.dump(data, f, indent=2)
            else:
                f.write(str(data))
    
    print(f"Resposta salva em {file_path}")

# Função para testar um endpoint
def test_endpoint(name, method, url, headers=None, data=None):
    print(f"\n> Testando endpoint: {name}")
    print(f"  {method} {url}")
    
    if headers is None:
        headers = {}
    
    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=data if data and method != 'GET' else None,
            params=data if data and method == 'GET' else None
        )
        
        filename = f"{name.lower().replace(' ', '_')}.json"
        save_response(filename, response)
        
        if 200 <= response.status_code < 300:
            print(f"  Resultado: OK ({response.status_code})")
        else:
            print(f"  Resultado: ERRO ({response.status_code})")
        
        return response
    except Exception as e:
        print(f"  Erro ao testar endpoint: {str(e)}")
        return None

# Função principal para executar todos os testes
def run_tests():
    print('===== Testando endpoints do Devagram =====')
    token = None
    
    # 1. Testar login e obter token
    print('\n=== Testando autenticação ===')
    login_response = test_endpoint(
        'Login',
        'POST',
        f"{BACKEND_URL}/login",
        {'Content-Type': 'application/json'},
        {'login': TEST_USER['email'], 'senha': TEST_USER['password']}
    )
    
    if login_response and login_response.status_code == 200:
        try:
            token = login_response.json().get('token')
            if token:
                print('  Token obtido com sucesso')
            else:
                print('  Token não encontrado na resposta')
        except:
            print('  Falha ao processar resposta de login')
    else:
        print('  Falha ao fazer login')
    
    # 2. Testar endpoints públicos
    print('\n=== Testando endpoints públicos ===')
    
    test_endpoint(
        'Frontend Home',
        'GET',
        FRONTEND_URL
    )
    
    test_endpoint(
        'Frontend Reset',
        'GET',
        f"{FRONTEND_URL}/reset.html"
    )
    
    # 3. Testar endpoints autenticados
    if token:
        print('\n=== Testando endpoints autenticados ===')
        auth_headers = {'Authorization': f'Bearer {token}'}
        
        # Feed
        test_endpoint(
            'Feed',
            'GET',
            f"{BACKEND_URL}/feed",
            auth_headers
        )
        
        # Pesquisa
        test_endpoint(
            'Pesquisa',
            'GET',
            f"{BACKEND_URL}/pesquisa",
            auth_headers,
            {'filtro': 'user'}
        )
        
        # Usuário
        test_endpoint(
            'Usuario',
            'GET',
            f"{BACKEND_URL}/usuario",
            auth_headers
        )
        
        # Seguidor
        test_endpoint(
            'Seguidor',
            'GET',
            f"{BACKEND_URL}/seguidor",
            auth_headers
        )
        
        # Comentário (apenas verificação)
        test_endpoint(
            'Comentario Options',
            'OPTIONS',
            f"{BACKEND_URL}/comentario",
            auth_headers
        )
        
        # Like (apenas verificação)
        test_endpoint(
            'Like Options',
            'OPTIONS',
            f"{BACKEND_URL}/like",
            auth_headers
        )
    
    print('\n=== Testes concluídos ===')
    print(f"Resultados salvos na pasta: {OUTPUT_DIR}")
    print(f"Data e hora dos testes: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    run_tests()