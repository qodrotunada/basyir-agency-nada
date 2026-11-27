import { describe, expect, it } from 'vitest';
import { CASES_CONFIG, EPISODE_META, VOCABULARY_REGISTRY } from './campaign.js';
import { getLearningChapter, ISTIMA_AUDIO_CONTENT, LEARNING_CHAPTER_IDS } from './learningMaterials.js';

describe('academic flipbook content', () => {
  it('provides all six chapters and keeps game missions out of the flipbook', () => {
    expect(LEARNING_CHAPTER_IDS).toHaveLength(6);
    for (const id of LEARNING_CHAPTER_IDS) {
      const learning = getLearningChapter(id);
      expect(learning, id).not.toBeNull();
      expect(learning.pages.length).toBeGreaterThanOrEqual(12);
      expect(learning.pages.some((page) => page.type === 'competency')).toBe(true);
      expect(learning.pages.some((page) => page.type === 'grammar-detail')).toBe(true);
      expect(learning.pages.some((page) => page.type === 'summary')).toBe(true);
      expect(learning.pages.some((page) => page.type === 'mission')).toBe(false);
      expect(learning.pages.some((page) => page.type === 'checkpoint')).toBe(false);
    }
  });

  it('provides interactive Arabic Istima audio and Indonesian transcripts in all six chapters', () => {
    expect(Object.keys(ISTIMA_AUDIO_CONTENT)).toHaveLength(6);
    for (const id of LEARNING_CHAPTER_IDS) {
      const istima = getLearningChapter(id).pages.find((page) => page.type === 'istima')?.istima;
      expect(istima, id).toBeTruthy();
      expect(istima.audioText, id).toMatch(/[\u0600-\u06FF]/);
      expect(istima.audioText, id).not.toMatch(/[A-Za-z]/);
      expect(istima.audioText, id).toMatch(/[\u064B-\u065F\u0670]/);
      expect(istima.turns.length, id).toBeGreaterThanOrEqual(4);
      expect(istima.adaptationNote, id).toMatch(/bukan kutipan langsung/i);
      istima.turns.forEach((turn) => {
        expect(turn.arabic, id).toMatch(/[\u0600-\u06FF]/);
        expect(turn.translation, id).toMatch(/[A-Za-z]/);
      });
    }
  });

  it('keeps academic chapter titles and case titles as separate fields', () => {
    for (const item of EPISODE_META) {
      expect(item.titleArabic, item.id).toMatch(/[\u0600-\u06FF]/);
      expect(item.title, item.id).toBeTruthy();
      expect(item.caseTitle, item.id).toBeTruthy();
      expect(item.caseTitle, item.id).toBe(CASES_CONFIG[item.id].caseInfo.title);
    }
  });

  it('uses a single chapter vocabulary registry for all flipbook vocabulary references', () => {
    for (const id of LEARNING_CHAPTER_IDS) {
      const learning = getLearningChapter(id);
      for (const page of learning.pages) {
        for (const vocabId of page.vocabIds ?? []) {
          expect(VOCABULARY_REGISTRY[vocabId], `${id}:${vocabId}`).toBeTruthy();
        }
      }
    }
  });

  it('keeps all Arabic vocabulary entries complete enough for study', () => {
    Object.entries(VOCABULARY_REGISTRY).forEach(([id, word]) => {
      expect(word.arabic, id).toMatch(/[\u0600-\u06FF]/);
      expect(word.transliteration?.trim(), id).toBeTruthy();
      expect(word.meaningIndo?.trim(), id).toBeTruthy();
      expect(word.exampleSentences?.[0]?.arabic, id).toMatch(/[\u0600-\u06FF]/);
    });
  });

  it('keeps the original six campaign identifiers unchanged', () => {
    expect(EPISODE_META.map((item) => item.id)).toEqual(Object.keys(CASES_CONFIG));
  });
});
