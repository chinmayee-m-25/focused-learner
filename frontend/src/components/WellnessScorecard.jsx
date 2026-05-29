import { useState, useEffect } from "react";

const EMOTION_CONFIG = {
  happy:     { emoji: "😊", color: "#22c55e", label: "Happy"    },
  sad:       { emoji: "😢", color: "#3b82f6", label: "Sad"      },
  angry:     { emoji: "😠", color: "#ef4444", label: "Angry"    },
  fearful:   { emoji: "😰", color: "#f97316", label: "Stressed" },
  disgusted: { emoji: "🤢", color: "#a855f7", label: "Disgusted"},
  surprised: { emoji: "😲", color: "#eab308", label: "Surprised"},
  neutral:   { emoji: "😐", color: "#6b7280", label: "Neutral"  },
};

export default function WellnessScorecard({ sessionStartTime, sleepAlerts = 0 }) {
  const [summary,      setSummary]      = useState({});
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [exported,     setExported]     = useState(false);

  // Poll window.__emotionSummary (set by EmotionDetector) every 5 s
  useEffect(() => {
    const id = setInterval(() => {
      if (window.__emotionSummary) setSummary({ ...window.__emotionSummary });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Update focus time every minute
  useEffect(() => {
    const id = setInterval(() => {
      if (sessionStartTime) {
        const mins = Math.floor((Date.now() - sessionStartTime) / 60000);
        setFocusMinutes(mins);
      }
    }, 60000);
    return () => clearInterval(id);
  }, [sessionStartTime]);

  const totalDetections = Object.values(summary).reduce((a, b) => a + b, 0) || 1;

  // Focus score: reward happy+neutral, penalise angry+fearful
  const positive  = (summary.happy   || 0) + (summary.neutral   || 0);
  const negative  = (summary.angry   || 0) + (summary.fearful   || 0);
  const focusScore = Math.max(0, Math.min(100,
    Math.round(((positive - negative * 2) / totalDetections) * 100 + 60)
  ));

  const scoreColor = focusScore >= 75 ? "#22c55e"
                   : focusScore >= 50 ? "#eab308"
                   : "#ef4444";

  // ── Export as plain-text report (no PDF lib needed) ───────────────────────
  const exportReport = () => {
    const lines = [
      "═══════════════════════════════════════",
      "       FOCUSED LEARNER — SESSION REPORT",
      "═══════════════════════════════════════",
      `Date         : ${new Date().toLocaleDateString()}`,
      `Time         : ${new Date().toLocaleTimeString()}`,
      `Focus Time   : ${focusMinutes} min`,
      `Sleep Alerts : ${sleepAlerts}`,
      `Focus Score  : ${focusScore} / 100`,
      "",
      "── Emotion Breakdown ───────────────────",
      ...Object.entries(summary).map(([e, c]) =>
        `  ${EMOTION_CONFIG[e]?.label || e.padEnd(10)} : ${c} detections (${Math.round(c/totalDetections*100)}%)`
      ),
      "═══════════════════════════════════════",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), {
      href: url, download: `wellness-report-${Date.now()}.txt`
    });
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Wellness Scorecard</h3>

      {/* Focus score ring */}
      <div style={styles.scoreRing}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={scoreColor} strokeWidth="10"
            strokeDasharray={`${focusScore * 2.51} 251`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
          <text x="50" y="55" textAnchor="middle" fill={scoreColor}
            fontSize="20" fontWeight="bold">{focusScore}</text>
        </svg>
        <p style={{ ...styles.scoreLabel, color: scoreColor }}>Focus Score</p>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <Stat icon="⏱" value={`${focusMinutes}m`} label="Focus Time" />
        <Stat icon="😴" value={sleepAlerts}         label="Sleep Alerts" />
        <Stat icon="🎭" value={totalDetections}     label="Detections" />
      </div>

      {/* Emotion bar chart */}
      {Object.keys(summary).length > 0 && (
        <div style={styles.chartSection}>
          <p style={styles.chartTitle}>Emotion Breakdown</p>
          {Object.entries(summary)
            .sort((a, b) => b[1] - a[1])
            .map(([emotion, count]) => {
              const cfg   = EMOTION_CONFIG[emotion] || {};
              const pct   = Math.round((count / totalDetections) * 100);
              return (
                <div key={emotion} style={styles.barRow}>
                  <span style={styles.barEmoji}>{cfg.emoji}</span>
                  <span style={styles.barLabel}>{cfg.label || emotion}</span>
                  <div style={styles.barTrack}>
                    <div style={{
                      ...styles.barFill,
                      width: `${pct}%`,
                      background: cfg.color || "#6b7280",
                    }} />
                  </div>
                  <span style={styles.barPct}>{pct}%</span>
                </div>
              );
            })}
        </div>
      )}

      {Object.keys(summary).length === 0 && (
        <p style={styles.empty}>Start the Emotion Detector to see data here.</p>
      )}

      {/* Export button */}
      <button style={styles.exportBtn} onClick={exportReport}>
        {exported ? "✅ Downloaded!" : "⬇ Export Report (.txt)"}
      </button>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div style={styles.statBox}>
      <span style={styles.statIcon}>{icon}</span>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  container: {
    background: "#1e1e2e",
    border: "1px solid #2a2a3e",
    borderRadius: "14px",
    padding: "20px",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', sans-serif",
    maxWidth: "380px",
  },
  title:      { margin: "0 0 16px", fontSize: "16px", color: "#c084fc" },
  scoreRing:  { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" },
  scoreLabel: { margin: "4px 0 0", fontSize: "13px", fontWeight: "600" },
  statsRow:   { display: "flex", gap: "8px", marginBottom: "16px" },
  statBox: {
    flex: 1, background: "#0f172a", borderRadius: "10px",
    padding: "10px 6px", textAlign: "center",
    display: "flex", flexDirection: "column", gap: "2px",
  },
  statIcon:   { fontSize: "18px" },
  statValue:  { fontSize: "20px", fontWeight: "700", color: "#f1f5f9" },
  statLabel:  { fontSize: "10px", color: "#64748b" },
  chartSection: { marginBottom: "16px" },
  chartTitle: { fontSize: "12px", color: "#64748b", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" },
  barRow: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" },
  barEmoji: { fontSize: "14px", width: "18px" },
  barLabel: { fontSize: "12px", width: "65px", color: "#94a3b8" },
  barTrack: { flex: 1, height: "8px", background: "#1e293b", borderRadius: "4px", overflow: "hidden" },
  barFill:  { height: "100%", borderRadius: "4px", transition: "width 0.6s ease" },
  barPct:   { fontSize: "11px", color: "#64748b", width: "30px", textAlign: "right" },
  empty:    { fontSize: "13px", color: "#475569", textAlign: "center", padding: "12px 0" },
  exportBtn: {
    width: "100%", padding: "10px", borderRadius: "8px",
    background: "#7c3aed", border: "none", color: "#fff",
    fontWeight: "600", fontSize: "14px", cursor: "pointer",
  },
};
