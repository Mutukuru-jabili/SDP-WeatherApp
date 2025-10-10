# Weather App — Fullstack (React + Vite, Spring Boot, MySQL)

## Structure
- weather-frontend: React + Vite frontend
- weather-backend: Spring Boot backend (Maven)

## Quick start (backend)
1. Install Java 17 and Maven.
2. Create MySQL database and update `src/main/resources/application.properties` with your username/password.
3. Run MySQL and create schema: see `schema.sql`.
4. From `weather-backend` directory run: `./mvnw spring-boot:run` or `mvn spring-boot:run`

## Quick start (frontend)
1. Install Node 18+ and npm.
2. In `weather-frontend` run: `npm install` then `npm run dev`
3. Open `http://localhost:5173` and use the search bar to query (backend at http://localhost:8080)

## Notes
- The backend currently returns mocked weather; integrate OpenWeatherMap or other provider in `WeatherService` using the `OPEN_WEATHER_API_KEY` env var.
- Update `.env` in the frontend with `VITE_API_BASE` if your backend is on a different host/port.
