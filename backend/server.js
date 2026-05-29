const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "FocusedLearner Backend is Running! 🎓" });
});

// Save progress route
app.post("/api/progress/save", (req, res) => {
  const { topic, score, user } = req.body;
  console.log(`User: ${user} | Topic: ${topic} | Score: ${score}`);
  res.json({ success: true, message: "Progress saved!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});