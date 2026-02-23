const mongoose = require('mongoose');

console.log('🔍 Testando Conexão MongoDB...\n');

const DB_CONEXAO_STRING = 'mongodb+srv://sergio_sena:Allsena16031980@devagran.dejvpwq.mongodb.net/devagram?retryWrites=true&w=majority';

if (!DB_CONEXAO_STRING) {
    console.log('❌ Variável DB_CONEXAO_STRING não encontrada no .env');
    process.exit(1);
}

console.log('📋 String de conexão encontrada');
console.log('🔗 Conectando ao MongoDB...\n');

mongoose.connection.on('connected', () => {
    console.log('✅ Banco de dados conectado com sucesso!');
    console.log('📊 Estado da conexão:', mongoose.connection.readyState);
    console.log('🗄️  Database:', mongoose.connection.db.databaseName);
    
    // Listar coleções
    mongoose.connection.db.listCollections().toArray((err, collections) => {
        if (err) {
            console.log('❌ Erro ao listar coleções:', err.message);
        } else {
            console.log('\n📚 Coleções disponíveis:');
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        }
        
        mongoose.connection.close();
        console.log('\n✅ Teste concluído!');
    });
});

mongoose.connection.on('error', (error) => {
    console.log('❌ Erro ao conectar ao banco de dados:', error.message);
    process.exit(1);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Desconectado do banco de dados');
});

// Tentar conectar
mongoose.connect(DB_CONEXAO_STRING)
    .then(() => {
        console.log('🎯 Conexão iniciada...');
    })
    .catch((error) => {
        console.log('❌ Falha na conexão:', error.message);
        process.exit(1);
    });
