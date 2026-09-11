// Omni Meta Lord — popup control script

(function () {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    gain: 5.0,
    highpass: 80,
    compressor: true,
    limiter: true,
    autoBoost: true
  };

  const PRESETS = {
    balanced: { gain: 3.0, highpass: 80, compressor: true, limiter: true },
    loud:     { gain: 8.0, highpass: 60, compressor: true, limiter: true },
    max:      { gain: 15.0, highpass: 40, compressor: true, limiter: true }
  };

  let settings = Object.assign({}, DEFAULTS);

  const enabledToggle = document.getElementById('enabledToggle');
  const gainSlider = document.getElementById('gainSlider');
  const gainValue = document.getElementById('gainValue');
  const hpSlider = document.getElementById('hpSlider');
  const hpValue = document.getElementById('hpValue');
  const compressorToggle = document.getElementById('compressorToggle');
  const limiterToggle = document.getElementById('limiterToggle');
  const autoBoostToggle = document.getElementById('autoBoostToggle');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const presetBtns = document.querySelectorAll('.preset-btn');

  chrome.storage.sync.get(DEFAULTS, function (stored) {
    settings = Object.assign({}, DEFAULTS, stored);
    applyToUI();
    sendToTab();
    updateStatus();
  });

  function applyToUI() {
    enabledToggle.checked = settings.enabled;
    gainSlider.value = settings.gain;
    gainValue.textContent = settings.gain.toFixed(1) + 'x';
    hpSlider.value = settings.highpass;
    hpValue.textContent = settings.highpass + ' Hz';
    compressorToggle.checked = settings.compressor;
    limiterToggle.checked = settings.limiter;
    autoBoostToggle.checked = settings.autoBoost;
    updatePresetHighlight();
  }

  function updatePresetHighlight() {
    presetBtns.forEach(function (btn) {
      const preset = PRESETS[btn.dataset.preset];
      if (preset &&
          preset.gain === settings.gain &&
          preset.highpass === settings.highpass) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function sendToTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'omni-settings',
        settings: settings
      }, function () {
        if (chrome.runtime.lastError) {
          updateStatus(false);
        }
      });
    });
  }

  function updateStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0] ? tabs[0].url : '';
      const supported = /messenger\.com|facebook\.com|instagram\.com/.test(url);

      if (!supported) {
        statusDot.classList.remove('active');
        statusText.textContent = 'Open Messenger, Facebook, or Instagram';
        return;
      }

      if (settings.enabled) {
        statusDot.classList.add('active');
        statusText.textContent = 'Boosting mic — Gain: ' + settings.gain.toFixed(1) + 'x';
      } else {
        statusDot.classList.remove('active');
        statusText.textContent = 'Boost disabled';
      }
    });
  }

  function save() {
    chrome.storage.sync.set(settings, function () {});
    sendToTab();
    updateStatus();
  }

  enabledToggle.addEventListener('change', function () {
    settings.enabled = enabledToggle.checked;
    save();
  });

  gainSlider.addEventListener('input', function () {
    settings.gain = parseFloat(gainSlider.value);
    gainValue.textContent = settings.gain.toFixed(1) + 'x';
    updatePresetHighlight();
  });
  gainSlider.addEventListener('change', save);

  hpSlider.addEventListener('input', function () {
    settings.highpass = parseInt(hpSlider.value, 10);
    hpValue.textContent = settings.highpass + ' Hz';
    updatePresetHighlight();
  });
  hpSlider.addEventListener('change', save);

  compressorToggle.addEventListener('change', function () {
    settings.compressor = compressorToggle.checked;
    save();
  });

  limiterToggle.addEventListener('change', function () {
    settings.limiter = limiterToggle.checked;
    save();
  });

  autoBoostToggle.addEventListener('change', function () {
    settings.autoBoost = autoBoostToggle.checked;
    save();
  });

  presetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const preset = PRESETS[btn.dataset.preset];
      if (!preset) return;
      settings = Object.assign(settings, preset);
      applyToUI();
      save();
    });
  });
})();
