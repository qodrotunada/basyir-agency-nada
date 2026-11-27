import React, { useEffect, useState } from 'react';
import { playArabic } from '../services/audioService.js';

const ARABIC_RANGES = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const ARABIC_SPEECH_CHARACTERS = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s،؛؟,.!?():ـ]+/g;

export function extractArabicSpeechText(value = '') {
  const source = String(value ?? '');
  if (!ARABIC_RANGES.test(source)) return '';
  return (source.match(ARABIC_SPEECH_CHARACTERS) ?? [])
    .join(' ')
    .replace(/[\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([،؛؟,.!?])/g, '$1')
    .trim();
}

function normalizeSpeechText(value = '') {
  return String(value ?? '').replace(/[\u0640]/g, '').replace(/\s+/g, ' ').trim();
}

export function ArabicAudioButton({ text, label = 'Dengarkan pelafalan Arab Fusha (TTS)', className = '', compact = false }) {
  const spokenText = extractArabicSpeechText(text);
  const [playState, setPlayState] = useState('idle');
  const normalizedText = normalizeSpeechText(spokenText);

  useEffect(() => {
    if (!spokenText || typeof window === 'undefined') return undefined;
    const handleAudioStatus = (event) => {
      const detail = event.detail ?? {};
      const eventText = normalizeSpeechText(detail.text);
      if (eventText && eventText !== normalizedText) return;
      if (detail.reason === 'AUDIO_PLAYBACK_STOPPED') {
        setPlayState((current) => current === 'loading' ? current : 'ready');
        return;
      }
      if (detail.reason === 'AUDIO_PLAYING' || detail.kind === 'playing') setPlayState('playing');
      else if (detail.reason === 'AUDIO_PLAYBACK_ENDED' || detail.kind === 'ended') setPlayState('ready');
      else if (detail.kind === 'error') setPlayState('error');
    };
    window.addEventListener('basyir-audio-status', handleAudioStatus);
    return () => window.removeEventListener('basyir-audio-status', handleAudioStatus);
  }, [spokenText, normalizedText]);

  if (!spokenText) return null;

  const handlePlay = async (event) => {
    event?.stopPropagation?.();
    event?.preventDefault?.();
    if (playState === 'loading') return;

    setPlayState('loading');
    try {
      const result = await playArabic({ text: spokenText });
      setPlayState(result?.ok ? 'playing' : 'error');
    } catch {
      setPlayState('error');
    }
  };

  const stateLabel = playState === 'loading'
    ? 'Memuat audio Arab'
    : playState === 'playing'
      ? 'Audio sedang diputar. Klik untuk memutar ulang.'
      : playState === 'error'
        ? 'Audio gagal. Klik untuk mencoba kembali.'
        : playState === 'ready'
          ? 'Audio selesai diputar. Klik untuk memutar ulang.'
          : label;
  const icon = playState === 'loading' ? '…' : playState === 'playing' ? '▶' : playState === 'error' ? '!' : '🔊';
  const stateClass = playState === 'loading' ? 'audio-loading' : playState === 'error' ? 'audio-error' : playState === 'playing' ? 'audio-playing' : playState === 'ready' ? 'audio-ready' : '';

  const controlProps = {
    className: `arabic-audio-button ${compact ? 'arabic-audio-compact' : ''} ${stateClass} ${className}`.trim(),
    onClick: handlePlay,
    onKeyDown: (event) => {
      if (compact && (event.key === 'Enter' || event.key === ' ')) handlePlay(event);
    },
    'aria-label': stateLabel,
    'aria-busy': playState === 'loading',
    title: stateLabel
  };

  if (compact) {
    return <span {...controlProps} role="button" tabIndex={playState === 'loading' ? -1 : 0}><span aria-hidden="true">{icon}</span></span>;
  }

  const statusText = playState === 'loading'
    ? 'Memuat audio…'
    : playState === 'playing'
      ? 'Sedang diputar'
      : playState === 'error'
        ? 'Gagal · coba lagi'
        : playState === 'ready'
          ? 'Selesai · putar ulang'
          : 'Dengarkan';

  return <button type="button" {...controlProps} disabled={playState === 'loading'}>
    <span aria-hidden="true">{icon}</span>
    <small aria-live="polite">{statusText}</small>
  </button>;
}

/** Arabic text with an adjacent playback control. Use inside non-interactive content. */
export default function ArabicText({ text, className = '', textClassName = '', label, compact = true }) {
  const spokenText = extractArabicSpeechText(text);
  if (!spokenText) return <span className={className}>{text}</span>;

  return (
    <span className={`arabic-audio-inline ${className}`.trim()}>
      <span className={`arabic-audio-value ${textClassName}`.trim()} lang="ar" dir="rtl">{text}</span>
      <ArabicAudioButton text={text} label={label} compact={compact} />
    </span>
  );
}
