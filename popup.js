* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  width: 340px;
  background-color: #0A0E14;
  background-image: linear-gradient(rgba(10, 14, 20, 0.74), rgba(10, 14, 20, 0.94)), var(--theme-gif), linear-gradient(145deg, #162536, #080B10);
  background-size: cover;
  background-position: center top;
  background-attachment: fixed;
  color: #E8EEF2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 16px;
}

.theme-hero {
  height: 76px;
  margin: -16px -16px 14px;
  background-image: linear-gradient(180deg, rgba(10, 14, 20, 0.06), rgba(10, 14, 20, 0.96)), var(--theme-gif), linear-gradient(145deg, #193149, #0A0E14);
  background-size: cover;
  background-position: center 20%;
  border-bottom: 1px solid rgba(116, 214, 255, 0.3);
}

.header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.logo-ring {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, #0D47A1, #003c8f);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.15);
}
.header h1 { font-size: 17px; font-weight: 700; letter-spacing: 0.3px; color: #FFFFFF; }
.subtitle { font-size: 11px; color: #6B7A8A; margin-top: 2px; }

.status-bar {
  display: flex; align-items: center; gap: 8px;
  background: #111820; border: 1px solid #1A2330; border-radius: 10px;
  padding: 10px 12px; margin-bottom: 14px;
}
.status-dot {
  width: 10px; height: 10px; border-radius: 50%; background: #6B7A8A;
  transition: all 0.3s ease;
}
.status-dot.active { background: #00E676; box-shadow: 0 0 8px rgba(0, 230, 118, 0.6); }
.status-dot.ultra { background: #ff4fd8; box-shadow: 0 0 8px rgba(255, 79, 216, 0.6); }
.status-dot.turbo { background: #ffaa00; box-shadow: 0 0 8px rgba(255, 170, 0, 0.6); }
#statusText { font-size: 12px; color: #8B9BAE; }

.control-group {
  background: rgba(17, 24, 32, 0.88); border: 1px solid #1A2330; border-radius: 10px;
  padding: 12px; margin-bottom: 10px;
}

.toggle-row { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.label-text { font-size: 13px; font-weight: 500; color: #C8D3DE; }
.value-badge {
  font-size: 12px; font-weight: 700; color: #00E5FF;
  background: rgba(0, 229, 255, 0.08); padding: 2px 8px; border-radius: 6px;
}

.toggle {
  appearance: none; -webkit-appearance: none;
  width: 40px; height: 22px; background: #1A2330; border-radius: 11px;
  position: relative; cursor: pointer; transition: background 0.25s ease; flex-shrink: 0;
}
.toggle:checked { background: #003c8f; }
.toggle-slider { display: none; }
.toggle::after {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 18px; height: 18px; background: #5A6B7E; border-radius: 50%; transition: all 0.25s ease;
}
.toggle:checked::after { left: 20px; background: #00E5FF; box-shadow: 0 0 6px rgba(0, 229, 255, 0.5); }

.slider-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.slider {
  -webkit-appearance: none; appearance: none; width: 100%; height: 4px;
  background: #1A2330; border-radius: 2px; outline: none; margin: 4px 0;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 16px; height: 16px;
  border-radius: 50%; background: #00E5FF; cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 229, 255, 0.4); border: 2px solid #0A0E14;
}
.slider::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%; background: #00E5FF;
  cursor: pointer; border: 2px solid #0A0E14;
}
.slider-labels { display: flex; justify-content: space-between; font-size: 10px; color: #4A5A6E; margin-top: 2px; }

.enhanced-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px;
}
.sub-field { }
.sub-lbl {
  display: flex; justify-content: space-between; font-size: 10px; color: #ccc;
  margin-bottom: 3px; font-weight: 600;
}
.sub-lbl span { color: #00E5FF; }

.boost-row { display: flex; gap: 8px; margin-bottom: 10px; }
.boost-btn {
  flex: 1; padding: 10px 0; background: #111820; border: 1px solid #1A2330;
  border-radius: 10px; color: #8B9BAE; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.2s ease;
}
.boost-btn:hover { border-color: #003c8f; color: #00E5FF; }
.boost-btn.turbo.active {
  background: #ffaa00; border-color: #ffaa00; color: #000;
  box-shadow: 0 0 12px rgba(255, 170, 0, 0.5);
}
.boost-btn.ultra.active {
  background: #ff4fd8; border-color: #ff4fd8; color: #fff;
  box-shadow: 0 0 14px rgba(255, 79, 216, 0.5);
}

.preset-row { display: flex; gap: 6px; margin-bottom: 10px; }
.preset-btn {
  flex: 1; padding: 8px 0; background: #111820; border: 1px solid #1A2330;
  border-radius: 8px; color: #8B9BAE; font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.preset-btn:hover { background: #16202B; border-color: #003c8f; color: #00E5FF; }
.preset-btn.active { background: #003c8f; border-color: #00E5FF; color: #FFFFFF; }

.info-box {
  background: rgba(0, 60, 143, 0.18); border: 1px solid rgba(0, 60, 143, 0.3);
  border-radius: 10px; padding: 10px 12px;
}
.info-box p { font-size: 11px; line-height: 1.5; color: #7B8BA0; }
.info-box strong { color: #A0B4C8; }
