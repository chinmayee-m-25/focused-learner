let studyMode = false;
let allowedTab = null;
let allowedUrl = null;
let allowedVideoId = null;

const getVideoId = (url) => {
  try {
    if (url && url.includes("watch?v=")) {
      return url.split("watch?v=")[1].split("&")[0];
    }
    return null;
  } catch (e) { return null; }
};

const showWarning = async (tabId, message) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (msg) => {
        const old = document.getElementById("studyBlock");
        if (old) old.remove();
        const div = document.createElement("div");
        div.id = "studyBlock";
        div.style.cssText = `
          position:fixed;top:0;left:0;
          width:100%;height:100%;
          background:rgba(255,0,0,0.97);
          z-index:2147483647;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          font-family:Arial;text-align:center;
          padding:20px;box-sizing:border-box;
        `;
        div.innerHTML = `
          <div style="font-size:80px">⛔</div>
          <h1 style="color:white;font-size:42px;margin:10px">
            STUDY MODE ON!
          </h1>
          <p style="color:white;font-size:22px;margin:5px">${msg}</p>
          <p style="color:white;font-size:18px">
            Going back to your study...
          </p>
        `;
        document.body.appendChild(div);
        setTimeout(() => { if (div.parentNode) div.remove(); }, 3000);
      },
      args: [message]
    });
  } catch (e) {}
};

const tabExists = async (tabId) => {
  try { await chrome.tabs.get(tabId); return true; }
  catch (e) { return false; }
};

// Block tab switching
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (!studyMode) return;
  if (activeInfo.tabId === allowedTab) {
    // Back to study tab - resume video
    try {
      await chrome.tabs.update(activeInfo.tabId, { muted: false });
      await chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        func: () => {
          const v = document.querySelector("video");
          if (v) v.play();
        }
      });
    } catch (e) {}
    return;
  }

  if (allowedTab) {
    const exists = await tabExists(allowedTab);
    if (!exists) {
      studyMode = false; allowedTab = null;
      allowedUrl = null; allowedVideoId = null;
      return;
    }
  }

  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    const url = tab.url || "";
    if (url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") || url === "") return;

    // Allow localhost/dashboard
    if (url.includes("localhost")) return;

    // Pause YouTube on study tab
    try {
      await chrome.tabs.update(allowedTab, { muted: true });
      await chrome.scripting.executeScript({
        target: { tabId: allowedTab },
        func: () => {
          const v = document.querySelector("video");
          if (v) v.pause();
        }
      });
    } catch (e) {}

    await showWarning(activeInfo.tabId,
      "You cannot switch tabs during study!");
    setTimeout(async () => {
      try {
        await chrome.tabs.update(allowedTab, { active: true });
        await chrome.tabs.update(allowedTab, { muted: false });
        await chrome.scripting.executeScript({
          target: { tabId: allowedTab },
          func: () => {
            const v = document.querySelector("video");
            if (v) v.play();
          }
        });
      } catch (e) {
        studyMode = false; allowedTab = null;
      }
    }, 2500);
  } catch (e) {}
});

// Block YouTube video change
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!studyMode) return;
  if (tabId !== allowedTab) return;
  if (!changeInfo.url) return;

  const newUrl = changeInfo.url;
  const newVideoId = getVideoId(newUrl);

  if (newVideoId && allowedVideoId && newVideoId !== allowedVideoId) {
    await showWarning(tabId,
      "You cannot change the video during study!");
    setTimeout(async () => {
      try { await chrome.tabs.update(tabId, { url: allowedUrl }); }
      catch (e) {}
    }, 2000);
  } else {
    allowedUrl = newUrl;
    if (newVideoId) allowedVideoId = newVideoId;
  }
});

// Block new tabs
chrome.tabs.onCreated.addListener(async (tab) => {
  if (!studyMode) return;
  setTimeout(async () => {
    try {
      await chrome.tabs.remove(tab.id);
      if (allowedTab) await chrome.tabs.update(allowedTab, { active: true });
    } catch (e) {}
  }, 500);
});

// Study tab closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === allowedTab) {
    studyMode = false; allowedTab = null;
    allowedUrl = null; allowedVideoId = null;
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "START_STUDY") {
    studyMode = true;
    allowedTab = msg.tabId;
    allowedUrl = msg.url;
    allowedVideoId = getVideoId(msg.url);
    sendResponse({ success: true });
  }
  if (msg.action === "STOP_STUDY") {
    studyMode = false; allowedTab = null;
    allowedUrl = null; allowedVideoId = null;
    sendResponse({ success: true });
  }
  if (msg.action === "GET_STATUS") {
    sendResponse({ studyMode, allowedTab });
  }
  return true;
});