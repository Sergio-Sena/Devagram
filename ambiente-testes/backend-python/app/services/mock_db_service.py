import logging
import hashlib
from datetime import datetime
from bson import ObjectId

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Banco de dados em memória
mock_db = {
    "usuarios": {},
    "publicacoes": {}
}

# Funções auxiliares
def hash_senha(senha: str) -> str:
    return hashlib.md5(senha.encode()).hexdigest()

def parse_object_id(id: str) -> str:
    return id

def usuario_helper(usuario) -> dict:
    if not usuario:
        return None
    return {
        "_id": usuario["_id"],
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
        "_id": publicacao["_id"],
        "idUsuario": publicacao["idUsuario"],
        "descricao": publicacao["descricao"],
        "foto": publicacao["foto"],
        "data": publicacao["data"],
        "comentarios": publicacao.get("comentarios", []),
        "likes": publicacao.get("likes", [])
    }

# Classe para simular uma coleção MongoDB
class MockCollection:
    def __init__(self, collection_name):
        self.collection_name = collection_name
        self.data = mock_db[collection_name]
    
    async def find_one(self, query):
        # Implementação simples para buscar por email ou _id
        if "email" in query:
            for id, item in self.data.items():
                if item["email"] == query["email"]:
                    return item
        elif "_id" in query:
            id = query["_id"]
            return self.data.get(id)
        return None
    
    async def insert_one(self, document):
        # Gera um ID único
        id = str(ObjectId())
        document["_id"] = id
        self.data[id] = document
        
        class Result:
            def __init__(self, id):
                self.inserted_id = id
        
        return Result(id)
    
    async def update_one(self, query, update):
        # Implementação simples para atualizar por _id
        if "_id" in query:
            id = query["_id"]
            if id in self.data:
                if "$set" in update:
                    for key, value in update["$set"].items():
                        self.data[id][key] = value
                if "$inc" in update:
                    for key, value in update["$inc"].items():
                        self.data[id][key] = self.data[id].get(key, 0) + value
                if "$push" in update:
                    for key, value in update["$push"].items():
                        if key not in self.data[id]:
                            self.data[id][key] = []
                        self.data[id][key].append(value)
                if "$pull" in update:
                    for key, value in update["$pull"].items():
                        if key in self.data[id] and value in self.data[id][key]:
                            self.data[id][key].remove(value)
        
        class Result:
            def __init__(self):
                self.modified_count = 1
        
        return Result()
    
    async def find(self, query=None):
        # Implementação simples para buscar todos ou filtrar
        results = []
        
        for id, item in self.data.items():
            if query is None:
                results.append(item)
            elif "nome" in query and "$regex" in query["nome"]:
                # Busca por nome (case insensitive)
                regex = query["nome"]["$regex"]
                if regex.lower() in item["nome"].lower():
                    results.append(item)
            elif "idUsuario" in query:
                # Busca por idUsuario
                if item.get("idUsuario") == query["idUsuario"]:
                    results.append(item)
        
        class Cursor:
            def __init__(self, results):
                self.results = results
            
            def sort(self, field, direction=1):
                # Ordenação simples
                reverse = direction == -1
                self.results.sort(key=lambda x: x.get(field, ""), reverse=reverse)
                return self
            
            async def to_list(self, length=None):
                # Limita o número de resultados se length for especificado
                if length is not None:
                    return self.results[:length]
                return self.results
        
        return Cursor(results)
    
    async def create_index(self, field, unique=False, direction=1):
        # Simula a criação de índice (não faz nada)
        logger.info(f"Índice criado para {field} (simulado)")
        return True

# Inicializa as coleções
usuarios = MockCollection("usuarios")
publicacoes = MockCollection("publicacoes")

# Função para verificar a conexão (sempre retorna True)
async def verificar_conexao():
    logger.info("Usando banco de dados em memória (simulado)")
    return True

# Função para criar índices (simulada)
async def criar_indices():
    logger.info("Criando índices (simulado)")
    return True

# Função para criar um usuário administrador
async def criar_usuario_admin():
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
        logger.info("Usuário administrador criado com sucesso (simulado)")
    else:
        logger.info("Usuário administrador já existe (simulado)")
    
    return True

# Função para inicializar o banco de dados
async def inicializar_db():
    logger.info("Inicializando banco de dados em memória (simulado)")
    await criar_indices()
    await criar_usuario_admin()
    return True

# Função para conectar ao banco de dados (sempre retorna True)
async def conectar_db():
    logger.info("Conectando ao banco de dados em memória (simulado)")
    return True