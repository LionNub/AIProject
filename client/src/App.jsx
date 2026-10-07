import { Navigate, Route, Routes } from "react-router-dom";
import FormPage from "./pages/FormPage.jsx";
import LogPage from "./pages/LogPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/log" element={<LogPage />} />
      <Route path="/admin" element={<Navigate to="/log" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
