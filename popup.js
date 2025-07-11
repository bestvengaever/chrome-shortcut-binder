let binds = [];

chrome.storage.local.get(["binds"], function (result) {
  if (result.binds && result.binds.length > 0) {
    binds = result.binds;
  } else {
    binds = [
      {
        keys: "Ctrl+Shift+E",
        command: "SugarCube.State.variables.player.energy = 100",
      },
    ];
    saveBind();
  }
  renderBinds();
});

function validateKeys(keys) {
  if (!keys) return false;
  const validModifiers = ["ctrl", "shift", "alt"];
  const parts = keys
    .toLowerCase()
    .split("+")
    .map((p) => p.trim());
  const hasModifier = parts.some((p) => validModifiers.includes(p));
  const hasKey = parts.some((p) => !validModifiers.includes(p));
  return hasModifier && hasKey;
}

function validateCommand(command) {
  return true;
}

function createBindElement(bind, index) {
  const bindDiv = document.createElement("div");
  bindDiv.className = "bind-container";

  const keysInput = document.createElement("input");
  keysInput.type = "text";
  keysInput.placeholder = "Shortcut (e.g., Ctrl+Shift+E)";
  keysInput.value = bind.keys;

  keysInput.addEventListener("keydown", (event) => {
    event.preventDefault();
    const modifiers = [];
    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.shiftKey) modifiers.push("Shift");
    if (event.altKey) modifiers.push("Alt");
    if (event.metaKey) modifiers.push("Meta");

    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
    if (!["Control", "Shift", "Alt", "Meta"].includes(key)) {
      modifiers.push(key);
    }

    const shortcut = modifiers.join("+");
    keysInput.value = shortcut;

    if (validateKeys(shortcut)) {
      binds[index].keys = shortcut;
      saveBind();
      keysInput.style.borderColor = "";
    } else {
      keysInput.style.borderColor = "red";
    }
  });

  const commandInput = document.createElement("input");
  commandInput.type = "text";
  commandInput.placeholder = "e.g., SugarCube.State.variables.energy = 100";
  commandInput.value = bind.command;
  commandInput.style.width = "100%";
  commandInput.addEventListener("input", () => {
    const value = commandInput.value.trim();
    if (validateCommand(value)) {
      binds[index].command = value;
      saveBind();
      commandInput.style.borderColor = "";
    } else {
      commandInput.style.borderColor = "red";
    }
  });

  const testButton = document.createElement("button");
  testButton.textContent = "Test";
  testButton.addEventListener("click", () => {
    if (validateCommand(bind.command)) {
      chrome.runtime.sendMessage({ command: bind.command }, (response) => {
        alert(response ? "Success!" : "Failed. Check console for errors.");
      });
    } else {
      alert("Invalid command format.");
    }
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-bind";
  removeButton.addEventListener("click", () => {
    binds.splice(index, 1);
    saveBind();
    renderBinds();
  });

  bindDiv.appendChild(keysInput);
  bindDiv.appendChild(commandInput);
  bindDiv.appendChild(testButton);
  bindDiv.appendChild(removeButton);

  return bindDiv;
}

function renderBinds() {
  const container = document.getElementById("binds-container");
  container.innerHTML = "";
  binds.forEach((bind, index) => {
    container.appendChild(createBindElement(bind, index));
  });
}

function saveBind() {
  chrome.storage.local.set({ binds: binds }, function () {
    chrome.runtime.sendMessage(
      { type: "updateBinds", binds: binds },
      (response) => {
        if (chrome.runtime.lastError) {
          // Error sending message to background script
        }
      }
    );
  });
}

document.getElementById("add-bind").addEventListener("click", () => {
  binds.push({
    keys: "",
    command: "",
  });
  renderBinds();
  saveBind();
});
