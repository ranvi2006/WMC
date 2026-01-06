import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { loginSuccess } from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      return setError("Please fill in all fields");
    }

    const payload = /^\d+$/.test(identifier)
      ? { phone: identifier, password }
      : { email: identifier, password };

    try {
      setLoading(true);
      const res = await loginUser(payload);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl p-6
          bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
          border border-gray-200 dark:border-white/10
          shadow-xl
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/CompanyLogo.png"
            alt="Logo"
            className="h-12"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1 mb-6">
          Sign in to continue your learning journey
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* IDENTIFIER */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email or Phone
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone number"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-2 px-6 py-3 rounded-xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white text-sm font-semibold
              shadow-lg shadow-purple-600/30
              hover:opacity-90 transition
              disabled:opacity-50
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
