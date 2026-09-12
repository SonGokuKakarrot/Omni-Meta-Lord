// Omni Meta Lord — popup control script v2

(function () {
  'use strict';

  const themeAsset = 'assets/363bc7ce3c45ce75bd795bd0ab88d936.gif';
  try {
    fetch(chrome.runtime.getURL(themeAsset), { method: 'HEAD' })
      .then(function (res) {
        if (res.ok) {
          document.body.style.setProperty('--theme-gif', `url("${chrome.runtime.getURL(themeAsset)}")`);
        }
      })
      .catch(function () {});
  } catch (e) {}

  const DEFAULTS = {
    enabled: true,
    clearGain: 240,
    masterGain: 1800,
    rageBoost: 1200,
    bitrate: 2500,
    stereoWidth: 1.15,
    eq1: 4, eq2: 3, eq3: 5, eq4: 6, eq5: 4, eq6: 2,
    noiseGate: 0,
    deEss: 0,
    bassBoost: 0,
    autoLevel: 0,
    turboActive: false,
    ultraTurboActive: false
  };

  const PRESETS = {
    balanced: { clearGain: 150, masterGain: 800, rageBoost: 500, bitrate: 2500, stereoWidth: 1.0, noiseGate: 20, deEss: 15, bassBoost: 10, autoLevel: 20 },
    loud:     { clearGain: 300, masterGain: 3000, rageBoost: 2500, bitrate: 2500, stereoWidth: 1.2, noiseGate: 15, deEss: 20, bassBoost: 20, autoLevel: 30 },
    max:      { clearGain: 450, masterGain: 8000, rageBoost: 5000, bitrate: 2500, stereoWidth: 1.4, noiseGate: 10, deEss: 25, bassBoost: 30, autoLevel: 40 },
    ultra:    { clearGain: 500, masterGain: 50000, rageBoost: 50000, bitrate: 2500, stereoWidth: 1.6, noiseGate: 5, deEss: 30, bassBoost: 40, autoLevel: 50 }
  };

  let settings = Object.assign({}, DEFAULTS);

  const $ = function (id) { return document.getElementById(id); };

  const enabledToggle = $('enabledToggle');
  const gainSlider = $('gainSlider'), gainValue = $('gainValue');
  const masterSlider = $('masterSlider'), masterValue = $('masterValue');
  const rageSlider = $('rageSlider'), rageValue = $('rageValue');
  const bitrateSlider = $('bitrateSlider'), bitrateValue = $('bitrateValue');
  const stereoSlider = $('stereoSlider'), stereoValue = $('stereoValue');
  const gateSlider = $('gateSlider'), gateValue = $('gateValue');
  const deEssSlider = $('deEssSlider'), deEssValue = $('deEssValue');
  const bassSlider = $('bassSlider'), bassValue = $('bassValue');
  const autoLevelSlider = $('autoLevelSlider'), autoLevelValue = $('autoLevelValue');
  const turboBtn = $('turboBtn'), ultraBtn = $('ultraBtn');
  const statusDot = $('statusDot'), statusText = $('statusText');
  const presetBtns = document.querySelectorAll('.preset-btn');

  chrome.storage.sync.get(DEFAULTS, function (stored) {
    settings = Object.assign({}, DEFAULTS, stored);
    applyToUI();
    sendToTab();
    updateStatus();
  });

  function applyToUI() {
    enabledToggle.checked = settings.enabled;
    gainSlider.value = settings.clearGain;
    gainValue.textContent = settings.clearGain + 'x';
    masterSlider.value = settings.masterGain;
    masterValue.textContent = settings.masterGain + 'x';
    rageSlider.value = settings.rageBoost;
    rageValue.textContent = settings.rageBoost + '%';
    bitrateSlider.value = settings.bitrate;
    bitrateValue.textContent = settings.bitrate;
    stereoSlider.value = settings.stereoWidth;
    stereoValue.textContent = settings.stereoWidth.toFixed(2) + 'x';
    gateSlider.value = settings.noiseGate;
    gateValue.textContent = settings.noiseGate + '%';
    deEssSlider.value = settings.deEss;
    deEssValue.textContent = settings.deEss + '%';
    bassSlider.value = settings.bassBoost;
    bassValue.textContent = settings.bassBoost + '%';
    autoLevelSlider.value = settings.autoLevel;
    autoLevelValue.textContent = settings.autoLevel + '%';

    turboBtn.classList.toggle('active', settings.turboActive);
    ultraBtn.classList.toggle('active', settings.ultraTurboActive);
    updatePresetHighlight();
  }

  function updatePresetHighlight() {
    presetBtns.forEach(function (btn) {
      var p = PRESETS[btn.dataset.preset];
      if (p && p.clearGain === settings.clearGain && p.masterGain === settings.masterGain) {
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
        if (chrome.runtime.lastError) { updateStatus(false); }
      });
    });
  }

  function updateStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0] ? tabs[0].url : '';
      var supported = /instagram\.com|whatsapp\.com|imo\.im|messenger\.com|facebook\.com|discord\.com|telegram\.org|webogram\.org|telegram\.im|tlgrm\.ru|tel\.onl/.test(url);
      if (!supported) {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Open a supported web call site';
        return;
      }
      if (!settings.enabled) {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Boost disabled';
        return;
      }
      if (settings.ultraTurboActive) {
        statusDot.className = 'status-dot ultra';
        statusText.textContent = 'ULTRA TURBO — Gain: ' + settings.clearGain + 'x';
      } else if (settings.turboActive) {
        statusDot.className = 'status-dot turbo';
        statusText.textContent = 'TURBO — Gain: ' + settings.clearGain + 'x';
      } else {
        statusDot.className = 'status-dot active';
        statusText.textContent = 'Boosting — Gain: ' + settings.clearGain + 'x';
      }
    });
  }

  function save() {
    chrome.storage.sync.set(settings, function () {});
    sendToTab();
    updateStatus();
  }

  // Sliders
  enabledToggle.addEventListener('change', function () { settings.enabled = enabledToggle.checked; save(); });

  gainSlider.addEventListener('input', function () { settings.clearGain = parseInt(gainSlider.value, 10); gainValue.textContent = settings.clearGain + 'x'; updatePresetHighlight(); });
  gainSlider.addEventListener('change', save);
  masterSlider.addEventListener('input', function () { settings.masterGain = parseInt(masterSlider.value, 10); masterValue.textContent = settings.masterGain + 'x'; updatePresetHighlight(); });
  masterSlider.addEventListener('change', save);
  rageSlider.addEventListener('input', function () { settings.rageBoost = parseInt(rageSlider.value, 10); rageValue.textContent = settings.rageBoost + '%'; });
  rageSlider.addEventListener('change', save);
  bitrateSlider.addEventListener('input', function () { settings.bitrate = parseInt(bitrateSlider.value, 10); bitrateValue.textContent = settings.bitrate; });
  bitrateSlider.addEventListener('change', save);
  stereoSlider.addEventListener('input', function () { settings.stereoWidth = parseFloat(stereoSlider.value); stereoValue.textContent = settings.stereoWidth.toFixed(2) + 'x'; });
  stereoSlider.addEventListener('change', save);
  gateSlider.addEventListener('input', function () { settings.noiseGate = parseInt(gateSlider.value, 10); gateValue.textContent = settings.noiseGate + '%'; });
  gateSlider.addEventListener('change', save);
  deEssSlider.addEventListener('input', function () { settings.deEss = parseInt(deEssSlider.value, 10); deEssValue.textContent = settings.deEss + '%'; });
  deEssSlider.addEventListener('change', save);
  bassSlider.addEventListener('input', function () { settings.bassBoost = parseInt(bassSlider.value, 10); bassValue.textContent = settings.bassBoost + '%'; });
  bassSlider.addEventListener('change', save);
  autoLevelSlider.addEventListener('input', function () { settings.autoLevel = parseInt(autoLevelSlider.value, 10); autoLevelValue.textContent = settings.autoLevel + '%'; });
  autoLevelSlider.addEventListener('change', save);

  // Boost buttons
  turboBtn.addEventListener('click', function () {
    settings.turboActive = !settings.turboActive;
    if (settings.turboActive) settings.ultraTurboActive = false;
    turboBtn.classList.toggle('active', settings.turboActive);
    ultraBtn.classList.remove('active');
    save();
  });

  ultraBtn.addEventListener('click', function () {
    settings.ultraTurboActive = !settings.ultraTurboActive;
    if (settings.ultraTurboActive) settings.turboActive = false;
    ultraBtn.classList.toggle('active', settings.ultraTurboActive);
    turboBtn.classList.remove('active');
    save();
  });

  // Presets
  presetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var preset = PRESETS[btn.dataset.preset];
      if (!preset) return;
      Object.assign(settings, preset);
      applyToUI();
      save();
    });
  });
})();
