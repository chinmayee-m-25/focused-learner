import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer";
import Report from "./pages/Report";
import Reschedule from "./pages/Reschedule";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video" element={<VideoPlayer />} />
        <Route path="/report" element={<Report />} />
        <Route path="/reschedule" element={<Reschedule />} />
      </Routes>
    </BrowserRouter>
  );
}