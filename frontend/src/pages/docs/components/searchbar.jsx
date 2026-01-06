import { useState } from "react";
import docs from "../data";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const results = query
    ? Object.values(docs).flatMap((doc) =>
        doc.sections
          .filter((sec) =>
            sec.title.toLowerCase().includes(query.toLowerCase())
          )
          .map((sec) => ({
            topic: doc.id,
            section: sec.id,
            title: sec.title,
          }))
      )
    : [];

  return (
    <div className="searchbar">
      <input
        placeholder="Search documentation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <ul className="search-results">
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
