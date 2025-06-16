from pymongo import MongoClient
from bson import ObjectId
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

class SeguidorModel:
    def __init__(self):
        # Conexão com o MongoDB
        self.client = MongoClient(os.getenv("MONGODB_URL"))
        self.db = self.client[os.getenv("DATABASE_NAME")]
        self.collection = self.db["seguidores"]

    async def seguir(self, usuario_id: str, seguido_id: str) -> bool:
        """
        Adiciona um seguidor
        """
        try:
            # Verifica se já segue
            seguidor = self.collection.find_one({
                "usuarioId": usuario_id,
                "usuarioSeguidoId": seguido_id
            })
            
            if seguidor:
                # Se já segue, remove o seguidor
                resultado = self.collection.delete_one({
                    "usuarioId": usuario_id,
                    "usuarioSeguidoId": seguido_id
                })
                return False  # Retorna False indicando que deixou de seguir
            else:
                # Se não segue, adiciona o seguidor
                self.collection.insert_one({
                    "usuarioId": usuario_id,
                    "usuarioSeguidoId": seguido_id
                })
                return True  # Retorna True indicando que começou a seguir
        except:
            return False

    async def contar_seguidores(self, usuario_id: str) -> int:
        """
        Conta quantos seguidores um usuário tem
        """
        return self.collection.count_documents({"usuarioSeguidoId": usuario_id})

    async def contar_seguindo(self, usuario_id: str) -> int:
        """
        Conta quantos usuários um usuário está seguindo
        """
        return self.collection.count_documents({"usuarioId": usuario_id})

    async def listar_seguidores(self, usuario_id: str) -> List[str]:
        """
        Lista os IDs dos seguidores de um usuário
        """
        seguidores = self.collection.find({"usuarioSeguidoId": usuario_id})
        return [seguidor["usuarioId"] for seguidor in seguidores]

    async def listar_seguindo(self, usuario_id: str) -> List[str]:
        """
        Lista os IDs dos usuários que um usuário está seguindo
        """
        seguindo = self.collection.find({"usuarioId": usuario_id})
        return [seguido["usuarioSeguidoId"] for seguido in seguindo]

    async def verifica_seguindo(self, usuario_id: str, seguido_id: str) -> bool:
        """
        Verifica se um usuário está seguindo outro
        """
        seguidor = self.collection.find_one({
            "usuarioId": usuario_id,
            "usuarioSeguidoId": seguido_id
        })
        return seguidor is not None