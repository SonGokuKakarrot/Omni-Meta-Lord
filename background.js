// Omni Meta Lord — service worker (Manifest V3 background)

function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: enabled ? '#00E676' : '#3A3A3A' });
}

chrome.storage.sync.get({ enabled: true }, function (stored) {
  updateBadge(stored.enabled);
});

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === 'sync' && changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === 'omni-status') {
    sendResponse({ ok: true });
  }
  return true;
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    console.log('Omni Meta Lord v2 installed. Extreme mic boost active on Messenger, Facebook, Instagram web calls.');
  }
});
