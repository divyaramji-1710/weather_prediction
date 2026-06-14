import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8000/weather/current?city=${city}`
      );

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      alert("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="overlay">

        <h1 className="title">☁️ Weather Dashboard</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button onClick={fetchWeather}>
            Search
          </button>
        </div>

        {loading && (
          <div className="loader"></div>
        )}

        {weather && (
          <div className="weather-card">

            <div className="weather-main">
              <div className="temp">
                {Math.round(weather.temperature)}°
              </div>

              <div>
                <h2>{weather.city}</h2>
                <p>{weather.description}</p>
              </div>
            </div>

            <div className="stats">

              <div className="stat-card">
                <h3>💧</h3>
                <p>{weather.humidity}%</p>
                <span>Humidity</span>
              </div>

              <div className="stat-card">
                <h3>💨</h3>
                <p>{weather.wind_speed}</p>
                <span>Wind</span>
              </div>

              <div className="stat-card">
                <h3>🌡</h3>
                <p>{weather.temperature}°</p>
                <span>Feels Like</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;