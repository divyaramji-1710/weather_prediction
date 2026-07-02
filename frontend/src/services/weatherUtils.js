// frontend/src/services/weatherUtils.js

/**
 * Formats a Unix timestamp to the city's local time using the timezone offset.
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezoneOffset - Timezone offset in seconds from UTC
 * @param {'short' | 'timeOnly' | 'dateOnly' | 'dayOnly' | 'hourOnly'} format
 * @returns {string}
 */
export function formatLocalTime(timestamp, timezoneOffset, format = 'short') {
  if (timestamp === undefined || timezoneOffset === undefined || timestamp === null) return '';
  
  // Shift the date to the target city's timezone
  // Javascript Date works in milliseconds, so convert seconds.
  const date = new Date((timestamp + timezoneOffset) * 1000);
  
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  if (format === 'timeOnly') {
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }
  
  if (format === 'hourOnly') {
    return `${displayHours} ${ampm}`;
  }
  
  if (format === 'dayOnly') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getUTCDay()];
  }
  
  if (format === 'dateOnly') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
  }
  
  // Default 'short': Thursday, Jul 2, 12:45 PM
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const dateNum = date.getUTCDate();
  
  return `${dayName}, ${monthName} ${dateNum} • ${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Returns weather background gradient and styling classes based on the current weather condition
 * @param {string} condition - Main weather condition (e.g. Rain, Clouds, Clear)
 * @param {string} iconCode - OpenWeatherMap icon code (ends in 'd' or 'n')
 * @returns {object} Theme configuration object
 */
export function getWeatherTheme(condition, iconCode) {
  const isNight = iconCode ? iconCode.endsWith('n') : false;
  
  if (isNight) {
    return {
      bgGradient: 'from-slate-950 via-slate-900 to-indigo-950',
      cardBg: 'bg-slate-950/40 border-slate-800/40 shadow-indigo-950/20',
      accentText: 'text-indigo-300',
      textColor: 'text-slate-100',
      glowColor: 'shadow-indigo-500/10',
      themeName: 'night',
    };
  }

  const cond = condition ? condition.toLowerCase() : '';
  
  if (cond.includes('clear')) {
    return {
      bgGradient: 'from-sky-400 via-orange-400 to-rose-400',
      cardBg: 'bg-white/10 border-white/20 shadow-orange-500/10',
      accentText: 'text-amber-200',
      textColor: 'text-white',
      glowColor: 'shadow-amber-500/10',
      themeName: 'clear-day',
    };
  } else if (cond.includes('cloud')) {
    return {
      bgGradient: 'from-blue-500 via-sky-500 to-slate-400',
      cardBg: 'bg-white/15 border-white/20 shadow-blue-500/10',
      accentText: 'text-sky-200',
      textColor: 'text-white',
      glowColor: 'shadow-blue-500/10',
      themeName: 'cloudy-day',
    };
  } else if (cond.includes('rain') || cond.includes('drizzle')) {
    return {
      bgGradient: 'from-slate-700 via-sky-900 to-slate-900',
      cardBg: 'bg-slate-900/30 border-slate-700/30 shadow-sky-900/10',
      accentText: 'text-sky-300',
      textColor: 'text-slate-100',
      glowColor: 'shadow-blue-500/5',
      themeName: 'rainy-day',
    };
  } else if (cond.includes('thunder')) {
    return {
      bgGradient: 'from-violet-950 via-slate-900 to-purple-950',
      cardBg: 'bg-purple-950/30 border-purple-900/30 shadow-purple-900/10',
      accentText: 'text-purple-300',
      textColor: 'text-slate-100',
      glowColor: 'shadow-purple-500/10',
      themeName: 'thunder-day',
    };
  } else if (cond.includes('snow')) {
    return {
      bgGradient: 'from-sky-300 via-blue-200 to-slate-400',
      cardBg: 'bg-white/20 border-white/30 shadow-blue-300/10',
      accentText: 'text-blue-900',
      textColor: 'text-slate-900',
      glowColor: 'shadow-sky-400/10',
      themeName: 'snowy-day',
    };
  } else {
    // Atmosphere: Mist, Haze, Smoke, Fog, etc.
    return {
      bgGradient: 'from-neutral-500 via-slate-500 to-zinc-600',
      cardBg: 'bg-white/10 border-white/20 shadow-slate-500/10',
      accentText: 'text-zinc-200',
      textColor: 'text-white',
      glowColor: 'shadow-zinc-500/10',
      themeName: 'misty-day',
    };
  }
}
