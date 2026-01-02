import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/UploadRoadmap.css";

const UploadRoadmap = () => {
  const user=JSON.parse(localStorage.getItem("user"));
   const navigatePath =
  user?.role === "admin"
    ? 'admin'
    : 'instructor';
  
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 

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
    formData.append("pdf", file); // ✅ MUST be "pdf"

    try {
      setLoading(true);

      const res = await api.post(
        "/api/roadmaps/upload",
        formData
      );

      // ✅ Success check
      if (res.status === 201 || res.data?.success) {
        setError("");
        navigate(`/${navigatePath}/courses`);
      } else {
        setError("Upload completed but unexpected response");
      }

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(
        err.response?.data?.message || "Failed to upload roadmap"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container upload-roadmap">
      <h1>Upload Roadmap</h1>

      <form className="roadmap-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Roadmap Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>PDF File *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Roadmap"}
        </button>
      </form>
    </div>
  );
};

export default UploadRoadmap;
