import asyncio
import logging
from app.services.db_service import verificar_conexao, criar_indices
from dotenv import load_dotenv

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carrega variáveis de ambiente
load_dotenv()

async def main():
    logger.info("Verificando conexão com o banco de dados...")
    conexao_ok = await verificar_conexao()
    
    if conexao_ok:
        logger.info("Conexão com o banco de dados estabelecida com sucesso!")
        
        logger.info("Criando índices nas coleções...")
        indices_ok = await criar_indices()
        
        if indices_ok:
            logger.info("Índices criados com sucesso!")
        else:
            logger.error("Falha ao criar índices!")
    else:
        logger.error("Falha ao conectar ao banco de dados!")

if __name__ == "__main__":
    asyncio.run(main())