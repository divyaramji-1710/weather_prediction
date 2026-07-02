// frontend/src/App.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import ErrorMessage from './components/ErrorMessage';
import { fetchCurrentWeather, fetchForecast } from './services/api';
import { getWeatherTheme } from './services/weatherUtils';
import { Compass } from 'lucide-react';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [units, setUnits] = useState('metric');
  const [currentCity, setCurrentCity] = useState('London');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('weather_search_history') || '[]');
    } catch {
      return [];
    }
  });

  const prevUnits = useRef(units);

  const handleSearch = useCallback(async function handleSearch(city) {
    if (!city) return;
    setLoading(true);
    setError('');

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, units),
        fetchForecast(city, units),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(city);

      // Save search to history if successful
      setHistory(prev => {
        const formattedCity = weatherData.city;
        const filtered = prev.filter(item => item.toLowerCase() !== formattedCity.toLowerCase());
        const updated = [formattedCity, ...filtered].slice(0, 5);
        localStorage.setItem('weather_search_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.detail || 'Unable to fetch weather data.';
      setError(message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [units]);

  // Load last queried or London automatically when app starts
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(currentCity);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Reload weather when units toggle changes
  useEffect(() => {
    if (!currentCity) return;
    if (prevUnits.current === units) return;

    prevUnits.current = units;
    const timer = setTimeout(() => {
      handleSearch(currentCity);
    }, 0);
    return () => clearTimeout(timer);
  }, [units, currentCity, handleSearch]);

  const handleSelectHistory = (city) => {
    setCurrentCity(city);
    handleSearch(city);
  };

  // Get styling theme based on current weather condition
  const theme = weather 
    ? getWeatherTheme(weather.weather[0]?.main, weather.weather[0]?.icon)
    : getWeatherTheme('', '');

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} transition-all duration-1000 ease-in-out flex flex-col items-center px-4 py-8 md:py-12 gap-6 font-sans overflow-x-hidden`}
    >
      {/* Header Branding */}
      <div className="flex flex-col items-center gap-1 mt-2">
        <div className="flex items-center gap-3">
          <Compass className="w-9 h-9 text-white animate-spin-slow" />
          <h1 className="text-3xl md:text-4xl font-black tracking-wider text-white select-none drop-shadow-sm">
            AETHER WEATHER
          </h1>
        </div>
        <p className="text-white/60 text-xs tracking-widest font-semibold uppercase mt-1">
          Premium Forecast Dashboard
        </p>
      </div>

      {/* Control Bar: Search and Units */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4 items-center justify-between mt-2">
        {/* Unit Toggle Pill */}
        <div className="flex bg-white/10 border border-white/20 p-1 rounded-2xl backdrop-blur-md shadow-md">
          <button
            onClick={() => setUnits('metric')}
            className={`px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
              units === 'metric'
                ? 'bg-white text-slate-900 shadow-md scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            °C (Metric)
          </button>
          <button
            onClick={() => setUnits('imperial')}
            className={`px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
              units === 'imperial'
                ? 'bg-white text-slate-900 shadow-md scale-105'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            °F (Imperial)
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <SearchBar
        onSearch={handleSearch}
        loading={loading}
        history={history}
        onSelectHistory={handleSelectHistory}
      />

      {/* Error Alert */}
      <ErrorMessage message={error} />

      {/* Loading Spinner */}
      {loading && !weather && (
        <div className="flex flex-col items-center text-white mt-12 gap-3 animate-pulse">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">Retrieving atmospheric data...</p>
        </div>
      )}

      {/* Weather Content Layout */}
      {!loading && weather && (
        <div className="w-full max-w-xl flex flex-col gap-6 animate-fade-in">
          {/* Main Card */}
          <WeatherCard
            data={weather}
            units={units}
          />
          
          {/* Forecast details (Hourly & Daily) */}
          {forecast && (
            <ForecastCard
              data={forecast}
              units={units}
            />
          )}
        </div>
      )}
    </div>
  );
}