import asyncio
import logging
import json

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def criar_usuario_teste():
    # Tenta importar o serviço de banco de dados real
    try:
        from app.services.db_service import conectar_db, hash_senha, usuarios
        logger.info("Usando serviço de banco de dados real")
    except ImportError:
        # Se falhar, usa o serviço simulado
        from app.services.mock_db_service import conectar_db, hash_senha, usuarios
        logger.info("Usando serviço de banco de dados simulado")
    
    # Conectar ao banco de dados
    conexao_ok = await conectar_db()
    if not conexao_ok:
        logger.error("Falha ao conectar ao banco de dados")
        return False
    
    # Dados do usuário de teste
    usuario_teste = {
        "nome": "Usuário Teste",
        "email": "teste@example.com",
        "senha": hash_senha("senha123"),
        "avatar": None,
        "seguidores": 0,
        "seguindo": 0,
        "publicacoes": 0,
        "seguidores_lista": [],
        "seguindo_lista": []
    }
    
    try:
        # Verificar se o usuário já existe
        usuario_existente = await usuarios.find_one({"email": usuario_teste["email"]})
        
        if usuario_existente:
            logger.info(f"Usuário {usuario_teste['email']} já existe")
            usuario_id = str(usuario_existente["_id"])
        else:
            # Inserir o usuário no banco de dados
            resultado = await usuarios.insert_one(usuario_teste)
            usuario_id = str(resultado.inserted_id)
            logger.info(f"Usuário {usuario_teste['email']} criado com sucesso. ID: {usuario_id}")
        
        # Simular login (buscar o usuário pelo email e senha)
        usuario_login = await usuarios.find_one({
            "email": usuario_teste["email"]
        })
        
        if usuario_login and usuario_login["senha"] == hash_senha("senha123"):
            logger.info("Login bem-sucedido!")
            logger.info(f"Dados do usuário: {json.dumps({
                'id': str(usuario_login['_id']),
                'nome': usuario_login['nome'],
                'email': usuario_login['email']
            }, indent=2)}")
            return True
        else:
            logger.error("Falha no login")
            return False
    
    except Exception as e:
        logger.error(f"Erro ao criar/logar usuário: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(criar_usuario_teste())