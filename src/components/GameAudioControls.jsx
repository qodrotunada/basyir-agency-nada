import React, { useEffect, useState } from 'react';
import { getGameAudioSettings, updateGameAudioSettings } from '../services/gameAudio.js';
import './game-audio-controls.css';

export default function GameAudioControls() {
  const [settings, setSettings] = useState(() => getGameAudioSettings());

  useEffect(() => {
    const sync = (event) => setSettings(event.detail ?? getGameAudioSettings());
    window.addEventListener('basyir-game-audio-settings', sync);
    return () => window.removeEventListener('basyir-game-audio-settings', sync);
  }, []);

  const update = (changes) => setSettings(updateGameAudioSettings(changes));

  return (
    <details className="game-audio-controls">
      <summary aria-label="Pengaturan audio permainan" title="Pengaturan audio permainan">
        <span className="game-audio-summary-icon" aria-hidden="true">♫</span>
        <span>Audio</span>
        <span className="game-audio-summary-state" aria-hidden="true">{settings.musicEnabled || settings.effectsEnabled ? 'ON' : 'OFF'}</span>
      </summary>
      <div className="game-audio-panel">
        <div className="game-audio-panel-heading">
          <strong>Pengaturan suara</strong>
          <small>Musik dan efek permainan</small>
        </div>
        <label className="game-audio-toggle">
          <span><strong>Musik adventure</strong><small>Musik latar saat bermain</small></span>
          <input type="checkbox" checked={settings.musicEnabled} onChange={(event) => update({ musicEnabled: event.target.checked })} />
        </label>
        <label className="game-audio-range">
          <span><strong>Volume musik</strong><output>{Math.round(settings.musicVolume * 100)}%</output></span>
          <input type="range" min="0" max="1" step="0.05" value={settings.musicVolume} onChange={(event) => update({ musicVolume: Number(event.target.value) })} disabled={!settings.musicEnabled} />
        </label>
        <label className="game-audio-toggle">
          <span><strong>Efek suara playful</strong><small>Jawaban benar, salah, dan kemenangan</small></span>
          <input type="checkbox" checked={settings.effectsEnabled} onChange={(event) => update({ effectsEnabled: event.target.checked })} />
        </label>
        <label className="game-audio-range">
          <span><strong>Volume efek</strong><output>{Math.round(settings.effectsVolume * 100)}%</output></span>
          <input type="range" min="0" max="1" step="0.05" value={settings.effectsVolume} onChange={(event) => update({ effectsVolume: Number(event.target.value) })} disabled={!settings.effectsEnabled} />
        </label>
        <p className="game-audio-note">Musik otomatis dijeda saat pelafalan Bahasa Arab diputar, lalu dilanjutkan setelah TTS selesai.</p>
      </div>
    </details>
  );
}
