import React from "react";
import "../css/Alerts.css";

export default function Alerts({ weather }) {
  if (!weather) {
    return null; // no weather data yet
  }

  const alerts = [];

  // ✅ Temperature-based alerts
  if (weather.main?.temp < 26) {
    alerts.push("🌡️ It's cool outside — wear a sweater!");
  }
  if (weather.main?.temp > 35) {
    alerts.push("🔥 It's very hot — stay hydrated!");
  }

  // ✅ Rain-related alerts
  if (weather.weather?.[0]?.main.toLowerCase().includes("rain")) {
    alerts.push("☔ Rain expected — carry an umbrella!");
  }

  // ✅ Wind-related alerts
  if (weather.wind?.speed > 10) {
    alerts.push("💨 It's windy — be careful when going out!");
  }

  // ✅ Humidity-related alerts
  if (weather.main?.humidity > 80) {
    alerts.push("💦 High humidity — dress lightly.");
  }

  // ✅ Clear sky at night
  const isNight =
    new Date().getHours() >= 20 || new Date().getHours() <= 5; // after 8PM or before 5AM
  if (
    weather.weather?.[0]?.main.toLowerCase().includes("clear") &&
    isNight
  ) {
    alerts.push("✨ Clear sky at night — perfect for stargazing.");
  }

  // ✅ Snow
  if (weather.weather?.[0]?.main.toLowerCase().includes("snow")) {
    alerts.push("❄️ Snowy weather — wear warm clothes and boots!");
  }

  // ✅ Visibility check
  if (weather.visibility / 1000 < 1) {
    alerts.push("🌫️ Low visibility — drive carefully.");
  }

  return (
    <div className="alerts-container">
      <h3>Weather Alerts</h3>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((a, i) => (
            <li key={i} className="alert-item">
              {a}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-alerts">✅ No special alerts. Enjoy your day!</p>
      )}
    </div>
  );
}
