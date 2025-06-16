from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

# Importações futuras dos schemas e models
# from schemas.publicacao_schema import PublicacaoResponseSchema
# from models.publicacao_model import PublicacaoModel
# from middlewares.auth_middleware import get_current_user

router = APIRouter()

@router.get("/feed", tags=["Feed"])
async def get_feed():
    """
    Retorna o feed do usuário logado
    """
    return {"message": "Feed do usuário"}

@router.get("/feed/{id}", tags=["Feed"])
async def get_feed_usuario(id: str):
    """
    Retorna o feed de um usuário específico
    """
    return {"message": f"Feed do usuário com ID {id}"}