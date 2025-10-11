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
    log('\n🔍 TESTANDO APIs NA AWS PRODUÇÃO\n', 'blue');
    
    const results = [];
    let token = null;
    
    // 1. Health Check
    log('1. Health Check...', 'yellow');
    const health = await testAPI('Health', `${BASE_URL}/health`);
    results.push(health);
    log(`  ${health.success ? '✅' : '❌'} ${health.status}`, health.success ? 'green' : 'red');
    
    // 2. Login
    log('\n2. Login...', 'yellow');
    const login = await testAPI('Login', `${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'user3@devagram.com', senha: '2700' })
    });
    results.push(login);
    log(`  ${login.success ? '✅' : '❌'} ${login.status}`, login.success ? 'green' : 'red');
    
    if (login.success && login.data.token) {
        token = login.data.token;
        log(`  Token obtido: ${token.substring(0, 20)}...`, 'green');
    }
    
    if (!token) {
        log('\n❌ Sem token, testes autenticados cancelados', 'red');
        return results;
    }
    
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    // 3. Feed
    log('\n3. Feed...', 'yellow');
    const feed = await testAPI('Feed', `${BASE_URL}/api/feed`, { headers: authHeaders });
    results.push(feed);
    log(`  ${feed.success ? '✅' : '❌'} ${feed.status}`, feed.success ? 'green' : 'red');
    if (feed.success) {
        log(`  Publicações: ${feed.data.length || 0}`, 'green');
    }
    
    // 4. Usuário
    log('\n4. Usuário...', 'yellow');
    const user = await testAPI('Usuario', `${BASE_URL}/api/usuario`, { headers: authHeaders });
    results.push(user);
    log(`  ${user.success ? '✅' : '❌'} ${user.status}`, user.success ? 'green' : 'red');
    if (user.success && user.data.nome) {
        log(`  Nome: ${user.data.nome}`, 'green');
    }
    
    // 5. Pesquisa
    log('\n5. Pesquisa...', 'yellow');
    const search = await testAPI('Pesquisa', `${BASE_URL}/api/pesquisa?filtro=user`, { headers: authHeaders });
    results.push(search);
    log(`  ${search.success ? '✅' : '❌'} ${search.status}`, search.success ? 'green' : 'red');
    if (search.success) {
        log(`  Usuários encontrados: ${search.data.length || 0}`, 'green');
    }
    
    // 6. Like (sem ID - deve dar erro 400)
    log('\n6. Like (sem ID)...', 'yellow');
    const like = await testAPI('Like', `${BASE_URL}/api/like`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({})
    });
    results.push(like);
    log(`  ${like.status === 400 ? '✅' : '❌'} ${like.status} (erro esperado)`, like.status === 400 ? 'green' : 'red');
    
    // 7. Comentário (sem ID - deve dar erro 400)
    log('\n7. Comentário (sem ID)...', 'yellow');
    const comment = await testAPI('Comentario', `${BASE_URL}/api/comentario`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ comentario: 'teste' })
    });
    results.push(comment);
    log(`  ${comment.status === 400 ? '✅' : '❌'} ${comment.status} (erro esperado)`, comment.status === 400 ? 'green' : 'red');
    
    // 8. Seguir (sem ID - deve dar erro 400)
    log('\n8. Seguir (sem ID)...', 'yellow');
    const follow = await testAPI('Seguir', `${BASE_URL}/api/seguir`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({})
    });
    results.push(follow);
    log(`  ${follow.status === 400 ? '✅' : '❌'} ${follow.status} (erro esperado)`, follow.status === 400 ? 'green' : 'red');
    
    // Resumo
    log('\n📊 RESUMO', 'blue');
    const success = results.filter(r => r.success || r.status === 400).length;
    log(`\nTotal: ${results.length}`, 'blue');
    log(`Sucesso: ${success}`, 'green');
    log(`Falhas: ${results.length - success}`, 'red');
    
    log('\n📋 Detalhes:', 'blue');
    results.forEach(r => {
        const ok = r.success || r.status === 400;
        log(`${ok ? '✅' : '❌'} ${r.name}: ${r.status}`, ok ? 'green' : 'red');
    });
    
    return results;
}

runTests().catch(console.error);
