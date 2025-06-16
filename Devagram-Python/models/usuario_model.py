from pymongo import MongoClient
from bson import ObjectId
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

class UsuarioModel:
    def __init__(self):
        # Conexão com o MongoDB
        self.client = MongoClient(os.getenv("MONGODB_URL"))
        self.db = self.client[os.getenv("DATABASE_NAME")]
        self.collection = self.db["usuarios"]

    async def criar_usuario(self, usuario: Dict[str, Any]) -> str:
        """
        Cria um novo usuário no banco de dados
        """
        resultado = self.collection.insert_one(usuario)
        return str(resultado.inserted_id)

    async def buscar_por_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Busca um usuário pelo email
        """
        usuario = self.collection.find_one({"email": email})
        if usuario:
            usuario["id"] = str(usuario["_id"])
            del usuario["_id"]
        return usuario

    async def buscar_por_id(self, id: str) -> Optional[Dict[str, Any]]:
        """
        Busca um usuário pelo ID
        """
        try:
            usuario = self.collection.find_one({"_id": ObjectId(id)})
            if usuario:
                usuario["id"] = str(usuario["_id"])
                del usuario["_id"]
            return usuario
        except:
            return None

    async def atualizar_usuario(self, id: str, dados: Dict[str, Any]) -> bool:
        """
        Atualiza os dados de um usuário
        """
        try:
            resultado = self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": dados}
            )
            return resultado.modified_count > 0
        except:
            return False

    async def pesquisar_por_nome(self, nome: str) -> List[Dict[str, Any]]:
        """
        Pesquisa usuários por nome
        """
        usuarios = self.collection.find({"nome": {"$regex": nome, "$options": "i"}})
        resultado = []
        for usuario in usuarios:
            usuario["id"] = str(usuario["_id"])
            del usuario["_id"]
            del usuario["senha"]  # Remove a senha dos resultados
            resultado.append(usuario)
        return resultado