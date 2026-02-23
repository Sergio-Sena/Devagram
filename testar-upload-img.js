const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuração
const API_BASE = 'http://localhost:3000/api';
const IMAGEM_PATH = 'C:\\Users\\dell 5557\\Pictures\\Outros-20251219T174207Z-3-001\\Outros\\IMG_0165';

// Credenciais
const usuario = {
    login: 'user1@devagram.com',
    senha: '2700'
};

async function testarUploadImagem() {
    try {
        console.log('🔐 Fazendo login...');
        
        // 1. Login
        const loginResponse = await axios.post(`${API_BASE}/login/`, usuario);
        const token = loginResponse.data.token;
        console.log('✅ Login realizado com sucesso');
        
        // 2. Verificar se arquivo existe
        if (!fs.existsSync(IMAGEM_PATH)) {
            console.log('❌ Arquivo não encontrado:', IMAGEM_PATH);
            console.log('📁 Verifique se o caminho está correto');
            return;
        }
        
        console.log('📁 Arquivo encontrado:', IMAGEM_PATH);
        const stats = fs.statSync(IMAGEM_PATH);
        console.log('📊 Tamanho:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
        
        // 3. Preparar FormData
        const formData = new FormData();
        formData.append('descricao', 'Teste de upload - IMG_0165');
        formData.append('file', fs.createReadStream(IMAGEM_PATH));
        
        console.log('📤 Fazendo upload...');
        
        // 4. Upload
        const uploadResponse = await axios.post(`${API_BASE}/publicacao/`, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            },
            timeout: 30000 // 30 segundos
        });
        
        if (uploadResponse.status === 200) {
            console.log('🎉 Upload realizado com sucesso!');
            console.log('📝 Resposta:', uploadResponse.data.msg);
            console.log('🌐 Acesse http://localhost:3001 para ver a publicação');
        }
        
    } catch (error) {
        console.error('❌ Erro no upload:');
        if (error.code === 'ENOENT') {
            console.log('📁 Arquivo não encontrado. Verifique o caminho:');
            console.log('   ', IMAGEM_PATH);
        } else if (error.response) {
            console.log('🔍 Status:', error.response.status);
            console.log('📝 Erro:', error.response.data);
        } else {
            console.log('🔍 Erro:', error.message);
        }
    }
}

console.log('🚀 TESTE DE UPLOAD - IMG_0165');
console.log('📁 Caminho:', IMAGEM_PATH);
console.log('');

testarUploadImagem();