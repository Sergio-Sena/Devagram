from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UsuarioModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    nome: str
    email: EmailStr
    senha: str
    avatar: Optional[str] = None
    seguidores: int = 0
    seguindo: int = 0
    publicacoes: int = 0
    seguidores_lista: List[str] = []
    seguindo_lista: List[str] = []
    criado_em: datetime = Field(default_factory=datetime.now)
    atualizado_em: datetime = Field(default_factory=datetime.now)

class UsuarioLoginModel(BaseModel):
    email: EmailStr
    senha: str

class UsuarioCadastroModel(BaseModel):
    nome: str
    email: EmailStr
    senha: str

class UsuarioRespostaModel(BaseModel):
    id: str = Field(..., alias="_id")
    nome: str
    email: EmailStr
    avatar: Optional[str] = None
    seguidores: int = 0
    seguindo: int = 0
    publicacoes: int = 0