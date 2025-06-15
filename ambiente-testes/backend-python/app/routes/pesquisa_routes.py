from fastapi import APIRouter, HTTPException, Depends, Query
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import usuarios, usuario_helper
from typing import Dict, List

router = APIRouter()

@router.get("/")
async def pesquisar_usuario(
    filtro: str = Query(..., description="Nome ou parte do nome para pesquisa"),
    token_data: Dict = Depends(validar_token_jwt)
):
    try:
        if not filtro or len(filtro) < 2:
            raise HTTPException(status_code=400, detail="Filtro de pesquisa inválido")
        
        # Busca usuários que contenham o filtro no nome (case insensitive)
        usuarios_encontrados = await usuarios.find(
            {"nome": {"$regex": filtro, "$options": "i"}}
        ).to_list(length=50)
        
        # Formata os resultados e remove a senha
        resultados = []
        for usuario in usuarios_encontrados:
            usuario_formatado = usuario_helper(usuario)
            resultados.append(usuario_formatado)
        
        return resultados
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao pesquisar usuários: {str(e)}")