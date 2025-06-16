from pydantic import BaseModel, EmailStr, Field

class LoginSchema(BaseModel):
    email: EmailStr
    senha: str = Field(..., min_length=6)

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"