// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/App.css";
import "../css/auth.css";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(""); // error or success message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password policy: min 8, at least one uppercase, one lowercase, one digit, one special char
  const passwordIsStrong = (pwd) => {
    if (!pwd || pwd.length < 8) return false;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return hasUpper && hasLower && hasDigit && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) {
      setMsg("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }

    if (!passwordIsStrong(password)) {
      setMsg(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    setLoading(true);
    try {
      // call backend signup
      const res = await fetch("http://localhost:8099/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data.error || data.message || "Signup failed. Try again.");
        setLoading(false);
        return;
      }

      alert("Signup successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      console.error("Signup network error:", err);
      setMsg("Network error. Could not reach server.");
      // optional local-only signup fallback:
      // const users = JSON.parse(localStorage.getItem('users')) || [];
      // if (users.find(u => u.email === email)) { setMsg("User exists"); setLoading(false); return; }
      // users.push({ name, email, password }); localStorage.setItem('users', JSON.stringify(users)); alert('Local signup OK'); navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  // For UX: show password strength hints
  const renderPasswordHints = () => {
    const hints = [
      { ok: password.length >= 8, text: "At least 8 characters" },
      { ok: /[A-Z]/.test(password), text: "Uppercase letter" },
      { ok: /[a-z]/.test(password), text: "Lowercase letter" },
      { ok: /[0-9]/.test(password), text: "A number" },
      { ok: /[^A-Za-z0-9]/.test(password), text: "A special character" },
    ];
    return (
      <ul className="password-hints">
        {hints.map((h, i) => (
          <li key={i} style={{ color: h.ok ? "green" : "#666" }}>
            {h.ok ? "✓" : "•"} {h.text}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {msg && <p className="msg error">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
          autoFocus
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        {renderPasswordHints()}
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          type="password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
}
