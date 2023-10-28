// Sample initial domain registry (you can edit or add to this as needed)
const domainRegistry = {
  "https://moodle.tu-darmstadt.de/course/view.php?id=35283":
    "Documents/Uni/WiSe 23/Software and Internet Economics/",
};

function logDebugMessage(message) {
  const timestamp = new Date().toLocaleString();
  chrome.storage.local.get("debugLog", (data) => {
    let debugLog = data.debugLog || [];
    debugLog.push({ timestamp, message });
    chrome.storage.local.set({ debugLog });
  });
}

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  try {
    chrome.storage.local.get(["domainRegistry", "debugMode"], (data) => {
      const registry = data.domainRegistry;
      console.log(registry);
      const debugMode = data.debugMode;
      const domainUrl = new URL(downloadItem.referrer);
      console.log(downloadItem);
      console.log(domainUrl);
      const domain = new URL(downloadItem.referrer).href;
      console.log(domain);

      console.log(`Download recognized from ${domain}`);
      console.log(`Checking if website ${domain} is in registry...`);

      var newFilename = "";
      if (registry[domain]) {
        console.log(
          `Website ${domain} found in registry. Redirecting download to ${registry[domain]}`
        );
        newFilename = registry[domain] + downloadItem.filename;
      } else {
        console.log(
          `Website ${domain} not found in registry. Using default download path.`
        );
        newFilename = "Downloads/" + downloadItem.filename;
      }
      console.log(newFilename);
      console.log(typeof newFilename);
      console.log(downloadItem.finalUrl);

      suggest(
        { filename: newFilename, conflictAction: "uniquify" },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error("error: ", chrome.runtime.lastError);
            console.warn(
              `An error occurred: ${chrome.runtime.lastError.message} and ${downloadId}`
            );
            return false;
          } else {
            console.log(`Download started with ID: ${downloadId}`);
            return true;
          }
        }
      );
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});
