// frontend/src/components/WeatherCard.jsx
import { 
  Thermometer, 
  Droplets, 
  Wind as WindIcon, 
  Gauge, 
  Eye, 
  Sunrise, 
  Sunset, 
  Navigation 
} from 'lucide-react';
import { formatLocalTime } from '../services/weatherUtils';

export default function WeatherCard({ data, units }) {
  if (!data) return null;

  const { city, country, main, weather, wind, dt, sunrise, sunset, timezone } = data;
  const icon = weather[0]?.icon;
  const description = weather[0]?.description || '';
  const condition = weather[0]?.main || 'Clear';

  const unitSymbol = units === 'imperial' ? '°F' : '°C';
  const windUnit = units === 'imperial' ? 'mph' : 'km/h';
  
  // Format Wind Speed: m/s -> km/h if metric
  const windSpeedFormatted = units === 'imperial' 
    ? wind.speed.toFixed(1) 
    : (wind.speed * 3.6).toFixed(1);
    
  // Format Visibility: meters -> km or miles
  const visibilityFormatted = data.visibility 
    ? (units === 'imperial' 
        ? (data.visibility * 0.000621371).toFixed(1) + ' mi' 
        : (data.visibility / 1000).toFixed(1) + ' km') 
    : 'N/A';

  return (
    <div className="w-full max-w-xl bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-white hover:shadow-white/5 transition-all duration-500 ease-in-out">
      {/* City header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow">
            {city}, {country}
          </h2>
          <p className="text-white/70 text-sm mt-1 font-medium">
            {formatLocalTime(dt, timezone)}
          </p>
        </div>
        
        {/* Status Pill */}
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white/15 border border-white/10 backdrop-blur-md uppercase">
          {condition}
        </span>
      </div>

      {/* Temp and Icon main display */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-60 group-hover:opacity-80 transition duration-500" />
              <img
                src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
                alt={description}
                className="w-28 h-28 relative z-10 filter drop-shadow-md animate-pulse-slow"
              />
            </div>
          )}
          <div>
            <div className="flex items-start">
              <span className="text-7xl font-extrabold tracking-tighter text-white select-none">
                {Math.round(main.temp)}
              </span>
              <span className="text-3xl font-semibold text-white/90 mt-1 ml-0.5">{unitSymbol}</span>
            </div>
            <p className="text-lg text-white/80 capitalize font-medium mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Min/Max and Feels-like box */}
        <div className="flex flex-col items-center md:items-end justify-center bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[140px] text-center md:text-right backdrop-blur">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Today's Range</p>
          <p className="text-lg font-bold text-white mt-1">
            {Math.round(main.temp_max)}{unitSymbol} <span className="text-white/40 font-medium">/</span> {Math.round(main.temp_min)}{unitSymbol}
          </p>
          <div className="w-full h-px bg-white/10 my-2" />
          <p className="text-xs text-white/60">
            Feels like <span className="font-semibold text-white">{Math.round(main.feels_like)}{unitSymbol}</span>
          </p>
        </div>
      </div>

      {/* 6 Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Metric 1: Apparent Temp */}
        <div className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition duration-300">
          <Thermometer className="w-6 h-6 text-orange-300 mb-2" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Feels Like</span>
          <span className="text-lg font-bold mt-1">{main.feels_like.toFixed(1)}{unitSymbol}</span>
        </div>

        {/* Metric 2: Humidity */}
        <div className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition duration-300">
          <Droplets className="w-6 h-6 text-blue-300 mb-2" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Humidity</span>
          <span className="text-lg font-bold mt-1">{main.humidity}%</span>
          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden max-w-[80px]">
            <div 
              className="bg-blue-400 h-full rounded-full" 
              style={{ width: `${main.humidity}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Wind */}
        <div className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition duration-300 relative overflow-hidden">
          <div className="flex gap-1.5 items-center mb-2">
            <WindIcon className="w-6 h-6 text-sky-300" />
            <Navigation 
              style={{ transform: `rotate(${wind.deg}deg)` }} 
              className="w-4 h-4 text-sky-200/80 transition-transform duration-500" 
            />
          </div>
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Wind Speed</span>
          <span className="text-lg font-bold mt-1">{windSpeedFormatted} {windUnit}</span>
        </div>

        {/* Metric 4: Pressure */}
        <div className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition duration-300">
          <Gauge className="w-6 h-6 text-emerald-300 mb-2" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Pressure</span>
          <span className="text-lg font-bold mt-1">{main.pressure} hPa</span>
        </div>

        {/* Metric 5: Visibility */}
        <div className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition duration-300">
          <Eye className="w-6 h-6 text-teal-300 mb-2" />
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Visibility</span>
          <span className="text-lg font-bold mt-1">{visibilityFormatted}</span>
        </div>

        {/* Metric 6: Sun cycle */}
        <div className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition duration-300 col-span-2 sm:col-span-1">
          <div className="flex gap-3 mb-2">
            <div className="flex flex-col items-center">
              <Sunrise className="w-4 h-4 text-yellow-300" />
              <span className="text-[10px] text-white/50 uppercase mt-0.5">Rise</span>
            </div>
            <div className="flex flex-col items-center">
              <Sunset className="w-4 h-4 text-rose-300" />
              <span className="text-[10px] text-white/50 uppercase mt-0.5">Set</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Day Cycle</span>
          <span className="text-[11px] font-bold mt-1 flex flex-col gap-0.5 text-white/90">
            <span>🌅 {formatLocalTime(sunrise, timezone, 'timeOnly')}</span>
            <span>🌇 {formatLocalTime(sunset, timezone, 'timeOnly')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
