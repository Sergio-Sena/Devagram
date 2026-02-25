const fs = require('fs');

// Configurações
const BASE_URL = 'http://localhost:3000/api';

// Função para testar cadastro com curl
async function testCadastroComCurl() {
    console.log('\n=== TESTANDO CADASTRO COM CURL ===');
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const userData = {
        nome: 'Teste Curl',
        email: `teste-curl-${Date.now()}@test.com`,
        senha: '123456'
    };
    
    const curlCommand = `curl -X POST ${BASE_URL}/cadastro -H "Content-Type: application/json" -d "${JSON.stringify(userData).replace(/"/g, '\\"')}"`;
    
    try {
        const { stdout, stderr } = await execPromise(curlCommand);
        console.log('Resposta do cadastro:', stdout);
        if (stderr) console.log('Erro:', stderr);
    } catch (error) {
        console.log('Erro no curl:', error.message);
    }
}

// Função para testar publicação com arquivo
async function testPublicacaoComArquivo() {
    console.log('\n=== TESTANDO PUBLICAÇÃO COM ARQUIVO ===');
    
    // Criar um arquivo de teste simples
    const testFilePath = 'test-image.txt';
    fs.writeFileSync(testFilePath, 'Conteúdo de teste para simular uma imagem');
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Primeiro fazer login para obter token
    const loginCommand = `curl -X POST ${BASE_URL}/login -H "Content-Type: application/json" -d "{\\"login\\":\\"user3@devagram.com\\",\\"senha\\":\\"2700\\"}"`;
    
    try {
        const { stdout: loginResponse } = await execPromise(loginCommand);
        const loginData = JSON.parse(loginResponse);
        
        if (loginData.token) {
            console.log('Login OK, testando publicação...');
            
            const publicacaoCommand = `curl -X POST ${BASE_URL}/publicacao -H "Authorization: Bearer ${loginData.token}" -F "file=@${testFilePath}" -F "descricao=Teste de publicação via curl"`;
            
            const { stdout: pubResponse } = await execPromise(publicacaoCommand);
            console.log('Resposta da publicação:', pubResponse);
        }
    } catch (error) {
        console.log('Erro:', error.message);
    } finally {
        // Limpar arquivo de teste
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

// Função para testar endpoints com IDs válidos
async function testEndpointsComIDs() {
    console.log('\n=== TESTANDO ENDPOINTS COM IDs VÁLIDOS ===');
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Login
    const loginCommand = `curl -X POST ${BASE_URL}/login -H "Content-Type: application/json" -d "{\\"login\\":\\"user3@devagram.com\\",\\"senha\\":\\"2700\\"}"`;
    
    try {
        const { stdout: loginResponse } = await execPromise(loginCommand);
        const loginData = JSON.parse(loginResponse);
        
        if (loginData.token) {
            const token = loginData.token;
            
            // Buscar feed para obter IDs de publicações
            const feedCommand = `curl -H "Authorization: Bearer ${token}" ${BASE_URL}/feed`;
            const { stdout: feedResponse } = await execPromise(feedCommand);
            const feedData = JSON.parse(feedResponse);
            
            if (feedData.length > 0) {
                const publicacaoId = feedData[0]._id;
                const usuarioId = feedData[0].idUsuario;
                
                console.log(`Usando publicação ID: ${publicacaoId}`);
                console.log(`Usando usuário ID: ${usuarioId}`);
                
                // Teste Like
                console.log('\\nTestando LIKE...');
                const likeCommand = `curl -X PUT "${BASE_URL}/like?id=${publicacaoId}" -H "Authorization: Bearer ${token}"`;
                const { stdout: likeResponse } = await execPromise(likeCommand);
                console.log('Like:', likeResponse);
                
                // Teste Comentário
                console.log('\\nTestando COMENTÁRIO...');
                const comentarioCommand = `curl -X PUT "${BASE_URL}/comentario?id=${publicacaoId}" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "{\\"comentario\\":\\"Teste de comentário\\"}"`;
                const { stdout: comentarioResponse } = await execPromise(comentarioCommand);
                console.log('Comentário:', comentarioResponse);
                
                // Teste Seguir (usando outro usuário)
                if (feedData.length > 1) {
                    const outroUsuarioId = feedData.find(p => p.idUsuario !== loginData._id)?.idUsuario;
                    if (outroUsuarioId) {
                        console.log('\\nTestando SEGUIR...');
                        const seguirCommand = `curl -X PUT "${BASE_URL}/seguir?id=${outroUsuarioId}" -H "Authorization: Bearer ${token}"`;
                        const { stdout: seguirResponse } = await execPromise(seguirCommand);
                        console.log('Seguir:', seguirResponse);
                    }
                }
            }
        }
    } catch (error) {
        console.log('Erro:', error.message);
    }
}

// Executar todos os testes
async function runAllTests() {
    await testCadastroComCurl();
    await testPublicacaoComArquivo();
    await testEndpointsComIDs();
}

runAllTests().catch(console.error);