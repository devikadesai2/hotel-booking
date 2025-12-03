import React, { useState, useEffect } from "react";
import API from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    if (!token || !raw) return;

    try {
      const user = JSON.parse(raw);
      if (user?.role === "admin") navigate("/admin");
      else navigate("/");
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [navigate]);

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error;
      alert(msg || "Login failed");
    }
  }

  return (
    <div className="container">
      <form className="form" onSubmit={submit}>
        <h2 style={{ marginTop: 0 }}>Sign in</h2>

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">
          Login
        </button>

        <p className="small" style={{ marginTop: 12 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
