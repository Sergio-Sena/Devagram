const axios = require('axios');
const fs = require('fs');

// Configuração
const API_BASE = 'http://localhost:3000/api';
const FRONTEND_BASE = 'http://localhost:3001';
const LOG_FILE = 'monitoring-report.json';

// Cores para logs
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

// Dados de teste
const usuarioTeste = {
    login: 'user1@devagram.com',
    senha: '2700'
};

let token = '';
let monitoringData = {
    timestamp: new Date().toISOString(),
    tests: []
};

// Função para medir tempo de resposta
const measureTime = async (testName, asyncFunction) => {
    const startTime = Date.now();
    try {
        const result = await asyncFunction();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const testResult = {
            test: testName,
            duration: `${duration}ms`,
            status: 'SUCCESS',
            timestamp: new Date().toISOString(),
            details: result
        };
        
        monitoringData.tests.push(testResult);
        
        // Análise de performance
        if (duration < 500) {
            log('green', `✅ ${testName}: ${duration}ms (EXCELENTE)`);
        } else if (duration < 1000) {
            log('yellow', `⚠️ ${testName}: ${duration}ms (BOM)`);
        } else {
            log('red', `❌ ${testName}: ${duration}ms (LENTO)`);
        }
        
        return { success: true, duration, result };
    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const testResult = {
            test: testName,
            duration: `${duration}ms`,
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            error: error.message
        };
        
        monitoringData.tests.push(testResult);
        log('red', `❌ ${testName}: ERRO após ${duration}ms - ${error.message}`);
        
        return { success: false, duration, error };
    }
};

// Testes de monitoramento
const monitorarSistema = async () => {
    console.log('\n🔍 INICIANDO MONITORAMENTO SPHERE SOCIAL\n');
    
    // 1. VELOCIDADE DE CARREGAMENTO - LOGIN
    await measureTime('Login API', async () => {
        const response = await axios.post(`${API_BASE}/login/`, usuarioTeste);
        token = response.data.token;
        return { status: response.status, responseSize: JSON.stringify(response.data).length };
    });

    // 2. VELOCIDADE DE CARREGAMENTO - FEED
    await measureTime('Feed API', async () => {
        const response = await axios.get(`${API_BASE}/feed/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { 
            status: response.status, 
            postsCount: response.data.length,
            responseSize: JSON.stringify(response.data).length 
        };
    });

    // 3. VELOCIDADE DE CARREGAMENTO - PESQUISA
    await measureTime('Pesquisa API', async () => {
        const response = await axios.get(`${API_BASE}/pesquisa/?filtro=user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { 
            status: response.status, 
            usersFound: response.data.length,
            responseSize: JSON.stringify(response.data).length 
        };
    });

    // 4. UPLOAD DE IMAGENS S3
    await measureTime('Upload S3', async () => {
        const FormData = require('form-data');
        const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
        
        const formData = new FormData();
        formData.append('descricao', `Monitor Test - ${new Date().toLocaleString()}`);
        formData.append('file', testImageBuffer, {
            filename: 'monitor-test.png',
            contentType: 'image/png'
        });
        
        const response = await axios.post(`${API_BASE}/publicacao/`, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        
        return { 
            status: response.status,
            message: response.data.msg,
            uploadSize: testImageBuffer.length 
        };
    });

    // 5. TRATAMENTO DE ERROS - Teste com dados inválidos
    await measureTime('Tratamento de Erro', async () => {
        try {
            await axios.post(`${API_BASE}/login/`, { login: 'invalid', senha: 'invalid' });
            throw new Error('Deveria ter falhado');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                return { 
                    status: error.response.status,
                    errorHandled: true,
                    errorMessage: error.response.data.erro 
                };
            }
            throw error;
        }
    });

    // 6. TESTE DE CARGA - Múltiplas requisições simultâneas
    await measureTime('Teste de Carga (5 requisições)', async () => {
        const promises = Array(5).fill().map(() => 
            axios.get(`${API_BASE}/feed/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        
        const results = await Promise.all(promises);
        return { 
            requestsCount: results.length,
            allSuccessful: results.every(r => r.status === 200),
            avgResponseSize: results.reduce((acc, r) => acc + JSON.stringify(r.data).length, 0) / results.length
        };
    });

    // Gerar relatório
    gerarRelatorio();
};

const gerarRelatorio = () => {
    // Salvar dados detalhados
    fs.writeFileSync(LOG_FILE, JSON.stringify(monitoringData, null, 2));
    
    // Análise geral
    const successTests = monitoringData.tests.filter(t => t.status === 'SUCCESS').length;
    const totalTests = monitoringData.tests.length;
    const avgDuration = monitoringData.tests
        .filter(t => t.status === 'SUCCESS')
        .reduce((acc, t) => acc + parseInt(t.duration), 0) / successTests;

    console.log('\n' + '='.repeat(60));
    log('cyan', '📊 RELATÓRIO DE MONITORAMENTO');
    console.log('='.repeat(60));
    
    log('blue', `📈 Testes executados: ${totalTests}`);
    log('green', `✅ Sucessos: ${successTests}`);
    log('red', `❌ Falhas: ${totalTests - successTests}`);
    log('yellow', `⏱️ Tempo médio: ${Math.round(avgDuration)}ms`);
    
    console.log('\n📋 ANÁLISE POR CATEGORIA:');
    
    // Velocidade de carregamento
    const loadTests = monitoringData.tests.filter(t => 
        t.test.includes('API') || t.test.includes('Feed') || t.test.includes('Login')
    );
    const avgLoadTime = loadTests.reduce((acc, t) => acc + parseInt(t.duration), 0) / loadTests.length;
    
    if (avgLoadTime < 500) {
        log('green', `🚀 Velocidade: EXCELENTE (${Math.round(avgLoadTime)}ms)`);
    } else if (avgLoadTime < 1000) {
        log('yellow', `⚡ Velocidade: BOA (${Math.round(avgLoadTime)}ms)`);
    } else {
        log('red', `🐌 Velocidade: PRECISA MELHORAR (${Math.round(avgLoadTime)}ms)`);
    }
    
    // Upload S3
    const uploadTest = monitoringData.tests.find(t => t.test.includes('Upload'));
    if (uploadTest) {
        if (uploadTest.status === 'SUCCESS') {
            log('green', `☁️ Upload S3: FUNCIONANDO (${uploadTest.duration})`);
        } else {
            log('red', `☁️ Upload S3: PROBLEMA`);
        }
    }
    
    // Tratamento de erros
    const errorTest = monitoringData.tests.find(t => t.test.includes('Erro'));
    if (errorTest && errorTest.status === 'SUCCESS') {
        log('green', `🛡️ Tratamento de Erros: FUNCIONANDO`);
    } else {
        log('red', `🛡️ Tratamento de Erros: PROBLEMA`);
    }
    
    // Teste de carga
    const loadTest = monitoringData.tests.find(t => t.test.includes('Carga'));
    if (loadTest && loadTest.status === 'SUCCESS') {
        log('green', `💪 Teste de Carga: APROVADO (${loadTest.duration})`);
    } else {
        log('red', `💪 Teste de Carga: REPROVADO`);
    }
    
    console.log('\n' + '='.repeat(60));
    log('cyan', `📄 Relatório detalhado salvo em: ${LOG_FILE}`);
    log('blue', '🔄 Execute novamente para monitoramento contínuo');
    console.log('='.repeat(60));
};

// Executar monitoramento
monitorarSistema().catch(console.error);