# backend/routers/weather.py
from fastapi import APIRouter, HTTPException, Query
from backend.services.weather_service import get_current_weather, get_forecast
from backend.models.schemas import CurrentWeatherResponse, ForecastResponse
import httpx

router = APIRouter(prefix='/weather', tags=['Weather'])

# ─────────────────────────────────────────────────────
# GET /weather/current?city=London&units=metric
# ─────────────────────────────────────────────────────
@router.get('/current', response_model=CurrentWeatherResponse)
async def current_weather(
    city: str = Query(..., min_length=1, description='City name'),
    units: str = Query('metric', description='metric | imperial | standard'),
):
    try:
        return await get_current_weather(city, units)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f'City not found: {city}')
        raise HTTPException(status_code=502, detail='Weather service error')
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail='Weather service timed out')

# ─────────────────────────────────────────────────────
# GET /weather/forecast?city=London&units=metric
# ─────────────────────────────────────────────────────
@router.get('/forecast', response_model=ForecastResponse)
async def forecast(
    city: str = Query(..., min_length=1, description='City name'),
    units: str = Query('metric', description='metric | imperial | standard'),
):
    try:
        return await get_forecast(city, units)
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f'City not found: {city}')
        raise HTTPException(status_code=502, detail='Weather service error')
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail='Weather service timed out')
