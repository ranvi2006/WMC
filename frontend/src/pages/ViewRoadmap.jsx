import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/ViewRoadmap.css";

const ViewRoadmap = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    let navigatePath = "/"; // default fallback

    if (user?.role === "admin") {
        navigatePath = "/admin/courses";
    } else if (user?.role === "teacher") {
        navigatePath = "/instructor/courses";
    } else if (user?.role === "student") {
        navigatePath = "/courses";
    }

    const { courseId } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                setError("");
                const res = await api.get(`/api/roadmaps/course/${courseId}`);
                setRoadmap(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "No roadmap available");
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [courseId]);

    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorState message={error} />;

    return (
        <div className="roadmap-container">
            {/* Header */}
            <header className="roadmap-header">
                <div className="header-content">
                    <Link to={navigatePath} className="back-btn">
                        ← Back to Courses
                    </Link>
                    <div className="header-info">
                        <h1 className="roadmap-title">{roadmap.title}</h1>
                        <p className="roadmap-desc">{roadmap.description}</p>
                    </div>
                </div>
            </header>

            <main className="roadmap-content">
                {/* PDF Preview */}
                <section className="pdf-section">
                    <div className="pdf-container">
                        <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(roadmap.pdfUrl)}&embedded=true`}
                            className="pdf-iframe"
                            title="Roadmap Preview"
                        />
                    </div>

                    {/* Actions */}
                    <div className="action-buttons">
                        <a
                            href={roadmap.pdfUrl}
                            download
                            className="btn primary"
                        >
                            📥 Download PDF
                        </a>
                        <a
                            href={roadmap.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn secondary"
                        >
                            🔗 Open Full Size
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
};

// Clean Skeleton
const SkeletonLoader = () => (
    <div className="roadmap-container">
        <div className="skeleton">
            <div className="skeleton-header">
                <div className="skeleton-back"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-desc"></div>
            </div>
            <div className="skeleton-pdf"></div>
        </div>
    </div>
);

// Clean Error
const ErrorState = ({ message }) => (
    <div className="roadmap-container">
        <div className="error-container">
            <div className="error-icon">📄</div>
            <h2>Roadmap Not Available</h2>
            <p>{message}</p>
            <Link to="/courses" className="btn primary">Browse Courses</Link>
        </div>
    </div>
);

export default ViewRoadmap;
