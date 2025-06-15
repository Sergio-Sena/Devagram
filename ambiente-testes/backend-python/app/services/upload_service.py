import os
import uuid
from fastapi import UploadFile
import aiofiles
from datetime import datetime

# Em um ambiente real, usaríamos um serviço de armazenamento como AWS S3 ou similar
# Para este exemplo, vamos salvar localmente

UPLOAD_DIR = "uploads"

async def upload_imagem(file: UploadFile) -> str:
    """
    Salva a imagem localmente e retorna a URL
    Em um ambiente real, usaríamos um serviço como AWS S3 ou Cosmic
    """
    # Cria o diretório de uploads se não existir
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Gera um nome único para o arquivo
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Salva o arquivo
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Retorna a URL (em um ambiente real, seria a URL do S3 ou similar)
    # Para este exemplo, retornamos um caminho relativo
    return f"/{file_path}"