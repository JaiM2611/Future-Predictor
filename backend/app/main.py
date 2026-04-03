from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import simulation, documentary

app = FastAPI(
    title="AI Future Documentary Engine",
    description="Simulate decisions. Experience consequences. Shape your future.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation.router)
app.include_router(documentary.router)


@app.get("/")
async def root():
    return {
        "message": "AI Future Documentary Engine API",
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
