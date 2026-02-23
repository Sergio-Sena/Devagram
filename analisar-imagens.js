const { MongoClient } = require('mongodb');
const axios = require('axios');

const DB_URL = 'mongodb+srv://sergio_sena:Allsena16031980@devagran.dejvpwq.mongodb.net/devagram?retryWrites=true&w=majority';

async function analisarImagensPublicacoes() {
    const client = new MongoClient(DB_URL);
    
    try {
        await client.connect();
        console.log('🔗 Conectado ao MongoDB');
        
        const db = client.db('devagram');
        const publicacoes = db.collection('publicacoes');
        
        // Buscar todas as publicações com imagens
        const posts = await publicacoes.find({
            foto: { $exists: true, $ne: null }
        }).limit(10).toArray();
        
        console.log(`📊 Analisando ${posts.length} publicações com imagens:\n`);
        
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            console.log(`${i + 1}. "${post.descricao?.substring(0, 50)}..."`);
            console.log(`   📷 URL: ${post.foto}`);
            
            try {
                // Verificar se a URL da imagem é acessível
                const response = await axios.head(post.foto, { timeout: 5000 });
                console.log(`   ✅ Status: ${response.status} - ${response.headers['content-type']}`);
                
                // Verificar se é uma imagem com fundo transparente ou branco
                if (post.foto.includes('placeholder')) {
                    console.log(`   🎨 TIPO: Placeholder (fundo artificial)`);
                } else if (post.foto.includes('s3.amazonaws.com')) {
                    console.log(`   🎨 TIPO: Imagem real do S3`);
                } else {
                    console.log(`   🎨 TIPO: Imagem externa`);
                }
                
            } catch (error) {
                console.log(`   ❌ Erro ao acessar: ${error.message}`);
            }
            
            console.log(`   📅 Data: ${post.data}`);
            console.log('   ' + '─'.repeat(60));
        }
        
        // Estatísticas
        const totalPosts = await publicacoes.countDocuments();
        const postsComImagem = await publicacoes.countDocuments({ foto: { $exists: true, $ne: null } });
        const placeholders = await publicacoes.countDocuments({ foto: { $regex: /placeholder/i } });
        const s3Images = await publicacoes.countDocuments({ foto: { $regex: /s3\.amazonaws\.com/i } });
        
        console.log('\n📈 ESTATÍSTICAS:');
        console.log(`   📝 Total de publicações: ${totalPosts}`);
        console.log(`   📷 Com imagens: ${postsComImagem}`);
        console.log(`   🎨 Placeholders: ${placeholders}`);
        console.log(`   ☁️ Imagens S3: ${s3Images}`);
        console.log(`   🌐 Outras: ${postsComImagem - placeholders - s3Images}`);
        
        console.log('\n🔍 ANÁLISE DO FUNDO BRANCO:');
        if (placeholders > 0) {
            console.log(`   ⚠️ ${placeholders} imagens placeholder podem ter fundo branco artificial`);
        }
        if (s3Images > 0) {
            console.log(`   ✅ ${s3Images} imagens reais do S3 - fundo depende da imagem original`);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await client.close();
        console.log('\n🔌 Conexão fechada');
    }
}

analisarImagensPublicacoes();