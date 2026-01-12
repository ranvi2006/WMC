import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
// import { updateUser } from "../store/slices/authSlice"; // optional

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= VALIDATION ================= */
  const isPhoneValid = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  };

  const hasChanges =
    name !== user?.name || phone !== user?.phone;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!isPhoneValid(phone)) {
      setError("Phone number must be exactly 10 digits (numbers only).");
      return;
    }
  
    try {
      setLoading(true);
  
      const res = await api.patch("/api/user/profile/update", {
        name,
        phone,
      });
  
      // Axios success → directly here
      console.log("Updated user:", res.data.user);
  
      // 🔁 Update redux state (IMPORTANT)
      dispatch({
        type: "auth/updateUser", // or your actual action
        payload: res.data.user,
      });
  
      alert("Profile updated successfully ✅");
  
    } catch (err) {
      setError(
        err.response?.data?.message || "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          My Profile
        </h1>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">

          {/* AVATAR */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={user?.avatar || "/images/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Change Avatar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* EMAIL (READ ONLY) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="mt-1 w-full px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
                className="mt-1 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit mobile number
              </p>
            </div>

            {/* ROLE & STATUS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border">
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                  {user?.role}
                </p>
              </div>

              <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border">
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

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600 mt-4">
                {error}
              </p>
            )}

            {/* SAVE BUTTON */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!hasChanges || loading}
                className={`
                  px-6 py-2 rounded-md font-medium transition
                  ${
                    hasChanges && !loading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
