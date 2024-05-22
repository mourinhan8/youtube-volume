"use strict";
let slider = document.getElementById("volSlider");
let volume = document.getElementById("volumeValue");
volume.innerHTML = "100";
slider.addEventListener("input", function () {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && (tabs[0].url.startsWith("chrome://") || tabs[0].url.startsWith("https://chromewebstore.google.com/"))) {
            return;
        }
        volume.innerHTML = this.value;
        const myTabId = tabs[0].id;
        if (myTabId !== undefined) {
            chrome.tabs.sendMessage(myTabId, { action: "adjustVolume", volume: this.value });
        }
    });
});
//# sourceMappingURL=background.js.map