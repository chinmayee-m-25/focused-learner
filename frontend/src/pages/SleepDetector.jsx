import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_SOURCES = [
  "/models",
  "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights",
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights",
];

function getEAR(eye) {
  if (!eye || eye.length < 6) return 0.3;
  const A = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
  const B = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
  const C = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
  return C === 0 ? 0 : (A + B) / (2 * C);
}

export default function SleepDetector({ onSleeping }) {
  const videoRef       = useRef(null);
  const intervalRef    = useRef(null);
  const countRef       = useRef(null);
  const noFaceTime     = useRef(null);
  const eyesClosedTime = useRef(null);
  const alarmRef       = useRef(null);

  const [status,      setStatus]      = useState("Detector off");
  const [isActive,    setIsActive]    = useState(false);
  const [countdown,   setCountdown]   = useState(10);
  const [modelsReady, setModelsReady] = useState(false);
  const [loadingMsg,  setLoadingMsg]  = useState("Loading models…");

  const LIMIT = 10000; // 10 seconds eyes closed before alarm

  // ── 1. Load models ────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      for (const source of MODEL_SOURCES) {
        try {
          setLoadingMsg("Loading face model…");
          await faceapi.nets.tinyFaceDetector.loadFromUri(source);
          setLoadingMsg("Loading landmark model…");
          await faceapi.nets.faceLandmark68TinyNet.loadFromUri(source);
          setModelsReady(true);
          setLoadingMsg("");
          console.log("✅ SleepDetector models loaded from:", source);
          return;
        } catch (e) {
          console.warn("Failed from", source, e.message);
          try { faceapi.nets.tinyFaceDetector.dispose?.(); } catch (_) {}
          try { faceapi.nets.faceLandmark68TinyNet.dispose?.(); } catch (_) {}
        }
      }
      setLoadingMsg("❌ Models failed to load");
    }
    load();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countRef.current);
      stopAlarm();
    };
  }, []);

  // ── 2. Alarm sound ────────────────────────────────────────────────────────
  const playAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const playBeep = (time) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.4, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        o.start(time);
        o.stop(time + 0.4);
      };
      for (let i = 0; i < 5; i++) playBeep(ctx.currentTime + i * 0.5);
    } catch (e) {
      console.warn("Alarm sound failed:", e);
    }
  };

  const stopAlarm = () => {
    if (alarmRef.current) {
      clearInterval(alarmRef.current);
      alarmRef.current = null;
    }
  };

  // ── 3. Countdown ──────────────────────────────────────────────────────────
  const startCountdown = (from) => {
    clearInterval(countRef.current);
    setCountdown(from);
    if (from <= 0) return;
    let val = from;
    countRef.current = setInterval(() => {
      val -= 1;
      setCountdown(Math.max(0, val));
      if (val <= 0) clearInterval(countRef.current);
    }, 1000);
  };

  // ── 4. Trigger alarm ──────────────────────────────────────────────────────
  const triggerAlarm = (reason) => {
    setStatus(`🚨 ${reason}`);
    clearInterval(intervalRef.current);
    playAlarm();
    if (onSleeping) onSleeping();
    // Restart detection after alarm
    setTimeout(() => {
      eyesClosedTime.current = null;
      noFaceTime.current = null;
      startCheck();
    }, 5000);
  };

  // ── 5. Detection loop ─────────────────────────────────────────────────────
  const startCheck = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 }))
        .withFaceLandmarks(true);

      if (!detection) {
        if (!noFaceTime.current) noFaceTime.current = Date.now();
        const gone = Date.now() - noFaceTime.current;
        const left = Math.max(0, Math.round((LIMIT - gone) / 1000));
        if (gone >= LIMIT) {
          triggerAlarm("No face detected!");
        } else {
          setStatus(`⚠️ No face! ${left}s left!`);
          startCountdown(left);
        }
        return;
      }

      noFaceTime.current = null;
      const landmarks = detection.landmarks;
      const leftEye   = landmarks.getLeftEye();
      const rightEye  = landmarks.getRightEye();
      const avgEAR    = (getEAR(leftEye) + getEAR(rightEye)) / 2;
      const eyesClosed = avgEAR < 0.22;

      if (eyesClosed) {
        if (!eyesClosedTime.current) eyesClosedTime.current = Date.now();
        const closed = Date.now() - eyesClosedTime.current;
        const left   = Math.max(0, Math.round((LIMIT - closed) / 1000));
        if (closed >= LIMIT) {
          triggerAlarm("SLEEPING DETECTED!");
        } else {
          setStatus(`😪 Eyes closed! ${left}s!`);
          startCountdown(left);
        }
      } else {
        eyesClosedTime.current = null;
        noFaceTime.current     = null;
        setStatus("👁️ Watching...");
        startCountdown(10);
      }
    }, 800);
  };

  // ── 6. Start camera ───────────────────────────────────────────────────────
  const startCamera = async () => {
    if (!modelsReady) {
      alert("Models still loading, please wait!");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsActive(true);
          setStatus("👁️ Watching...");
          noFaceTime.current     = null;
          eyesClosedTime.current = null;
          startCountdown(10);
          startCheck();
        };
      }
    } catch (e) {
      setStatus(e.name === "NotAllowedError"
        ? "❌ Camera permission denied"
        : "❌ Camera unavailable");
    }
  };

  // ── 7. Stop camera ────────────────────────────────────────────────────────
  const stopCamera = () => {
    clearInterval(intervalRef.current);
    clearInterval(countRef.current);
    stopAlarm();
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setStatus("Detector off");
    setCountdown(10);
    noFaceTime.current     = null;
    eyesClosedTime.current = null;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const borderColor = status.includes("🚨") || status.includes("😪")
    ? "orange" : isActive ? "#4CAF50" : "#555";

  const bgColor = status.includes("🚨")
    ? "rgba(255,0,0,0.97)"
    : status.includes("⚠️") || status.includes("😪")
    ? "rgba(255,152,0,0.97)"
    : "rgba(20,20,35,0.97)";

  return (
    <div style={{
      position: "fixed", bottom: "20px", right: "20px",
      background: bgColor, padding: "12px", borderRadius: "12px",
      zIndex: 1000, textAlign: "center",
      border: `3px solid ${borderColor}`,
      width: "175px", transition: "all 0.3s"
    }}>
      <video ref={videoRef} autoPlay muted playsInline style={{
        width: "151px", height: "113px", borderRadius: "8px",
        display: isActive ? "block" : "none",
        transform: "scaleX(-1)"
      }} />

      {!isActive && (
        <div style={{
          width: "151px", height: "95px",
          display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: "5px"
        }}>
          <span style={{ fontSize: "40px" }}>😴</span>
          <span style={{ color: "#94a3b8", fontSize: "10px", textAlign: "center" }}>
            {loadingMsg || "AI-powered eye detection"}
          </span>
        </div>
      )}

      <p style={{ color: "white", margin: "6px 0", fontSize: "11px", fontWeight: "bold" }}>
        {status}
      </p>

      {isActive && (
        <div style={{
          background: countdown <= 3 ? "#f44336" : "rgba(0,0,0,0.5)",
          borderRadius: "8px", padding: "5px", marginBottom: "6px",
          transition: "background 0.3s"
        }}>
          <p style={{ color: "white", margin: 0, fontSize: "11px" }}>
            🔔 Alarm in: <strong>{countdown}s</strong>
          </p>
        </div>
      )}

      <button
        onClick={isActive ? stopCamera : startCamera}
        disabled={!modelsReady && !isActive}
        style={{
          background: !modelsReady && !isActive ? "#666"
            : isActive ? "#f44336" : "#4CAF50",
          color: "white", border: "none", padding: "8px",
          borderRadius: "6px",
          cursor: modelsReady || isActive ? "pointer" : "not-allowed",
          fontSize: "11px", width: "100%", fontWeight: "bold"
        }}
      >
        {!modelsReady && !isActive ? "⏳ Loading AI…"
          : isActive ? "🔴 Stop"
          : "😴 Start Sleep Detector"}
      </button>

      {isActive && (
        <p style={{ color: "#90EE90", fontSize: "9px", margin: "4px 0 0 0" }}>
          🤖 face-api.js — EAR eye detection
        </p>
      )}
    </div>
  );
}
