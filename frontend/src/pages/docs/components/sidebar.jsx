import { Link } from "react-router-dom";
import docs from "../data";

export default function sidebar() {
  return (
    <aside style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
      <h3>Documentation</h3>

      {Object.values(docs).map(doc => (
        <div key={doc.id}>
          <h4>{doc.title}</h4>
          <ul>
            {doc.sections.map(sec => (
              <li key={sec.id}>
                <Link to={`/docs/${doc.id}/${sec.id}`}>
                  {sec.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
