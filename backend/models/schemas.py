# backend/models/schemas.py
from pydantic import BaseModel
from typing import List, Optional

class WeatherMain(BaseModel):
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    humidity: int
    pressure: int

class WeatherDescription(BaseModel):
    main: str
    description: str
    icon: str

class Wind(BaseModel):
    speed: float
    deg: int

class CurrentWeatherResponse(BaseModel):
    city: str
    country: str
    main: WeatherMain
    weather: List[WeatherDescription]
    wind: Wind
    visibility: Optional[int] = None
    dt: int  # Unix timestamp
    sunrise: Optional[int] = None
    sunset: Optional[int] = None
    timezone: Optional[int] = None

class ForecastItem(BaseModel):
    dt: int
    main: WeatherMain
    weather: List[WeatherDescription]
    wind: Wind
    dt_txt: str

class ForecastResponse(BaseModel):
    city: str
    country: str
    timezone: Optional[int] = None
    items: List[ForecastItem]

