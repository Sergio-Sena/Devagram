from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ComentarioSchema(BaseModel):
    texto: str = Field(..., min_length=1, max_length=255)

class ComentarioResponseSchema(BaseModel):
    id: str
    texto: str
    usuario_id: str
    usuario_nome: str
    usuario_avatar: Optional[str] = None
    data: datetime

class PublicacaoSchema(BaseModel):
    descricao: str = Field(..., min_length=1, max_length=255)
    foto: str

class PublicacaoResponseSchema(BaseModel):
    id: str
    descricao: str
    foto: str
    usuario_id: str
    usuario_nome: str
    usuario_avatar: Optional[str] = None
    data: datetime
    likes: List[str] = []
    comentarios: List[ComentarioResponseSchema] = []