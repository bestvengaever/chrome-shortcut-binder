let activeBinds = [];
let lastBindsHash = "";

function getBindsHash(binds) {
  return JSON.stringify(binds);
}

function updateBinds() {
  chrome.storage.local.get(["binds"], function (result) {
    const newBinds = result.binds || [];
    const newHash = getBindsHash(newBinds);

    if (newHash !== lastBindsHash) {
      activeBinds = newBinds;
      lastBindsHash = newHash;
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.contentEditable === "true"
  ) {
    return;
  }

  chrome.storage.local.get(["binds"], function (result) {
    const currentBinds = result.binds || [];

    currentBinds.forEach((bind) => {
      if (!bind.keys || !bind.command) return;

      const keys = bind.keys.toLowerCase().split("+");
      const pressedKeys = [];
      if (e.ctrlKey || e.metaKey) pressedKeys.push("ctrl");
      if (e.shiftKey) pressedKeys.push("shift");
      if (e.altKey) pressedKeys.push("alt");
      pressedKeys.push(e.key.toLowerCase());

      if (keys.every((k) => pressedKeys.includes(k))) {
        e.preventDefault();
        chrome.runtime.sendMessage({ command: bind.command });
      }
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateBinds") {
    updateBinds();
    sendResponse({ success: true });
  }
});

updateBinds();

setInterval(() => {
  updateBinds();
}, 2000);

try {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.binds) {
      updateBinds();
    }
  });
} catch (error) {
  // Storage change listener not available
}
