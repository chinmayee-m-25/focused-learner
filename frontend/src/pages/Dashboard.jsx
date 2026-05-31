import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_TOPICS = [
  { id: 1, title: "Python Basics",     video: "https://www.youtube.com/embed/kqtD5dpn9C8" },
  { id: 2, title: "Python Functions",  video: "https://www.youtube.com/embed/_uQrJ0TkZlc" },
  { id: 3, title: "Python Lists",      video: "https://www.youtube.com/embed/W8KRzm-HUcc" },
];

export default function Dashboard() {
  const navigate  = useNavigate();
  const user      = localStorage.getItem("currentUser") || "Student";
  const userEmail = localStorage.getItem("userEmail")   || user;

  // ── Per-user keys ─────────────────────────────────────────────────────────
  const TOPICS_KEY    = `topics_${userEmail}`;
  const COMPLETED_KEY = `completed_${userEmail}`;

  const [completed,     setCompleted]     = useState([]);
  const [topics,        setTopics]        = useState([]);
  const [showAddTopic,  setShowAddTopic]  = useState(false);
  const [newTopic,      setNewTopic]      = useState("");
  const [newVideo,      setNewVideo]      = useState("");

  useEffect(() => {
    // Load this user's completed topics
    const done = JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]");
    setCompleted(done);

    // Load this user's own topics
    const saved = JSON.parse(localStorage.getItem(TOPICS_KEY) || "[]");
    if (saved.length === 0) {
      // First time — give default topics
      localStorage.setItem(TOPICS_KEY, JSON.stringify(DEFAULT_TOPICS));
      setTopics(DEFAULT_TOPICS);
    } else {
      setTopics(saved);
    }
  }, []);

  const startTopic = (topic, index) => {
    if (index === 0 || completed.includes(topics[index - 1].id)) {
      navigate("/video", { state: { topic } });
    } else {
      alert("🔒 Complete previous topic first!");
    }
  };

  const addTopic = () => {
    if (!newTopic || !newVideo) {
      alert("Please enter topic name and YouTube link!");
      return;
    }
    let embedUrl = newVideo;
    if (newVideo.includes("watch?v=")) {
      const videoId = newVideo.split("watch?v=")[1].split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (newVideo.includes("youtu.be/")) {
      const videoId = newVideo.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    const newItem = { id: Date.now(), title: newTopic, video: embedUrl };
    const updated = [...topics, newItem];
    localStorage.setItem(TOPICS_KEY, JSON.stringify(updated));
    setTopics(updated);
    setNewTopic("");
    setNewVideo("");
    setShowAddTopic(false);
    alert(`✅ "${newTopic}" added to your dashboard!`);
  };

  const deleteTopic = (id) => {
    if (window.confirm("Delete this topic from your dashboard?")) {
      const updated = topics.filter(t => t.id !== id);
      localStorage.setItem(TOPICS_KEY, JSON.stringify(updated));
      setTopics(updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentEmail");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <div style={{
      background: "#1a1a2e", minHeight: "100vh",
      padding: "20px", fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "20px",
          flexWrap: "wrap", gap: "10px"
        }}>
          <div>
            <h1 style={{ color: "#4CAF50", margin: 0, fontSize: "26px" }}>
              🎓 Welcome, {user}!
            </h1>
            <p style={{ color: "gray", margin: "4px 0 0 0", fontSize: "14px" }}>
              Your personal learning dashboard
            </p>
          </div>
          <button onClick={handleLogout} style={{
            background: "#f44336", color: "white", border: "none",
            padding: "10px 20px", borderRadius: "8px",
            cursor: "pointer", fontSize: "14px", fontWeight: "bold"
          }}>
            🚪 Logout
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: "#0d47a1", padding: "15px",
          borderRadius: "12px", marginBottom: "20px", textAlign: "center"
        }}>
          <p style={{ color: "white", margin: "0 0 8px 0", fontWeight: "bold", fontSize: "15px" }}>
            ✅ {completed.length} / {topics.length} Topics Completed
          </p>
          <div style={{ background: "#1565c0", borderRadius: "10px", height: "14px", overflow: "hidden" }}>
            <div style={{
              background: "linear-gradient(90deg, #4CAF50, #2196F3)",
              height: "100%",
              width: topics.length > 0 ? `${(completed.length / topics.length) * 100}%` : "0%",
              transition: "width 0.5s", borderRadius: "10px"
            }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: "6px 0 0 0", fontSize: "13px" }}>
            {topics.length > 0
              ? `${Math.round((completed.length / topics.length) * 100)}% Complete`
              : "Add your own topics to start!"}
          </p>
        </div>

        {/* Add Topic Button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            onClick={() => setShowAddTopic(!showAddTopic)}
            style={{
              background: showAddTopic ? "#f44336" : "#9C27B0",
              color: "white", border: "none", padding: "12px 28px",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "15px", fontWeight: "bold"
            }}>
            {showAddTopic ? "✕ Cancel" : "➕ Add Your Topic"}
          </button>
        </div>

        {/* Add Topic Form */}
        {showAddTopic && (
          <div style={{
            background: "#16213e", padding: "20px",
            borderRadius: "12px", marginBottom: "20px",
            border: "1px solid #9C27B0"
          }}>
            <h3 style={{ color: "#9C27B0", margin: "0 0 15px 0" }}>
              ➕ Add Your Own Topic
            </h3>
            <input
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              placeholder="Topic name (e.g. Data Structures)"
              style={{
                width: "100%", padding: "10px", marginBottom: "10px",
                borderRadius: "8px", border: "1px solid #444",
                background: "#1a1a2e", color: "white",
                fontSize: "14px", boxSizing: "border-box"
              }}
            />
            <input
              value={newVideo}
              onChange={e => setNewVideo(e.target.value)}
              placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)"
              style={{
                width: "100%", padding: "10px", marginBottom: "10px",
                borderRadius: "8px", border: "1px solid #444",
                background: "#1a1a2e", color: "white",
                fontSize: "14px", boxSizing: "border-box"
              }}
            />
            <button onClick={addTopic} style={{
              background: "#4CAF50", color: "white", border: "none",
              padding: "10px 25px", borderRadius: "8px",
              cursor: "pointer", fontSize: "14px", fontWeight: "bold"
            }}>
              ✅ Add Topic
            </button>
          </div>
        )}

        {/* Topics List */}
        {topics.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "gray" }}>
            <p style={{ fontSize: "40px" }}>📚</p>
            <p>No topics yet! Click "Add Your Topic" to get started.</p>
          </div>
        )}

        {topics.map((topic, index) => {
          const isDone      = completed.includes(topic.id);
          const isUnlocked  = index === 0 || completed.includes(topics[index - 1].id);

          return (
            <div key={topic.id} style={{
              background: isDone ? "#1b5e20" : isUnlocked ? "#16213e" : "#0d0d1a",
              border: `2px solid ${isDone ? "#4CAF50" : isUnlocked ? "#2196F3" : "#333"}`,
              borderRadius: "12px", padding: "16px", marginBottom: "12px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
              opacity: isUnlocked ? 1 : 0.6
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>
                  {isDone ? "✅" : isUnlocked ? "▶️" : "🔒"}
                </span>
                <div>
                  <h3 style={{
                    color: isDone ? "#a5d6a7" : isUnlocked ? "white" : "#666",
                    margin: 0, fontSize: "16px"
                  }}>
                    {topic.title}
                  </h3>
                  <p style={{
                    color: isDone ? "#a5d6a7" : isUnlocked ? "#666" : "#555",
                    margin: 0, fontSize: "13px"
                  }}>
                    {isDone ? "🎉 Completed!"
                      : isUnlocked ? "Ready to learn!"
                      : "Complete previous topic first!"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginLeft: "15px" }}>
                <button
                  onClick={() => startTopic(topic, index)}
                  disabled={!isUnlocked}
                  style={{
                    background: isDone ? "#2196F3" : isUnlocked ? "#4CAF50" : "#444",
                    color: "white", border: "none", padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    fontSize: "14px", fontWeight: "bold", whiteSpace: "nowrap"
                  }}>
                  {isDone ? "🔄 Review" : "▶️ Start"}
                </button>
                <button onClick={() => deleteTopic(topic.id)} style={{
                  background: "#f44336", color: "white", border: "none",
                  padding: "10px 14px", borderRadius: "8px",
                  cursor: "pointer", fontSize: "16px"
                }}>
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {/* Bottom Buttons */}
        <div style={{
          textAlign: "center", marginTop: "25px",
          display: "flex", gap: "12px",
          justifyContent: "center", flexWrap: "wrap", paddingBottom: "80px"
        }}>
          <button onClick={() => navigate("/reschedule")} style={{
            background: "#FF9800", color: "white", border: "none",
            padding: "12px 28px", borderRadius: "8px",
            cursor: "pointer", fontSize: "15px", fontWeight: "bold"
          }}>
            📅 Reschedule
          </button>
          <button onClick={() => navigate("/report")} style={{
            background: "#2196F3", color: "white", border: "none",
            padding: "12px 28px", borderRadius: "8px",
            cursor: "pointer", fontSize: "15px", fontWeight: "bold"
          }}>
            📊 My Report
          </button>
        </div>

      </div>
    </div>
  );
}
