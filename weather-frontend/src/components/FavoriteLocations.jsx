import React, { useEffect, useState } from "react";
import {
  getFavoriteLocations,
  saveFavoriteLocation,
  deleteFavoriteLocation,
  updateFavoriteLocation,
} from "../api/weatherApi";

export default function FavoriteLocations() {
  const [favorites, setFavorites] = useState([]);
  const [label, setLabel] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all favorites
  async function fetchFavorites() {
    setLoading(true);
    setMsg("");
    try {
      const res = await getFavoriteLocations();
      setFavorites(res || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setMsg("⚠️ Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Add new favorite
  async function addFavorite() {
    if (!label.trim() || !city.trim()) {
      setMsg("⚠️ Please enter both label and city.");
      return;
    }

    try {
      await saveFavoriteLocation({ name: label, city });
      setLabel("");
      setCity("");
      setMsg("✅ Location saved!");
      fetchFavorites();
    } catch (err) {
      console.error("Error saving favorite:", err);
      setMsg("⚠️ Save failed.");
    }
  }

  // Delete favorite
  async function removeFavorite(id) {
    try {
      await deleteFavoriteLocation(id);
      setMsg("🗑️ Deleted!");
      fetchFavorites();
    } catch (err) {
      console.error("Error deleting:", err);
      setMsg("⚠️ Delete failed.");
    }
  }

  // Update favorite
  async function editFavorite(id) {
    const newName = prompt("Enter new label:");
    if (!newName) return;

    try {
      await updateFavoriteLocation(id, { name: newName, city: "Unknown" });
      setMsg("✏️ Updated!");
      fetchFavorites();
    } catch (err) {
      console.error("Error updating:", err);
      setMsg("⚠️ Update failed.");
    }
  }

  return (
    <div className="favorites">
      <h3>⭐ Favorite Locations</h3>
      {msg && <p>{msg}</p>}

      <div className="fav-form">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (Home, Work)"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <button onClick={addFavorite}>Save</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {favorites.map((f) => (
            <li key={f.id}>
              <strong>{f.name}</strong> — {f.city}
              <button onClick={() => editFavorite(f.id)}>✏️</button>
              <button onClick={() => removeFavorite(f.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
