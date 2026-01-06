import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    language: "English",
    price: 0,
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.category) {
      return setError("Please fill all required fields");
    }

    try {
      setLoading(true);
      await api.post("/api/courses", form);
      navigate("/instructor/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      "
    >
      <div className="max-w-2xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Fill in the details to create a new course
        </p>

        {/* CARD */}
        <div
          className="
            rounded-2xl p-6
            bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
            border border-gray-200 dark:border-white/10
            shadow-lg
          "
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TITLE */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Course Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Web Development"
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will students learn?"
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                  resize-none
                "
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Web Development"
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                "
              />
            </div>

            {/* LEVEL */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Level
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                "
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Language
              </label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                "
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                "
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                "
              >
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {loading ? "Creating..." : "Create Course"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
