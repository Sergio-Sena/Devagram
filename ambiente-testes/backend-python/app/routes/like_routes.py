from fastapi import APIRouter, HTTPException, Depends
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import publicacoes, parse_object_id
from typing import Dict

router = APIRouter()

@router.put("/{id}")
async def dar_like(
    id: str,
    token_data: Dict = Depends(validar_token_jwt)
):
    try:
        # Obtém o ID do usuário logado
        user_id = token_data.get("_id")
        
        # Verifica se a publicação existe
        publicacao = await publicacoes.find_one({"_id": parse_object_id(id)})
        if not publicacao:
            raise HTTPException(status_code=400, detail="Publicação não encontrada")
        
        # Verifica se o usuário já deu like
        likes = publicacao.get("likes", [])
        
        if user_id in likes:
            # Remove o like (unlike)
            await publicacoes.update_one(
                {"_id": parse_object_id(id)},
                {"$pull": {"likes": user_id}}
            )
            return {"msg": "Like removido com sucesso"}
        else:
            # Adiciona o like
            await publicacoes.update_one(
                {"_id": parse_object_id(id)},
                {"$push": {"likes": user_id}}
            )
            return {"msg": "Like adicionado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar like: {str(e)}")