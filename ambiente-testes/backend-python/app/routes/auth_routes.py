from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from app.models.usuario import UsuarioLoginModel, UsuarioCadastroModel, UsuarioRespostaModel
from app.services.db_service import usuarios, hash_senha, usuario_helper
from app.services.upload_service import upload_imagem
import jwt
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")

router = APIRouter()

@router.post("/login")
async def login(usuario: UsuarioLoginModel):
    # Verifica se o JWT_SECRET está configurado
    if not JWT_SECRET:
        raise HTTPException(status_code=500, detail="JWT_SECRET não configurado")
    
    # Busca o usuário pelo email e senha
    usuario_encontrado = await usuarios.find_one({
        "email": usuario.email,
        "senha": hash_senha(usuario.senha)
    })
    
    # Se não encontrar o usuário, retorna erro
    if not usuario_encontrado:
        raise HTTPException(status_code=400, detail="Usuário ou senha inválidos")
    
    # Gera o token JWT
    token = jwt.encode(
        {"_id": str(usuario_encontrado["_id"])},
        JWT_SECRET,
        algorithm="HS256"
    )
    
    # Retorna os dados do usuário e o token
    return {
        "nome": usuario_encontrado["nome"],
        "email": usuario_encontrado["email"],
        "token": token
    }

@router.post("/cadastro")
async def cadastro(
    nome: str = Form(...),
    email: str = Form(...),
    senha: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    # Validações
    if len(nome) < 2:
        raise HTTPException(status_code=400, detail="Nome inválido")
    
    if len(email) < 5 or "@" not in email or "." not in email:
        raise HTTPException(status_code=400, detail="Email inválido")
    
    if len(senha) < 4:
        raise HTTPException(status_code=400, detail="Senha inválida")
    
    # Verifica se já existe um usuário com o mesmo email
    usuario_existente = await usuarios.find_one({"email": email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Esse email já está vinculado a uma conta!")
    
    # Upload da imagem (se fornecida)
    avatar_url = None
    if file:
        avatar_url = await upload_imagem(file)
    
    # Cria o usuário
    novo_usuario = {
        "nome": nome,
        "email": email,
        "senha": hash_senha(senha),
        "avatar": avatar_url,
        "seguidores": 0,
        "seguindo": 0,
        "publicacoes": 0
    }
    
    await usuarios.insert_one(novo_usuario)
    
    return {"msg": "Usuário cadastrado com sucesso!"}