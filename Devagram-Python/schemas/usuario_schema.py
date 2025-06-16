from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UsuarioSchema(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    senha: str = Field(..., min_length=6)
    avatar: Optional[str] = None

class UsuarioUpdateSchema(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar: Optional[str] = None

class UsuarioResponseSchema(BaseModel):
    id: str
    nome: str
    email: EmailStr
    avatar: Optional[str] = None
    seguidores: int = 0
    seguindo: int = 0

class UsuarioPesquisaSchema(BaseModel):
    nome: str = Field(..., min_length=2)