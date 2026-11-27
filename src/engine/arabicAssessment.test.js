import { describe, expect, it } from 'vitest';
import { CASES_CONFIG } from '../data/campaign.js';
import { arabicQuestion, validateAssessmentLanguage } from './arabicAssessment.js';

describe('Arabic checkpoint language direction', () => {
  it('asks Arabic-to-Indonesian vocabulary questions with Indonesian options', () => {
    Object.entries(CASES_CONFIG).forEach(([chapterId, chapter]) => {
      chapter.mastery.filter((question) => (question.translationDirection ?? (question.mode === 'vocabulary' ? 'ar-id' : null)) === 'ar-id').forEach((question) => {
        const localized = arabicQuestion(question);
        expect(localized.prompt, `${chapterId}:${question.id}`).toMatch(/[\u0600-\u06FF]/);
        expect(localized.options, `${chapterId}:${question.id}`).toHaveLength(4);
        localized.options.forEach((option) => {
          expect(option, `${chapterId}:${question.id}`).toMatch(/[A-Za-z]/);
          expect(option, `${chapterId}:${question.id}`).not.toMatch(/[\u0600-\u06FF]/);
        });
        expect(localized.explanation, `${chapterId}:${question.id}`).toMatch(/[A-Za-z]/);
        expect(validateAssessmentLanguage(question), `${chapterId}:${question.id}`).toEqual([]);
      });
    });
  });

  it('keeps Indonesian-to-Arabic items in the opposite direction', () => {
    const question = {
      id: 'sample-id-ar',
      mode: 'vocabulary',
      translationDirection: 'id-ar',
      prompt: 'Apa bahasa Arab untuk pembeli?',
      options: ['الْمُشْتَرِي', 'الْبَائِعُ', 'الْمِيزَانُ', 'الثَّمَنُ'],
      correctIndex: 0,
      explanation: 'الْمُشْتَرِي berarti pembeli.'
    };
    expect(arabicQuestion(question).prompt).toBe(question.prompt);
    expect(arabicQuestion(question).options).toEqual(question.options);
    expect(validateAssessmentLanguage(question)).toEqual([]);
  });

  it('rejects vocabulary questions whose answer options use the wrong language', () => {
    const question = {
      id: 'sample-ar-id-invalid',
      mode: 'vocabulary',
      prompt: 'Apa arti دِينٌ?',
      options: ['دِينٌ', 'مَسْجِدٌ', 'كَنِيسَةٌ', 'تَسَامُحٌ'],
      correctIndex: 0,
      explanation: 'دِينٌ berarti agama.'
    };
    expect(validateAssessmentLanguage(question)).toContain('ARABIC_TO_INDONESIAN_OPTIONS_MUST_BE_INDONESIAN');
  });

  it('keeps ten questions per chapter and sixty questions overall', () => {
    const counts = Object.values(CASES_CONFIG).map((chapter) => chapter.mastery.length);
    expect(counts).toEqual([10, 10, 10, 10, 10, 10]);
    expect(counts.reduce((sum, count) => sum + count, 0)).toBe(60);
  });

  it('does not repeat checkpoint prompts without an assessment purpose', () => {
    const prompts = Object.values(CASES_CONFIG).flatMap((chapter) => chapter.mastery.map((question) => arabicQuestion(question).prompt.trim().toLowerCase()));
    expect(new Set(prompts).size).toBe(60);
  });

  it('preserves question IDs, answer indexes, and four-option order', () => {
    Object.values(CASES_CONFIG).forEach((chapter) => {
      chapter.mastery.forEach((question) => {
        const localized = arabicQuestion(question);
        expect(localized.id).toBe(question.id);
        expect(localized.correctIndex).toBe(question.correctIndex);
        expect(localized.options).toEqual(question.options);
        expect(localized.options).toHaveLength(4);
      });
    });
  });
});
