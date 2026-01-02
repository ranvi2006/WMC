
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/UploadRoadmap.css";

const UploadRoadmap = () => {
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
    formData.append("roadmap", file); // field name must match multer
    try {
      setLoading(true);
      await api.post("/api/roadmaps/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/instructor/courses");
    } catch (err) {
      console.log(error);
      setError(err.response?.data?.message || "Failed to upload roadmap");
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
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>PDF File *</label>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Roadmap"}
        </button>
      </form>
    </div>
  );
};

export default UploadRoadmap;
