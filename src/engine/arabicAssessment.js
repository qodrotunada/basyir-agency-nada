import { VOCABULARY_REGISTRY } from '../data/campaign.js';

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const ARABIC_ONLY_RE = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u064B-\u065F\u0670\u06D6-\u06ED\s،؛؟,.!():ـ]+$/;

function extractArabicPhrase(value = '') {
  return (String(value).match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u064B-\u065F\u0670\u06D6-\u06ED]+(?:[\sـ]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u064B-\u065F\u0670\u06D6-\u06ED]+)*/g) ?? [])
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getArabicVocabularyTerm(question) {
  const registered = question.vocabularyId ? VOCABULARY_REGISTRY[question.vocabularyId]?.arabic : '';
  if (registered) return registered.split('/')[0].trim();
  return extractArabicPhrase(question.prompt);
}

/**
 * Keep the assessment language in the direction the item actually tests.
 * Arabic -> Indonesian vocabulary items use an Arabic prompt and Indonesian
 * answer choices. Indonesian -> Arabic items retain Indonesian prompts and
 * Arabic choices. Grammar/reading items are left in their authored language.
 */
export function arabicQuestion(question) {
  const direction = question.translationDirection ?? (question.mode === 'vocabulary' ? 'ar-id' : null);

  if (direction === 'ar-id') {
    const term = getArabicVocabularyTerm(question);
    if (!term) {
      return {
        ...question,
        options: [...question.options],
        arabicPrompt: false,
        explanation: question.explanation
      };
    }
    const correctAnswer = question.options[question.correctIndex];
    return {
      ...question,
      prompt: `مَا مَعْنَى الْكَلِمَةِ: ${term}؟`,
      options: [...question.options],
      correctIndex: question.correctIndex,
      explanation: `${term} berarti ${correctAnswer}. ${question.explanation ?? 'Perhatikan makna kosakata tersebut dalam konteks bab.'}`, 
      arabicPrompt: true,
      translationDirection: 'ar-id'
    };
  }

  return {
    ...question,
    options: [...question.options],
    arabicPrompt: Boolean(question.arabicPrompt && ARABIC_ONLY_RE.test(question.prompt.trim()))
  };
}

/** Return content issues without mutating or reordering the question. */
export function validateAssessmentLanguage(question) {
  const issues = [];
  const options = Array.isArray(question.options) ? question.options : [];
  const direction = question.translationDirection ?? (question.mode === 'vocabulary' ? 'ar-id' : null);

  if (options.length !== 4) issues.push('EXPECTED_FOUR_OPTIONS');
  if (new Set(options).size !== options.length) issues.push('DUPLICATE_OPTIONS');
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= options.length) {
    issues.push('INVALID_CORRECT_INDEX');
  }

  if (direction === 'ar-id') {
    const localized = arabicQuestion(question);
    if (!ARABIC_RE.test(localized.prompt)) issues.push('ARABIC_TERM_MISSING_FROM_PROMPT');
    if (localized.options.some((option) => ARABIC_RE.test(option))) issues.push('ARABIC_TO_INDONESIAN_OPTIONS_MUST_BE_INDONESIAN');
    if (localized.options.some((option) => !/[A-Za-z]/.test(option))) issues.push('INDONESIAN_OPTION_TEXT_MISSING');
  }

  if (direction === 'id-ar') {
    if (ARABIC_ONLY_RE.test(question.prompt.trim())) issues.push('INDONESIAN_TO_ARABIC_PROMPT_MUST_BE_INDONESIAN');
    if (options.some((option) => !ARABIC_ONLY_RE.test(option.trim()))) issues.push('INDONESIAN_TO_ARABIC_OPTIONS_MUST_BE_ARABIC');
  }

  return issues;
}

export function isArabicOnlyAssessmentText(value = '') {
  return ARABIC_ONLY_RE.test(String(value).trim());
}
