from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, movies, recommendations, interactions, users
from app.core.config import settings

app = FastAPI(
    title="NFLIX API",
    description="Movie Recommendation System Backend",
    version="1.0.0",
)

# ── CORS — allow Next.js frontend ────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ─────────────────────────────────────────────────────────
app.include_router(auth.router,            prefix="/api/auth",            tags=["Auth"])
app.include_router(movies.router,          prefix="/api/movies",          tags=["Movies"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(interactions.router,    prefix="/api/interactions",    tags=["Interactions"])
app.include_router(users.router,           prefix="/api/users",           tags=["Users"])


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "NFLIX API"}
