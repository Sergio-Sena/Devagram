from fastapi import APIRouter, HTTPException, Depends
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import usuarios, parse_object_id
from typing import Dict

router = APIRouter()

@router.put("/{id}")
async def seguir_usuario(
    id: str,
    token_data: Dict = Depends(validar_token_jwt)
):
    try:
        # Obtém o ID do usuário logado
        user_id = token_data.get("_id")
        
        # Verifica se o usuário a ser seguido existe
        usuario_seguido = await usuarios.find_one({"_id": parse_object_id(id)})
        if not usuario_seguido:
            raise HTTPException(status_code=400, detail="Usuário a ser seguido não encontrado")
        
        # Verifica se o usuário logado existe
        usuario_logado = await usuarios.find_one({"_id": parse_object_id(user_id)})
        if not usuario_logado:
            raise HTTPException(status_code=400, detail="Usuário logado não encontrado")
        
        # Verifica se o usuário está tentando seguir a si mesmo
        if user_id == id:
            raise HTTPException(status_code=400, detail="Não é possível seguir a si mesmo")
        
        # Verifica se o usuário já segue o outro
        seguindo = usuario_logado.get("seguindo", [])
        seguidores = usuario_seguido.get("seguidores", [])
        
        if id in seguindo:
            # Deixar de seguir
            await usuarios.update_one(
                {"_id": parse_object_id(user_id)},
                {
                    "$pull": {"seguindo": id},
                    "$inc": {"seguindo_count": -1}
                }
            )
            
            await usuarios.update_one(
                {"_id": parse_object_id(id)},
                {
                    "$pull": {"seguidores": user_id},
                    "$inc": {"seguidores_count": -1}
                }
            )
            
            return {"msg": "Deixou de seguir com sucesso"}
        else:
            # Seguir
            await usuarios.update_one(
                {"_id": parse_object_id(user_id)},
                {
                    "$push": {"seguindo": id},
                    "$inc": {"seguindo_count": 1}
                }
            )
            
            await usuarios.update_one(
                {"_id": parse_object_id(id)},
                {
                    "$push": {"seguidores": user_id},
                    "$inc": {"seguidores_count": 1}
                }
            )
            
            return {"msg": "Seguindo com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar seguir/deixar de seguir: {str(e)}")