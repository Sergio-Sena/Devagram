import motor.motor_asyncio
import os
from dotenv import load_dotenv
from bson import ObjectId
import hashlib
import asyncio
import logging
from datetime import datetime

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/devagram-python-test")
logger.info(f"Conectando ao MongoDB: {MONGODB_URL}")

# Variável global para controlar o estado da conexão
client = None
db = None
usuarios = None
publicacoes = None

# Função para inicializar a conexão com o banco de dados
async def conectar_db():
    global client, db, usuarios, publicacoes
    
    try:
        # Tenta conectar ao MongoDB
        client = motor.motor_asyncio.AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            retryWrites=True,
            w="majority"
        )
        
        # Verifica se a conexão está funcionando
        await client.admin.command('ping')
        
        # Obtém a referência ao banco de dados
        db = client.get_database()
        
        # Inicializa as coleções
        usuarios = db.usuarios
        publicacoes = db.publicacoes
        
        logger.info("Conexão com MongoDB estabelecida com sucesso")
        return True
    except Exception as e:
        logger.error(f"Erro ao conectar ao MongoDB: {e}")
        return False

# Funções auxiliares
def hash_senha(senha: str) -> str:
    return hashlib.md5(senha.encode()).hexdigest()

def parse_object_id(id: str) -> ObjectId:
    return ObjectId(id)

def usuario_helper(usuario) -> dict:
    if not usuario:
        return None
    return {
        "_id": str(usuario["_id"]),
        "nome": usuario["nome"],
        "email": usuario["email"],
        "avatar": usuario.get("avatar"),
        "seguidores": usuario.get("seguidores", 0),
        "seguindo": usuario.get("seguindo", 0),
        "publicacoes": usuario.get("publicacoes", 0),
        "seguidores_lista": usuario.get("seguidores_lista", []),
        "seguindo_lista": usuario.get("seguindo_lista", []),
        "criado_em": usuario.get("criado_em", datetime.now()),
        "atualizado_em": usuario.get("atualizado_em", datetime.now())
    }

def publicacao_helper(publicacao) -> dict:
    if not publicacao:
        return None
    return {
        "_id": str(publicacao["_id"]),
        "idUsuario": publicacao["idUsuario"],
        "descricao": publicacao["descricao"],
        "foto": publicacao["foto"],
        "data": publicacao["data"],
        "comentarios": publicacao.get("comentarios", []),
        "likes": publicacao.get("likes", [])
    }

# Função para verificar a conexão com o banco de dados
async def verificar_conexao():
    global client
    
    if not client:
        return await conectar_db()
    
    try:
        # Ping para verificar se o servidor está respondendo
        await client.admin.command('ping')
        logger.info("Ping ao MongoDB bem-sucedido")
        return True
    except Exception as e:
        logger.error(f"Erro ao fazer ping no MongoDB: {e}")
        # Tenta reconectar
        return await conectar_db()

# Função para criar índices nas coleções
async def criar_indices():
    global usuarios, publicacoes
    
    if not usuarios or not publicacoes:
        logger.error("Coleções não inicializadas")
        return False
    
    try:
        # Índice para email único em usuários
        await usuarios.create_index("email", unique=True)
        logger.info("Índice de email criado com sucesso")
        
        # Índice para busca por nome de usuário
        await usuarios.create_index("nome")
        logger.info("Índice de nome criado com sucesso")
        
        # Índice para publicações por data
        await publicacoes.create_index("data", direction=-1)
        logger.info("Índice de data em publicações criado com sucesso")
        
        # Índice para publicações por usuário
        await publicacoes.create_index("idUsuario")
        logger.info("Índice de idUsuario em publicações criado com sucesso")
        
        return True
    except Exception as e:
        logger.error(f"Erro ao criar índices: {e}")
        return False

# Função para criar um usuário administrador inicial (se não existir)
async def criar_usuario_admin():
    global usuarios
    
    if not usuarios:
        logger.error("Coleção de usuários não inicializada")
        return False
    
    try:
        # Verifica se já existe um usuário admin
        admin = await usuarios.find_one({"email": "admin@devagram.com"})
        
        if not admin:
            # Cria o usuário admin
            novo_admin = {
                "nome": "Administrador",
                "email": "admin@devagram.com",
                "senha": hash_senha("admin123"),
                "avatar": None,
                "seguidores": 0,
                "seguindo": 0,
                "publicacoes": 0,
                "seguidores_lista": [],
                "seguindo_lista": [],
                "criado_em": datetime.now(),
                "atualizado_em": datetime.now(),
                "admin": True
            }
            
            await usuarios.insert_one(novo_admin)
            logger.info("Usuário administrador criado com sucesso")
        else:
            logger.info("Usuário administrador já existe")
        
        return True
    except Exception as e:
        logger.error(f"Erro ao criar usuário administrador: {e}")
        return False

# Executar verificação de conexão e criação de índices na inicialização
async def inicializar_db():
    # Conecta ao banco de dados
    conexao_ok = await conectar_db()
    
    if conexao_ok:
        # Cria índices
        indices_ok = await criar_indices()
        
        # Cria usuário admin
        admin_ok = await criar_usuario_admin()
        
        return indices_ok and admin_ok
    
    return False