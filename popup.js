document.getElementById("addDomain").addEventListener("click", function () {
  /**
   * Gets the value of the domain input field.
   * @returns {string} The value of the domain input field.
   */
  const domain = document.getElementById("domainInput").value;
  const path = document.getElementById("pathInput").value;

  chrome.storage.local.get("domainRegistry", (data) => {
    const registry = data.domainRegistry;
    registry[domain] = path;
    chrome.storage.local.set({ domainRegistry: registry });
  });
});

document.getElementById("debugMode").addEventListener("change", function () {
  /**
   * Gets the value of the debug mode checkbox element.
   * @returns {boolean} The value of the debug mode checkbox element.
   */
  const isDebugMode = document.getElementById("debugMode").checked;
  chrome.storage.local.set({ debugMode: isDebugMode });
});

// Get the current state of debugMode from Chrome storage
chrome.storage.local.get("debugMode", (data) => {
  /**
   * Gets the debug checkbox element from the DOM.
   * @type {HTMLInputElement}
   */
  const debugCheckbox = document.getElementById("debugMode");
  debugCheckbox.checked = data.debugMode || false;
});

// Load the registry into the UI on popup open
chrome.storage.local.get("domainRegistry", (data) => {
  const registry = data.domainRegistry || {};
  const registryList = document.getElementById("registryList");
  const registryTable = document.getElementById("registryTable");
  registryList.innerHTML = ""; // Clear existing entries

  for (const domain in registry) {
    const tableRow = document.createElement("tr");
    const domainCell1 = document.createElement("td");
    const domainCell2 = document.createElement("td");
    const form1 = document.createElement("form");
    const form2 = document.createElement("form");
    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    const deleteButton = document.createElement("button");
    const submitButton = document.createElement("button");
    const cancelButton = document.createElement("button");

    input1.type = "text";
    input1.value = domain;
    input2.type = "text";
    input2.value = registry[domain];
    deleteButton.textContent = "Delete";
    submitButton.textContent = "Submit";
    submitButton.style.display = "none";
    cancelButton.textContent = "Cancel";
    cancelButton.style.display = "none";


    form1.appendChild(input1);
    form2.appendChild(input2);
    domainCell1.appendChild(form1);
    domainCell2.appendChild(form2);

    input1.addEventListener("input", function () {
      submitButton.style.display = "inline-block";
      cancelButton.style.display = "inline-block";
    });

    input2.addEventListener("input", function () {
      submitButton.style.display = "inline-block";
      cancelButton.style.display = "inline-block";
    });

    deleteButton.addEventListener("click", function () {
      delete registry[domain];
      chrome.storage.local.set({ domainRegistry: registry }, function () {
        // Update UI
        tableRow.remove();
      });
    });

    cancelButton.addEventListener("click", function () {
      input1.value = domain;
      input2.value = registry[domain];
      input1.disabled = true;
      input2.disabled = true;
      submitButton.style.display = "inline-block";
      cancelButton.style.display = "none";
    });

    submitButton.addEventListener("click", function () {
      for (const tableRow of registryTable.rows) {
        const domain = tableRow.cells[0].querySelector("input").value;
        const newPath = tableRow.cells[1].querySelector("input").value;
        if (domain && newPath) {
          registry[domain] = newPath;
        }
      }
      chrome.storage.local.set({ domainRegistry: registry }, function () {
        // Update UI
        submitButton.style.display = "inline-block";
        cancelButton.style.display = "none";
      });
    });

    const actionCell = document.createElement("td");
    actionCell.style.width = "fit-content";
    actionCell.appendChild(deleteButton);
    actionCell.appendChild(submitButton);
    actionCell.appendChild(cancelButton);
    tableRow.appendChild(domainCell1);
    tableRow.appendChild(domainCell2);
    tableRow.appendChild(actionCell);
    registryTable.appendChild(tableRow);
  }
});

// Event listener for the "View Registry" button
document.getElementById("viewRegistry").addEventListener("click", function () {
  chrome.tabs.create({ url: "popup.html" }); // Open the popup.html in a new tab
});
