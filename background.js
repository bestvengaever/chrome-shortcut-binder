let activeBinds = [];

function executeCommand(command) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0]) {
      return;
    }
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        world: "MAIN",
        func: (commandStr) => {
          try {
            const result = new Function(commandStr)();
            return { success: true, result };
          } catch (error) {
            return { success: false, error: error.message };
          }
        },
        args: [command],
      },
      (results) => {
        if (chrome.runtime.lastError) {
          // Script execution failed
        } else if (results && results[0].result) {
          const { success, error } = results[0].result;
          if (!success) {
            // Command failed
          }
        }
      }
    );
  });
}

function notifyAllContentScripts() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs
        .sendMessage(tab.id, { type: "updateBinds" })
        .catch((error) => {
          // Ignore errors for tabs that don't have content scripts
        });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command) {
    executeCommand(message.command);
    sendResponse(true);
  } else if (message.type === "updateBinds") {
    activeBinds = message.binds;
    notifyAllContentScripts();
    sendResponse({ success: true });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "bind-command") {
    chrome.storage.local.get(["binds"], function (result) {
      if (result.binds && result.binds.length > 0) {
        executeCommand(result.binds[0].command);
      }
    });
  } else {
    const bind = activeBinds.find((b) => b.keys === command);
    if (bind) {
      try {
        eval(bind.command);
      } catch (error) {
        // Command execution failed
      }
    }
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.binds) {
    activeBinds = changes.binds.newValue || [];
    notifyAllContentScripts();
  }
});

chrome.storage.local.get(["binds"], function (result) {
  activeBinds = result.binds || [];
});
