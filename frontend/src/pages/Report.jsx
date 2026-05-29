import { useNavigate } from "react-router-dom";

export default function Report() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") || "Student";
  const completed = JSON.parse(localStorage.getItem("completed") || "[]");

  const allTopics = [
    { id: 1, title: "Python Basics" },
    { id: 2, title: "Python Functions" },
    { id: 3, title: "Python Lists" },
  ];

  return (
    <div style={{ background: "#1a1a2e", minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <h1 style={{ color: "#4CAF50", textAlign: "center" }}>
          📊 My Learning Report
        </h1>
        <p style={{ color: "gray", textAlign: "center" }}>
          Student: {user}
        </p>

        {/* Score Summary */}
        <div style={{
          background: "#0d47a1",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "white", margin: 0 }}>
            ✅ {completed.length} / {allTopics.length} Topics Completed
          </h2>
          <div style={{
            background: "#1565c0",
            borderRadius: "10px",
            height: "20px",
            marginTop: "15px",
            overflow: "hidden"
          }}>
            <div style={{
              background: "#4CAF50",
              height: "100%",
              width: `${(completed.length / allTopics.length) * 100}%`,
              transition: "width 0.5s"
            }} />
          </div>
          <p style={{ color: "white", marginTop: "10px" }}>
            {Math.round((completed.length / allTopics.length) * 100)}% Complete
          </p>
        </div>

        {/* Topic List */}
        {allTopics.map(topic => {
          const isDone = completed.includes(topic.id);
          return (
            <div key={topic.id} style={{
              background: isDone ? "#1b5e20" : "#333",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ color: "white", margin: 0 }}>
                  {isDone ? "✅" : "⏳"} {topic.title}
                </h3>
                <p style={{ color: "gray", margin: "5px 0 0 0" }}>
                  {isDone ? "Completed! 🎉" : "Not completed yet"}
                </p>
              </div>
              <span style={{
                background: isDone ? "#4CAF50" : "#555",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "14px"
              }}>
                {isDone ? "Done ✓" : "Pending"}
              </span>
            </div>
          );
        })}

        {/* Buttons */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => navigate("/dashboard")}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              marginRight: "10px"
            }}>
            🏠 Back to Dashboard
          </button>
          <button onClick={() => {
            localStorage.removeItem("completed");
            window.location.reload();
          }}
            style={{
              background: "#f44336",
              color: "white",
              border: "none",
              padding: "12px 30px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}>
            🔄 Reset Progress
          </button>
        </div>

      </div>
    </div>
  );
}