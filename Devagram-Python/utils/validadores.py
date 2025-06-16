import re
from typing import Optional

class Validadores:
    @staticmethod
    def validar_email(email: str) -> bool:
        """
        Valida se o email está em um formato válido
        """
        padrao = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(padrao, email))

    @staticmethod
    def validar_senha(senha: str) -> bool:
        """
        Valida se a senha tem pelo menos 6 caracteres
        """
        return len(senha) >= 6

    @staticmethod
    def validar_nome(nome: str) -> bool:
        """
        Valida se o nome tem pelo menos 2 caracteres
        """
        return len(nome) >= 2

    @staticmethod
    def validar_imagem_base64(imagem_base64: Optional[str]) -> bool:
        """
        Valida se a string é uma imagem base64 válida
        """
        if not imagem_base64:
            return False
            
        try:
            # Verifica se começa com o padrão de base64 para imagens
            padrao = r'^data:image\/(jpeg|png|gif|jpg);base64,'
            return bool(re.match(padrao, imagem_base64))
        except:
            return False