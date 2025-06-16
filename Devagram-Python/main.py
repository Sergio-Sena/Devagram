from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Importação das rotas
from routes.usuario_routes import router as usuario_router
from routes.auth_routes import router as auth_router
from routes.publicacao_routes import router as publicacao_router
from routes.seguidor_routes import router as seguidor_router
from routes.feed_routes import router as feed_router

# Cria a aplicação FastAPI
app = FastAPI(
    title="Devagram API",
    description="API do Devagram - Clone do Instagram",
    version="1.0.0"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Inclusão das rotas
app.include_router(auth_router, prefix="/api", tags=["Autenticação"])
app.include_router(usuario_router, prefix="/api", tags=["Usuários"])
app.include_router(publicacao_router, prefix="/api", tags=["Publicações"])
app.include_router(seguidor_router, prefix="/api", tags=["Seguidores"])
app.include_router(feed_router, prefix="/api", tags=["Feed"])

# Rota raiz
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Bem-vindo à API do Devagram"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)