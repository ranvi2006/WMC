import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { registerUser } from "../services/authService";
import { loginSuccess } from "../store/slices/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [step, setStep] = useState("email"); // email | otp | register
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLERS ================= */

  const sendOtp = async () => {
    if (!email) return setError("Email is required");

    try {
      setLoading(true);
      setError("");

      await api.post("/send-email", { email });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setError("Enter the OTP");

    try {
      setLoading(true);
      setError("");

      await api.post("/verify-otp", { email, otp });
      setStep("register");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.password) {
      return setError("Please fill all fields");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      setError("");

      const res = await registerUser({
        ...formData,
        email,
      });

      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
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
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          Verify your email to get started
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}

        {/* ================= STEP 1: EMAIL ================= */}
        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm mb-4
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                hover:opacity-90 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* ================= STEP 2: OTP ================= */}
        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm mb-4
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                hover:opacity-90 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ================= STEP 3: REGISTER ================= */}
        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white"
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                hover:opacity-90 transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
