# backend/services/weather_service.py
import httpx
from backend.config import OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL
from backend.models.schemas import CurrentWeatherResponse, ForecastResponse

# ─────────────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────────────
def _build_params(city: str, units: str = 'metric') -> dict:
    return {
        'q': city,
        'appid': OPENWEATHER_API_KEY,
        'units': units,
    }

# ─────────────────────────────────────────────────────
# Current weather
# ─────────────────────────────────────────────────────
async def get_current_weather(city: str, units: str = 'metric') -> CurrentWeatherResponse:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'{OPENWEATHER_BASE_URL}/weather',
            params=_build_params(city, units),
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

    return CurrentWeatherResponse(
        city=data['name'],
        country=data['sys']['country'],
        main=data['main'],
        weather=data['weather'],
        wind=data['wind'],
        visibility=data.get('visibility'),
        dt=data['dt'],
    )

# ─────────────────────────────────────────────────────
# 5-day forecast
# ─────────────────────────────────────────────────────
async def get_forecast(city: str, units: str = 'metric') -> ForecastResponse:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'{OPENWEATHER_BASE_URL}/forecast',
            params=_build_params(city, units),
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

    return ForecastResponse(
        city=data['city']['name'],
        country=data['city']['country'],
        items=data['list'],
    )
