import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email | otp | reset | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!email) return setError("Email is required");

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/send-email", { email });
      setSuccess(res.data.message);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (!otp) return setError("OTP is required");

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/verify-otp", { email, otp });
      setSuccess(res.data.message);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async () => {
    if (!newPassword) return setError("Password is required");

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/reset-password", {
        email,
        otp,
        newPassword
      });
      setSuccess(res.data.message);
      setStep("done");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex justify-center px-4
        pt-20 sm:pt-24
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
          h-fit
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/CompanyLogo.png"
            alt="Logo"
            className="h-12"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1 mb-6">
          Reset your account password securely
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 text-sm text-green-600 dark:text-green-400 text-center">
            {success}
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Registered Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-3 text-sm mb-4
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="
                w-full px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-3 text-sm mb-4
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="
                w-full px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3: RESET */}
        {step === "reset" && (
          <>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-3 text-sm mb-4
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="
                w-full px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        {/* STEP 4: DONE */}
        {step === "done" && (
          <p className="text-center text-sm text-gray-700 dark:text-gray-300">
            Password reset successful. <br />
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Go to Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
