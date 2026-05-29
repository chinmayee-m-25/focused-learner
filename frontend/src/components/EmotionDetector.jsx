import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

const EMOTION_CONFIG = {
  happy:     { emoji: "😊", color: "#22c55e", label: "Happy",     pauseVideo: false },
  sad:       { emoji: "😢", color: "#3b82f6", label: "Sad",       pauseVideo: false },
  angry:     { emoji: "😠", color: "#ef4444", label: "Angry",     pauseVideo: true  },
  fearful:   { emoji: "😰", color: "#f97316", label: "Stressed",  pauseVideo: true  },
  disgusted: { emoji: "🤢", color: "#a855f7", label: "Disgusted", pauseVideo: false },
  surprised: { emoji: "😲", color: "#eab308", label: "Surprised", pauseVideo: false },
  neutral:   { emoji: "😐", color: "#6b7280", label: "Neutral",   pauseVideo: false },
};

// Pause YouTube iframe using postMessage API
const pauseYouTubeVideo = () => {
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach(iframe => {
    try {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    } catch (e) {}
  });
};

export default function EmotionDetector({ onEmotionChange, isActive = true }) {
  const webcamRef   = useRef(null);
  const canvasRef   = useRef(null);
  const intervalRef = useRef(null);

  const [modelsLoaded,   setModelsLoaded]   = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [loadingMsg,     setLoadingMsg]     = useState("Loading AI models…");
  const [webcamError,    setWebcamError]    = useState(null);
  const [detectionOn,    setDetectionOn]    = useState(false);
  const [pausedByEmotion,setPausedByEmotion]= useState(false);

  // ── 1. Load models ────────────────────────────────────────────────────────
  useEffect(() => {
    const MODEL_URL = "/models";
    async function loadModels() {
      try {
        setLoadingMsg("Loading face detection model…");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setLoadingMsg("Loading expression model…");
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        setLoadingMsg("❌ Failed to load models. Check /public/models folder.");
        console.error("face-api model load error:", err);
      }
    }
    loadModels();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // ── 2. Start webcam ───────────────────────────────────────────────────────
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.play();
      }
      setWebcamError(null);
      return true;
    } catch {
      setWebcamError("Camera permission denied. Please allow camera access.");
      return false;
    }
  }, []);

  // ── 3. Detection loop ─────────────────────────────────────────────────────
  const startDetection = useCallback(async () => {
    if (!modelsLoaded) return;
    const ok = await startWebcam();
    if (!ok) return;
    setDetectionOn(true);

    intervalRef.current = setInterval(async () => {
      if (!webcamRef.current) return;

      const detections = await faceapi
        .detectSingleFace(webcamRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections) { setCurrentEmotion(null); return; }

      const expressions = detections.expressions;
      const topEmotion  = Object.entries(expressions).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0];

      const config = EMOTION_CONFIG[topEmotion] || EMOTION_CONFIG.neutral;
      setCurrentEmotion({ name: topEmotion, ...config, score: expressions[topEmotion] });

      setEmotionHistory(prev => [
        ...prev.slice(-49),
        { emotion: topEmotion, timestamp: Date.now() }
      ]);

      if (onEmotionChange) onEmotionChange({ name: topEmotion, ...config });

      // ── Pause YouTube iframe when angry or stressed ──────────────────────
      if (config.pauseVideo) {
        pauseYouTubeVideo();
        setPausedByEmotion(true);
        console.log(`⏸ YouTube paused — emotion: ${topEmotion}`);
      } else if (pausedByEmotion) {
        // Resume when emotion returns to normal
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach(iframe => {
          try {
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
          } catch (e) {}
        });
        setPausedByEmotion(false);
      }

    }, 1500);
  }, [modelsLoaded, startWebcam, onEmotionChange, pausedByEmotion]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDetectionOn(false);
    setCurrentEmotion(null);
    if (webcamRef.current?.srcObject) {
      webcamRef.current.srcObject.getTracks().forEach(t => t.stop());
      webcamRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive && detectionOn) stopDetection();
  }, [isActive, detectionOn, stopDetection]);

  const getEmotionSummary = () => {
    const counts = {};
    emotionHistory.forEach(({ emotion }) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
    });
    return counts;
  };

  useEffect(() => {
    window.__emotionHistory = emotionHistory;
    window.__emotionSummary = getEmotionSummary();
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🧠 Emotion Detector</h3>

      <video ref={webcamRef} style={styles.hiddenVideo} muted playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!modelsLoaded && <p style={styles.loading}>{loadingMsg}</p>}
      {webcamError   && <p style={styles.error}>{webcamError}</p>}

      {pausedByEmotion && (
        <div style={styles.pauseBanner}>
          ⏸ Video paused — you look stressed/angry!
        </div>
      )}

      {currentEmotion && (
        <div style={{ ...styles.emotionCard, borderColor: currentEmotion.color }}>
          <span style={styles.emoji}>{currentEmotion.emoji}</span>
          <span style={{ ...styles.emotionLabel, color: currentEmotion.color }}>
            {currentEmotion.label}
          </span>
          <span style={styles.score}>
            {Math.round(currentEmotion.score * 100)}%
          </span>
        </div>
      )}

      {detectionOn && !currentEmotion && (
        <p style={styles.noFace}>👀 No face detected — move closer</p>
      )}

      <div style={styles.controls}>
        {!detectionOn ? (
          <button
            style={{ ...styles.btn, background: "#22c55e" }}
            onClick={startDetection}
            disabled={!modelsLoaded}
          >
            {modelsLoaded ? "▶ Start Detection" : "Loading…"}
          </button>
        ) : (
          <button
            style={{ ...styles.btn, background: "#ef4444" }}
            onClick={stopDetection}
          >
            ■ Stop Detection
          </button>
        )}
      </div>

      {emotionHistory.length > 0 && (
        <div style={styles.historyBar}>
          {emotionHistory.slice(-10).map((h, i) => (
            <span key={i} title={h.emotion} style={styles.historyDot}>
              {EMOTION_CONFIG[h.emotion]?.emoji || "❓"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#1e1e2e", border: "1px solid #2a2a3e",
    borderRadius: "12px", padding: "16px", color: "#e2e8f0",
    fontFamily: "'Segoe UI', sans-serif", minWidth: "220px", maxWidth: "300px",
  },
  title:      { margin: "0 0 12px", fontSize: "15px", color: "#c084fc" },
  hiddenVideo:{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 },
  loading:    { fontSize: "13px", color: "#94a3b8", margin: "8px 0" },
  error:      { fontSize: "13px", color: "#f87171", margin: "8px 0" },
  pauseBanner:{ background: "#f97316", color: "#fff", borderRadius: "8px",
    padding: "6px 10px", fontSize: "12px", textAlign: "center", marginBottom: "8px" },
  emotionCard:{ display: "flex", flexDirection: "column", alignItems: "center",
    gap: "4px", padding: "12px", borderRadius: "10px",
    border: "2px solid", background: "#0f172a", margin: "8px 0" },
  emoji:        { fontSize: "36px" },
  emotionLabel: { fontSize: "18px", fontWeight: "700" },
  score:        { fontSize: "12px", color: "#94a3b8" },
  noFace:       { fontSize: "13px", color: "#64748b", textAlign: "center" },
  controls:     { display: "flex", justifyContent: "center", marginTop: "10px" },
  btn: {
    padding: "8px 20px", borderRadius: "8px", border: "none",
    color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "14px",
  },
  historyBar: { display: "flex", flexWrap: "wrap", gap: "4px",
    marginTop: "10px", justifyContent: "center" },
  historyDot: { fontSize: "18px", cursor: "default" },
};
