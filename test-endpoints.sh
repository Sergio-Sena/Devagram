#!/bin/bash

# Script para testar endpoints do Devagram
echo "===== Testando endpoints do Devagram ====="
echo

# Configuração
BACKEND_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:3001"
OUTPUT_DIR="./endpoint-tests"
TOKEN=""

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Criar pasta para resultados se não existir
mkdir -p "$OUTPUT_DIR"

# Função para testar endpoint e salvar resultado
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local headers="$4"
    local data="$5"
    local output_file="$6"
    
    echo -e "\n${YELLOW}> Testando endpoint: $name${NC}"
    echo "  $method $url"
    
    local curl_cmd="curl -X $method \"$url\""
    
    if [ -n "$headers" ]; then
        curl_cmd="$curl_cmd $headers"
    fi
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d \"$data\""
    fi
    
    curl_cmd="$curl_cmd -s"
    
    local result=$(eval $curl_cmd)
    echo "$result" > "$OUTPUT_DIR/$output_file"
    
    if echo "$result" | grep -q "erro"; then
        echo -e "  Resultado: ${RED}ERRO${NC}"
    else
        echo -e "  Resultado: ${GREEN}OK${NC}"
    fi
    
    echo "$result"
}

# 1. Testar login e obter token
echo -e "\n${BLUE}=== Testando autenticação ===${NC}"
login_result=$(test_endpoint "Login" "POST" "$BACKEND_URL/login" \
    "-H \"Content-Type: application/json\"" \
    "{\"login\":\"user1@devagram.com\",\"senha\":\"2700\"}" \
    "login.json")

# Extrair token do resultado
if echo "$login_result" | grep -q "token"; then
    TOKEN=$(echo "$login_result" | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')
    echo -e "  Token obtido com sucesso: ${GREEN}OK${NC}"
else
    echo -e "  Falha ao obter token: ${RED}ERRO${NC}"
fi

# 2. Testar endpoints que não precisam de autenticação
echo -e "\n${BLUE}=== Testando endpoints públicos ===${NC}"

test_endpoint "Página inicial (Frontend)" "GET" "$FRONTEND_URL" \
    "" "" "frontend_home.html"

test_endpoint "Página de reset (Frontend)" "GET" "$FRONTEND_URL/reset.html" \
    "" "" "frontend_reset.html"

# 3. Testar endpoints que precisam de autenticação
if [ -n "$TOKEN" ]; then
    echo -e "\n${BLUE}=== Testando endpoints autenticados ===${NC}"
    AUTH_HEADER="-H \"Authorization: Bearer $TOKEN\""
    
    test_endpoint "Feed" "GET" "$BACKEND_URL/feed" \
        "$AUTH_HEADER" "" "feed.json"
    
    test_endpoint "Pesquisa" "GET" "$BACKEND_URL/pesquisa?filtro=user" \
        "$AUTH_HEADER" "" "pesquisa.json"
    
    test_endpoint "Usuário" "GET" "$BACKEND_URL/usuario" \
        "$AUTH_HEADER" "" "usuario.json"
        
    test_endpoint "Seguidor" "GET" "$BACKEND_URL/seguidor" \
        "$AUTH_HEADER" "" "seguidor.json"
fi

# 4. Testar outros endpoints importantes
echo -e "\n${BLUE}=== Testando outros endpoints ===${NC}"

test_endpoint "Cadastro (apenas verificação)" "OPTIONS" "$BACKEND_URL/cadastro" \
    "" "" "cadastro_options.txt"

echo -e "\n${BLUE}=== Testes concluídos ===${NC}"
echo "Resultados salvos na pasta: $OUTPUT_DIR"