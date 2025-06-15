from fastapi import APIRouter, HTTPException, Depends
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import publicacoes, usuarios, parse_object_id, publicacao_helper
from typing import Dict

router = APIRouter()

@router.put("/{id}")
async def adicionar_comentario(
    id: str,
    comentario: str,
    token_data: Dict = Depends(validar_token_jwt)
):
    try:
        # Obtém o ID do usuário logado
        user_id = token_data.get("_id")
        
        # Verifica se o usuário existe
        usuario = await usuarios.find_one({"_id": parse_object_id(user_id)})
        if not usuario:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")
        
        # Verifica se a publicação existe
        publicacao = await publicacoes.find_one({"_id": parse_object_id(id)})
        if not publicacao:
            raise HTTPException(status_code=400, detail="Publicação não encontrada")
        
        # Valida o comentário
        if not comentario or len(comentario) < 1:
            raise HTTPException(status_code=400, detail="Comentário inválido")
        
        # Cria o objeto de comentário
        novo_comentario = {
            "usuarioId": user_id,
            "nome": usuario["nome"],
            "comentario": comentario
        }
        
        # Adiciona o comentário à publicação
        await publicacoes.update_one(
            {"_id": parse_object_id(id)},
            {"$push": {"comentarios": novo_comentario}}
        )
        
        return {"msg": "Comentário adicionado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao adicionar comentário: {str(e)}")