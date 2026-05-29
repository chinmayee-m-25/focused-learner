import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function SleepDetector({ onSleeping }) {
  const videoRef        = useRef(null);
  const intervalRef     = useRef(null);
  const countRef        = useRef(null);
  const noFaceTime      = useRef(null);
  const eyesClosedTime  = useRef(null);

  const [status,     setStatus]     = useState("Detector off");
  const [isActive,   setIsActive]   = useState(false);
  const [countdown,  setCountdown]  = useState(10);
  const [modelsReady,setModelsReady]= useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading models…");

  const LIMIT = 10000; // 10 seconds

  // ── 1. Load face-api models ─────────────────────────────────────────────
  useEffect(() => {
    const MODEL_URL = "/models";
    async function load() {
      try {
        setLoadingMsg("Loading face model…");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setLoadingMsg("Loading landmark model…");
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
        setModelsReady(true);
        setLoadingMsg("");
      } catch (e) {
        setLoadingMsg("❌ Models failed. Check /public/models");
        console.error(e);
      }
    }
    load();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countRef.current);
    };
  }, []);

  // ── 2. Buzzer ────────────────────────────────────────────────────────────
  const playBuzzer = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      ctx.resume().then(() => {
        for (let i = 0; i < 12; i++) {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.value = i % 2 === 0 ? 1200 : 600;
          gain.gain.value = 5.0;
          osc.start(ctx.currentTime + i * 0.25);
          osc.stop(ctx.currentTime + i * 0.25 + 0.2);
        }
      });
    } catch (e) {}
  };

  // ── 3. Countdown ─────────────────────────────────────────────────────────
  const startCountdown = (sec) => {
    setCountdown(sec);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(countRef.current); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  // ── 4. Trigger alarm ─────────────────────────────────────────────────────
  const triggerAlarm = (reason) => {
    setStatus(`😴 ${reason} BUZZER!`);
    playBuzzer();
    setTimeout(playBuzzer, 1500);
    setTimeout(playBuzzer, 3000);
    onSleeping();
    noFaceTime.current      = null;
    eyesClosedTime.current  = null;
    startCountdown(10);
  };

  // ── 5. EAR (Eye Aspect Ratio) — detects closed eyes accurately ───────────
  const getEAR = (eye) => {
    // eye = array of 6 {x,y} points
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const vertical1 = dist(eye[1], eye[5]);
    const vertical2 = dist(eye[2], eye[4]);
    const horizontal = dist(eye[0], eye[3]);
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  // ── 6. Detection loop using face-api ─────────────────────────────────────
  const startCheck = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !modelsReady) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true); // true = use tiny landmark model

      if (!detection) {
        // No face found
        eyesClosedTime.current = null;
        if (!noFaceTime.current) noFaceTime.current = Date.now();
        const gone = Date.now() - noFaceTime.current;
        const left = Math.max(0, Math.round((LIMIT - gone) / 1000));
        if (gone >= LIMIT) {
          triggerAlarm("NOT THERE!");
        } else {
          setStatus(`⚠️ No face! ${left}s left!`);
          startCountdown(left);
        }
        return;
      }

      // Face found — check EAR for eye closure
      noFaceTime.current = null;
      const landmarks  = detection.landmarks;
      const leftEye    = landmarks.getLeftEye();
      const rightEye   = landmarks.getRightEye();
      const leftEAR    = getEAR(leftEye);
      const rightEAR   = getEAR(rightEye);
      const avgEAR     = (leftEAR + rightEAR) / 2;
      const eyesClosed = avgEAR < 0.22; // threshold — lower = more closed

      if (eyesClosed) {
        if (!eyesClosedTime.current) eyesClosedTime.current = Date.now();
        const closed = Date.now() - eyesClosedTime.current;
        const left   = Math.max(0, Math.round((LIMIT - closed) / 1000));
        if (closed >= LIMIT) {
          triggerAlarm("EYES CLOSED!");
        } else {
          setStatus(`😪 Eyes closed! ${left}s!`);
          startCountdown(left);
        }
      } else {
        // All good
        eyesClosedTime.current = null;
        noFaceTime.current     = null;
        setStatus("👁️ Watching...");
        startCountdown(10);
      }
    }, 800);
  };

  // ── 7. Start / Stop camera ───────────────────────────────────────────────
  const startCamera = async () => {
    if (!modelsReady) {
      alert("Models still loading, please wait a moment!");
      return;
    }
    try {
      // Unlock AudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      await ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      g.gain.value = 0.001;
      o.start(); o.stop(ctx.currentTime + 0.1);
    } catch (e) {}

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        setIsActive(true);
        setStatus("👁️ Watching...");
        noFaceTime.current     = null;
        eyesClosedTime.current = null;
        startCountdown(10);
        startCheck();
      };
    } catch (e) {
      setStatus("❌ Allow camera!");
      alert("Please allow camera access!");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    clearInterval(intervalRef.current);
    clearInterval(countRef.current);
    noFaceTime.current     = null;
    eyesClosedTime.current = null;
    setIsActive(false);
    setStatus("Detector off");
    setCountdown(10);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const borderColor = status.includes("😴") ? "red"
    : status.includes("⚠️") || status.includes("😪") ? "orange"
    : isActive ? "#4CAF50" : "#555";

  const bgColor = status.includes("😴") ? "rgba(255,0,0,0.97)"
    : status.includes("⚠️") || status.includes("😪") ? "rgba(255,152,0,0.97)"
    : "rgba(0,0,0,0.9)";

  return (
    <div style={{
      position: "fixed", bottom: "20px", right: "20px",
      background: bgColor, padding: "12px", borderRadius: "12px",
      zIndex: 1000, textAlign: "center",
      border: `3px solid ${borderColor}`,
      width: "175px", transition: "all 0.3s"
    }}>
      <video ref={videoRef} autoPlay muted style={{
        width: "151px", height: "113px", borderRadius: "8px",
        display: isActive ? "block" : "none",
        transform: "scaleX(-1)"
      }} />

      {!isActive && (
        <div style={{ width: "151px", height: "95px",
          display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: "5px" }}>
          <span style={{ fontSize: "40px" }}>😴</span>
          <span style={{ color: "gray", fontSize: "10px", textAlign: "center" }}>
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
          borderRadius: "8px", padding: "5px", marginBottom: "6px"
        }}>
          <p style={{ color: "white", margin: 0, fontSize: "11px" }}>
            🔔 Alarm in: <strong>{countdown}s</strong>
          </p>
        </div>
      )}

      <button onClick={isActive ? stopCamera : startCamera}
        disabled={!modelsReady && !isActive}
        style={{
          background: !modelsReady && !isActive ? "#666"
            : isActive ? "#f44336" : "#4CAF50",
          color: "white", border: "none", padding: "8px",
          borderRadius: "6px", cursor: modelsReady || isActive ? "pointer" : "not-allowed",
          fontSize: "11px", width: "100%", fontWeight: "bold"
        }}>
        {!modelsReady && !isActive ? "⏳ Loading AI…"
          : isActive ? "🔴 Stop"
          : "😴 Start Sleep Detector"}
      </button>

      {isActive && (
        <p style={{ color: "#90EE90", fontSize: "9px", margin: "4px 0 0 0" }}>
          🤖 face-api.js — accurate EAR detection
        </p>
      )}
    </div>
  );
}
