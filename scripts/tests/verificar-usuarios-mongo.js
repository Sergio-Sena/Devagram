#!/usr/bin/env node

/**
 * Verificar Usuários no MongoDB
 * Usa a mesma conexão do backend Python
 */

const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb+srv://sergio_sena:Allsena16031980@devagran.dejvpwq.mongodb.net/devagram?retryWrites=true&w=majority';

async function verificarUsuarios() {
    const client = new MongoClient(MONGODB_URL);

    try {
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas\n');

        const db = client.db('devagram');
        const usuariosCollection = db.collection('usuarios');
        
        // Listar todos os usuários
        const usuarios = await usuariosCollection.find({}).toArray();
        
        console.log(`📊 Encontrados ${usuarios.length} usuários no banco:\n`);
        
        usuarios.forEach((usuario, index) => {
            console.log(`${index + 1}. ${usuario.nome}`);
            console.log(`   Email: ${usuario.email}`);
            console.log(`   ID: ${usuario._id}`);
            console.log(`   Avatar: ${usuario.avatar ? 'Sim' : 'Não'}`);
            console.log('');
        });

        // Mostrar primeiro usuário para teste
        if (usuarios.length > 0) {
            const primeiroUsuario = usuarios[0];
            console.log('🔑 Para testar login, use:');
            console.log(`   Email: ${primeiroUsuario.email}`);
            console.log(`   Senha: [verificar no banco ou usar senha padrão]`);
        }

    } catch (error) {
        console.error('❌ Erro ao verificar usuários:', error.message);
    } finally {
        await client.close();
        console.log('\n✅ Conexão fechada');
    }
}

verificarUsuarios().catch(console.error);