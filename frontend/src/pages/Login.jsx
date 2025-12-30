import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"

const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // email OR phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    setError("");

    if (!identifier) return setError("Email or phone is required");
    if (!password) return setError("Password is required");

    setLoading(true);

    try {
      const payload =
        /^\d+$/.test(identifier)
          ? { phone: identifier, password }
          : { email: identifier, password };

      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        payload
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log(res.data);

      // redirect later
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/images/logo.jpg" className="auth-logo" alt="logo" />

        <h2 className="auth-title">Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          className="input"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔹 REGISTER BUTTON */}
        <button
          className="btn btn-secondary"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/register")}
        >
          Create New Account
        </button>

        <p className="helper-text">
          Don’t have an account? Register now
        </p>
      </div>
    </div>
  );
};

export default Login;
