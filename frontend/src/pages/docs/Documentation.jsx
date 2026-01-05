import { Routes, Route } from "react-router-dom";
import DocLayout from "./components/DocLayout";
import DocsHome from "./pages/DocsHome";
import DocPage from "./pages/DocPage";
import "../docs/Documentation.css";

export default function Documentation() {
  return (
    <Routes>
      <Route path="/" element={<DocLayout />}>
        <Route index element={<DocsHome />} />
        <Route path=":topic/:section?" element={<DocPage />} />
      </Route>
    </Routes>
  );
}
