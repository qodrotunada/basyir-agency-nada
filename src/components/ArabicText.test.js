import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ArabicAudioButton, extractArabicSpeechText } from './ArabicText.jsx';
import { playArabic } from '../services/audioService.js';

vi.mock('../services/audioService.js', () => ({ playArabic: vi.fn() }));
afterEach(cleanup);

describe('Arabic speech text extraction', () => {
  it('keeps Arabic harakat for neural pronunciation', () => {
    expect(extractArabicSpeechText('لِلْكِيلُو')).toBe('لِلْكِيلُو');
  });

  it('removes transliteration and Indonesian meaning from the spoken text', () => {
    expect(extractArabicSpeechText('لِلْكِيلُو lil-kīlū · untuk setiap kilogram')).toBe('لِلْكِيلُو');
  });

  it('preserves a full Arabic phrase and its diacritics', () => {
    expect(extractArabicSpeechText('سِعْرُ اللَّحْمِ')).toBe('سِعْرُ اللَّحْمِ');
  });

  it('returns an empty string when the input contains no Arabic', () => {
    expect(extractArabicSpeechText('harga daging')).toBe('');
  });
});

describe('Arabic audio control status', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading and playing states, then updates when playback ends', async () => {
    let resolvePlayback;
    playArabic.mockImplementation(() => new Promise((resolve) => { resolvePlayback = resolve; }));
    render(React.createElement(ArabicAudioButton, { text: 'سِعْرُ اللَّحْمِ', compact: false }));
    fireEvent.click(screen.getByRole('button', { name: /dengarkan pelafalan/i }));
    expect(screen.getByText('Memuat audio…')).toBeTruthy();
    resolvePlayback({ ok: true });
    await waitFor(() => expect(screen.getByText('Sedang diputar')).toBeTruthy());
    window.dispatchEvent(new CustomEvent('basyir-audio-status', { detail: { kind: 'ended', reason: 'AUDIO_PLAYBACK_ENDED', text: 'سِعْرُ اللَّحْمِ' } }));
    await waitFor(() => expect(screen.getByText('Selesai · putar ulang')).toBeTruthy());
  });

  it('shows a visible retry state when the audio service fails', async () => {
    playArabic.mockResolvedValue({ ok: false, reason: 'TEST_ERROR' });
    render(React.createElement(ArabicAudioButton, { text: 'مَسْجِدٌ', compact: false }));
    fireEvent.click(screen.getByRole('button', { name: /dengarkan pelafalan/i }));
    await waitFor(() => expect(screen.getByText('Gagal · coba lagi')).toBeTruthy());
  });

  it('allows replay after a completed playback', async () => {
    playArabic.mockResolvedValue({ ok: true });
    render(React.createElement(ArabicAudioButton, { text: 'مَسْجِدٌ', compact: false }));
    fireEvent.click(screen.getByRole('button', { name: /dengarkan pelafalan/i }));
    await waitFor(() => expect(screen.getByText('Sedang diputar')).toBeTruthy());
    window.dispatchEvent(new CustomEvent('basyir-audio-status', { detail: { kind: 'ended', reason: 'AUDIO_PLAYBACK_ENDED', text: 'مَسْجِدٌ' } }));
    await waitFor(() => expect(screen.getByText('Selesai · putar ulang')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /audio selesai diputar/i }));
    await waitFor(() => expect(playArabic).toHaveBeenCalledTimes(2));
  });
});
