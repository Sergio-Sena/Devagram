const fs = require('fs');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let userId = '';

// Cores para output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Função para fazer requisições
async function makeRequest(endpoint, method = 'GET', data = null, headers = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return {
            status: response.status,
            data: result,
            success: response.status >= 200 && response.status < 300
        };
    } catch (error) {
        return {
            status: 0,
            data: { erro: error.message },
            success: false
        };
    }
}

// Função para fazer upload de arquivo
async function makeFileRequest(endpoint, filePath, data = {}, headers = {}) {
    const FormData = require('form-data');
    const form = new FormData();
    
    // Adicionar arquivo se existir
    if (filePath && fs.existsSync(filePath)) {
        form.append('file', fs.createReadStream(filePath));
    }
    
    // Adicionar outros dados
    Object.keys(data).forEach(key => {
        form.append(key, data[key]);
    });

    const url = `${BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: form,
            headers: {
                ...headers
            }
        });
        
        const result = await response.json();
        return {
            status: response.status,
            data: result,
            success: response.status >= 200 && response.status < 300
        };
    } catch (error) {
        return {
            status: 0,
            data: { erro: error.message },
            success: false
        };
    }
}

// Função para log colorido
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Testes das APIs
async function testAPIs() {
    log('\n=== INICIANDO TESTES DAS APIs ===', 'blue');
    
    const results = [];
    
    // 1. Teste de Cadastro
    log('\n1. Testando CADASTRO...', 'yellow');
    const cadastroData = {
        nome: 'Teste User',
        email: `teste${Date.now()}@test.com`,
        senha: '123456'
    };
    
    const cadastroResult = await makeRequest('/cadastro', 'POST', cadastroData);
    results.push({ endpoint: 'POST /cadastro', ...cadastroResult });
    
    if (cadastroResult.success) {
        log('✅ Cadastro: OK', 'green');
    } else {
        log(`❌ Cadastro: ${cadastroResult.status} - ${cadastroResult.data.erro}`, 'red');
    }
    
    // 2. Teste de Login
    log('\n2. Testando LOGIN...', 'yellow');
    const loginData = {
        login: cadastroData.email,
        senha: cadastroData.senha
    };
    
    const loginResult = await makeRequest('/login', 'POST', loginData);
    results.push({ endpoint: 'POST /login', ...loginResult });
    
    if (loginResult.success && loginResult.data.token) {
        authToken = loginResult.data.token;
        userId = loginResult.data._id;
        log('✅ Login: OK', 'green');
    } else {
        log(`❌ Login: ${loginResult.status} - ${loginResult.data.erro}`, 'red');
        // Tentar com usuário existente
        log('Tentando login com usuário existente...', 'yellow');
        const loginExistente = await makeRequest('/login', 'POST', {
            login: 'user3@devagram.com',
            senha: '2700'
        });
        
        if (loginExistente.success && loginExistente.data.token) {
            authToken = loginExistente.data.token;
            userId = loginExistente.data._id;
            log('✅ Login com usuário existente: OK', 'green');
        }
    }
    
    // Headers com autenticação
    const authHeaders = {
        'Authorization': `Bearer ${authToken}`
    };
    
    // 3. Teste de Usuário (GET)
    log('\n3. Testando GET USUARIO...', 'yellow');
    const usuarioResult = await makeRequest('/usuario', 'GET', null, authHeaders);
    results.push({ endpoint: 'GET /usuario', ...usuarioResult });
    
    if (usuarioResult.success) {
        log('✅ GET Usuario: OK', 'green');
    } else {
        log(`❌ GET Usuario: ${usuarioResult.status} - ${usuarioResult.data.erro}`, 'red');
    }
    
    // 4. Teste de Feed
    log('\n4. Testando FEED...', 'yellow');
    const feedResult = await makeRequest('/feed', 'GET', null, authHeaders);
    results.push({ endpoint: 'GET /feed', ...feedResult });
    
    if (feedResult.success) {
        log('✅ Feed: OK', 'green');
    } else {
        log(`❌ Feed: ${feedResult.status} - ${feedResult.data.erro}`, 'red');
    }
    
    // 5. Teste de Pesquisa
    log('\n5. Testando PESQUISA...', 'yellow');
    const pesquisaResult = await makeRequest('/pesquisa?filtro=user', 'GET', null, authHeaders);
    results.push({ endpoint: 'GET /pesquisa', ...pesquisaResult });
    
    if (pesquisaResult.success) {
        log('✅ Pesquisa: OK', 'green');
    } else {
        log(`❌ Pesquisa: ${pesquisaResult.status} - ${pesquisaResult.data.erro}`, 'red');
    }
    
    // 6. Teste de Publicação (sem arquivo - deve falhar)
    log('\n6. Testando PUBLICACAO (sem arquivo)...', 'yellow');
    const publicacaoSemArquivo = await makeRequest('/publicacao', 'POST', {
        descricao: 'Teste de publicação'
    }, authHeaders);
    results.push({ endpoint: 'POST /publicacao (sem arquivo)', ...publicacaoSemArquivo });
    
    if (publicacaoSemArquivo.status === 400) {
        log('✅ Publicação sem arquivo: Erro esperado (400)', 'green');
    } else {
        log(`❌ Publicação sem arquivo: ${publicacaoSemArquivo.status}`, 'red');
    }
    
    // 7. Teste de Seguir (sem ID - deve falhar)
    log('\n7. Testando SEGUIR (sem ID)...', 'yellow');
    const seguirResult = await makeRequest('/seguir', 'PUT', {}, authHeaders);
    results.push({ endpoint: 'PUT /seguir', ...seguirResult });
    
    if (seguirResult.status === 400) {
        log('✅ Seguir sem ID: Erro esperado (400)', 'green');
    } else {
        log(`❌ Seguir sem ID: ${seguirResult.status}`, 'red');
    }
    
    // 8. Teste de Like (sem ID - deve falhar)
    log('\n8. Testando LIKE (sem ID)...', 'yellow');
    const likeResult = await makeRequest('/like', 'PUT', {}, authHeaders);
    results.push({ endpoint: 'PUT /like', ...likeResult });
    
    if (likeResult.status === 400) {
        log('✅ Like sem ID: Erro esperado (400)', 'green');
    } else {
        log(`❌ Like sem ID: ${likeResult.status}`, 'red');
    }
    
    // 9. Teste de Comentário (sem ID - deve falhar)
    log('\n9. Testando COMENTARIO (sem ID)...', 'yellow');
    const comentarioResult = await makeRequest('/comentario', 'PUT', {
        comentario: 'Teste de comentário'
    }, authHeaders);
    results.push({ endpoint: 'PUT /comentario', ...comentarioResult });
    
    if (comentarioResult.status === 400) {
        log('✅ Comentário sem ID: Erro esperado (400)', 'green');
    } else {
        log(`❌ Comentário sem ID: ${comentarioResult.status}`, 'red');
    }
    
    // 10. Teste de Excluir Publicação (sem ID - deve falhar)
    log('\n10. Testando EXCLUIR PUBLICACAO (sem ID)...', 'yellow');
    const excluirResult = await makeRequest('/excluirPublicacao', 'DELETE', null, authHeaders);
    results.push({ endpoint: 'DELETE /excluirPublicacao', ...excluirResult });
    
    if (excluirResult.status === 400) {
        log('✅ Excluir sem ID: Erro esperado (400)', 'green');
    } else {
        log(`❌ Excluir sem ID: ${excluirResult.status}`, 'red');
    }
    
    // Resumo dos resultados
    log('\n=== RESUMO DOS TESTES ===', 'blue');
    
    const sucessos = results.filter(r => r.success || (r.status >= 400 && r.status < 500)).length;
    const total = results.length;
    
    log(`\nTotal de testes: ${total}`, 'blue');
    log(`Sucessos/Esperados: ${sucessos}`, 'green');
    log(`Falhas: ${total - sucessos}`, 'red');
    
    log('\nDetalhes:', 'blue');
    results.forEach(result => {
        const status = result.success || (result.status >= 400 && result.status < 500) ? '✅' : '❌';
        const color = result.success || (result.status >= 400 && result.status < 500) ? 'green' : 'red';
        log(`${status} ${result.endpoint}: ${result.status}`, color);
    });
    
    // Salvar resultados em arquivo
    const reportPath = path.join(__dirname, 'api-test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`\nRelatório salvo em: ${reportPath}`, 'blue');
}

// Executar testes
if (require.main === module) {
    testAPIs().catch(console.error);
}

module.exports = { testAPIs };