import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { logout } from "../../store/slices/authSlice";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= PASSWORD STATES ================= */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= DEACTIVATE STATE ================= */
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  /* ================= CHANGE PASSWORD ================= */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch("/api/user/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess(res.data.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message || "Password update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEACTIVATE ACCOUNT ================= */
  const handleDeactivateAccount = async () => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate your account? You will be logged out immediately."
    );

    if (!confirmDeactivate) return;

    try {
      setDeactivateLoading(true);

      await api.patch("/api/user/deactivate");

      dispatch(logout());
      navigate("/login");

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to deactivate account"
      );
    } finally {
      setDeactivateLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h1>

        {/* ================= SECURITY ================= */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* SUCCESS */}
            {success && (
              <p className="text-sm text-green-600">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-2 rounded-md font-medium transition
                ${
                  loading
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* ================= ACCOUNT INFO ================= */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {user?.email}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border">
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-medium capitalize text-gray-800 dark:text-gray-200">
                {user?.role}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border">
              <p className="text-xs text-gray-500">Email Status</p>
              <p
                className={`font-medium ${
                  user?.isVerified
                    ? "text-green-600"
                    : "text-yellow-500"
                }`}
              >
                {user?.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <div className="bg-white dark:bg-gray-900 border border-red-300 dark:border-red-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Danger Zone
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Deactivating your account will disable access and log you out immediately.
            You can contact support to reactivate your account later.
          </p>

          <button
            onClick={handleDeactivateAccount}
            disabled={deactivateLoading}
            className={`
              px-6 py-2 rounded-md font-medium transition
              border border-red-600
              ${
                deactivateLoading
                  ? "bg-red-200 text-red-500 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              }
            `}
          >
            {deactivateLoading
              ? "Deactivating..."
              : "Deactivate Account"}
          </button>
        </div>

      </div>
    </section>
  );
};

export default Settings;
