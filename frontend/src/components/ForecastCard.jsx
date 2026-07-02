// frontend/src/components/ForecastCard.jsx
import { Calendar, Clock, Droplets, Wind } from 'lucide-react';
import { formatLocalTime } from '../services/weatherUtils';

export default function ForecastCard({ data, units }) {
  if (!data) return null;

  const { timezone, items } = data;
  const unitSymbol = units === 'imperial' ? '°F' : '°C';
  const windUnit = units === 'imperial' ? 'mph' : 'km/h';

  // 1. Hourly Forecast: Next 24 hours (first 8 intervals from OpenWeatherMap)
  const hourlyItems = items.slice(0, 8);

  // 2. 5-Day Forecast: Filter to show roughly 1 reading per day (e.g., every 8th item)
  // Let's filter to pick items around midday (e.g. dt_txt containing "12:00:00") or default to every 8th item if not found.
  let dailyItems = items.filter(item => item.dt_txt.includes('12:00:00'));
  if (dailyItems.length === 0) {
    dailyItems = items.filter((_, i) => i % 8 === 0);
  }
  // Make sure we limit to 5 days
  dailyItems = dailyItems.slice(0, 5);

  return (
    <div className="w-full max-w-xl flex flex-col gap-6 mt-2">
      {/* Hourly Forecast */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-white/90">
          <Clock className="w-5 h-5 text-sky-300" />
          <h3 className="font-bold tracking-wide uppercase text-sm">Hourly Forecast (Next 24h)</h3>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x scroll-smooth">
          {hourlyItems.map(item => {
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0]?.icon;
            const desc = item.weather[0]?.description || '';
            const humidity = item.main.humidity;
            const windSpeed = units === 'imperial' 
              ? item.wind.speed.toFixed(0) 
              : (item.wind.speed * 3.6).toFixed(0);

            return (
              <div 
                key={item.dt}
                className="flex flex-col items-center justify-between p-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl min-w-[80px] snap-center transition duration-300 group"
              >
                <span className="text-xs text-white/60 font-semibold uppercase">
                  {formatLocalTime(item.dt, timezone, 'hourOnly')}
                </span>
                
                {icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                    alt={desc}
                    className="w-12 h-12 my-1 filter drop-shadow group-hover:scale-110 transition duration-300"
                  />
                )}
                
                <span className="text-base font-extrabold text-white">
                  {temp}{unitSymbol}
                </span>

                {/* Micro indicators */}
                <div className="flex flex-col gap-0.5 items-center mt-2 text-[9px] text-white/40 font-medium">
                  <span className="flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5 text-blue-300/80" />
                    {humidity}%
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-sky-300/80" />
                    {windSpeed} {windUnit.split('/')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-white/90">
          <Calendar className="w-5 h-5 text-indigo-300" />
          <h3 className="font-bold tracking-wide uppercase text-sm">5-Day Forecast</h3>
        </div>

        <div className="flex flex-col gap-3">
          {dailyItems.map(item => {
            const dayName = formatLocalTime(item.dt, timezone, 'dayOnly');
            const dateStr = formatLocalTime(item.dt, timezone, 'dateOnly');
            const icon = item.weather[0]?.icon;
            const desc = item.weather[0]?.description || '';
            const tempMin = Math.round(item.main.temp_min);
            const tempMax = Math.round(item.main.temp_max);

            return (
              <div 
                key={item.dt}
                className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition duration-300"
              >
                {/* Date */}
                <div className="w-24">
                  <p className="font-bold text-sm text-white">{dayName}</p>
                  <p className="text-xs text-white/50 font-medium">{dateStr}</p>
                </div>

                {/* Weather Status */}
                <div className="flex-1 flex items-center gap-3 pl-2">
                  {icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${icon}.png`}
                      alt={desc}
                      className="w-10 h-10 filter drop-shadow"
                    />
                  )}
                  <span className="text-xs text-white/80 font-medium capitalize hidden sm:inline truncate max-w-[120px]">
                    {desc}
                  </span>
                </div>

                {/* Apple Weather Style Temp Range Bar */}
                <div className="flex items-center justify-end gap-3 w-40 text-right">
                  <span className="text-xs text-white/40 font-semibold w-8">{tempMin}{unitSymbol}</span>
                  
                  {/* Visual temperature progress slider */}
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden relative hidden xs:block">
                    <div 
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 rounded-full"
                      style={{ left: '20%', right: '20%' }}
                    />
                  </div>

                  <span className="text-sm font-extrabold text-white w-8">{tempMax}{unitSymbol}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
