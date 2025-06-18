const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const BACKEND_URL = 'http://localhost:3000/api';
const FRONTEND_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, 'endpoint-tests');
const TEST_USER = {
  email: 'user1@devagram.com',
  password: '2700'
};

// Criar diretório de saída se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Função para salvar resposta em arquivo
const saveResponse = (filename, data) => {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Resposta salva em ${filePath}`);
};

// Função para testar um endpoint
const testEndpoint = async (name, method, url, headers = {}, data = null) => {
  console.log(`\n> Testando endpoint: ${name}`);
  console.log(`  ${method} ${url}`);
  
  try {
    const config = {
      method,
      url,
      headers,
      validateStatus: () => true // Não rejeitar em caso de erro HTTP
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    const filename = `${name.toLowerCase().replace(/\s+/g, '_')}.json`;
    saveResponse(filename, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`  Resultado: OK (${response.status})`);
    } else {
      console.log(`  Resultado: ERRO (${response.status})`);
    }
    
    return response;
  } catch (error) {
    console.error(`  Erro ao testar endpoint: ${error.message}`);
    return null;
  }
};

// Função principal para executar todos os testes
const runTests = async () => {
  console.log('===== Testando endpoints do Devagram =====');
  let token = null;
  
  // 1. Testar login e obter token
  console.log('\n=== Testando autenticação ===');
  const loginResponse = await testEndpoint(
    'Login',
    'POST',
    `${BACKEND_URL}/login`,
    { 'Content-Type': 'application/json' },
    { login: TEST_USER.email, senha: TEST_USER.password }
  );
  
  if (loginResponse && loginResponse.data && loginResponse.data.token) {
    token = loginResponse.data.token;
    console.log('  Token obtido com sucesso');
  } else {
    console.log('  Falha ao obter token');
  }
  
  // 2. Testar endpoints públicos
  console.log('\n=== Testando endpoints públicos ===');
  
  await testEndpoint(
    'Frontend Home',
    'GET',
    FRONTEND_URL
  );
  
  await testEndpoint(
    'Frontend Reset',
    'GET',
    `${FRONTEND_URL}/reset.html`
  );
  
  // 3. Testar endpoints autenticados
  if (token) {
    console.log('\n=== Testando endpoints autenticados ===');
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    
    // Feed
    await testEndpoint(
      'Feed',
      'GET',
      `${BACKEND_URL}/feed`,
      authHeaders
    );
    
    // Pesquisa
    await testEndpoint(
      'Pesquisa',
      'GET',
      `${BACKEND_URL}/pesquisa?filtro=user`,
      authHeaders
    );
    
    // Usuário
    await testEndpoint(
      'Usuario',
      'GET',
      `${BACKEND_URL}/usuario`,
      authHeaders
    );
    
    // Seguidor
    await testEndpoint(
      'Seguidor',
      'GET',
      `${BACKEND_URL}/seguidor`,
      authHeaders
    );
    
    // Comentário (apenas verificação)
    await testEndpoint(
      'Comentario Options',
      'OPTIONS',
      `${BACKEND_URL}/comentario`,
      authHeaders
    );
    
    // Like (apenas verificação)
    await testEndpoint(
      'Like Options',
      'OPTIONS',
      `${BACKEND_URL}/like`,
      authHeaders
    );
    
    // Publicação (apenas verificação)
    await testEndpoint(
      'Publicacao Options',
      'OPTIONS',
      `${BACKEND_URL}/publicacao`,
      authHeaders
    );
  }
  
  console.log('\n=== Testes concluídos ===');
  console.log(`Resultados salvos na pasta: ${OUTPUT_DIR}`);
};

// Executar testes
runTests().catch(error => {
  console.error('Erro ao executar testes:', error);
});