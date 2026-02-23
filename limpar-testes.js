const { MongoClient } = require('mongodb');

const DB_URL = 'mongodb+srv://sergio_sena:Allsena16031980@devagran.dejvpwq.mongodb.net/devagram?retryWrites=true&w=majority';

async function limparPublicacoesTeste() {
    const client = new MongoClient(DB_URL);
    
    try {
        await client.connect();
        console.log('🔗 Conectado ao MongoDB');
        
        const db = client.db('devagram');
        const publicacoes = db.collection('publicacoes');
        
        // Buscar publicações de teste
        const testePosts = await publicacoes.find({
            $or: [
                { descricao: { $regex: /teste automatizado/i } },
                { descricao: { $regex: /monitor test/i } },
                { descricao: { $regex: /teste/i } },
                { foto: { $regex: /placeholder/i } }
            ]
        }).toArray();
        
        console.log(`📊 Encontradas ${testePosts.length} publicações de teste`);
        
        if (testePosts.length > 0) {
            // Mostrar publicações que serão removidas
            testePosts.forEach((post, index) => {
                console.log(`${index + 1}. "${post.descricao}" - ${post.data}`);
            });
            
            // Remover publicações de teste
            const resultado = await publicacoes.deleteMany({
                $or: [
                    { descricao: { $regex: /teste automatizado/i } },
                    { descricao: { $regex: /monitor test/i } },
                    { descricao: { $regex: /teste/i } },
                    { foto: { $regex: /placeholder/i } }
                ]
            });
            
            console.log(`🗑️ Removidas ${resultado.deletedCount} publicações de teste`);
        } else {
            console.log('✅ Nenhuma publicação de teste encontrada');
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await client.close();
        console.log('🔌 Conexão fechada');
    }
}

limparPublicacoesTeste();