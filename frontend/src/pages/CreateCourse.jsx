import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CreateCourses.css";

const CreateCourse = () => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.category) {
      return setError("Please fill all required fields");
    }

    try {
      setLoading(true);
      const res=await api.post("/api/courses", form);
      // console.log("Create Course",res.data );
      navigate("/instructor/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-course">
      <h1>Create New Course</h1>
      <p className="subtitle">
        Fill in the details to create a new course
      </p>

      <form className="course-form" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Course Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Full Stack Web Development"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What will students learn?"
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category *</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Web Development"
          />
        </div>

        {/* Level */}
        <div className="form-group">
          <label>Level</label>
          <select name="level" value={form.level} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Language */}
        <div className="form-group">
          <label>Language</label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Publish</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
