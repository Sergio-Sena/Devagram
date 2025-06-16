from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

# Importações futuras dos schemas e models
# from schemas.seguidor_schema import SeguidorSchema, SeguidorResponseSchema
# from models.seguidor_model import SeguidorModel
# from middlewares.auth_middleware import get_current_user

router = APIRouter()

@router.post("/seguir/{id}", tags=["Seguidores"])
async def seguir_usuario(id: str):
    """
    Segue ou deixa de seguir um usuário
    """
    return {"message": f"Seguindo usuário com ID {id}"}

@router.get("/seguidor/{id}", tags=["Seguidores"])
async def get_seguidores(id: str):
    """
    Retorna os seguidores de um usuário
    """
    return {"message": f"Seguidores do usuário com ID {id}"}