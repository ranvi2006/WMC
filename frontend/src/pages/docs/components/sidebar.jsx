import { Link } from "react-router-dom";
import docs from "../data";

export default function Sidebar({ onNavigate }) {
  return (
    <div className="sidebar-inner">
      <h3>Documentation</h3>

      {Object.values(docs).map((doc) => (
        <div key={doc.id}>
          <h4>{doc.title}</h4>
          <ul>
            {doc.sections.map((sec) => (
              <li key={sec.id}>
                <Link
                  to={`/docs/${doc.id}/${sec.id}`}
                  onClick={onNavigate}
                >
                  {sec.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
