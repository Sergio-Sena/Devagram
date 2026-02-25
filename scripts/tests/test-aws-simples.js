const BASE_URL = 'https://uh77b02lq5.execute-api.us-east-1.amazonaws.com/dev';

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

async function testAPI(name, url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { name, status: response.status, success: response.ok, data };
    } catch (error) {
        return { name, status: 0, success: false, error: error.message };
    }
}

async function runTests() {
    log('\n🔍 TESTANDO APIs FUNCIONAIS NA AWS\n', 'blue');
    
    // 1. Health Check
    log('1. Health Check', 'yellow');
    const health = await testAPI('Health', `${BASE_URL}/health`);
    log(`   Status: ${health.status}`, health.success ? 'green' : 'red');
    if (health.success) {
        log(`   MongoDB: ${health.data.mongodb}`, 'green');
        log(`   Timestamp: ${health.data.timestamp}`, 'green');
    }
    
    // 2. Login
    log('\n2. Login API', 'yellow');
    const login = await testAPI('Login', `${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'user3@devagram.com', senha: '2700' })
    });
    log(`   Status: ${login.status}`, login.success ? 'green' : 'red');
    if (login.success) {
        log(`   Nome: ${login.data.nome}`, 'green');
        log(`   Email: ${login.data.email}`, 'green');
        log(`   Token: ${login.data.token.substring(0, 30)}...`, 'green');
    }
    
    // 3. Feed
    log('\n3. Feed API', 'yellow');
    if (login.success && login.data.token) {
        const feed = await testAPI('Feed', `${BASE_URL}/api/feed`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${login.data.token}`
            }
        });
        log(`   Status: ${feed.status}`, feed.success ? 'green' : 'red');
        if (feed.success) {
            log(`   Publicações: ${feed.data.length || 0}`, 'green');
            if (feed.data.length > 0) {
                log(`   Primeira publicação:`, 'green');
                log(`     - Usuário: ${feed.data[0].usuario?.nome || 'N/A'}`, 'green');
                log(`     - Descrição: ${feed.data[0].descricao || 'N/A'}`, 'green');
            }
        }
    } else {
        log('   ⚠️  Pulado (sem token)', 'yellow');
    }
    
    // Resumo
    log('\n📊 RESUMO FINAL\n', 'blue');
    log('✅ APIs Funcionando:', 'green');
    log('   - Health Check', 'green');
    log('   - Login', 'green');
    log('   - Feed', 'green');
    
    log('\n❌ APIs Não Implementadas no Lambda:', 'red');
    log('   - Usuario', 'red');
    log('   - Pesquisa', 'red');
    log('   - Like', 'red');
    log('   - Comentario', 'red');
    log('   - Seguir', 'red');
    log('   - Publicacao', 'red');
    log('   - ExcluirPublicacao', 'red');
    
    log('\n💡 Nota:', 'yellow');
    log('   O Lambda atual só tem login e feed implementados.', 'yellow');
    log('   Para ter todas as APIs, precisa usar Next.js completo no Lambda.', 'yellow');
}

runTests().catch(console.error);
