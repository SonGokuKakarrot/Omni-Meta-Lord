// Omni Meta Lord — ISOLATED world content script
// Bridges settings between the extension (popup/background) and the
// MAIN world injected script via window postMessage.

(function () {
  'use strict';

  const themeAsset = 'assets/363bc7ce3c45ce75bd795bd0ab88d936.gif';

  function postToPage(type, payload) {
    window.postMessage({
      source: "Omni-Universal-Lord",
      type,
      ...payload
    }, "*");
  }

  function sendTheme() {
    try {
      var url = chrome.runtime.getURL(themeAsset);
      fetch(url, { method: 'HEAD' })
        .then(function (res) {
          if (res.ok) postToPage("OMNI_THEME", { themeUrl: url });
        })
        .catch(function () {});
    } catch (e) {}
  }

  sendTheme();
  window.addEventListener("message", function (event) {
    if (event.source === window && event.data?.source === "Omni-Universal-Lord" && event.data.type === "OMNI_INJECTOR_READY") {
      sendTheme();
    }
  });

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'omni-settings') {
      postToPage("OMNI_CONFIG", { config: msg.settings });
      sendResponse({ ok: true });
    }
    if (msg.type === 'omni-ping') {
      postToPage("OMNI_PING", {});
      sendResponse({ ok: true });
    }
    return true;
  });
})();
