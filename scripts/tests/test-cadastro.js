const http = require('http');

const data = JSON.stringify({
    nome: 'Usuario Teste',
    email: `teste${Date.now()}@teste.com`,
    senha: 'senha123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/cadastro/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🧪 Testando API de Cadastro...\n');
console.log('📤 Dados enviados:', JSON.parse(data));
console.log('');

const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    console.log('');

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('📥 Resposta:');
        try {
            const response = JSON.parse(body);
            console.log(JSON.stringify(response, null, 2));
            
            if (res.statusCode === 200) {
                console.log('\n✅ Cadastro realizado com sucesso!');
            } else {
                console.log(`\n❌ Erro no cadastro: ${response.erro || body}`);
            }
        } catch (e) {
            console.log(body);
            console.log(`\n❌ Erro ao processar resposta: ${e.message}`);
        }
    });
});

req.on('error', (error) => {
    console.error(`❌ Erro na requisição: ${error.message}`);
});

req.write(data);
req.end();
