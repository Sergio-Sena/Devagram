# Script para testar endpoints do Devagram
Write-Host "===== Testando endpoints do Devagram =====" -ForegroundColor Cyan

# Configuração
$backendUrl = "http://localhost:3000/api"
$frontendUrl = "http://localhost:3001"
$token = ""
$outputFolder = ".\endpoint-tests"

# Criar pasta para resultados se não existir
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

# Função para testar endpoint e salvar resultado
function Test-Endpoint {
    param (
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Headers = "",
        [string]$Body = "",
        [string]$OutputFile
    )
    
    Write-Host "`n> Testando endpoint: $Name" -ForegroundColor Yellow
    Write-Host "  $Method $Url"
    
    $curlCommand = "curl -X $Method `"$Url`""
    
    if ($Headers -ne "") {
        $curlCommand += " $Headers"
    }
    
    if ($Body -ne "") {
        $curlCommand += " -d `"$Body`""
    }
    
    $curlCommand += " -s"
    
    try {
        $result = Invoke-Expression $curlCommand
        $result | Out-File -FilePath "$outputFolder\$OutputFile" -Encoding utf8
        
        if ($result -match "erro") {
            Write-Host "  Resultado: ERRO" -ForegroundColor Red
        } else {
            Write-Host "  Resultado: OK" -ForegroundColor Green
        }
        
        return $result
    } catch {
        Write-Host "  Erro ao executar requisição: $_" -ForegroundColor Red
        return $null
    }
}

# 1. Testar login e obter token
Write-Host "`n=== Testando autenticação ===" -ForegroundColor Magenta
$loginResult = Test-Endpoint -Name "Login" -Method "POST" -Url "$backendUrl/login" `
    -Headers "-H `"Content-Type: application/json`"" `
    -Body "{`\`"login`\`":`\`"user1@devagram.com`\`",`\`"senha`\`":`\`"2700`\`"}" `
    -OutputFile "login.json"

# Extrair token do resultado
if ($loginResult -match '"token":"([^"]+)"') {
    $token = $matches[1]
    Write-Host "  Token obtido com sucesso" -ForegroundColor Green
} else {
    Write-Host "  Falha ao obter token" -ForegroundColor Red
}

# 2. Testar endpoints que não precisam de autenticação
Write-Host "`n=== Testando endpoints públicos ===" -ForegroundColor Magenta

Test-Endpoint -Name "Página inicial (Frontend)" -Method "GET" -Url "$frontendUrl" `
    -OutputFile "frontend_home.html"

Test-Endpoint -Name "Página de reset (Frontend)" -Method "GET" -Url "$frontendUrl/reset.html" `
    -OutputFile "frontend_reset.html"

# 3. Testar endpoints que precisam de autenticação
if ($token -ne "") {
    Write-Host "`n=== Testando endpoints autenticados ===" -ForegroundColor Magenta
    $authHeader = "-H `"Authorization: Bearer $token`""
    
    Test-Endpoint -Name "Feed" -Method "GET" -Url "$backendUrl/feed" `
        -Headers $authHeader -OutputFile "feed.json"
    
    Test-Endpoint -Name "Pesquisa" -Method "GET" -Url "$backendUrl/pesquisa?filtro=user" `
        -Headers $authHeader -OutputFile "pesquisa.json"
    
    Test-Endpoint -Name "Usuário" -Method "GET" -Url "$backendUrl/usuario" `
        -Headers $authHeader -OutputFile "usuario.json"
}

# 4. Testar outros endpoints importantes
Write-Host "`n=== Testando outros endpoints ===" -ForegroundColor Magenta

Test-Endpoint -Name "Cadastro (apenas verificação)" -Method "OPTIONS" -Url "$backendUrl/cadastro" `
    -OutputFile "cadastro_options.txt"

if ($token -ne "") {
    Test-Endpoint -Name "Seguidor" -Method "GET" -Url "$backendUrl/seguidor" `
        -Headers $authHeader -OutputFile "seguidor.json"
}

Write-Host "`n=== Testes concluídos ===" -ForegroundColor Cyan
Write-Host "Resultados salvos na pasta: $outputFolder" -ForegroundColor Cyan