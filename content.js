// Omni Meta Lord — ISOLATED world content script
// Bridges settings between the extension (popup/background) and the
// MAIN world injected script via window CustomEvents.

(function () {
  'use strict';

  // Forward settings from extension to page (MAIN world)
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type === 'omni-settings') {
      window.dispatchEvent(new CustomEvent('omni-meta-lord-settings', {
        detail: msg.settings
      }));
      sendResponse({ ok: true });
    }
    if (msg.type === 'omni-ping') {
      window.dispatchEvent(new CustomEvent('omni-meta-lord-ping'));
      sendResponse({ ok: true });
    }
    return true;
  });

  // Listen for status updates from the page (MAIN world)
  window.addEventListener('omni-meta-lord-status', function (e) {
    chrome.runtime.sendMessage({
      type: 'omni-status',
      status: e.detail
    }).catch(function () {});
  });
})();
