import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/CreateCourses.css";

const EditCourse = () => {
  const { courseId } = useParams();
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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/courses/${courseId}`);
        setForm(res.data.data);
      } catch (err) {
        setError("Failed to load course");
      }
    };
    fetchCourse();
  }, [courseId]);

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
      await api.put(`/api/courses/${courseId}`, form);
      navigate("/instructor/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-course">
      <h1>Edit Course</h1>
      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Title *</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <input name="category" value={form.category} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Level</label>
          <select name="level" value={form.level} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <input name="language" value={form.language} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Publish</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
