from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import usuarios, publicacoes, parse_object_id, publicacao_helper
from app.services.upload_service import upload_imagem
from typing import Dict
from datetime import datetime

router = APIRouter()

@router.post("/{user_id}")
async def criar_publicacao(
    user_id: str,
    descricao: str = Form(...),
    file: UploadFile = File(...),
    token_data: Dict = Depends(validar_token_jwt)
):
    try:
        # Verifica se o usuário existe
        usuario = await usuarios.find_one({"_id": parse_object_id(user_id)})
        
        if not usuario:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")
        
        # Validações
        if len(descricao) < 2:
            raise HTTPException(status_code=400, detail="Descrição necessária")
        
        # Upload da imagem
        foto_url = await upload_imagem(file)
        
        # Cria a publicação
        nova_publicacao = {
            "idUsuario": user_id,
            "descricao": descricao,
            "foto": foto_url,
            "data": datetime.now(),
            "comentarios": [],
            "likes": []
        }
        
        # Insere a publicação
        await publicacoes.insert_one(nova_publicacao)
        
        # Incrementa o contador de publicações do usuário
        await usuarios.update_one(
            {"_id": parse_object_id(user_id)},
            {"$inc": {"publicacoes": 1}}
        )
        
        return {"msg": "Publicação criada com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao cadastrar publicação: {str(e)}")