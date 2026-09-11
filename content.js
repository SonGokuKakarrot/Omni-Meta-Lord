// Omni Meta Lord — ISOLATED world content script
// Bridges settings between the extension (popup/background) and the
// MAIN world injected script via window postMessage.

(function () {
  'use strict';

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'omni-settings') {
      window.postMessage({
        source: "Omni-Universal-Lord",
        type: "OMNI_CONFIG",
        config: msg.settings
      }, "*");
      sendResponse({ ok: true });
    }
    if (msg.type === 'omni-ping') {
      window.postMessage({ source: "Omni-Universal-Lord", type: "OMNI_PING" }, "*");
      sendResponse({ ok: true });
    }
    return true;
  });
})();
