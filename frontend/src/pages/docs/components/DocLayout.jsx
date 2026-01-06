import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import "../Documentation.css";

export default function DocLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="doc-layout">
      
      {/* MOBILE HEADER */}
      <div className="doc-mobile-header">
        <button onClick={() => setOpen(true)} className="menu-btn">
          ☰
        </button>
        <span>Documentation</span>
      </div>

      {/* SIDEBAR */}
      <aside className={`doc-sidebar ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          ✕
        </button>
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      {/* CONTENT */}
      <main className="doc-content">
        <SearchBar />
        <Outlet />
      </main>
    </div>
  );
}
