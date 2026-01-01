import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { loginSuccess } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!identifier || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const payload = /^\d+$/.test(identifier)
      ? { phone: identifier, password }
      : { email: identifier, password };

    try {
      const res = await loginUser(payload);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <img
          src="/images/logo.jpg"
          alt="We Make Coder Logo"
          className="auth-logo"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue your learning journey</p>

        {error && <div className="error">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="identifier">
              Email or Phone
            </label>
            <input
              id="identifier"
              type="text"
              className="input"
              placeholder="Enter your email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "var(--spacing-sm)" }}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
