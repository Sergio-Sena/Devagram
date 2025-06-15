from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carrega variáveis de ambiente
load_dotenv()

# Tenta importar o serviço de banco de dados real
try:
    from app.services.db_service import inicializar_db
    logger.info("Usando serviço de banco de dados real")
except Exception as e:
    # Se falhar, usa o serviço simulado
    logger.error(f"Erro ao importar serviço de banco de dados real: {e}")
    from app.services.mock_db_service import inicializar_db
    logger.info("Usando serviço de banco de dados simulado")

# Importa as rotas
from app.routes import auth_routes, usuario_routes, publicacao_routes, feed_routes
from app.routes import comentario_routes, like_routes, pesquisa_routes, seguir_routes

# Cria a aplicação FastAPI
app = FastAPI(
    title="Devagram API",
    description="API para o Devagram - Backend Python",
    version="1.0.0"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evento de inicialização para verificar a conexão com o banco de dados
@app.on_event("startup")
async def startup_db_client():
    logger.info("Inicializando conexão com o banco de dados...")
    db_ok = await inicializar_db()
    if db_ok:
        logger.info("Banco de dados inicializado com sucesso")
    else:
        logger.error("Falha ao inicializar o banco de dados")

# Rota de health check
@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "ok"}

# Inclui as rotas da API
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(usuario_routes.router, prefix="/api/usuario", tags=["Usuário"])
app.include_router(publicacao_routes.router, prefix="/api/publicacao", tags=["Publicação"])
app.include_router(feed_routes.router, prefix="/api/feed", tags=["Feed"])
app.include_router(comentario_routes.router, prefix="/api/comentario", tags=["Comentário"])
app.include_router(like_routes.router, prefix="/api/like", tags=["Like"])
app.include_router(pesquisa_routes.router, prefix="/api/pesquisa", tags=["Pesquisa"])
app.include_router(seguir_routes.router, prefix="/api/seguir", tags=["Seguir"])

# Inicia o servidor se executado diretamente
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Iniciando servidor na porta {port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)