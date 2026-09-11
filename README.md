# Omni Meta Lord — Browser Extension

Maximum mic gain booster for **Messenger**, **Facebook**, and **Instagram** web calls. Amplifies your microphone in real time so your voice is the loudest and clearest it can be on every audio or video call.

## How it works

The extension intercepts your microphone stream before it reaches the call and routes it through a professional audio chain:

1. **High-pass filter** — removes low-frequency rumble and handling noise
2. **Gain boost** — amplifies your voice up to 20x
3. **Compressor** — evens out loud and quiet parts so everything is audible
4. **Limiter** — prevents distortion and clipping at high gain

The boosted audio is what the call receives instead of your raw microphone.

## Installation

1. Open Chrome or Edge
2. Go to `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `omni-meta-lord` folder
6. The extension icon appears in your toolbar

## Usage

1. Open **messenger.com**, **facebook.com**, or **instagram.com** in your browser
2. Click the Omni Meta Lord icon to open the control panel
3. Make sure **Master Boost** is ON
4. Adjust the **Gain Boost** slider (default: 5x, max: 20x)
5. Join any audio or video call — your mic is automatically boosted

### Presets

- **Balanced** — 3x gain, 80Hz filter (natural but louder)
- **Loud** — 8x gain, 60Hz filter (very loud, clear)
- **Max** — 15x gain, 40Hz filter (maximum loudness)

### Settings

| Setting | Description |
|---------|-------------|
| Master Boost | Toggle the entire boost on/off |
| Gain Boost | How much to amplify your mic (1x–20x) |
| High-Pass Filter | Cuts low rumble (20–300 Hz) |
| Compressor | Evens out volume dynamics |
| Limiter | Prevents distortion at high gain |
| Auto-Boost | Automatically boost on every call |

## Important notes

- This only works for calls made through a **web browser** (Chrome/Edge desktop). It does not affect calls made from the native Messenger or Instagram mobile apps.
- Your settings are saved automatically and persist across sessions.
- If your voice distorts at very high gain, lower the Gain Boost or enable the Limiter.

## File structure

```
omni-meta-lord/
├── manifest.json      — Extension config (Manifest V3)
├── inject.js          — MAIN world: getUserMedia override + audio chain
├── content.js         — ISOLATED world: settings relay bridge
├── popup.html         — Control panel UI
├── popup.css          — Control panel styles
├── popup.js           — Control panel logic
├── background.js      — Service worker + badge
├── icons/             — Extension icons (16, 48, 128px)
└── README.md          — This file
```
