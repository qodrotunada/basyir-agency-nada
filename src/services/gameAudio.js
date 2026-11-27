const SETTINGS_KEY = 'basyir-agency:game-audio-settings';
const DEFAULT_SETTINGS = Object.freeze({
  musicEnabled: true,
  effectsEnabled: true,
  musicVolume: 0.24,
  effectsVolume: 0.72
});

let settings = readSettings();
let musicElement = null;
let activeGameAudio = false;
let speechIsActive = false;
let resumeMusicAfterSpeech = false;
let visibilityHandlerAttached = false;
const activeEffects = new Set();

function clampVolume(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : fallback;
}

function readSettings() {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const stored = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || 'null');
    return {
      musicEnabled: stored?.musicEnabled !== false,
      effectsEnabled: stored?.effectsEnabled !== false,
      musicVolume: clampVolume(stored?.musicVolume, DEFAULT_SETTINGS.musicVolume),
      effectsVolume: clampVolume(stored?.effectsVolume, DEFAULT_SETTINGS.effectsVolume)
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function emitSettings() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('basyir-game-audio-settings', { detail: { ...settings } }));
  } catch { /* Audio preferences are optional and must never interrupt learning. */ }
}

function getMusicElement() {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;
  if (!musicElement) {
    musicElement = new Audio('/audio/adventure-loop.mp3');
    musicElement.loop = true;
    musicElement.preload = 'auto';
    musicElement.setAttribute?.('playsinline', '');
  }
  musicElement.volume = settings.musicVolume;
  return musicElement;
}

async function playMusicIfAllowed() {
  if (!activeGameAudio || speechIsActive || !settings.musicEnabled) return false;
  let audio;
  try { audio = getMusicElement(); } catch { return false; }
  if (!audio) return false;
  audio.volume = settings.musicVolume;
  try {
    await audio.play();
    return true;
  } catch {
    // Browser autoplay rules may block playback until the next user gesture.
    return false;
  }
}

export function initGameAudio() {
  if (typeof window === 'undefined') return () => {};

  const handleSpeechPlayback = (event) => {
    const state = event.detail?.state;
    if (state === 'start') {
      speechIsActive = true;
      resumeMusicAfterSpeech = activeGameAudio;
      musicElement?.pause();
      return;
    }

    if (state === 'end' || state === 'error' || state === 'stopped') {
      speechIsActive = false;
      const shouldResume = resumeMusicAfterSpeech && activeGameAudio;
      resumeMusicAfterSpeech = false;
      if (shouldResume) void playMusicIfAllowed();
    }
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'hidden') {
      musicElement?.pause();
    } else if (activeGameAudio && !speechIsActive) {
      void playMusicIfAllowed();
    }
  };

  window.addEventListener('basyir-tts-playback', handleSpeechPlayback);
  if (!visibilityHandlerAttached) {
    document.addEventListener('visibilitychange', handleVisibility);
    visibilityHandlerAttached = true;
  }

  return () => {
    window.removeEventListener('basyir-tts-playback', handleSpeechPlayback);
  };
}

/** Start the instrumental while the learner is in a game or dictionary activity. */
export function startGameMusic() {
  activeGameAudio = true;
  if (speechIsActive) {
    resumeMusicAfterSpeech = true;
    return;
  }
  void playMusicIfAllowed();
}

/** Stop the instrumental when leaving game and dictionary activities. */
export function stopGameMusic() {
  activeGameAudio = false;
  resumeMusicAfterSpeech = false;
  musicElement?.pause();
  if (musicElement) {
    try { musicElement.currentTime = 0; } catch { /* Metadata may not have loaded yet. */ }
  }
}

export function playGameSound(name) {
  if (!settings.effectsEnabled || speechIsActive || typeof Audio === 'undefined') return false;
  const files = {
    correct: '/audio/correct.mp3',
    wrong: '/audio/wrong.mp3',
    victory: '/audio/victory.mp3'
  };
  const source = files[name];
  if (!source) return false;

  try {
    const audio = new Audio(source);
    audio.preload = 'auto';
    audio.volume = settings.effectsVolume;
    activeEffects.add(audio);
    const cleanup = () => activeEffects.delete(audio);
    audio.addEventListener('ended', cleanup, { once: true });
    audio.addEventListener('error', cleanup, { once: true });
    const result = audio.play();
    if (result?.catch) result.catch(cleanup);
    return true;
  } catch {
    return false;
  }
}

export function getGameAudioSettings() {
  return { ...settings };
}

export function updateGameAudioSettings(changes = {}) {
  settings = {
    musicEnabled: typeof changes.musicEnabled === 'boolean' ? changes.musicEnabled : settings.musicEnabled,
    effectsEnabled: typeof changes.effectsEnabled === 'boolean' ? changes.effectsEnabled : settings.effectsEnabled,
    musicVolume: changes.musicVolume === undefined ? settings.musicVolume : clampVolume(changes.musicVolume, settings.musicVolume),
    effectsVolume: changes.effectsVolume === undefined ? settings.effectsVolume : clampVolume(changes.effectsVolume, settings.effectsVolume)
  };

  if (musicElement) musicElement.volume = settings.musicVolume;
  if (!settings.musicEnabled) musicElement?.pause();
  else if (activeGameAudio && !speechIsActive) void playMusicIfAllowed();

  emitSettings();
  return getGameAudioSettings();
}
