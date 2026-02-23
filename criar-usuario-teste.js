const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

const criarUsuarioTeste = async () => {
    try {
        const novoUsuario = {
            nome: 'Usuario Teste',
            email: 'teste@devagram.com',
            senha: '123456'
        };

        console.log('🔧 Criando usuário de teste...');
        
        const response = await axios.post(`${API_BASE}/cadastro/`, novoUsuario);
        
        if (response.status === 200) {
            console.log('✅ Usuário criado com sucesso!');
            console.log(`   Nome: ${response.data.nome}`);
            console.log(`   Email: ${response.data.email}`);
            console.log(`   ID: ${response.data._id}`);
        }
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.erro?.includes('já cadastrado')) {
            console.log('⚠️ Usuário já existe, pode usar para teste');
        } else {
            console.log('❌ Erro ao criar usuário:', error.response?.data || error.message);
        }
    }
};

criarUsuarioTeste();