from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.middleware.jwt_middleware import validar_token_jwt
from app.services.db_service import usuarios, parse_object_id, usuario_helper
from app.services.upload_service import upload_imagem
from typing import Optional, Dict

router = APIRouter()

@router.get("/{user_id}")
async def obter_usuario(user_id: str, token_data: Dict = Depends(validar_token_jwt)):
    try:
        # Busca o usuário pelo ID
        usuario = await usuarios.find_one({"_id": parse_object_id(user_id)})
        
        if not usuario:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")
        
        # Remove a senha dos dados retornados
        usuario_formatado = usuario_helper(usuario)
        
        return usuario_formatado
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Não foi possível obter dados do usuário: {str(e)}")

@router.put("/{user_id}")
async def atualizar_usuario(
    user_id: str,
    nome: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    token_data: Dict = Depends(validar_token_jwt)
):
    try:
        # Verifica se o usuário existe
        usuario = await usuarios.find_one({"_id": parse_object_id(user_id)})
        
        if not usuario:
            raise HTTPException(status_code=400, detail="Usuário não encontrado")
        
        # Prepara os dados para atualização
        dados_atualizacao = {}
        
        # Atualiza o nome se fornecido
        if nome and len(nome) > 2:
            dados_atualizacao["nome"] = nome
        
        # Atualiza o avatar se fornecido
        if file:
            avatar_url = await upload_imagem(file)
            dados_atualizacao["avatar"] = avatar_url
        
        # Se não há dados para atualizar, retorna erro
        if not dados_atualizacao:
            raise HTTPException(status_code=400, detail="Nenhum dado válido para atualização")
        
        # Atualiza o usuário
        await usuarios.update_one(
            {"_id": parse_object_id(user_id)},
            {"$set": dados_atualizacao}
        )
        
        return {"msg": "Atualização feita com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Não foi possível atualizar usuário: {str(e)}")