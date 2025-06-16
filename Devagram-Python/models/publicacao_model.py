from pymongo import MongoClient
from bson import ObjectId
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from datetime import datetime

# Carrega variáveis de ambiente
load_dotenv()

class PublicacaoModel:
    def __init__(self):
        # Conexão com o MongoDB
        self.client = MongoClient(os.getenv("MONGODB_URL"))
        self.db = self.client[os.getenv("DATABASE_NAME")]
        self.collection = self.db["publicacoes"]

    async def criar_publicacao(self, publicacao: Dict[str, Any]) -> str:
        """
        Cria uma nova publicação no banco de dados
        """
        # Renomeia o campo usuario_id para idUsuario se necessário
        if "usuario_id" in publicacao and "idUsuario" not in publicacao:
            publicacao["idUsuario"] = publicacao["usuario_id"]
            del publicacao["usuario_id"]
            
        publicacao["data"] = datetime.now()
        publicacao["likes"] = []
        publicacao["comentarios"] = []
        resultado = self.collection.insert_one(publicacao)
        return str(resultado.inserted_id)

    async def buscar_por_id(self, id: str) -> Optional[Dict[str, Any]]:
        """
        Busca uma publicação pelo ID
        """
        try:
            publicacao = self.collection.find_one({"_id": ObjectId(id)})
            if publicacao:
                publicacao["id"] = str(publicacao["_id"])
                del publicacao["_id"]
            return publicacao
        except:
            return None

    async def buscar_feed_usuario(self, usuario_id: str) -> List[Dict[str, Any]]:
        """
        Busca as publicações de um usuário específico
        """
        publicacoes = self.collection.find({"idUsuario": usuario_id}).sort("data", -1)
        resultado = []
        for publicacao in publicacoes:
            publicacao["id"] = str(publicacao["_id"])
            del publicacao["_id"]
            resultado.append(publicacao)
        return resultado

    async def buscar_feed(self, usuario_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Busca as publicações dos usuários que o usuário logado segue
        """
        publicacoes = self.collection.find({"idUsuario": {"$in": usuario_ids}}).sort("data", -1)
        resultado = []
        for publicacao in publicacoes:
            publicacao["id"] = str(publicacao["_id"])
            del publicacao["_id"]
            resultado.append(publicacao)
        return resultado

    async def adicionar_like(self, publicacao_id: str, usuario_id: str) -> bool:
        """
        Adiciona um like em uma publicação
        """
        try:
            resultado = self.collection.update_one(
                {"_id": ObjectId(publicacao_id), "likes": {"$ne": usuario_id}},
                {"$push": {"likes": usuario_id}}
            )
            return resultado.modified_count > 0
        except:
            return False

    async def remover_like(self, publicacao_id: str, usuario_id: str) -> bool:
        """
        Remove um like de uma publicação
        """
        try:
            resultado = self.collection.update_one(
                {"_id": ObjectId(publicacao_id)},
                {"$pull": {"likes": usuario_id}}
            )
            return resultado.modified_count > 0
        except:
            return False

    async def adicionar_comentario(self, publicacao_id: str, comentario: Dict[str, Any]) -> bool:
        """
        Adiciona um comentário em uma publicação
        """
        try:
            comentario["id"] = str(ObjectId())
            comentario["data"] = datetime.now()
            resultado = self.collection.update_one(
                {"_id": ObjectId(publicacao_id)},
                {"$push": {"comentarios": comentario}}
            )
            return resultado.modified_count > 0
        except:
            return False