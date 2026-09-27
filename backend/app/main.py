import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("reforge")

app = FastAPI(
    title="ReForge API",
    description="AI Software Recovery & Evolution Engine - Backend Gateway",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {
        "product": "ReForge",
        "tagline": "AI Software Recovery & Evolution Engine",
        "version": "1.0.0",
        "status": "ONLINE",
        "core_statement": "ReForge doesn't just modernize legacy code. It recovers the knowledge trapped inside it."
    }

@app.get("/health")
async def health():
    return {"status": "HEALTHY", "engine": "ReForge Core"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
