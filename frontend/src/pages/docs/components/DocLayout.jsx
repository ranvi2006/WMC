import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import SearchBar from "./searchbar";
export default function DocLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <SearchBar />
        <Outlet />
      </main>
    </div>
  );
}
