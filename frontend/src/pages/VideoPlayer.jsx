import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FunBreak from "./FunBreak";
import SleepDetector from "./SleepDetector";
import AIAssistant from "../components/AIAssistant";
import EmotionDetector from "../components/EmotionDetector";
import WellnessScorecard from "../components/WellnessScorecard";
import { getQuestionsForTopic } from "../data/quizData";

export default function VideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic;
  const videoRef = useRef(null);
  const [sessionStart] = useState(Date.now());
  const [sleepAlerts, setSleepAlerts] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showFunBreak, setShowFunBreak] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [score, setScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const funBreakRef = useRef(null);
  const user = localStorage.getItem("currentUser") || "Student";

  const getDefaultQuestions = () => [
    {
      q: `What is the time complexity of binary search?`,
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: "O(log n)"
    },
    {
      q: "Which data structure uses LIFO order?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: "Stack"
    },
    {
      q: "What does CPU stand for?",
      options: ["Central Processing Unit", "Core Processing Unit", "Central Program Utility", "Computer Processing Unit"],
      correct: "Central Processing Unit"
    }
  ];

  const generateQuiz = async () => {
    setLoadingQuiz(true);
    setQuestions([]);

    // ── Step 1: Try local quiz bank first ──────────────────────────────────
    const localQuestions = getQuestionsForTopic(topic?.title, 3);
    if (localQuestions) {
      setQuestions(localQuestions);
      setLoadingQuiz(false);
      return;
    }

    // ── Step 2: Fallback to AI generation ──────────────────────────────────
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY_HERE",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Create 3 HARD multiple choice questions about "${topic?.title}".
            Questions must be useful for GATE/IIT/competitive exam preparation.
            Requirements:
            - Deep conceptual understanding required
            - No obvious answers
            - All 4 options must look similar/confusing
            - Test real knowledge not just memory
            - Include numerical/formula based questions if applicable
            Return ONLY valid JSON array, no extra text:
            [{"q":"question","options":["a","b","c","d"],"correct":"a"}]`
          }]
        })
      });
      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      setQuestions(JSON.parse(clean));
    } catch (e) {
      setQuestions(getDefaultQuestions());
    }
    setLoadingQuiz(false);
  };

  const handleSleeping = () => {
    setVideoPaused(true);
    setSleepAlerts(prev => prev + 1);
    setShowWarning(true);
    setTimeout(() => {
      setShowWarning(false);
      setShowQuiz(true);
      generateQuiz();
    }, 4000);
  };

  const handleEmotionChange = (emotion) => {
    console.log("Current emotion:", emotion.label);
  };

  useEffect(() => {
    funBreakRef.current = setInterval(() => {
      setShowFunBreak(true);
    }, 120000);
    return () => clearInterval(funBreakRef.current);
  }, []);

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    if (finalScore >= 60) {
      const key = `completed_${user}`;
      const completed = JSON.parse(localStorage.getItem(key) || "[]");
      if (!completed.includes(topic?.id)) {
        completed.push(topic?.id);
        localStorage.setItem(key, JSON.stringify(completed));
      }
    }
  };

  if (!topic) return (
    <div style={{ color: "white", textAlign: "center", padding: "100px 20px" }}>
      <h2>❌ No topic selected!</h2>
      <button onClick={() => navigate("/dashboard")}
        style={{ background: "#4CAF50", color: "white", border: "none",
        padding: "12px 25px", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div style={{ background: "#1a1a2e", minHeight: "100vh", padding: "20px" }}>

      {/* Sleep Warning */}
      {showWarning && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(255,0,0,0.95)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"
        }}>
          <div style={{ fontSize: "80px" }}>😴</div>
          <h1 style={{ color: "white", fontSize: "50px", margin: "10px 0" }}>WAKE UP!</h1>
          <p style={{ color: "white", fontSize: "24px", margin: "5px 0" }}>
            🔔 Buzzer rang! Video stopped!
          </p>
          <p style={{ color: "white", fontSize: "18px" }}>Answer the quiz to continue!</p>
        </div>
      )}

      {/* Fun Break */}
      {showFunBreak && <FunBreak onDone={() => setShowFunBreak(false)} />}

      {/* Quiz Modal */}
      {showQuiz && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.95)", zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", boxSizing: "border-box"
        }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "15px",
            maxWidth: "520px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ textAlign: "center", color: "#333", margin: "0 0 20px 0" }}>
              📝 Quiz — {topic.title}
            </h2>
            {loadingQuiz ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <p style={{ fontSize: "40px" }}>🤖</p>
                <p style={{ fontSize: "18px", color: "#333" }}>Generating questions...</p>
              </div>
            ) : score === null ? (
              <>
                {questions.map((q, i) => (
                  <div key={i} style={{ marginBottom: "25px" }}>
                    <p style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>
                      {i + 1}. {q.q}
                    </p>
                    {q.options.map(opt => (
                      <button key={opt}
                        onClick={() => setAnswers({ ...answers, [i]: opt })}
                        style={{
                          display: "block", width: "100%", padding: "10px 15px",
                          margin: "6px 0",
                          background: answers[i] === opt ? "#4CAF50" : "#f5f5f5",
                          color: answers[i] === opt ? "white" : "#333",
                          border: answers[i] === opt ? "none" : "1px solid #ddd",
                          borderRadius: "8px", cursor: "pointer",
                          textAlign: "left", fontSize: "15px"
                        }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ))}
                <button onClick={submitQuiz}
                  style={{ width: "100%", padding: "14px", background: "#2196F3",
                  color: "white", border: "none", borderRadius: "8px",
                  fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>
                  Submit Quiz ✅
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "60px", margin: 0 }}>{score >= 60 ? "🎉" : "😔"}</p>
                <h2 style={{ color: score >= 60 ? "green" : "red" }}>
                  {score >= 60 ? "Great job!" : "Try again!"}
                </h2>
                <p style={{ fontSize: "64px", fontWeight: "bold",
                  color: score >= 60 ? "green" : "red", margin: "10px 0" }}>
                  {score}%
                </p>
                {score >= 60 ? (
                  <button onClick={() => {
                    setVideoPaused(false); setShowQuiz(false);
                    setScore(null); setAnswers({}); setQuestions([]);
                  }}
                    style={{ width: "100%", padding: "14px", background: "#4CAF50",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                    ▶️ Continue Video
                  </button>
                ) : (
                  <button onClick={() => { setScore(null); setAnswers({}); }}
                    style={{ width: "100%", padding: "14px", background: "#f44336",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                    🔄 Try Again
                  </button>
                )}
                <button onClick={() => navigate("/dashboard")}
                  style={{ width: "100%", padding: "12px", background: "#555",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: "pointer", fontSize: "15px" }}>
                  🏠 Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wellness Scorecard Modal */}
      {showScorecard && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.85)", zIndex: 9997,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", boxSizing: "border-box"
        }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowScorecard(false)}
              style={{ position: "absolute", top: "-12px", right: "-12px",
              background: "#ef4444", color: "white", border: "none",
              borderRadius: "50%", width: "28px", height: "28px",
              cursor: "pointer", fontSize: "14px", fontWeight: "bold", zIndex: 1 }}>
              ✕
            </button>
            <WellnessScorecard
              sessionStartTime={sessionStart}
              sleepAlerts={sleepAlerts}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ color: "white", margin: 0 }}>🎓 {topic.title}</h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={() => setShowFunBreak(true)}
            style={{ background: "#9C27B0", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            🎮 Fun Break
          </button>
          <button onClick={() => { setShowQuiz(true); generateQuiz(); }}
            style={{ background: "#FF9800", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            📝 Take Quiz
          </button>
          <button onClick={() => setShowScorecard(true)}
            style={{ background: "#06b6d4", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            📊 Scorecard
          </button>
          <button onClick={() => navigate("/reschedule")}
            style={{ background: "#2196F3", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            📅 Reschedule
          </button>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "#555", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            🏠 Dashboard
          </button>
        </div>
      </div>

      {/* Video */}
      <div style={{ textAlign: "center" }}>
        {videoPaused ? (
          <div style={{ width: "80%", height: "450px", background: "#000",
            margin: "0 auto", borderRadius: "12px", display: "flex",
            alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <p style={{ fontSize: "60px", margin: 0 }}>⏸️</p>
            <h3 style={{ color: "white", margin: "10px 0" }}>Video Paused!</h3>
            <p style={{ color: "gray" }}>Answer the quiz to continue!</p>
          </div>
        ) : (
          <iframe
            ref={videoRef}
            width="80%" height="450"
            src={topic.video + "?autoplay=1&enablejsapi=1"}
            title={topic.title}
            frameBorder="0"
            allowFullScreen
            allow="autoplay"
            style={{ borderRadius: "12px" }}
          />
        )}
      </div>

      <p style={{ color: "gray", textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
        💡 Start Sleep Detector & Emotion Detector for full focus tracking!
      </p>

      {/* Emotion Detector — bottom center */}
      <div style={{ position: "fixed", bottom: "20px", left: "50%",
        transform: "translateX(-50%)", zIndex: 1000 }}>
        <EmotionDetector
          videoRef={videoRef}
          onEmotionChange={handleEmotionChange}
          isActive={!videoPaused}
        />
      </div>

      {/* Sleep Detector bottom right */}
      <SleepDetector onSleeping={handleSleeping} />

      {/* AI Assistant bottom left */}
      <AIAssistant topicTitle={topic.title} />

    </div>
  );
}
