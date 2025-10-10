// src/pages/Signin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/App.css";
import "../css/auth.css";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(""); // inline message shown to user
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!email || !password) {
      setMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // call backend signin
      const res = await fetch("http://localhost:8099/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // backend returned an error (401 or 400). Show it.
        setMsg(data.error || data.message || "Signin failed. Check your credentials.");
        setLoading(false);
        return;
      }

      // success: data should include id, name, email, role (per your backend)
      localStorage.setItem("user", JSON.stringify(data));
      // optional short success alert
      alert("Signed in successfully!");
      navigate("/"); // redirect to home
    } catch (err) {
      // network error — optionally fallback to localStorage-based auth
      console.error("Signin network error:", err);
      setMsg("Network error. If you want to sign in without backend, enable local fallback.");
      // === local fallback (optional) ===
      // const users = JSON.parse(localStorage.getItem("users")) || [];
      // const user = users.find(u => u.email === email && u.password === password);
      // if (user) { localStorage.setItem('user', JSON.stringify(user)); navigate('/'); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {msg && <p className="msg error">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          autoFocus
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
