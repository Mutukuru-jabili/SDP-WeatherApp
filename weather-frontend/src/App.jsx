import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Pages */
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";

/* Global layout components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Component demos (so you can visit them directly for testing) */
import Alerts from "./components/Alerts";
import FavoriteLocations from "./components/FavoriteLocations";
import ForecastItem from "./components/ForecastItem";
import ForecastList from "./components/ForecastList";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import Tips from "./components/Tips";
import WeatherCard from "./components/WeatherCard";

/* Simple NotFound fallback */
function NotFound() {
  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h2>404 — Page not found</h2>
      <p>The route you requested does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <main style={{ flex: 1, padding: "1rem 1.5rem" }}>
          <Routes>
            {/* Primary pages */}
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Component demo/test routes */}
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/weather-card" element={<WeatherCard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/favorite-locations" element={<FavoriteLocations />} />
            <Route path="/forecast-item" element={<ForecastItem />} />
            <Route path="/forecast-list" element={<ForecastList />} />
            <Route path="/map-view" element={<MapView />} />
            <Route path="/search-bar" element={<SearchBar />} />
            <Route path="/tips" element={<Tips />} />

            {/* Redirect common legacy route or explicit not-found */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
