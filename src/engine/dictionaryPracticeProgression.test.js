import { describe, expect, it } from 'vitest';
import {
  getNextDictionaryPracticeBatch,
  recordVocabularyResponse
} from './vocabulary.js';

const registry = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => {
    const vocabId = `word-${index + 1}`;
    return [vocabId, {
      vocabId,
      arabic: `Ø¹ÙŽØ±ÙŽØ¨ÙÙŠÙ‘ ${index + 1}`,
      meaningIndo: `Arti ${index + 1}`,
      sourceEpisodeIds: ['ch01-shopping']
    }];
  })
);

describe('Kamus Detektif adaptive practice', () => {
  it('starts with the first five vocabulary items that are not mastered', () => {
    const batch = getNextDictionaryPracticeBatch({}, registry);
    expect(batch.map((word) => word.vocabId)).toEqual([
      'word-1', 'word-2', 'word-3', 'word-4', 'word-5'
    ]);
  });

  it('skips vocabulary mastered in dictionary practice', () => {
    const progress = {
      'word-1': { dictionaryPracticeStatus: 'mastered' },
      'word-2': { dictionaryPracticeStatus: 'mastered' },
      'word-3': { dictionaryPracticeStatus: 'mastered' }
    };
    const batch = getNextDictionaryPracticeBatch(progress, registry);
    expect(batch.map((word) => word.vocabId)).toEqual([
      'word-4', 'word-5', 'word-6', 'word-7', 'word-8'
    ]);
  });

  it('keeps incorrect words in the next practice queue and continues with new words', () => {
    const progress = {
      'word-1': { dictionaryPracticeStatus: 'review' },
      'word-2': { dictionaryPracticeStatus: 'mastered' },
      'word-3': { dictionaryPracticeStatus: 'mastered' },
      'word-4': { dictionaryPracticeStatus: 'mastered' },
      'word-5': { dictionaryPracticeStatus: 'mastered' }
    };
    const batch = getNextDictionaryPracticeBatch(progress, registry);
    expect(batch.map((word) => word.vocabId)).toEqual([
      'word-6', 'word-1', 'word-7', 'word-8', 'word-9'
    ]);
  });

  it('interleaves several incorrect words with new words so new vocabulary keeps advancing', () => {
    const progress = {
      'word-1': { dictionaryPracticeStatus: 'review' },
      'word-2': { dictionaryPracticeStatus: 'review' },
      'word-3': { dictionaryPracticeStatus: 'review' },
      'word-4': { dictionaryPracticeStatus: 'review' },
      'word-5': { dictionaryPracticeStatus: 'review' }
    };
    const batch = getNextDictionaryPracticeBatch(progress, registry);
    expect(batch.map((word) => word.vocabId)).toEqual([
      'word-6', 'word-1', 'word-7', 'word-2', 'word-8'
    ]);
  });

  it('also skips vocabulary already mastered by the existing retrieval system', () => {
    const progress = {
      'word-1': { masteryStatus: 'mastered' },
      'word-2': { masteryStatus: 'mastered' }
    };
    const batch = getNextDictionaryPracticeBatch(progress, registry);
    expect(batch.map((word) => word.vocabId)).toEqual([
      'word-3', 'word-4', 'word-5', 'word-6', 'word-7'
    ]);
  });

  it('marks a correct dictionary-practice response as mastered for this practice flow', () => {
    const progress = recordVocabularyResponse(
      {}, 'word-1', 'ch01-shopping', true, 'dictionary-practice'
    );
    expect(progress['word-1'].dictionaryPracticeStatus).toBe('mastered');
    expect(getNextDictionaryPracticeBatch(progress, registry).map((word) => word.vocabId)[0])
      .toBe('word-2');
  });

  it('marks an incorrect dictionary-practice response for review', () => {
    const progress = recordVocabularyResponse(
      {}, 'word-1', 'ch01-shopping', false, 'dictionary-practice'
    );
    expect(progress['word-1'].dictionaryPracticeStatus).toBe('review');
    expect(getNextDictionaryPracticeBatch(progress, registry).map((word) => word.vocabId)[1])
      .toBe('word-1');
  });

  it('does not change dictionary-practice status for other learning modes', () => {
    const progress = recordVocabularyResponse(
      {}, 'word-1', 'ch01-shopping', true, 'checkpoint'
    );
    expect(progress['word-1'].dictionaryPracticeStatus).toBeUndefined();
  });

  it('respects the requested batch size', () => {
    expect(getNextDictionaryPracticeBatch({}, registry, 3)).toHaveLength(3);
  });
});