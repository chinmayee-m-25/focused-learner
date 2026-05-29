// Create AI Assistant button on YouTube
function createYouTubeAssistant() {
  // Don't create twice
  if (document.getElementById("focusAssistant")) return;

  const API_KEY = "YOUR_API_KEY_HERE";

  // Main container
  const container = document.createElement("div");
  container.id = "focusAssistant";
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;

  // Toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "focusToggle";
  toggleBtn.innerHTML = "🤖";
  toggleBtn.style.cssText = `
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: #2196F3;
    color: white;
    border: none;
    font-size: 22px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    display: block;
  `;

  // Panel
  const panel = document.createElement("div");
  panel.id = "focusPanel";
  panel.style.cssText = `
    display: none;
    position: absolute;
    bottom: 65px;
    left: 0;
    width: 320px;
    height: 480px;
    background: #1a1a2e;
    border-radius: 15px;
    border: 2px solid #2196F3;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    flex-direction: column;
  `;

  panel.innerHTML = `
    <!-- Header -->
    <div style="background:#2196F3;padding:12px 15px;display:flex;
    align-items:center;gap:8px;">
      <span style="font-size:20px">🤖</span>
      <div>
        <p style="color:white;margin:0;font-weight:bold;font-size:14px">
          AI Assistant
        </p>
        <p style="color:rgba(255,255,255,0.8);margin:0;font-size:11px">
          YouTube Learning Helper
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div style="display:flex;background:#0d1117;border-bottom:1px solid #333">
      <button id="tabTranslate" onclick="switchTab('translate')"
        style="flex:1;padding:10px;background:#2196F3;color:white;
        border:none;cursor:pointer;font-size:13px;font-weight:bold">
        🌍 Translate
      </button>
      <button id="tabDoubt" onclick="switchTab('doubt')"
        style="flex:1;padding:10px;background:transparent;color:white;
        border:none;cursor:pointer;font-size:13px">
        💬 Ask Doubt
      </button>
    </div>

    <!-- Translate Panel -->
    <div id="translatePanel" style="flex:1;padding:12px;
    overflow-y:auto;display:flex;flex-direction:column;gap:10px">
      <p style="color:gray;font-size:12px;margin:0">
        Translate any text from the video!
      </p>
      <select id="langSelect" style="width:100%;padding:8px;
      border-radius:8px;border:1px solid #444;background:#333;
      color:white;font-size:14px">
        <option>Telugu</option>
        <option>Hindi</option>
        <option>Tamil</option>
        <option>Kannada</option>
        <option>Malayalam</option>
        <option>Bengali</option>
        <option>Marathi</option>
        <option>Gujarati</option>
        <option>Punjabi</option>
        <option>Urdu</option>
      </select>
      <textarea id="translateInput" placeholder="Type or paste text here..."
        style="width:100%;height:80px;padding:8px;border-radius:8px;
        border:1px solid #444;background:#333;color:white;
        font-size:13px;resize:none;box-sizing:border-box"></textarea>
      <button onclick="doTranslate()"
        style="width:100%;padding:10px;background:#2196F3;color:white;
        border:none;border-radius:8px;cursor:pointer;
        font-size:14px;font-weight:bold">
        🌍 Translate
      </button>
      <div id="translateResult" style="display:none;background:#0d3b1e;
      padding:12px;border-radius:8px;border:1px solid #4CAF50">
        <p style="color:#4CAF50;margin:0 0 5px;font-size:11px;
        font-weight:bold">✅ Translation:</p>
        <p id="translateText" style="color:white;margin:0;
        font-size:14px;line-height:1.6"></p>
      </div>
    </div>

    <!-- Doubt Panel -->
    <div id="doubtPanel" style="display:none;flex:1;
    flex-direction:column;overflow:hidden">
      <div id="chatMessages" style="flex:1;overflow-y:auto;
      padding:12px;display:flex;flex-direction:column;gap:8px;
      min-height:280px;max-height:280px">
        <div style="text-align:center;padding:20px">
          <p style="font-size:30px">💬</p>
          <p style="color:gray;font-size:13px">
            Ask any doubt about this YouTube video!
          </p>
        </div>
      </div>
      <div style="padding:10px;border-top:1px solid #333;
      display:flex;gap:8px">
        <input id="doubtInput" placeholder="Ask your doubt..."
          style="flex:1;padding:8px;border-radius:8px;
          border:1px solid #444;background:#333;color:white;
          font-size:13px"
          onkeypress="if(event.key==='Enter')doDoubt()"/>
        <button onclick="doDoubt()"
          style="padding:8px 12px;background:#4CAF50;color:white;
          border:none;border-radius:8px;cursor:pointer;font-size:16px">
          ➤
        </button>
      </div>
    </div>
  `;

  container.appendChild(panel);
  container.appendChild(toggleBtn);
  document.body.appendChild(container);

  // Toggle panel
  toggleBtn.addEventListener("click", () => {
    const isOpen = panel.style.display === "flex";
    panel.style.display = isOpen ? "none" : "flex";
    panel.style.flexDirection = "column";
    toggleBtn.innerHTML = isOpen ? "🤖" : "✕";
    toggleBtn.style.background = isOpen ? "#2196F3" : "#f44336";
  });

  // Switch tabs
  window.switchTab = (tab) => {
    const translate = document.getElementById("translatePanel");
    const doubt = document.getElementById("doubtPanel");
    const tabT = document.getElementById("tabTranslate");
    const tabD = document.getElementById("tabDoubt");

    if (tab === "translate") {
      translate.style.display = "flex";
      translate.style.flexDirection = "column";
      doubt.style.display = "none";
      tabT.style.background = "#2196F3";
      tabD.style.background = "transparent";
    } else {
      translate.style.display = "none";
      doubt.style.display = "flex";
      doubt.style.flexDirection = "column";
      tabT.style.background = "transparent";
      tabD.style.background = "#4CAF50";
    }
  };

  // Translate function
  window.doTranslate = async () => {
    const text = document.getElementById("translateInput").value;
    const lang = document.getElementById("langSelect").value;
    const result = document.getElementById("translateResult");
    const output = document.getElementById("translateText");

    if (!text.trim()) {
      alert("Please enter text to translate!");
      return;
    }

    output.innerText = "⏳ Translating...";
    result.style.display = "block";

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Translate this text to ${lang}. Return ONLY translated text:
            "${text}"`
          }]
        })
      });
      const data = await response.json();
      output.innerText = data.content[0].text;
    } catch (e) {
      output.innerText = "❌ Failed! Check API key.";
    }
  };

  // Doubt function
  window.doDoubt = async () => {
    const input = document.getElementById("doubtInput");
    const chat = document.getElementById("chatMessages");
    const question = input.value.trim();
    if (!question) return;

    // Get video title
    const videoTitle = document.querySelector("h1.ytd-watch-metadata")?.innerText
      || "this YouTube video";

    // Add user message
    chat.innerHTML += `
      <div style="display:flex;justify-content:flex-end">
        <div style="max-width:85%;padding:8px 12px;
        border-radius:12px 12px 2px 12px;
        background:#2196F3;color:white;font-size:13px">
          ${question}
        </div>
      </div>
    `;
    input.value = "";

    // Add loading
    const loadingId = "loading_" + Date.now();
    chat.innerHTML += `
      <div id="${loadingId}" style="display:flex;justify-content:flex-start">
        <div style="padding:8px 12px;background:#333;
        border-radius:12px;color:gray;font-size:13px">
          🤖 Thinking...
        </div>
      </div>
    `;
    chat.scrollTop = chat.scrollHeight;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a helpful teacher for "${videoTitle}".
            Answer in simple easy English, max 100 words:
            ${question}`
          }]
        })
      });
      const data = await response.json();
      const answer = data.content[0].text;

      // Remove loading
      document.getElementById(loadingId)?.remove();

      // Add AI answer
      chat.innerHTML += `
        <div style="display:flex;justify-content:flex-start">
          <div style="max-width:85%;padding:8px 12px;
          border-radius:12px 12px 12px 2px;
          background:#333;color:white;font-size:13px;line-height:1.5">
            <p style="color:#4CAF50;margin:0 0 4px;
            font-size:11px;font-weight:bold">🤖 AI Teacher</p>
            ${answer}
          </div>
        </div>
      `;
    } catch (e) {
      document.getElementById(loadingId)?.remove();
      chat.innerHTML += `
        <div style="display:flex;justify-content:flex-start">
          <div style="padding:8px 12px;background:#333;
          border-radius:12px;color:#f44336;font-size:13px">
            ❌ Failed! Check API key.
          </div>
        </div>
      `;
    }
    chat.scrollTop = chat.scrollHeight;
  };
}

// Wait for YouTube to load then create assistant
setTimeout(createYouTubeAssistant, 2000);

// Also handle buzzer warning from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "BUZZER") {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;top:0;left:0;
      width:100%;height:100%;
      background:rgba(255,0,0,0.9);
      z-index:99999;display:flex;
      align-items:center;justify-content:center;
      flex-direction:column;font-family:Arial;
    `;
    overlay.innerHTML = `
      <div style="font-size:80px">⚠️</div>
      <h1 style="color:white;font-size:48px">FOCUS!</h1>
      <p style="color:white;font-size:22px">Go back to your study!</p>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 3000);
  }
});