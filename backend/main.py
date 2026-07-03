# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import weather

app = FastAPI(
    title='Weather App API',
    description='FastAPI backend for the React weather app',
    version='1.0.0',
)

# ─────────────────────────────────────────────────────
# CORS — allows the React dev server to call this API
# ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Allow any origin (e.g. Vercel, localhost)
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Register routers
app.include_router(weather.router)

@app.get('/')
async def root():
    return {'message': 'Weather App API is running'}

