import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function UploadRoadmap() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigatePath =
    user?.role === "admin" ? "admin" : "instructor";

  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !file) {
      return setError("Title and PDF file are required");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("courseId", courseId);
    formData.append("pdf", file); // MUST be "pdf"

    try {
      setLoading(true);

      const res = await api.post(
        "/api/roadmaps/upload",
        formData
      );

      if (res.status === 201 || res.data?.success) {
        navigate(`/${navigatePath}/courses`);
      } else {
        setError(
          "Upload completed but unexpected response"
        );
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload roadmap"
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
      <div className="max-w-xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Upload Roadmap
        </h1>

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
                Roadmap Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
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

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
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

            {/* FILE */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                PDF File *
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                className="
                  w-full text-sm
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-xl
                  file:border-0
                  file:bg-indigo-600 file:text-white
                  hover:file:opacity-90
                  text-gray-700 dark:text-gray-300
                "
                required
              />
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
              {loading ? "Uploading..." : "Upload Roadmap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
