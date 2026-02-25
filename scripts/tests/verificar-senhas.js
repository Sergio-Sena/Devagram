#!/usr/bin/env node

/**
 * Verificar Formato das Senhas no MongoDB
 */

const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb+srv://sergio_sena:Allsena16031980@devagran.dejvpwq.mongodb.net/devagram?retryWrites=true&w=majority';

async function verificarSenhas() {
    const client = new MongoClient(MONGODB_URL);

    try {
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas\n');

        const db = client.db('devagram');
        const usuariosCollection = db.collection('usuarios');
        
        // Buscar usuário específico
        const usuario = await usuariosCollection.findOne({ email: 'user1@devagram.com' });
        
        if (usuario) {
            console.log('👤 Usuário encontrado:');
            console.log(`   Nome: ${usuario.nome}`);
            console.log(`   Email: ${usuario.email}`);
            console.log(`   Senha (hash): ${usuario.senha}`);
            console.log(`   Tamanho hash: ${usuario.senha.length} caracteres`);
            console.log(`   Formato: ${usuario.senha.startsWith('$2b$') ? 'bcrypt' : 'outro'}`);
            
            // Verificar se é bcrypt
            if (usuario.senha.startsWith('$2b$') || usuario.senha.startsWith('$2a$')) {
                console.log('   ✅ Formato bcrypt - compatível com Python');
            } else {
                console.log('   ⚠️  Formato não-bcrypt - pode ser incompatível');
                console.log('   💡 Possível solução: recriar usuário ou adaptar validação');
            }
        } else {
            console.log('❌ Usuário user1@devagram.com não encontrado');
        }

        // Verificar outros usuários também
        console.log('\n📊 Verificando formato de senhas de todos os usuários:');
        const usuarios = await usuariosCollection.find({}).toArray();
        
        usuarios.forEach((u, index) => {
            const isBcrypt = u.senha.startsWith('$2b$') || u.senha.startsWith('$2a$');
            console.log(`${index + 1}. ${u.email} - ${isBcrypt ? '✅ bcrypt' : '❌ outro formato'}`);
        });

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
        console.log('\n✅ Conexão fechada');
    }
}

verificarSenhas().catch(console.error);