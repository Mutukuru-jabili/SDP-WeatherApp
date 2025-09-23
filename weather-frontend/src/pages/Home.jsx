import React, { useState } from "react";
import {
  fetchCurrentWeatherByCity,
  fetchForecastByCity,
  getAlerts,
} from "../api/weatherApi";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import Alerts from "../components/Alerts";

console.log("Weather API URL:", import.meta.env.VITE_WEATHER_API_URL);
console.log("Weather API KEY:", import.meta.env.VITE_WEATHER_API_KEY);

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");

  const onSearch = async () => {
    if (!query) return;
    setLoading(true);
    setMsg("");

    try {
      const [cur, f, a] = await Promise.all([
        fetchCurrentWeatherByCity(query),
        fetchForecastByCity(query),
        getAlerts(query),
      ]);

      setWeather(cur);
      // normalize forecast
      setForecast(f.daily || f.list || f.days || []);
      setAlerts(a || []);
    } catch (err) {
      console.error("Weather fetch failed:", err);
      setMsg("⚠️ Could not fetch weather for " + query);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
  

      {/* Header */}
      <header className="home-header">
        <h1 className="app-title">🌤️ WeatherPro</h1>
        <p className="subtitle">
          Get accurate weather information and forecasts for any city worldwide
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button onClick={onSearch}>Search</button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Weather Card */}
        <section className="weather-card">
          {loading && <p>⏳ Fetching latest weather...</p>}
          {msg && <p className="msg error">{msg}</p>}

          {weather ? (
            <>
              <div className="weather-header">
                <h2>{weather.name}</h2>
                <span className="country">{weather.sys?.country}</span>
                <div className="temp">{Math.round(weather.main?.temp)}°</div>
                <p className="desc">{weather.weather?.[0]?.description}</p>
              </div>

              <div className="weather-details">
                <div>
                  <span>Humidity</span>
                  <strong>{weather.main?.humidity}%</strong>
                </div>
                <div>
                  <span>Wind</span>
                  <strong>{weather.wind?.speed} m/s</strong>
                </div>
                <div>
                  <span>Visibility</span>
                  <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
                </div>
                <div>
                  <span>Pressure</span>
                  <strong>{weather.main?.pressure} hPa</strong>
                </div>
              </div>
              <p className="feels-like">
                Feels like {Math.round(weather.main?.feels_like)}°
              </p>

              {/* ✅ Weather Alerts */}
              <Alerts weather={weather} />
            </>
          ) : (
            !loading && <p>🔍 Search for a city to see weather details.</p>
          )}
        </section>

        {/* Forecast List */}
        <aside className="forecast">
          <h3>5-Day Forecast</h3>
          {forecast.length > 0 ? (
            <ul>
              {forecast.slice(0, 5).map((day, idx) => (
                <li key={idx}>
                  <div className="forecast-day">
                    <span>
                      {idx === 0
                        ? "Today"
                        : idx === 1
                        ? "Tomorrow"
                        : `Day ${idx + 1}`}
                    </span>
                    <span className="forecast-desc">
                      {day.weather?.[0]?.description || "—"}
                    </span>
                  </div>
                  <div className="forecast-temp">
                    {Math.round(day.temp?.day || day.main?.temp || 0)}°
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No forecast data</p>
          )}
        </aside>
      </div>
    </div>
  );
}
