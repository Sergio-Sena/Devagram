const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Cores para output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    reset: '\x1b[0m'
};

// Função para fazer requisições HTTP
function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, data: response, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body, headers: res.headers });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Testes das APIs
const tests = [
    {
        name: 'GET /api/usuario (sem token)',
        method: 'GET',
        path: '/api/usuario',
        expectedStatus: [400, 401],
        description: 'Deve retornar erro sem autenticação'
    },
    {
        name: 'POST /api/login (credenciais inválidas)',
        method: 'POST',
        path: '/api/login',
        data: { login: 'teste@invalido.com', senha: 'senhaerrada' },
        expectedStatus: [400, 401, 405],
        description: 'Deve retornar erro com credenciais inválidas'
    },
    {
        name: 'POST /api/cadastro (sem dados)',
        method: 'POST',
        path: '/api/cadastro',
        data: {},
        expectedStatus: [400, 500],
        description: 'Deve retornar erro sem dados obrigatórios'
    },
    {
        name: 'GET /api/feed (sem token)',
        method: 'GET',
        path: '/api/feed',
        expectedStatus: [400, 401],
        description: 'Deve retornar erro sem autenticação'
    },
    {
        name: 'GET /api/pesquisa (sem token)',
        method: 'GET',
        path: '/api/pesquisa',
        expectedStatus: [400, 401],
        description: 'Deve retornar erro sem autenticação'
    }
];

async function runTests() {
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}🧪 TESTE DE APIs DO BACKEND${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}\n`);

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            console.log(`${colors.yellow}Testando: ${test.name}${colors.reset}`);
            console.log(`  Método: ${test.method} ${test.path}`);
            
            const result = await makeRequest(test.method, test.path, test.data, test.token);
            
            const isExpected = test.expectedStatus.includes(result.status);
            
            if (isExpected) {
                console.log(`  ${colors.green}✓ PASSOU${colors.reset} - Status: ${result.status}`);
                console.log(`  ${colors.green}${test.description}${colors.reset}`);
                passed++;
            } else {
                console.log(`  ${colors.red}✗ FALHOU${colors.reset} - Status: ${result.status} (esperado: ${test.expectedStatus.join(' ou ')})`);
                console.log(`  Resposta:`, result.data);
                failed++;
            }
        } catch (error) {
            console.log(`  ${colors.red}✗ ERRO${colors.reset} - ${error.message}`);
            failed++;
        }
        console.log('');
    }

    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}📊 RESUMO DOS TESTES${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.green}✓ Passou: ${passed}${colors.reset}`);
    console.log(`${colors.red}✗ Falhou: ${failed}${colors.reset}`);
    console.log(`Total: ${passed + failed}`);
    console.log('');

    // Lista de todas as rotas disponíveis
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log(`${colors.blue}📋 ROTAS DISPONÍVEIS${colors.reset}`);
    console.log(`${colors.blue}========================================${colors.reset}`);
    console.log('POST   /api/cadastro       - Cadastrar novo usuário');
    console.log('POST   /api/login          - Fazer login');
    console.log('GET    /api/usuario        - Obter dados do usuário logado');
    console.log('PUT    /api/usuario        - Atualizar dados do usuário');
    console.log('GET    /api/feed           - Obter feed de publicações');
    console.log('POST   /api/publicacao     - Criar nova publicação');
    console.log('POST   /api/like           - Curtir/descurtir publicação');
    console.log('POST   /api/comentario     - Comentar em publicação');
    console.log('GET    /api/pesquisa       - Pesquisar usuários');
    console.log('PUT    /api/seguir         - Seguir/deixar de seguir usuário');
    console.log('DELETE /api/excluirPublicacao - Excluir publicação');
    console.log('');
}

// Verificar se o servidor está rodando
console.log(`${colors.yellow}Verificando se o servidor está rodando em ${BASE_URL}...${colors.reset}\n`);

makeRequest('GET', '/api/usuario')
    .then(() => {
        console.log(`${colors.green}✓ Servidor está respondendo!${colors.reset}\n`);
        runTests();
    })
    .catch((error) => {
        console.log(`${colors.red}✗ Erro: Servidor não está respondendo em ${BASE_URL}${colors.reset}`);
        console.log(`${colors.red}Certifique-se de que o backend está rodando com: npm run dev${colors.reset}`);
        console.log(`${colors.red}Erro: ${error.message}${colors.reset}`);
    });
