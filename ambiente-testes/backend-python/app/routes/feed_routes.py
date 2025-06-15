from fastapi import APIRouter, HTTPException, Depends
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import publicacoes, usuarios, parse_object_id, publicacao_helper, usuario_helper
from typing import Dict, List

router = APIRouter()

@router.get("/")
async def listar_feed(token_data: Dict = Depends(validar_token_jwt)):
    try:
        # Obtém o ID do usuário logado
        user_id = token_data.get("_id")
        
        # Busca as publicações ordenadas por data (mais recentes primeiro)
        publicacoes_lista = await publicacoes.find().sort("data", -1).to_list(length=100)
        
        # Formata as publicações e adiciona informações do usuário
        feed = []
        for publicacao in publicacoes_lista:
            publicacao_formatada = publicacao_helper(publicacao)
            
            # Busca informações do usuário que fez a publicação
            usuario = await usuarios.find_one({"_id": parse_object_id(publicacao["idUsuario"])})
            if usuario:
                usuario_formatado = usuario_helper(usuario)
                publicacao_formatada["usuario"] = usuario_formatado
            
            feed.append(publicacao_formatada)
        
        return feed
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao listar feed: {str(e)}")

@router.get("/usuario/{user_id}")
async def listar_feed_por_usuario(user_id: str, token_data: Dict = Depends(validar_token_jwt)):
    try:
        # Verifica se o usuário existe
        usuario = await usuarios.find_one({"_id": parse_object_id(user_id)})
        if not usuario:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")
        
        # Busca as publicações do usuário
        publicacoes_lista = await publicacoes.find({"idUsuario": user_id}).sort("data", -1).to_list(length=100)
        
        # Formata as publicações
        feed = []
        for publicacao in publicacoes_lista:
            publicacao_formatada = publicacao_helper(publicacao)
            publicacao_formatada["usuario"] = usuario_helper(usuario)
            feed.append(publicacao_formatada)
        
        return feed
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao listar feed do usuário: {str(e)}")