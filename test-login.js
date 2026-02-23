const http = require('http');

const data = JSON.stringify({
    login: 'teste@teste.com',
    senha: '1234'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🧪 Testando API de Login...\n');
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
        console.log('Raw:', body);
        try {
            const response = JSON.parse(body);
            console.log(JSON.stringify(response, null, 2));
            
            if (res.statusCode === 200) {
                console.log('\n✅ Login realizado com sucesso!');
                if (response.token) {
                    console.log('🔑 Token JWT recebido');
                }
            } else {
                console.log(`\n❌ Erro no login: ${response.erro || body}`);
            }
        } catch (e) {
            console.log('Erro ao parsear JSON:', e.message);
        }
    });
});

req.on('error', (error) => {
    console.error(`❌ Erro na requisição: ${error.message}`);
});

req.write(data);
req.end();
