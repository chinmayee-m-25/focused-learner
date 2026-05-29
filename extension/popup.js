// Check status when popup opens
chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
  if (response && response.studyMode) {
    document.getElementById("statusBox").innerText = "Status: ON 🟢";
    document.getElementById("statusBox").style.color = "#4CAF50";
  } else {
    document.getElementById("statusBox").innerText = "Status: OFF 🔴";
    document.getElementById("statusBox").style.color = "#f44336";
  }
});

// Start Study Mode
document.getElementById("start").onclick = function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (!tabs[0]) return;
    chrome.runtime.sendMessage({
      action: "START_STUDY",
      tabId: tabs[0].id,
      url: tabs[0].url
    }, function(response) {
      if (response && response.success) {
        document.getElementById("statusBox").innerText = "Status: ON 🟢";
        document.getElementById("statusBox").style.color = "#4CAF50";
      }
    });
  });
};

// Stop Study Mode
document.getElementById("stop").onclick = function() {
  chrome.runtime.sendMessage({ action: "STOP_STUDY" }, function(response) {
    if (response && response.success) {
      document.getElementById("statusBox").innerText = "Status: OFF 🔴";
      document.getElementById("statusBox").style.color = "#f44336";
    }
  });
};