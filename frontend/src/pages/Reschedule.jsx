import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reschedule() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("Python Basics");
  const [saved, setSaved] = useState(false);
  const schedules = JSON.parse(localStorage.getItem("schedules") || "[]");

  const saveSchedule = () => {
    if (!date || !time) { alert("Please select date and time!"); return; }
    schedules.push({ topic, date, time, id: Date.now() });
    localStorage.setItem("schedules", JSON.stringify(schedules));
    setSaved(true);
  };

  return (
    <div style={{ background: "#1a1a2e", minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ color: "#4CAF50", textAlign: "center" }}>📅 Reschedule Learning</h1>
        <p style={{ color: "gray", textAlign: "center" }}>Can't study now? Schedule for later!</p>

        <div style={{ background: "white", padding: "30px", borderRadius: "15px", marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>📚 Select Topic:</label>
          <select value={topic} onChange={e => setTopic(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", marginBottom: "15px" }}>
            <option>Python Basics</option>
            <option>Python Functions</option>
            <option>Python Lists</option>
          </select>

          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>📅 Select Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", marginBottom: "15px" }} />

          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>⏰ Select Time:</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", marginBottom: "20px" }} />

          <button onClick={saveSchedule}
            style={{ width: "100%", padding: "12px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}>
            💾 Save Schedule
          </button>

          {saved && (
            <div style={{ background: "#e8f5e9", padding: "15px", borderRadius: "8px", marginTop: "15px", textAlign: "center" }}>
              <p style={{ color: "#2e7d32", fontWeight: "bold", margin: 0 }}>
                ✅ Scheduled! {topic} on {date} at {time}
              </p>
            </div>
          )}
        </div>

        {schedules.length > 0 && (
          <div style={{ background: "white", padding: "20px", borderRadius: "15px", marginBottom: "20px" }}>
            <h3 style={{ color: "#333", margin: "0 0 15px 0" }}>📋 Your Schedules:</h3>
            {schedules.map((s, i) => (
              <div key={i} style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{s.topic}</p>
                  <p style={{ margin: 0, color: "gray", fontSize: "14px" }}>{s.date} at {s.time}</p>
                </div>
                <span style={{ color: "#4CAF50" }}>📅</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate("/dashboard")}
          style={{ width: "100%", padding: "12px", background: "#2196F3", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}>
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  );
}