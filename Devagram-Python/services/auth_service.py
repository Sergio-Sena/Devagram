from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configurações do JWT
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Contexto para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
        """
        Verifica se a senha fornecida corresponde ao hash armazenado
        """
        return pwd_context.verify(senha_plana, senha_hash)

    @staticmethod
    def gerar_hash_senha(senha: str) -> str:
        """
        Gera um hash para a senha
        """
        return pwd_context.hash(senha)

    @staticmethod
    def criar_token_acesso(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Cria um token JWT de acesso
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return encoded_jwt