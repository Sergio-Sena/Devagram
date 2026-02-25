const fs = require('fs');

const BASE_URL = 'http://localhost:3000/api';
const FRONTEND_URL = 'http://localhost:3001';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
    try {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        return {
            name,
            status: response.status,
            success: response.status >= 200 && response.status < 300,
            data,
            error: null
        };
    } catch (error) {
        return {
            name,
            status: 0,
            success: false,
            data: null,
            error: error.message
        };
    }
}

async function runTests() {
    log('\n🔍 INICIANDO TESTES COMPLETOS DO DEVAGRAM\n', 'blue');
    
    const results = {
        backend: [],
        frontend: [],
        env: [],
        summary: {}
    };
    
    // 1. Verificar variáveis de ambiente
    log('📋 1. VERIFICANDO VARIÁVEIS DE AMBIENTE', 'yellow');
    const envPath = 'c:\\Projetos Git\\Devaria\\Devagram-Node\\.env';
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {
            'DB_CONEXAO_STRING': envContent.includes('DB_CONEXAO_STRING'),
            'JWT_SECRET': envContent.includes('JWT_SECRET'),
            'MINHA_CHAVE_JWT': envContent.includes('MINHA_CHAVE_JWT'),
            'AWS_ACCESS_KEY_ID': envContent.includes('AWS_ACCESS_KEY_ID'),
            'AWS_SECRET_ACCESS_KEY': envContent.includes('AWS_SECRET_ACCESS_KEY'),
            'BUCKET_AVATARES': envContent.includes('BUCKET_AVATARES'),
            'CLOUDFRONT_DOMAIN': envContent.includes('CLOUDFRONT_DOMAIN')
        };
        
        Object.entries(envVars).forEach(([key, exists]) => {
            const status = exists ? '✅' : '❌';
            const color = exists ? 'green' : 'red';
            log(`  ${status} ${key}`, color);
            results.env.push({ variable: key, exists });
        });
    } else {
        log('  ❌ Arquivo .env não encontrado', 'red');
    }
    
    // 2. Testar Backend
    log('\n🔧 2. TESTANDO BACKEND (localhost:3000)', 'yellow');
    
    // Teste de login
    const loginTest = await testEndpoint(
        'POST /api/login',
        `${BASE_URL}/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: 'user3@devagram.com', senha: '2700' })
        }
    );
    results.backend.push(loginTest);
    log(`  ${loginTest.success ? '✅' : '❌'} Login: ${loginTest.status}`, loginTest.success ? 'green' : 'red');
    if (!loginTest.success && loginTest.data) {
        log(`     Erro: ${JSON.stringify(loginTest.data)}`, 'red');
    }
    
    let token = null;
    if (loginTest.success && loginTest.data.token) {
        token = loginTest.data.token;
    }
    
    // Teste de cadastro
    const cadastroTest = await testEndpoint(
        'POST /api/cadastro',
        `${BASE_URL}/cadastro`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Teste User',
                email: `teste${Date.now()}@test.com`,
                senha: '123456'
            })
        }
    );
    results.backend.push(cadastroTest);
    log(`  ${cadastroTest.success ? '✅' : '❌'} Cadastro: ${cadastroTest.status}`, cadastroTest.success ? 'green' : 'red');
    
    // Testes com autenticação
    if (token) {
        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        
        // Feed
        const feedTest = await testEndpoint('GET /api/feed', `${BASE_URL}/feed`, {
            headers: authHeaders
        });
        results.backend.push(feedTest);
        log(`  ${feedTest.success ? '✅' : '❌'} Feed: ${feedTest.status}`, feedTest.success ? 'green' : 'red');
        
        // Usuário
        const userTest = await testEndpoint('GET /api/usuario', `${BASE_URL}/usuario`, {
            headers: authHeaders
        });
        results.backend.push(userTest);
        log(`  ${userTest.success ? '✅' : '❌'} Usuário: ${userTest.status}`, userTest.success ? 'green' : 'red');
        
        // Pesquisa
        const searchTest = await testEndpoint('GET /api/pesquisa', `${BASE_URL}/pesquisa?filtro=user`, {
            headers: authHeaders
        });
        results.backend.push(searchTest);
        log(`  ${searchTest.success ? '✅' : '❌'} Pesquisa: ${searchTest.status}`, searchTest.success ? 'green' : 'red');
    } else {
        log('  ⚠️  Testes autenticados pulados (sem token)', 'yellow');
    }
    
    // 3. Testar Frontend
    log('\n🎨 3. TESTANDO FRONTEND (localhost:3001)', 'yellow');
    
    const frontendTest = await testEndpoint('GET /', FRONTEND_URL);
    results.frontend.push(frontendTest);
    log(`  ${frontendTest.success ? '✅' : '❌'} Homepage: ${frontendTest.status}`, frontendTest.success ? 'green' : 'red');
    
    // 4. Resumo
    log('\n📊 RESUMO DOS TESTES\n', 'blue');
    
    const backendSuccess = results.backend.filter(r => r.success).length;
    const backendTotal = results.backend.length;
    const envSuccess = results.env.filter(r => r.exists).length;
    const envTotal = results.env.length;
    
    results.summary = {
        backend: { success: backendSuccess, total: backendTotal, percentage: Math.round((backendSuccess/backendTotal)*100) },
        frontend: { success: results.frontend[0]?.success ? 1 : 0, total: 1 },
        env: { success: envSuccess, total: envTotal, percentage: Math.round((envSuccess/envTotal)*100) }
    };
    
    log(`Backend: ${backendSuccess}/${backendTotal} (${results.summary.backend.percentage}%)`, backendSuccess === backendTotal ? 'green' : 'yellow');
    log(`Frontend: ${results.summary.frontend.success}/${results.summary.frontend.total}`, results.summary.frontend.success ? 'green' : 'red');
    log(`Variáveis ENV: ${envSuccess}/${envTotal} (${results.summary.env.percentage}%)`, envSuccess === envTotal ? 'green' : 'yellow');
    
    // Salvar resultados
    fs.writeFileSync('test-results-completo.json', JSON.stringify(results, null, 2));
    log('\n✅ Resultados salvos em test-results-completo.json', 'green');
    
    return results;
}

runTests().catch(console.error);
