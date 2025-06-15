from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ComentarioModel(BaseModel):
    usuarioId: str
    nome: str
    comentario: str
    data: datetime = Field(default_factory=datetime.now)

class PublicacaoModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    idUsuario: str
    descricao: str
    foto: str
    data: datetime = Field(default_factory=datetime.now)
    comentarios: List[ComentarioModel] = []
    likes: List[str] = []

class PublicacaoCriacaoModel(BaseModel):
    descricao: str