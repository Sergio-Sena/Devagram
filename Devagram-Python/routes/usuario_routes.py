from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from middlewares.auth_middleware import get_current_user
from models.usuario_model import UsuarioModel
from schemas.usuario_schema import UsuarioResponseSchema, UsuarioUpdateSchema

router = APIRouter()

@router.get("/usuario", tags=["Usuários"])
async def get_usuario_logado(usuario_id: str = Depends(get_current_user)):
    """
    Retorna os dados do usuário logado
    """
    usuario_model = UsuarioModel()
    usuario = await usuario_model.buscar_por_id(usuario_id)
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Remove a senha do resultado
    if "senha" in usuario:
        del usuario["senha"]
    
    return usuario

@router.get("/usuario/{id}", tags=["Usuários"])
async def get_usuario(id: str, usuario_id: str = Depends(get_current_user)):
    """
    Retorna um usuário específico pelo ID
    """
    usuario_model = UsuarioModel()
    usuario = await usuario_model.buscar_por_id(id)
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Remove a senha do resultado
    if "senha" in usuario:
        del usuario["senha"]
    
    return usuario

@router.put("/usuario", tags=["Usuários"])
async def update_usuario(
    nome: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    usuario_id: str = Depends(get_current_user)
):
    """
    Atualiza os dados do usuário logado
    """
    usuario_model = UsuarioModel()
    usuario = await usuario_model.buscar_por_id(usuario_id)
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    dados_atualizacao = {}
    
    # Atualiza o nome se fornecido
    if nome and len(nome) > 2:
        dados_atualizacao["nome"] = nome
    
    # Atualiza o avatar se um arquivo for enviado
    if file:
        # Aqui você usaria seu serviço de upload de imagens
        # Por enquanto, apenas simulamos o resultado
        # from services.upload_service import UploadService
        # avatar_url = await UploadService.upload_imagem(file, "avatares")
        # if avatar_url:
        #     dados_atualizacao["avatar"] = avatar_url
        pass
    
    # Atualiza o usuário no banco de dados
    if dados_atualizacao:
        sucesso = await usuario_model.atualizar_usuario(usuario_id, dados_atualizacao)
        if not sucesso:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Não foi possível atualizar o usuário"
            )
    
    return {"message": "Usuário atualizado com sucesso"}

@router.post("/pesquisa", tags=["Usuários"])
async def pesquisar_usuario(filtro: str, usuario_id: str = Depends(get_current_user)):
    """
    Pesquisa usuários por nome
    """
    if not filtro or len(filtro) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Favor informar um filtro válido!"
        )
    
    usuario_model = UsuarioModel()
    usuarios = await usuario_model.pesquisar_por_nome(filtro)
    
    # Remove a senha dos resultados (já é feito no modelo)
    return usuarios