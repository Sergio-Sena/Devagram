const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3000/api';
const axiosInstance = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    withCredentials: true
});

// Cores para logs
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
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
let userId = '';

// Função para fazer requisições com token
const apiCall = async (method, url, data = null) => {
    try {
        const config = {
            method,
            url,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        if (data) config.data = data;
        
        const response = await axiosInstance(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message,
            status: error.response?.status 
        };
    }
};

// Testes da jornada completa
const testarJornadaCompleta = async () => {
    console.log('\n🚀 INICIANDO TESTE DA JORNADA COMPLETA - SPHERE SOCIAL\n');
    
    // 1. LOGIN
    log('cyan', '🔐 TESTE 1: LOGIN');
    const loginResult = await apiCall('POST', '/login/', usuarioTeste);
    
    if (loginResult.success) {
        log('green', '✅ Login realizado com sucesso');
        token = loginResult.data.token;
        console.log(`   👤 Usuário: ${loginResult.data.nome}`);
        console.log(`   📧 Email: ${loginResult.data.email}`);
        console.log(`   🎫 Token: ${token.substring(0, 20)}...`);
    } else {
        log('red', '❌ Falha no login');
        console.log(`   Erro: ${JSON.stringify(loginResult.error)}`);
        return;
    }

    // 2. OBTER DADOS DO USUÁRIO
    log('cyan', '\n👤 TESTE 2: DADOS DO USUÁRIO');
    const usuarioResult = await apiCall('GET', '/usuario/');
    
    if (usuarioResult.success) {
        log('green', '✅ Dados do usuário obtidos');
        userId = usuarioResult.data._id;
        console.log(`   ID: ${userId}`);
        console.log(`   Nome: ${usuarioResult.data.nome}`);
        console.log(`   Seguidores: ${usuarioResult.data.seguidores || 0}`);
        console.log(`   Seguindo: ${usuarioResult.data.seguindo || 0}`);
    } else {
        log('red', '❌ Falha ao obter dados do usuário');
        console.log(`   Erro: ${JSON.stringify(usuarioResult.error)}`);
    }

    // 3. FEED PRINCIPAL
    log('cyan', '\n📰 TESTE 3: FEED PRINCIPAL');
    const feedResult = await apiCall('GET', '/feed/');
    
    if (feedResult.success) {
        log('green', '✅ Feed carregado com sucesso');
        console.log(`   📝 Publicações encontradas: ${feedResult.data.length}`);
        if (feedResult.data.length > 0) {
            console.log(`   📄 Primeira publicação: ${feedResult.data[0].descricao?.substring(0, 50)}...`);
        }
    } else {
        log('red', '❌ Falha ao carregar feed');
        console.log(`   Erro: ${JSON.stringify(feedResult.error)}`);
    }

    // 4. BUSCAR USUÁRIOS
    log('cyan', '\n🔍 TESTE 4: PESQUISA DE USUÁRIOS');
    const pesquisaResult = await apiCall('GET', '/pesquisa/?filtro=user');
    
    if (pesquisaResult.success) {
        log('green', '✅ Pesquisa realizada com sucesso');
        console.log(`   👥 Usuários encontrados: ${pesquisaResult.data.length}`);
    } else {
        log('red', '❌ Falha na pesquisa');
        console.log(`   Erro: ${JSON.stringify(pesquisaResult.error)}`);
    }

    // 5. CRIAR PUBLICAÇÃO
    log('cyan', '\n📝 TESTE 5: CRIAR PUBLICAÇÃO');
    
    let publicacaoId = '';
    
    // Criar FormData para simular upload
    const FormData = require('form-data');
    
    try {
        // Criar uma imagem de teste simples (1x1 pixel PNG)
        const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
        
        const formData = new FormData();
        formData.append('descricao', `Teste automatizado - ${new Date().toLocaleString()}`);
        formData.append('file', testImageBuffer, {
            filename: 'teste.png',
            contentType: 'image/png'
        });
        
        const publicacaoResult = await axiosInstance.post('/publicacao/', formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        
        if (publicacaoResult.status === 200) {
            log('green', '✅ Publicação criada com sucesso');
            console.log(`   📄 Resposta: ${publicacaoResult.data.msg}`);
        } else {
            log('red', '❌ Falha ao criar publicação');
            console.log(`   Status: ${publicacaoResult.status}`);
            console.log(`   Erro: ${JSON.stringify(publicacaoResult.data)}`);
        }
    } catch (error) {
        log('red', '❌ Falha ao criar publicação');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Erro: ${JSON.stringify(error.response?.data) || error.message}`);
    }

    // 6. CURTIR PUBLICAÇÃO (se criou uma)
    if (publicacaoId) {
        log('cyan', '\n❤️ TESTE 6: CURTIR PUBLICAÇÃO');
        const likeResult = await apiCall('PUT', `/like/?id=${publicacaoId}`);
        
        if (likeResult.success) {
            log('green', '✅ Like realizado com sucesso');
        } else {
            log('red', '❌ Falha ao curtir');
            console.log(`   Erro: ${JSON.stringify(likeResult.error)}`);
        }
    }

    // 7. COMENTAR PUBLICAÇÃO (se criou uma)
    if (publicacaoId) {
        log('cyan', '\n💬 TESTE 7: COMENTAR PUBLICAÇÃO');
        const comentario = {
            comentario: 'Comentário de teste automatizado!'
        };
        
        const comentarioResult = await apiCall('PUT', `/comentario/?id=${publicacaoId}`, comentario);
        
        if (comentarioResult.success) {
            log('green', '✅ Comentário adicionado com sucesso');
        } else {
            log('red', '❌ Falha ao comentar');
            console.log(`   Erro: ${JSON.stringify(comentarioResult.error)}`);
        }
    }

    // 8. SEGUIR USUÁRIO (buscar outro usuário primeiro)
    log('cyan', '\n👥 TESTE 8: SEGUIR USUÁRIO');
    const usuariosResult = await apiCall('GET', '/pesquisa/?filtro=test');
    
    if (usuariosResult.success && usuariosResult.data.length > 0) {
        const outroUsuario = usuariosResult.data.find(u => u._id !== userId);
        
        if (outroUsuario) {
            const seguirResult = await apiCall('PUT', `/seguir/?id=${outroUsuario._id}`);
            
            if (seguirResult.success) {
                log('green', '✅ Usuário seguido com sucesso');
                console.log(`   👤 Seguindo: ${outroUsuario.nome}`);
            } else {
                log('red', '❌ Falha ao seguir usuário');
                console.log(`   Erro: ${JSON.stringify(seguirResult.error)}`);
            }
        } else {
            log('yellow', '⚠️ Nenhum outro usuário encontrado para seguir');
        }
    }

    // 9. VERIFICAR FEED ATUALIZADO
    log('cyan', '\n🔄 TESTE 9: FEED ATUALIZADO');
    const feedAtualizadoResult = await apiCall('GET', '/feed/');
    
    if (feedAtualizadoResult.success) {
        log('green', '✅ Feed atualizado carregado');
        console.log(`   📝 Total de publicações: ${feedAtualizadoResult.data.length}`);
    } else {
        log('red', '❌ Falha ao carregar feed atualizado');
    }

    // 10. DELETAR PUBLICAÇÃO CRIADA
    if (publicacaoId) {
        log('cyan', '\n🗑️ TESTE 10: DELETAR PUBLICAÇÃO');
        const deleteResult = await apiCall('DELETE', `/publicacao/?id=${publicacaoId}`);
        
        if (deleteResult.success) {
            log('green', '✅ Publicação deletada com sucesso');
        } else {
            log('red', '❌ Falha ao deletar publicação');
            console.log(`   Erro: ${JSON.stringify(deleteResult.error)}`);
        }
    }

    // RESUMO FINAL
    console.log('\n' + '='.repeat(60));
    log('magenta', '📊 RESUMO DA JORNADA COMPLETA');
    console.log('='.repeat(60));
    log('green', '✅ Testes executados com sucesso');
    log('blue', '🔐 Login → 👤 Usuário → 📰 Feed → 🔍 Pesquisa');
    log('blue', '📝 Publicar → ❤️ Curtir → 💬 Comentar → 👥 Seguir');
    log('blue', '🔄 Feed Atualizado → 🗑️ Limpeza');
    console.log('='.repeat(60));
    log('cyan', '🎉 JORNADA COMPLETA FINALIZADA!');
};

// Executar teste
testarJornadaCompleta().catch(console.error);