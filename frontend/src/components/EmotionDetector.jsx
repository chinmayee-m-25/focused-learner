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

const MODEL_SOURCES = [
  "/models",
  "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights",
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights",
];

const pauseYouTubeVideo = () => {
  document.querySelectorAll("iframe").forEach(iframe => {
    try { iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*"); } catch (e) {}
  });
};

const resumeYouTubeVideo = () => {
  document.querySelectorAll("iframe").forEach(iframe => {
    try { iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*"); } catch (e) {}
  });
};

export default function EmotionDetector({ onEmotionChange, isActive = true }) {
  const webcamRef    = useRef(null);
  const intervalRef  = useRef(null);

  const [modelsLoaded,    setModelsLoaded]    = useState(false);
  const [currentEmotion,  setCurrentEmotion]  = useState(null);
  const [emotionHistory,  setEmotionHistory]  = useState([]);
  const [loadingMsg,      setLoadingMsg]      = useState("Loading AI models…");
  const [webcamError,     setWebcamError]     = useState(null);
  const [detectionOn,     setDetectionOn]     = useState(false);
  const [pausedByEmotion, setPausedByEmotion] = useState(false);
  const [modelError,      setModelError]      = useState(false);

  // ── 1. Load models ────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadModels() {
      for (const source of MODEL_SOURCES) {
        try {
          setLoadingMsg("Loading face detection…");
          await faceapi.nets.tinyFaceDetector.loadFromUri(source);
          setLoadingMsg("Loading expression model…");
          await faceapi.nets.faceExpressionNet.loadFromUri(source);
          setModelsLoaded(true);
          setLoadingMsg("");
          console.log("✅ Models loaded from:", source);
          return;
        } catch (err) {
          console.warn("❌ Failed from", source, err.message);
          try { faceapi.nets.tinyFaceDetector.dispose?.(); } catch(_) {}
          try { faceapi.nets.faceExpressionNet.dispose?.(); } catch(_) {}
        }
      }
      setModelError(true);
      setLoadingMsg("❌ Models failed to load.");
    }
    loadModels();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // ── 2. Start webcam ───────────────────────────────────────────────────────
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = webcamRef.current;
      if (video) {
        video.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(resolve); // resolve even if play() fails
          };
          video.onerror = reject;
          setTimeout(resolve, 3000); // timeout fallback
        });
      }
      setWebcamError(null);
      return true;
    } catch (err) {
      console.error("Webcam error:", err);
      setWebcamError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Click the camera icon in your browser address bar to allow."
          : err.name === "NotFoundError"
          ? "No camera found on this device."
          : "Camera error: " + err.message
      );
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
      const video = webcamRef.current;
      if (!video || video.readyState < 2 || video.paused) return;

      try {
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 }))
          .withFaceExpressions();

        if (!detections) { setCurrentEmotion(null); return; }

        const expressions = detections.expressions;
        const topEmotion  = Object.entries(expressions).reduce((a, b) => b[1] > a[1] ? b : a)[0];
        const config      = EMOTION_CONFIG[topEmotion] || EMOTION_CONFIG.neutral;
        const emotion     = { name: topEmotion, ...config, score: expressions[topEmotion] };

        setCurrentEmotion(emotion);
        setEmotionHistory(prev => [...prev.slice(-49), { emotion: topEmotion, timestamp: Date.now() }]);
        if (onEmotionChange) onEmotionChange(emotion);

        if (config.pauseVideo) {
          pauseYouTubeVideo();
          setPausedByEmotion(true);
        } else {
          setPausedByEmotion(prev => { if (prev) resumeYouTubeVideo(); return false; });
        }
      } catch (err) {
        console.error("Detection error:", err);
      }
    }, 1500);
  }, [modelsLoaded, startWebcam, onEmotionChange]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDetectionOn(false);
    setCurrentEmotion(null);
    setPausedByEmotion(false);
    if (webcamRef.current?.srcObject) {
      webcamRef.current.srcObject.getTracks().forEach(t => t.stop());
      webcamRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive && detectionOn) stopDetection();
  }, [isActive, detectionOn, stopDetection]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🧠 Emotion Detector</h3>

      {/* Video must be visible enough for face-api to process */}
      <video
        ref={webcamRef}
        muted
        playsInline
        autoPlay
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: "160px",
          height: "120px",
          top: 0,
          left: 0,
        }}
      />

      {!modelsLoaded && !modelError && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loading}>{loadingMsg}</p>
        </div>
      )}

      {modelError && (
        <div style={styles.errorBox}>
          <p style={styles.errorTitle}>⚠️ Models failed to load</p>
          <p style={styles.errorText}>Using CDN fallback — please wait or refresh.</p>
        </div>
      )}

      {webcamError && (
        <div style={styles.errorBox}>
          <p style={styles.errorTitle}>📷 Camera Error</p>
          <p style={styles.errorText}>{webcamError}</p>
        </div>
      )}

      {pausedByEmotion && (
        <div style={styles.pauseBanner}>⏸ Video paused — you look stressed/angry!</div>
      )}

      {currentEmotion && (
        <div style={{ ...styles.emotionCard, borderColor: currentEmotion.color }}>
          <span style={styles.emoji}>{currentEmotion.emoji}</span>
          <span style={{ ...styles.emotionLabel, color: currentEmotion.color }}>{currentEmotion.label}</span>
          <span style={styles.score}>{Math.round(currentEmotion.score * 100)}%</span>
        </div>
      )}

      {detectionOn && !currentEmotion && !webcamError && (
        <p style={styles.noFace}>👀 No face detected — move closer</p>
      )}

      <div style={styles.controls}>
        {!detectionOn ? (
          <button
            style={{ ...styles.btn, background: modelsLoaded ? "#22c55e" : "#374151", opacity: modelsLoaded ? 1 : 0.6 }}
            onClick={startDetection}
            disabled={!modelsLoaded}
          >
            {modelsLoaded ? "▶ Start Detection" : "Loading…"}
          </button>
        ) : (
          <button style={{ ...styles.btn, background: "#ef4444" }} onClick={stopDetection}>
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
    position: "relative",
  },
  title:      { margin: "0 0 12px", fontSize: "15px", color: "#c084fc" },
  loadingBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", margin: "8px 0" },
  spinner: {
    width: "24px", height: "24px", borderRadius: "50%",
    border: "3px solid #2a2a3e", borderTopColor: "#c084fc",
    animation: "spin 0.8s linear infinite",
  },
  loading:     { fontSize: "13px", color: "#94a3b8", margin: 0, textAlign: "center" },
  errorBox:    { background: "#1f1215", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "10px", margin: "8px 0" },
  errorTitle:  { color: "#f87171", fontSize: "13px", fontWeight: "700", margin: "0 0 4px" },
  errorText:   { color: "#94a3b8", fontSize: "11px", margin: 0 },
  pauseBanner: { background: "#f97316", color: "#fff", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", textAlign: "center", marginBottom: "8px" },
  emotionCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "12px", borderRadius: "10px", border: "2px solid", background: "#0f172a", margin: "8px 0" },
  emoji:        { fontSize: "36px" },
  emotionLabel: { fontSize: "18px", fontWeight: "700" },
  score:        { fontSize: "12px", color: "#94a3b8" },
  noFace:       { fontSize: "13px", color: "#64748b", textAlign: "center" },
  controls:     { display: "flex", justifyContent: "center", marginTop: "10px" },
  btn:          { padding: "8px 20px", borderRadius: "8px", border: "none", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer" },
  historyBar:   { display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "10px", justifyContent: "center" },
  historyDot:   { fontSize: "18px", cursor: "default" },
};
