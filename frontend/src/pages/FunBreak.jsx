import { useState, useEffect } from "react";

const allPuzzles = [
  { emoji: "🤔", title: "Classic Riddle", question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?", answer: "Echo", options: ["Shadow", "Echo", "Wind", "Mirror"] },
  { emoji: "🔢", title: "Quick Math", question: "If you have 3 apples and take away 2, how many apples do YOU have?", answer: "2", options: ["1", "2", "3", "0"] },
  { emoji: "💡", title: "Brain Teaser", question: "The more you take, the more you leave behind. What am I?", answer: "Footsteps", options: ["Time", "Money", "Footsteps", "Memories"] },
  { emoji: "🧮", title: "Programmer Math", question: "A programmer had 10 bugs. He fixed 9. How many bugs are left?", answer: "99", options: ["1", "10", "99", "0"] },
  { emoji: "🎯", title: "Guess It", question: "I have keys but no locks. I have space but no room. You can enter but cannot go inside. What am I?", answer: "Keyboard", options: ["Piano", "Map", "Keyboard", "Phone"] },
  { emoji: "🔍", title: "Number Pattern", question: "What comes next? 2, 4, 8, 16, 32, ___", answer: "64", options: ["48", "56", "64", "72"] },
  { emoji: "🌟", title: "Classic Riddle", question: "What has hands but cannot clap?", answer: "Clock", options: ["Gloves", "Clock", "Tree", "Robot"] },
  { emoji: "🎲", title: "Tricky Math", question: "If there are 6 apples and you take 3, how many do YOU have?", answer: "3", options: ["6", "0", "3", "9"] },
  { emoji: "🔢", title: "Fibonacci", question: "What comes next? 1, 1, 2, 3, 5, 8, ___", answer: "13", options: ["10", "11", "12", "13"] },
  { emoji: "🏆", title: "Think Hard", question: "I am always in front of you but cannot be seen. What am I?", answer: "Future", options: ["Mirror", "Future", "Shadow", "Dream"] },
  { emoji: "💻", title: "Coding Riddle", question: "How do you make a developer work overtime?", answer: "Say it will only take 5 minutes", options: ["Give more salary", "Say it will only take 5 minutes", "Buy coffee", "Give holiday"] },
  { emoji: "🎨", title: "Visual Pattern", question: "🔴🔵🔴🔵🔴 What comes next?", answer: "🔵", options: ["🔴", "🔵", "🟢", "🟡"] },
  { emoji: "🧠", title: "Logic Puzzle", question: "If 1=5, 2=10, 3=15, 4=20, then 5=?", answer: "1", options: ["25", "30", "1", "5"] },
  { emoji: "🌍", title: "Fun Fact Quiz", question: "How many zeros are in one million?", answer: "6", options: ["5", "6", "7", "8"] },
  { emoji: "🎪", title: "Tricky One", question: "A rooster lays an egg on top of a barn. Which way does the egg roll?", answer: "Roosters don't lay eggs!", options: ["Left", "Right", "Roosters don't lay eggs!", "Down"] },
];

export default function FunBreak({ onDone }) {
  const TOTAL_TIME = 300; // 5 minutes
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffled] = useState(() => {
    const s = [...allPuzzles].sort(() => Math.random() - 0.5);
    return s.slice(0, 8); // Pick 8 random puzzles
  });
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = shuffled[currentIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const handleAnswer = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === current.answer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIdx >= shuffled.length - 1) {
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        background: "rgba(0,0,0,0.92)",
        zIndex: 9999, display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "20px", boxSizing: "border-box"
      }}>
        <div style={{
          background: "white", padding: "35px",
          borderRadius: "20px", maxWidth: "420px",
          width: "100%", textAlign: "center"
        }}>
          <div style={{ fontSize: "60px" }}>🏆</div>
          <h2 style={{ color: "#4CAF50", margin: "10px 0" }}>
            Fun Break Complete!
          </h2>
          <p style={{ fontSize: "22px", color: "#333" }}>
            You scored <strong style={{ color: "#2196F3" }}>
              {score}/{shuffled.length}
            </strong>
          </p>
          <p style={{ color: "#555", fontSize: "16px" }}>
            {score === shuffled.length ? "Perfect score! 🌟" :
             score >= shuffled.length * 0.7 ? "Great job! 💪" :
             score >= shuffled.length * 0.5 ? "Good effort! 😊" :
             "Keep practicing! 📚"}
          </p>
          <div style={{
            background: "#f5f5f5", padding: "15px",
            borderRadius: "10px", margin: "15px 0"
          }}>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Correct: {score} | Wrong: {shuffled.length - score}
            </p>
          </div>
          <button onClick={onDone} style={{
            width: "100%", padding: "14px",
            background: "#4CAF50", color: "white",
            border: "none", borderRadius: "10px",
            fontSize: "16px", cursor: "pointer",
            fontWeight: "bold"
          }}>
            ▶️ Back to Learning!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.92)",
      zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "20px", boxSizing: "border-box"
    }}>
      <div style={{
        background: "white", padding: "25px",
        borderRadius: "20px", maxWidth: "500px",
        width: "100%", boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "15px" }}>
          <div>
            <h2 style={{ color: "#4CAF50", margin: 0, fontSize: "18px" }}>
              🎉 Fun Break!
            </h2>
            <p style={{ color: "#888", margin: "2px 0", fontSize: "12px" }}>
              Question {currentIdx + 1} of {shuffled.length}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              background: timeLeft <= 60 ? "#ffebee" : "#e3f2fd",
              padding: "6px 12px", borderRadius: "20px",
              border: `2px solid ${timeLeft <= 60 ? "#f44336" : "#2196F3"}`
            }}>
              <p style={{
                color: timeLeft <= 60 ? "#f44336" : "#2196F3",
                margin: 0, fontSize: "14px", fontWeight: "bold"
              }}>
                ⏱️ {formatTime(timeLeft)}
              </p>
            </div>
            <p style={{ color: "#4CAF50", margin: "3px 0",
              fontSize: "12px", fontWeight: "bold" }}>
              ✅ Score: {score}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: "#f0f0f0", borderRadius: "10px",
          height: "6px", marginBottom: "15px", overflow: "hidden" }}>
          <div style={{
            background: "#4CAF50", height: "100%",
            width: `${((currentIdx) / shuffled.length) * 100}%`,
            transition: "width 0.3s"
          }} />
        </div>

        {/* Puzzle */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <div style={{ fontSize: "45px" }}>{current.emoji}</div>
          <p style={{ color: "#2196F3", fontWeight: "bold",
            margin: "5px 0", fontSize: "15px" }}>
            {current.title}
          </p>
        </div>

        {/* Question */}
        <div style={{ background: "#f5f5f5", padding: "15px",
          borderRadius: "12px", marginBottom: "15px" }}>
          <p style={{ color: "#333", fontSize: "15px",
            lineHeight: "1.6", margin: 0, fontWeight: "bold",
            textAlign: "center" }}>
            {current.question}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column",
          gap: "8px", marginBottom: "15px" }}>
          {current.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)}
              disabled={answered}
              style={{
                padding: "11px 15px",
                background: !answered ? "#f0f0f0"
                  : opt === current.answer ? "#e8f5e9"
                  : opt === selected ? "#ffebee" : "#f0f0f0",
                color: "#333",
                border: `2px solid ${!answered ? "#ddd"
                  : opt === current.answer ? "#4CAF50"
                  : opt === selected ? "#f44336" : "#ddd"}`,
                borderRadius: "10px",
                cursor: answered ? "default" : "pointer",
                fontSize: "14px", fontWeight: "bold",
                textAlign: "left", transition: "all 0.2s"
              }}>
              {String.fromCharCode(65+i)}. {opt}
              {answered && opt === current.answer && " ✅"}
              {answered && opt === selected && opt !== current.answer && " ❌"}
            </button>
          ))}
        </div>

        {/* Result */}
        {answered && (
          <div style={{
            background: selected === current.answer ? "#e8f5e9" : "#fff3e0",
            padding: "12px", borderRadius: "10px",
            marginBottom: "12px", textAlign: "center",
            border: `2px solid ${selected === current.answer ? "#4CAF50" : "#FF9800"}`
          }}>
            <p style={{
              color: selected === current.answer ? "#2e7d32" : "#e65100",
              margin: 0, fontWeight: "bold", fontSize: "15px"
            }}>
              {selected === current.answer
                ? "🎉 Correct! Well done!"
                : `💡 Answer: "${current.answer}"`}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onDone} style={{
            flex: 1, padding: "11px",
            background: "#555", color: "white",
            border: "none", borderRadius: "10px",
            cursor: "pointer", fontSize: "13px"
          }}>
            ⏭️ Skip Break
          </button>
          {answered && (
            <button onClick={nextQuestion} style={{
              flex: 2, padding: "11px",
              background: "#4CAF50", color: "white",
              border: "none", borderRadius: "10px",
              cursor: "pointer", fontSize: "14px",
              fontWeight: "bold"
            }}>
              {currentIdx >= shuffled.length - 1
                ? "🏁 Finish!" : "➡️ Next Question"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}