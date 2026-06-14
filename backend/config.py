# backend/config.py
from dotenv import load_dotenv
import os

load_dotenv()  # Reads the .env file

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

if not OPENWEATHER_API_KEY:
    raise ValueError('OPENWEATHER_API_KEY is not set in .env')
