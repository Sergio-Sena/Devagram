#!/usr/bin/env node

/**
 * Criar Usuário de Teste com Bcrypt
 */

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URL = 'mongodb+srv://sergio_sena:Allsena16031980@devagran.dejvpwq.mongodb.net/devagram?retryWrites=true&w=majority';

async function criarUsuarioTeste() {
    const client = new MongoClient(MONGODB_URL);

    try {
        await client.connect();
        console.log('✅ Conectado ao MongoDB Atlas\n');

        const db = client.db('devagram');
        const usuariosCollection = db.collection('usuarios');
        
        // Gerar senha bcrypt
        const senhaTexto = '123456';
        const senhaBcrypt = await bcrypt.hash(senhaTexto, 10);
        
        console.log('🔐 Gerando senha bcrypt:');
        console.log(`   Senha texto: ${senhaTexto}`);
        console.log(`   Senha bcrypt: ${senhaBcrypt}`);
        
        // Criar usuário de teste
        const usuarioTeste = {
            _id: new ObjectId(),
            nome: 'Python Test User',
            email: 'python@test.com',
            senha: senhaBcrypt,
            avatar: 'https://via.placeholder.com/150',
            seguidores: [],
            seguindo: [],
            publicacoes: []
        };
        
        // Verificar se já existe
        const existente = await usuariosCollection.findOne({ email: usuarioTeste.email });
        if (existente) {
            console.log('⚠️  Usuário já existe, removendo...');
            await usuariosCollection.deleteOne({ email: usuarioTeste.email });
        }
        
        // Inserir usuário
        await usuariosCollection.insertOne(usuarioTeste);
        
        console.log('\n✅ Usuário de teste criado com sucesso!');
        console.log('\n🔑 Credenciais para teste:');
        console.log(`   Email: ${usuarioTeste.email}`);
        console.log(`   Senha: ${senhaTexto}`);
        console.log(`   ID: ${usuarioTeste._id}`);

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.close();
        console.log('\n✅ Conexão fechada');
    }
}

criarUsuarioTeste().catch(console.error);