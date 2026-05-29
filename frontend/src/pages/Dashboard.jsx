import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState([]);
  const [topics, setTopics] = useState([]);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newVideo, setNewVideo] = useState("");
  const user = localStorage.getItem("currentUser") || "Student";

  useEffect(() => {
    const done = JSON.parse(
      localStorage.getItem(`completed_${user}`) || "[]"
    );
    setCompleted(done);
    const saved = JSON.parse(localStorage.getItem("topics") || "[]");
    if (saved.length === 0) {
      const defaults = [
        { id: 1, title: "Python Basics",
          video: "https://www.youtube.com/embed/kqtD5dpn9C8" },
        { id: 2, title: "Python Functions",
          video: "https://www.youtube.com/embed/_uQrJ0TkZlc" },
        { id: 3, title: "Python Lists",
          video: "https://www.youtube.com/embed/W8KRzm-HUcc" },
      ];
      localStorage.setItem("topics", JSON.stringify(defaults));
      setTopics(defaults);
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
    const newItem = {
      id: Date.now(),
      title: newTopic,
      video: embedUrl
    };
    const updated = [...topics, newItem];
    localStorage.setItem("topics", JSON.stringify(updated));
    setTopics(updated);
    setNewTopic("");
    setNewVideo("");
    setShowAddTopic(false);
    alert(`✅ "${newTopic}" added successfully!`);
  };

  const deleteTopic = (id) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      const updated = topics.filter(t => t.id !== id);
      localStorage.setItem("topics", JSON.stringify(updated));
      setTopics(updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentEmail");
    window.location.href = "/";
  };

  return (
    <div style={{
      background: "#1a1a2e",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
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
              Choose your topic to start learning!
            </p>
          </div>
          <button onClick={handleLogout}
            style={{
              background: "#f44336", color: "white",
              border: "none", padding: "10px 20px",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "14px", fontWeight: "bold"
            }}>
            🚪 Logout
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: "#0d47a1", padding: "15px",
          borderRadius: "12px", marginBottom: "20px",
          textAlign: "center"
        }}>
          <p style={{
            color: "white", margin: "0 0 8px 0",
            fontWeight: "bold", fontSize: "15px"
          }}>
            ✅ {completed.length} / {topics.length} Topics Completed
          </p>
          <div style={{
            background: "#1565c0", borderRadius: "10px",
            height: "14px", overflow: "hidden"
          }}>
            <div style={{
              background: "linear-gradient(90deg, #4CAF50, #2196F3)",
              height: "100%",
              width: topics.length > 0
                ? `${(completed.length / topics.length) * 100}%`
                : "0%",
              transition: "width 0.5s",
              borderRadius: "10px"
            }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)",
            margin: "6px 0 0 0", fontSize: "13px" }}>
            {topics.length > 0
              ? `${Math.round((completed.length / topics.length) * 100)}% Complete`
              : "Add topics to start!"}
          </p>
        </div>

        {/* Add Topic Button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            onClick={() => setShowAddTopic(!showAddTopic)}
            style={{
              background: showAddTopic ? "#f44336" : "#9C27B0",
              color: "white", border: "none",
              padding: "12px 28px", borderRadius: "8px",
              cursor: "pointer", fontSize: "15px",
              fontWeight: "bold"
            }}>
            {showAddTopic ? "❌ Cancel" : "➕ Add Your Own Topic"}
          </button>
        </div>

        {/* Add Topic Form */}
        {showAddTopic && (
          <div style={{
            background: "white", padding: "25px",
            borderRadius: "12px", marginBottom: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
              ➕ Add New Topic
            </h3>

            <label style={{
              fontWeight: "bold", color: "#555",
              display: "block", marginBottom: "5px"
            }}>
              📚 Topic Name:
            </label>
            <input
              type="text"
              placeholder="Example: JavaScript, React, Java, HTML, Data Science"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              style={{
                width: "100%", padding: "12px",
                borderRadius: "8px", border: "1.5px solid #ddd",
                fontSize: "15px", marginBottom: "15px",
                boxSizing: "border-box"
              }}
            />

            <label style={{
              fontWeight: "bold", color: "#555",
              display: "block", marginBottom: "5px"
            }}>
              🎬 YouTube Video Link:
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={newVideo}
              onChange={e => setNewVideo(e.target.value)}
              style={{
                width: "100%", padding: "12px",
                borderRadius: "8px", border: "1.5px solid #ddd",
                fontSize: "15px", marginBottom: "8px",
                boxSizing: "border-box"
              }}
            />
            <p style={{ color: "gray", fontSize: "13px",
              margin: "0 0 15px 0" }}>
              💡 Go to YouTube → Copy URL from address bar → Paste here!
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={addTopic}
                style={{
                  flex: 1, background: "#4CAF50", color: "white",
                  border: "none", padding: "12px",
                  borderRadius: "8px", cursor: "pointer",
                  fontSize: "15px", fontWeight: "bold"
                }}>
                💾 Save Topic
              </button>
              <button onClick={() => setShowAddTopic(false)}
                style={{
                  flex: 1, background: "#f44336", color: "white",
                  border: "none", padding: "12px",
                  borderRadius: "8px", cursor: "pointer",
                  fontSize: "15px", fontWeight: "bold"
                }}>
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {topics.length === 0 && (
          <div style={{
            textAlign: "center", padding: "50px 20px",
            color: "gray"
          }}>
            <p style={{ fontSize: "50px", margin: "0 0 15px" }}>📚</p>
            <p style={{ fontSize: "18px", margin: "0 0 8px" }}>
              No topics yet!
            </p>
            <p style={{ fontSize: "14px" }}>
              Click "Add Your Own Topic" to start learning!
            </p>
          </div>
        )}

        {/* Topic List */}
        {topics.map((topic, index) => {
          const isUnlocked = index === 0 ||
            completed.includes(topics[index - 1].id);
          const isDone = completed.includes(topic.id);

          return (
            <div key={topic.id} style={{
              background: isDone ? "#1b5e20"
                : isUnlocked ? "white" : "#2a2a3e",
              padding: "20px", borderRadius: "12px",
              marginBottom: "15px", display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: isUnlocked
                ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
              border: isDone ? "1px solid #4CAF50"
                : isUnlocked ? "1px solid #ddd"
                : "1px solid #333"
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: isDone ? "white"
                    : isUnlocked ? "#1a1a2e" : "#666",
                  margin: "0 0 5px 0", fontSize: "17px"
                }}>
                  {isDone ? "✅" : isUnlocked ? "▶️" : "🔒"} {topic.title}
                </h3>
                <p style={{
                  color: isDone ? "#a5d6a7"
                    : isUnlocked ? "#666" : "#555",
                  margin: 0, fontSize: "13px"
                }}>
                  {isDone ? "🎉 Completed!"
                    : isUnlocked ? "Ready to learn!"
                    : "Complete previous topic first!"}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px",
                marginLeft: "15px" }}>
                <button
                  onClick={() => startTopic(topic, index)}
                  disabled={!isUnlocked}
                  style={{
                    background: isDone ? "#2196F3"
                      : isUnlocked ? "#4CAF50" : "#444",
                    color: "white", border: "none",
                    padding: "10px 18px", borderRadius: "8px",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    fontSize: "14px", fontWeight: "bold",
                    whiteSpace: "nowrap"
                  }}>
                  {isDone ? "🔄 Review" : "▶️ Start"}
                </button>
                <button onClick={() => deleteTopic(topic.id)}
                  style={{
                    background: "#f44336", color: "white",
                    border: "none", padding: "10px 14px",
                    borderRadius: "8px", cursor: "pointer",
                    fontSize: "16px"
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
          justifyContent: "center", flexWrap: "wrap",
          paddingBottom: "80px"
        }}>
          <button onClick={() => navigate("/reschedule")}
            style={{
              background: "#FF9800", color: "white",
              border: "none", padding: "12px 28px",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "15px", fontWeight: "bold"
            }}>
            📅 Reschedule
          </button>
          <button onClick={() => navigate("/report")}
            style={{
              background: "#2196F3", color: "white",
              border: "none", padding: "12px 28px",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "15px", fontWeight: "bold"
            }}>
            📊 My Report
          </button>
        </div>

      </div>

  
    </div>
  );
}