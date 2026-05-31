import { useState, useRef, useEffect } from "react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const LANGUAGES = {
  "Telugu": "te", "Hindi": "hi", "Tamil": "ta",
  "Kannada": "kn", "Malayalam": "ml", "Bengali": "bn",
  "Marathi": "mr", "Gujarati": "gu", "Punjabi": "pa",
  "Urdu": "ur", "French": "fr", "Spanish": "es",
  "German": "de", "Japanese": "ja", "Chinese": "zh"
};

export default function AIAssistant({ topicTitle }) {
  const [isOpen,        setIsOpen]        = useState(false);
  const [activeTab,     setActiveTab]     = useState("youtube");
  const [language,      setLanguage]      = useState("Telugu");

  // YouTube tab
  const [youtubeUrl,    setYoutubeUrl]    = useState("");
  const [embedUrl,      setEmbedUrl]      = useState("");
  const [isListening,   setIsListening]   = useState(false);
  const [liveOriginal,  setLiveOriginal]  = useState("");
  const [liveTranslated,setLiveTranslated]= useState("");
  const [liveStatus,    setLiveStatus]    = useState("");

  // Text tab
  const [inputText,     setInputText]     = useState("");
  const [translated,    setTranslated]    = useState("");
  const [translating,   setTranslating]   = useState(false);

  // Doubt tab
  const [doubt,         setDoubt]         = useState("");
  const [messages,      setMessages]      = useState([]);
  const [aiLoading,     setAiLoading]     = useState(false);

  const chatEndRef      = useRef(null);
  const recognitionRef  = useRef(null);
  const translateTimer  = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => stopListening();
  }, []);

  // ── Translate via MyMemory (free, no key needed) ──────────────────────────
  const translateText = async (text) => {
    if (!text.trim()) return "";
    try {
      const code = LANGUAGES[language];
      const res  = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${code}`
      );
      const data = await res.json();
      if (data.responseStatus === 200) return data.responseData.translatedText;
      return "Translation failed. Try again.";
    } catch {
      return "Translation error. Check internet connection.";
    }
  };

  // ── YouTube URL → embed ───────────────────────────────────────────────────
  const getEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}?enablejsapi=1`;
      }
      if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}?enablejsapi=1`;
      }
      if (url.includes("youtube.com/embed/")) return url;
      return "";
    } catch { return ""; }
  };

  const handleLoadVideo = () => {
    const url = getEmbedUrl(youtubeUrl);
    if (url) {
      setEmbedUrl(url);
      setLiveOriginal("");
      setLiveTranslated("");
    } else {
      alert("Invalid YouTube URL!\nExample: https://www.youtube.com/watch?v=xxxxx");
    }
  };

  // ── Live translation via browser SpeechRecognition ───────────────────────
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setLiveStatus("❌ Speech recognition not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new SR();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = "en-US";
    recognitionRef.current     = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setLiveStatus("🎤 Listening… speak what the video says");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript).join(" ");
      setLiveOriginal(transcript);
      clearTimeout(translateTimer.current);
      translateTimer.current = setTimeout(async () => {
        const result = await translateText(transcript);
        if (result) setLiveTranslated(result);
      }, 800);
    };

    recognition.onerror = (e) => {
      console.error("SpeechRecognition error:", e);
      setLiveStatus("❌ Mic error: " + e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setLiveStatus("⏹ Stopped.");
    };

    recognition.start();
  };

  const stopListening = () => {
    clearTimeout(translateTimer.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setLiveStatus("");
  };

  // ── Text translation ──────────────────────────────────────────────────────
  const handleTranslate = async () => {
    if (!inputText.trim()) { alert("Please enter some text!"); return; }
    setTranslating(true);
    setTranslated("");
    const result = await translateText(inputText);
    setTranslated(result);
    setTranslating(false);
  };

  // ── Doubt clearing via Groq ───────────────────────────────────────────────
  const askDoubt = async () => {
    if (!doubt.trim()) return;
    const userMsg = doubt.trim();
    setDoubt("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAiLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          max_tokens: 500,
          messages: [
            {
              role: "system",
              content: `You are a helpful tutor for the topic "${topicTitle}". 
              Answer student doubts clearly and concisely. 
              Use simple language. Keep answers under 150 words.
              If the question is unrelated to the topic, gently redirect.`
            },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: userMsg }
          ]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "API error");
      }

      const reply = data.choices?.[0]?.message?.content || "Sorry, no response received.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("Groq error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "❌ AI unavailable right now. Check your internet or API key. Error: " + err.message
      }]);
    }
    setAiLoading(false);
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const tabBtn = (tab) => ({
    flex: 1, padding: "9px 0",
    background: activeTab === tab ? "#fff" : "transparent",
    color: activeTab === tab ? "#e53935" : "#fff",
    border: "none", borderRadius: "6px", cursor: "pointer",
    fontSize: "13px", fontWeight: "bold", transition: "all 0.2s"
  });

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed", bottom: "20px", left: "20px",
            width: "52px", height: "52px", borderRadius: "50%",
            background: "linear-gradient(135deg, #e53935, #b71c1c)",
            border: "none", cursor: "pointer", zIndex: 9999,
            fontSize: "22px", boxShadow: "0 4px 15px rgba(229,57,53,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >🤖</button>
      )}

      {/* Main panel */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "20px", left: "20px",
          width: "360px", height: "540px",
          background: "#1a1a2e", borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          zIndex: 9999, display: "flex", flexDirection: "column",
          overflow: "hidden", border: "1px solid #333"
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #e53935, #b71c1c)",
            padding: "14px 16px", display: "flex",
            alignItems: "center", justifyContent: "space-between", flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
              }}>🤖</div>
              <div>
                <p style={{ color: "white", margin: 0, fontWeight: "bold", fontSize: "15px" }}>Video Translator</p>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "11px" }}>{topicTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)", border: "none",
                color: "white", borderRadius: "50%",
                width: "28px", height: "28px", cursor: "pointer",
                fontSize: "14px", fontWeight: "bold"
              }}
            >✕</button>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", background: "#e53935",
            padding: "6px 10px", gap: "4px", flexShrink: 0
          }}>
            <button onClick={() => setActiveTab("youtube")} style={tabBtn("youtube")}>📺 YouTube</button>
            <button onClick={() => setActiveTab("text")}    style={tabBtn("text")}>🌐 Text</button>
            <button onClick={() => setActiveTab("doubt")}   style={tabBtn("doubt")}>🤔 Doubt</button>
          </div>

          {/* ── YouTube Tab ── */}
          {activeTab === "youtube" && (
            <div style={{ flex: 1, padding: "14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ color: "#c084fc", fontSize: "13px", fontWeight: "bold", margin: 0 }}>
                📺 YouTube Subtitle Translator
              </p>

              <input
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                style={{
                  width: "100%", padding: "9px 10px", borderRadius: "8px",
                  border: "1px solid #444", background: "#2a2a3e",
                  color: "white", fontSize: "13px", boxSizing: "border-box"
                }}
              />

              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{
                  width: "100%", padding: "8px", borderRadius: "8px",
                  border: "1px solid #444", background: "#2a2a3e",
                  color: "white", fontSize: "13px"
                }}
              >
                {Object.keys(LANGUAGES).map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              <button
                onClick={handleLoadVideo}
                style={{
                  width: "100%", padding: "10px", background: "#4CAF50",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: "pointer", fontSize: "14px", fontWeight: "bold"
                }}
              >📺 Load Video</button>

              {embedUrl && (
                <iframe
                  src={embedUrl}
                  width="100%" height="160"
                  frameBorder="0" allowFullScreen
                  allow="autoplay"
                  style={{ borderRadius: "8px" }}
                />
              )}

              <div style={{ borderTop: "1px solid #333", paddingTop: "10px" }}>
                <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 6px", textAlign: "center" }}>
                  🎤 Live Subtitle Translation<br />
                  <span style={{ fontSize: "10px" }}>Speak what the video says</span>
                </p>

                {liveStatus && (
                  <p style={{ color: "#facc15", fontSize: "11px", textAlign: "center", margin: "0 0 6px" }}>
                    {liveStatus}
                  </p>
                )}

                <button
                  onClick={isListening ? stopListening : startListening}
                  style={{
                    width: "100%", padding: "10px",
                    background: isListening ? "#ef4444" : "#22c55e",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontSize: "13px", fontWeight: "bold"
                  }}
                >
                  {isListening ? "⏹ Stop Translation" : "🎤 Start Live Translation"}
                </button>

                {liveOriginal && (
                  <div style={{
                    background: "#1e2a3a", padding: "8px 10px",
                    borderRadius: "8px", marginTop: "8px", border: "1px solid #3b82f6"
                  }}>
                    <p style={{ color: "#3b82f6", margin: "0 0 2px", fontSize: "10px", fontWeight: "bold" }}>🔊 Heard:</p>
                    <p style={{ color: "#cbd5e1", margin: 0, fontSize: "12px" }}>{liveOriginal}</p>
                  </div>
                )}

                {liveTranslated && (
                  <div style={{
                    background: "#0d3b1e", padding: "10px",
                    borderRadius: "8px", marginTop: "6px", border: "1px solid #4CAF50"
                  }}>
                    <p style={{ color: "#4CAF50", margin: "0 0 4px", fontSize: "11px", fontWeight: "bold" }}>
                      ✅ {language}:
                    </p>
                    <p style={{ color: "white", margin: 0, fontSize: "13px", lineHeight: "1.5" }}>
                      {liveTranslated}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Text Tab ── */}
          {activeTab === "text" && (
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ color: "#4CAF50", fontSize: "12px", margin: 0, fontWeight: "bold" }}>
                ✅ Free Translation — 15 Languages!
              </p>

              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{
                  width: "100%", padding: "8px", borderRadius: "8px",
                  border: "1px solid #444", background: "#2a2a3e",
                  color: "white", fontSize: "14px"
                }}
              >
                {Object.keys(LANGUAGES).map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              <textarea
                placeholder="Type or paste text from the video here..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{
                  width: "100%", height: "100px", padding: "10px",
                  borderRadius: "8px", border: "1px solid #444",
                  background: "#2a2a3e", color: "white",
                  fontSize: "13px", resize: "none", boxSizing: "border-box"
                }}
              />

              <button
                onClick={handleTranslate}
                disabled={translating}
                style={{
                  width: "100%", padding: "11px",
                  background: translating ? "#555" : "#e53935",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: translating ? "not-allowed" : "pointer",
                  fontSize: "14px", fontWeight: "bold"
                }}
              >
                {translating ? "🔄 Translating..." : `🌍 Translate to ${language}`}
              </button>

              {translated && (
                <div style={{
                  background: "#0d3b1e", padding: "12px",
                  borderRadius: "8px", border: "1px solid #4CAF50"
                }}>
                  <p style={{ color: "#4CAF50", margin: "0 0 6px", fontSize: "12px", fontWeight: "bold" }}>
                    ✅ {language} Translation:
                  </p>
                  <p style={{ color: "white", margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
                    {translated}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Doubt Tab ── */}
          {activeTab === "doubt" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 10px" }}>
                    <p style={{ fontSize: "32px", margin: "0 0 8px" }}>🤔</p>
                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                      Ask any doubt about<br />
                      <strong style={{ color: "#c084fc" }}>{topicTitle}</strong>
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                  }}>
                    <div style={{
                      maxWidth: "85%", padding: "10px 12px",
                      borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: msg.role === "user" ? "#e53935" : "#2a2a3e",
                      color: "white", fontSize: "13px", lineHeight: "1.5"
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{
                      background: "#2a2a3e", padding: "10px 14px",
                      borderRadius: "12px 12px 12px 2px", color: "#94a3b8", fontSize: "13px"
                    }}>
                      🤖 Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: "12px", borderTop: "1px solid #333",
                display: "flex", gap: "8px", flexShrink: 0
              }}>
                <input
                  value={doubt}
                  onChange={e => setDoubt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && askDoubt()}
                  placeholder={`Ask about ${topicTitle}...`}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: "8px",
                    border: "1px solid #444", background: "#2a2a3e",
                    color: "white", fontSize: "13px"
                  }}
                />
                <button
                  onClick={askDoubt}
                  disabled={aiLoading || !doubt.trim()}
                  style={{
                    padding: "10px 14px", background: aiLoading ? "#555" : "#e53935",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    fontSize: "16px", fontWeight: "bold"
                  }}
                >➤</button>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}
