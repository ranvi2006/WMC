import { useState } from "react";
import docs from "../data";
import { Link } from "react-router-dom";

export default function searchbar() {
  const [query, setQuery] = useState("");

  const results = query
    ? Object.values(docs).flatMap(doc =>
        doc.sections.filter(sec =>
          sec.title.toLowerCase().includes(query.toLowerCase())
        ).map(sec => ({
          topic: doc.id,
          section: sec.id,
          title: sec.title
        }))
      )
    : [];

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        placeholder="Search documentation..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      {query && (
        <ul>
          {results.map((r, i) => (
            <li key={i}>
              <Link to={`/docs/${r.topic}/${r.section}`}>
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
