const http = require('http');
const fs = require('fs');
const path = require('path');

// Gerar boundary único
const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

// Criar dados do formulário
const email = `teste${Date.now()}@teste.com`;
const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="nome"',
    '',
    'Usuario Teste API',
    `--${boundary}`,
    'Content-Disposition: form-data; name="email"',
    '',
    email,
    `--${boundary}`,
    'Content-Disposition: form-data; name="senha"',
    '',
    'senha123',
    `--${boundary}--`,
    ''
].join('\r\n');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/cadastro/',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData)
    }
};

console.log('🧪 Testando API de Cadastro (multipart/form-data)...\n');
console.log('📤 Dados enviados:');
console.log('  Nome: Usuario Teste API');
console.log('  Email:', email);
console.log('  Senha: senha123');
console.log('');

const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
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
            if (res.statusCode === 308) {
                console.log('\n⚠️  Redirect detectado. Tentando novamente com barra final...');
            }
        }
    });
});

req.on('error', (error) => {
    console.error(`❌ Erro na requisição: ${error.message}`);
});

req.write(formData);
req.end();
