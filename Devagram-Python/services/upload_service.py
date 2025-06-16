import os
import base64
import requests
from typing import Optional
from dotenv import load_dotenv
import uuid

# Carrega variáveis de ambiente
load_dotenv()

# Configurações do Cosmic
BUCKET_SLUG = os.getenv("BUCKET_SLUG")
WRITE_KEY = os.getenv("WRITE_KEY")

class UploadService:
    @staticmethod
    async def upload_imagem(imagem_base64: str, pasta: str = "avatares") -> Optional[str]:
        """
        Faz upload de uma imagem para o Cosmic e retorna a URL
        """
        try:
            # Gera um nome único para a imagem
            nome_arquivo = f"{uuid.uuid4()}.jpg"
            
            # URL da API do Cosmic
            url = f"https://api.cosmicjs.com/v2/buckets/{BUCKET_SLUG}/media"
            
            # Cabeçalhos da requisição
            headers = {
                "Authorization": f"Bearer {WRITE_KEY}",
                "Content-Type": "application/json"
            }
            
            # Corpo da requisição
            payload = {
                "media": {
                    "name": nome_arquivo,
                    "folder": pasta,
                    "content": imagem_base64
                }
            }
            
            # Faz a requisição para o Cosmic
            response = requests.post(url, json=payload, headers=headers)
            
            # Verifica se a requisição foi bem-sucedida
            if response.status_code == 200:
                data = response.json()
                return data["media"]["url"]
            else:
                return None
        except Exception as e:
            print(f"Erro ao fazer upload da imagem: {e}")
            return None