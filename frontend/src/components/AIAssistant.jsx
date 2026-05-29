import { useState, useRef, useEffect } from "react";

const ANTHROPIC_KEY = "j4WMT7tBtDSzRFV16CKBqaxyTfCXz98h";
const ASSEMBLY_KEY = "19cce2de51cf4dbe8de282cfba9ff993";

export default function AIAssistant({ topicTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("youtube");
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [language, setLanguage] = useState("Telugu");
  const [loading, setLoading] = useState(false);
  const [doubt, setDoubt] = useState("");
  const [messages, setMessages] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranslated, setLiveTranslated] = useState("");
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const translateTimerRef = useRef(null);

  const languages = {
    "Telugu": "te", "Hindi": "hi", "Tamil": "ta",
    "Kannada": "kn", "Malayalam": "ml", "Bengali": "bn",
    "Marathi": "mr", "Gujarati": "gu", "Punjabi": "pa",
    "Urdu": "ur", "French": "fr", "Spanish": "es",
    "German": "de", "Japanese": "ja", "Chinese": "zh"
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const translateText = async (inputText) => {
    if (!inputText.trim()) return "";
    try {
      const code = languages[language];
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=en|${code}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.responseStatus === 200) return data.responseData.translatedText;
      return "";
    } catch (e) { return ""; }
  };

  const handleTranslate = async () => {
    if (!text.trim()) { alert("Please enter text!"); return; }
    setLoading(true);
    setTranslated("");
    const result = await translateText(text);
    setTranslated(result || "Translation failed. Please try again.");
    setLoading(false);
  };

  const getEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("youtube.com/embed/")) return url;
      return "";
    } catch { return ""; }
  };

  const handleLoadVideo = () => {
    const embedUrl = getEmbedUrl(youtubeUrl);
    if (embedUrl) setVideoLoaded(true);
    else alert("Invalid YouTube URL! Example: https://www.youtube.com/watch?v=xxxxx");
  };

  const startLiveTranslation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported!"); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join(" ");
      clearTimeout(translateTimerRef.current);
      translateTimerRef.current = setTimeout(async () => {
        const result = await translateText(transcript);
        if (result) setLiveTranslated(result);
      }, 800);
    };
    recognition.start();
    setIsListening(true);
  };

  const stopLiveTranslation = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setLiveTranslated("");
  };

  const handleDoubt = async () => {
    if (!doubt.trim()) return;
    const userMsg = doubt.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setDoubt("");
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: `You are a helpful AI teacher. The student is learning about "${topicTitle}". Answer this question simply and encouragingly in 2-3 sentences: "${userMsg}"`
          }]
        })
      });
      const data = await response.json();
      const answer = data.content[0].text;
      setMessages(prev => [...prev, { role: "ai", text: answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: `Great question about "${topicTitle}"! Focus on the video and take notes. You've got this! 🚀` }]);
    }
    setLoading(false);
  };

  const tabStyle = (tab) => ({
    flex: 1, padding: "9px 0",
    background: activeTab === tab ? "#fff" : "transparent",
    color: activeTab === tab ? "#e53935" : "#fff",
    border: "none", borderRadius: "6px", cursor: "pointer",
    fontSize: "13px", fontWeight: "bold", transition: "all 0.2s"
  });

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{
          position: "fixed", bottom: "20px", left: "20px",
          width: "52px", height: "52px", borderRadius: "50%",
          background: "linear-gradient(135deg, #e53935, #b71c1c)",
          border: "none", cursor: "pointer", zIndex: 9999,
          fontSize: "22px", boxShadow: "0 4px 15px rgba(229,57,53,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>🤖</button>
      )}

      {isOpen && (
        <div style={{
          position: "fixed", bottom: "20px", left: "20px",
          width: "360px", height: "540px",
          background: "#1a1a2e", borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          zIndex: 9999, display: "flex", flexDirection: "column",
          overflow: "hidden", border: "1px solid #333"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #e53935, #b71c1c)",
            padding: "14px 16px", display: "flex",
            alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>
              <div>
                <p style={{ color: "white", margin: 0, fontWeight: "bold", fontSize: "15px" }}>Video Translator</p>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "11px" }}>{topicTitle}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>✕</button>
          </div>

          <div style={{ display: "flex", background: "#e53935", padding: "6px 10px", gap: "4px" }}>
            <button onClick={() => setActiveTab("youtube")} style={tabStyle("youtube")}>📺 YouTube</button>
            <button onClick={() => setActiveTab("text")} style={tabStyle("text")}>🌐 Text</button>
            <button onClick={() => setActiveTab("doubt")} style={tabStyle("doubt")}>💬 Doubt</button>
          </div>

          {activeTab === "youtube" && (
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ color: "#f44336", fontSize: "13px", margin: 0, fontWeight: "bold", textAlign: "center" }}>📺 YouTube Subtitle Translator</p>
              <input type="text" placeholder="Paste YouTube URL here..."
                value={youtubeUrl}
                onChange={e => { setYoutubeUrl(e.target.value); setVideoLoaded(false); }}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#333", color: "white", fontSize: "13px", boxSizing: "border-box" }}
              />
              <select value={language} onChange={e => setLanguage(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #444", background: "#333", color: "white", fontSize: "13px" }}>
                {Object.keys(languages).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={handleLoadVideo} disabled={!youtubeUrl.trim()}
                style={{ width: "100%", padding: "11px", background: youtubeUrl.trim() ? "#2196F3" : "#555", color: "white", border: "none", borderRadius: "8px", cursor: youtubeUrl.trim() ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: "bold" }}>
                📺 Load Video
              </button>
              {videoLoaded && (
                <iframe width="100%" height="170" src={getEmbedUrl(youtubeUrl)} frameBorder="0" allowFullScreen style={{ borderRadius: "8px" }} />
              )}
              <div style={{ borderTop: "1px solid #333", paddingTop: "10px" }}>
                <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 4px", textAlign: "center" }}>🎤 Live Subtitle Translation</p>
                <p style={{ color: "#888", fontSize: "11px", margin: "0 0 8px", textAlign: "center", lineHeight: "1.4" }}>Click start → speak what the video says → translation appears!</p>
                <button onClick={isListening ? stopLiveTranslation : startLiveTranslation}
                  style={{ width: "100%", padding: "12px", background: isListening ? "#f44336" : "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
                  {isListening ? "⏹ Stop Translation" : "🎤 Start Live Translation"}
                </button>
                {liveTranslated && (
                  <div style={{ background: "#0d3b1e", padding: "10px", borderRadius: "8px", marginTop: "8px", border: "1px solid #4CAF50" }}>
                    <p style={{ color: "#4CAF50", margin: "0 0 4px", fontSize: "11px", fontWeight: "bold" }}>✅ {language}:</p>
                    <p style={{ color: "white", margin: 0, fontSize: "13px", lineHeight: "1.5" }}>{liveTranslated}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "text" && (
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ color: "#4CAF50", fontSize: "12px", margin: 0, fontWeight: "bold" }}>✅ Free Translation — 15 Languages!</p>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #444", background: "#333", color: "white", fontSize: "14px" }}>
                {Object.keys(languages).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <textarea placeholder="Type or paste text from the video here..."
                value={text} onChange={e => setText(e.target.value)}
                style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#333", color: "white", fontSize: "13px", resize: "none", boxSizing: "border-box" }}
              />
              <button onClick={handleTranslate} disabled={loading}
                style={{ width: "100%", padding: "11px", background: loading ? "#555" : "#f44336", color: "white", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "bold" }}>
                {loading ? "🔄 Translating..." : `🌐 Translate to ${language}`}
              </button>
              {translated && (
                <div style={{ background: "#0d3b1e", padding: "12px", borderRadius: "8px", border: "1px solid #4CAF50" }}>
                  <p style={{ color: "#4CAF50", margin: "0 0 5px", fontSize: "11px", fontWeight: "bold" }}>✅ {language} Translation:</p>
                  <p style={{ color: "white", margin: "0 0 8px", fontSize: "14px", lineHeight: "1.6" }}>{translated}</p>
                  <button onClick={() => navigator.clipboard.writeText(translated)}
                    style={{ padding: "4px 12px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px" }}>
                    📋 Copy
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "doubt" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <p style={{ fontSize: "28px" }}>💬</p>
                    <p style={{ color: "#4CAF50", fontSize: "12px", margin: "0 0 8px", fontWeight: "bold" }}>🤖 Powered by Claude AI!</p>
                    <p style={{ color: "gray", fontSize: "13px" }}>Ask anything about {topicTitle}!</p>
                    {["What is this topic about?", "How to learn this easily?", "Why is this important?", "Give me an example", "This is difficult for me", "What is the difference?"].map(q => (
                      <button key={q} onClick={() => setDoubt(q)}
                        style={{ display: "block", width: "100%", padding: "7px 10px", margin: "4px 0", background: "#2a2a3e", color: "white", border: "1px solid #444", borderRadius: "8px", cursor: "pointer", fontSize: "12px", textAlign: "left" }}>
                        💡 {q}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "85%", padding: "10px 12px", borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: msg.role === "user" ? "#f44336" : "#2a2a3e", color: "white", fontSize: "13px", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                      {msg.role === "ai" && <p style={{ color: "#4CAF50", margin: "0 0 4px", fontSize: "11px", fontWeight: "bold" }}>🤖 AI Teacher</p>}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ padding: "10px 15px", background: "#2a2a3e", borderRadius: "12px", color: "gray", fontSize: "13px" }}>🤖 Thinking...</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: "10px", borderTop: "1px solid #333", display: "flex", gap: "8px" }}>
                <input placeholder="Ask your doubt..."
                  value={doubt} onChange={e => setDoubt(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && handleDoubt()}
                  style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid #444", background: "#333", color: "white", fontSize: "13px" }}
                />
                <button onClick={handleDoubt} disabled={loading}
                  style={{ padding: "8px 14px", background: loading ? "#555" : "#f44336", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
