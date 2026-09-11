// Omni Meta Lord — MAIN world injected script
// Overrides navigator.mediaDevices.getUserMedia to intercept the microphone
// track and route it through a professional audio amplification chain:
//   high-pass filter → gain boost → compressor → limiter
// This makes your voice as loud and clear as possible on every call.

(function () {
  'use strict';

  const TAG = '[Omni Meta Lord]';
  let settings = {
    enabled: true,
    gain: 5.0,
    highpass: 80,
    compressor: true,
    limiter: true,
    noiseSuppression: false,
    autoBoost: true
  };
  let audioContext = null;
  let activeSourceMap = new WeakMap();

  // ---- Settings relay (from content script / popup) ----
  window.addEventListener('omni-meta-lord-settings', function (e) {
    if (e.detail) {
      settings = Object.assign(settings, e.detail);
      console.log(TAG, 'Settings updated:', settings);
      window.dispatchEvent(new CustomEvent('omni-meta-lord-status', {
        detail: { active: settings.enabled, gain: settings.gain }
      }));
    }
  });

  // ---- Audio processing chain ----
  function buildChain(inputStream) {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(function () {});
    }

    const source = audioContext.createMediaStreamSource(inputStream);
    activeSourceMap.set(inputStream, source);

    // High-pass filter — removes low rumble / handling noise
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = settings.highpass;
    highpass.Q.value = 0.7;

    // Gain node — the core boost
    const gainNode = audioContext.createGain();
    gainNode.gain.value = settings.gain;

    let lastNode = gainNode;

    // Compressor — evens out dynamics so quiet parts are still loud
    if (settings.compressor) {
      const comp = audioContext.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.knee.value = 30;
      comp.ratio.value = 12;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      gainNode.connect(comp);
      lastNode = comp;
    }

    // Limiter — prevents clipping / distortion at high gain
    if (settings.limiter) {
      const limiter = audioContext.createDynamicsCompressor();
      limiter.threshold.value = -3;
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.001;
      limiter.release.value = 0.1;
      lastNode.connect(limiter);
      lastNode = limiter;
    }

    // Connect chain
    source.connect(highpass);
    highpass.connect(gainNode);

    // Destination stream
    const dest = audioContext.createMediaStreamDestination();
    lastNode.connect(dest);

    return dest.stream;
  }

  function processStream(originalStream) {
    if (!settings.enabled) return originalStream;

    const tracks = originalStream.getAudioTracks();
    if (tracks.length === 0) return originalStream;

    try {
      const boosted = buildChain(originalStream);
      // Preserve video tracks untouched
      const videoTracks = originalStream.getVideoTracks();
      videoTracks.forEach(function (t) { boosted.addTrack(t); });
      console.log(TAG, 'Mic boosted. Gain:', settings.gain, 'x');
      return boosted;
    } catch (err) {
      console.error(TAG, 'Boost failed, using original stream:', err);
      return originalStream;
    }
  }

  // ---- Override getUserMedia ----
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  navigator.mediaDevices.getUserMedia = async function (constraints) {
    const stream = await originalGetUserMedia(constraints);

    // Only process if this request includes audio
    const hasAudio = (constraints && constraints.audio) ||
      stream.getAudioTracks().length > 0;
    if (!hasAudio) return stream;

    return processStream(stream);
  };

  // ---- Also override the older callback-style API just in case ----
  if (navigator.getUserMedia) {
    const origLegacy = navigator.getUserMedia.bind(navigator);
    navigator.getUserMedia = function (constraints, onSuccess, onError) {
      origLegacy(constraints, function (stream) {
        const processed = (constraints && constraints.audio) ? processStream(stream) : stream;
        onSuccess(processed);
      }, onError);
    };
  }

  // ---- Status ping responder ----
  window.addEventListener('omni-meta-lord-ping', function () {
    window.dispatchEvent(new CustomEvent('omni-meta-lord-status', {
      detail: { active: settings.enabled, gain: settings.gain }
    }));
  });

  console.log(TAG, 'Loaded. Mic boost active on Messenger / Facebook / Instagram web calls.');
})();
