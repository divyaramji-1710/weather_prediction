# streamlit_app.py
import streamlit as st
import requests
import os
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

# Setup Page Configuration
st.set_page_config(
    page_title="Aether Weather Dashboard",
    page_icon="🌤️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# App Custom CSS styling
st.markdown("""
<style>
    .main {
        background-color: #0f172a;
        color: #f8fafc;
    }
    .stMetric {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 15px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .stMetric label {
        color: #94a3b8 !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
    }
    .stMetric div {
        color: #ffffff !important;
    }
    .forecast-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 10px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar configurations
st.sidebar.title("🌤️ Aether Settings")

# Retrieve API Key from .env or sidebar text input
api_key = os.getenv("OPENWEATHER_API_KEY")
if not api_key:
    api_key = st.sidebar.text_input("Enter OpenWeatherMap API Key:", type="password")
    if not api_key:
        st.info("🔑 Please configure your `OPENWEATHER_API_KEY` in the `.env` file or enter it in the sidebar to fetch weather data.")
        st.stop()
else:
    st.sidebar.success("✅ API Key loaded from .env")

# Unit and City selections
units = st.sidebar.radio("Temperature Units:", ["Metric (°C)", "Imperial (°F)"])
unit_param = "metric" if "Metric" in units else "imperial"
temp_symbol = "°C" if unit_param == "metric" else "°F"
wind_unit = "km/h" if unit_param == "metric" else "mph"

# Preset locations
preset_cities = ["London", "New York", "Tokyo", "Paris", "Sydney"]
city_selection = st.sidebar.selectbox("Quick Select City:", [""] + preset_cities)

# Main City Search Input
st.title("🌤️ Aether Weather Dashboard")
st.markdown("A premium, interactive Python Streamlit weather intelligence application.")

city_input = st.text_input("Search City name:", value=city_selection if city_selection else "London")

# API Helper Functions
@st.cache_data(ttl=600)  # Cache results for 10 minutes
def get_weather_data(city, api_key, units):
    base_url = "https://api.openweathermap.org/data/2.5"
    
    # Fetch Current Weather
    current_url = f"{base_url}/weather?q={city}&appid={api_key}&units={units}"
    # Fetch Forecast
    forecast_url = f"{base_url}/forecast?q={city}&appid={api_key}&units={units}"
    
    current_res = requests.get(current_url)
    forecast_res = requests.get(forecast_url)
    
    if current_res.status_code == 200 and forecast_res.status_code == 200:
        return current_res.json(), forecast_res.json()
    else:
        return None, None

# Fetch and display weather metrics
if city_input:
    current_data, forecast_data = get_weather_data(city_input, api_key, unit_param)
    
    if current_data and forecast_data:
        # Destructure Current Info
        city_name = current_data["name"]
        country = current_data["sys"]["country"]
        temp = current_data["main"]["temp"]
        feels_like = current_data["main"]["feels_like"]
        temp_min = current_data["main"]["temp_min"]
        temp_max = current_data["main"]["temp_max"]
        humidity = current_data["main"]["humidity"]
        pressure = current_data["main"]["pressure"]
        wind_speed = current_data["wind"]["speed"]
        if unit_param == "metric":
            wind_speed = wind_speed * 3.6  # m/s to km/h
        wind_deg = current_data["wind"]["deg"]
        description = current_data["weather"][0]["description"]
        icon = current_data["weather"][0]["icon"]
        timezone_offset = current_data["timezone"]
        
        # Format Times based on timezone offset
        local_time_utc = datetime.utcfromtimestamp(current_data["dt"] + timezone_offset)
        sunrise_time = datetime.utcfromtimestamp(current_data["sys"]["sunrise"] + timezone_offset).strftime("%I:%M %p")
        sunset_time = datetime.utcfromtimestamp(current_data["sys"]["sunset"] + timezone_offset).strftime("%I:%M %p")
        
        # Display Current Overview
        col_header_left, col_header_right = st.columns([3, 1])
        with col_header_left:
            st.subheader(f"📍 {city_name}, {country}")
            st.caption(f"Local Date & Time: {local_time_utc.strftime('%A, %b %d, %Y • %I:%M %p')}")
        with col_header_right:
            st.image(f"https://openweathermap.org/img/wn/{icon}@2x.png", width=90)
            
        # Core Metrics Display
        st.markdown("### 📊 Atmospheric Conditions")
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Temperature", f"{round(temp)}{temp_symbol}", f"Feels like {round(feels_like)}{temp_symbol}")
        col2.metric("Humidity", f"{humidity}%")
        col3.metric("Wind Speed", f"{wind_speed:.1f} {wind_unit}", f"Direction: {wind_deg}°")
        col4.metric("Barometric Pressure", f"{pressure} hPa")

        # Sunrise & Sunset and Ranges
        col_sun1, col_sun2, col_sun3 = st.columns(3)
        col_sun1.metric("Daily Temp Range", f"{round(temp_max)}{temp_symbol} / {round(temp_min)}{temp_symbol}")
        col_sun2.metric("Sunrise 🌅", sunrise_time)
        col_sun3.metric("Sunset 🌇", sunset_time)
        
        # Hourly Temp Trend (Visualized via Streamlit Chart)
        st.markdown("### 📈 24-Hour Temperature Trend")
        hourly_list = forecast_data["list"][:8]  # Next 24 hours (8 periods)
        times = []
        temps = []
        humidities = []
        
        for item in hourly_list:
            dt = datetime.utcfromtimestamp(item["dt"] + timezone_offset)
            times.append(dt.strftime("%I %p"))
            temps.append(item["main"]["temp"])
            humidities.append(item["main"]["humidity"])
            
        chart_data = pd.DataFrame({
            'Time': times,
            'Temperature': temps,
            'Humidity (%)': humidities
        }).set_index('Time')
        
        st.line_chart(chart_data['Temperature'], use_container_width=True)
        
        # 5-Day Forecast Layout
        st.markdown("### 📅 5-Day Outlook")
        daily_intervals = forecast_data["list"]
        # Group by days (midday reads, or roughly every 8th item)
        daily_list = [daily_intervals[i] for i in range(0, len(daily_intervals), 8)][:5]
        
        col_d1, col_d2, col_d3, col_d4, col_d5 = st.columns(5)
        cols = [col_d1, col_d2, col_d3, col_d4, col_d5]
        
        for idx, item in enumerate(daily_list):
            dt = datetime.utcfromtimestamp(item["dt"] + timezone_offset)
            day_name = dt.strftime("%A")
            date_str = dt.strftime("%b %d")
            temp_forecast = item["main"]["temp"]
            desc_forecast = item["weather"][0]["description"]
            icon_forecast = item["weather"][0]["icon"]
            
            with cols[idx]:
                st.markdown(f"""
                <div class="forecast-card">
                    <h4 style="margin: 0; color: #38bdf8;">{day_name}</h4>
                    <p style="margin: 2px 0 8px 0; font-size: 0.85em; color: #94a3b8;">{date_str}</p>
                    <img src="https://openweathermap.org/img/wn/{icon_forecast}.png" width="50" style="margin: auto;"/>
                    <h3 style="margin: 5px 0; color: #f8fafc;">{round(temp_forecast)}{temp_symbol}</h3>
                    <p style="margin: 0; font-size: 0.8em; text-transform: capitalize; color: #cbd5e1;">{desc_forecast}</p>
                </div>
                """, unsafe_allow_html=True)
    else:
        st.error(f"❌ Could not retrieve weather data for '{city_input}'. Please check the city name spelling or your API key.")
