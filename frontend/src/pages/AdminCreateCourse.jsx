import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminCreateCourse = () => {
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

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.category) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/courses", form);
      console.log("Create Course:", res.data);
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6">

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Create New Course
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Fill in the details to create a new course
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Web Development"
              className="w-full px-3 py-2 rounded border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-900
                         text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will students learn?"
              rows={4}
              className="w-full px-3 py-2 rounded border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-900
                         text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Web Development"
              className="w-full px-3 py-2 rounded border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-900
                         text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* GRID: LEVEL + LANGUAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* LEVEL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Level
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border
                           border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-900
                           text-gray-900 dark:text-gray-100"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Language
              </label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border
                           border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-900
                           text-gray-900 dark:text-gray-100"
              />
            </div>

          </div>

          {/* GRID: PRICE + STATUS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border
                           border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-900
                           text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border
                           border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-900
                           text-gray-900 dark:text-gray-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600
                       text-white px-6 py-2 rounded font-medium
                       disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminCreateCourse;
