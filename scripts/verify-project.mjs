import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CAMPAIGN_CONFIG, CASES_CONFIG, EPISODE_META, VOCABULARY_REGISTRY } from '../src/data/campaign.js';
import { getLearningChapter, ISTIMA_AUDIO_CONTENT, LEARNING_CHAPTER_IDS } from '../src/data/learningMaterials.js';
import { DEDUCTION_CASES } from '../src/data/deduction.js';
import { arabicQuestion, validateAssessmentLanguage } from '../src/engine/arabicAssessment.js';
import { validateCampaignConfig } from '../src/engine/configValidator.js';
import { awardReward, claimDailyReward, createInitialGamificationState, derivePlayerStats, seedGamificationFromProgress } from '../src/engine/gamification.js';

const expectedPuzzleSentences = {
  'ch01-shopping': 'سِعْرُ اللَّحْمِ مِائَةُ أَلْفِ رُوبِيَّةٍ لِلْكِيلُو الْوَاحِدِ',
  'ch02-health': 'ذَهَبَ مُحَمَّدٌ إِلَى الْمُسْتَشْفَى لِلْفَحْصِ',
  'ch03-travel': 'سَافَرَ فَاتِحٌ إِلَى إِنْدُونِيسِيَا يَوْمَ الْأَحَدِ بِالطَّائِرَةِ',
  'ch04-hajj-umrah': 'طَافَ الْحَاجُّ حَوْلَ الْكَعْبَةِ سَبْعَةَ أَشْوَاطٍ',
  'ch05-ict': 'يُحَرِّرُ الْمُحَرِّرُ الْمَلَفَّ وَيَحْفَظُهُ فِي الْمُجَلَّدِ الْمُخَصَّصِ',
  'ch06-religions': 'يُصَلِّي الْمُسْلِمُونَ فِي الْمَسَاجِدِ'
};

const errors = validateCampaignConfig(CAMPAIGN_CONFIG, CASES_CONFIG, VOCABULARY_REGISTRY);
assert.deepEqual(errors, [], `Campaign validation failed: ${JSON.stringify(errors)}`);
assert.equal(EPISODE_META.length, 6);
assert.equal(LEARNING_CHAPTER_IDS.length, 6);
assert.deepEqual(EPISODE_META.map((item) => item.id), Object.keys(CASES_CONFIG));

let questionCount = 0;
const normalizedQuestionPrompts = new Set();
for (const id of LEARNING_CHAPTER_IDS) {
  const learning = getLearningChapter(id);
  assert.ok(learning, `Missing learning chapter ${id}`);
  assert.ok(learning.pages.length >= 12, `Insufficient pages in ${id}`);
  assert.ok(learning.pages.some((p) => p.type === 'competency'), `Missing competency page ${id}`);
  assert.ok(learning.pages.some((p) => p.type === 'grammar-detail'), `Missing grammar page ${id}`);
  assert.ok(learning.pages.some((p) => p.type === 'summary'), `Missing summary page ${id}`);
  assert.ok(!learning.pages.some((p) => ['mission', 'checkpoint', 'puzzle'].includes(p.type)), `Game activity leaked into flipbook ${id}`);
  assert.match(learning.meta.titleArabic, /[\u0600-\u06FF]/, `Arabic chapter title missing ${id}`);
  assert.ok(learning.meta.title?.trim(), `Indonesian chapter title missing ${id}`);
  assert.ok(learning.meta.caseTitle?.trim(), `Case title missing ${id}`);

  const istima = learning.pages.find((p) => p.type === 'istima')?.istima;
  assert.ok(istima, `Missing Istima audio data ${id}`);
  assert.match(istima.audioText, /[\u0600-\u06FF]/, `Arabic audio text missing ${id}`);
  assert.doesNotMatch(istima.audioText, /[A-Za-z]/, `Non-Arabic text leaked into TTS payload ${id}`);
  assert.match(istima.audioText, /[\u064B-\u065F\u0670]/, `Arabic harakat missing from TTS payload ${id}`);
  assert.ok(istima.turns.length >= 4, `Istima dialogue too short ${id}`);
  assert.match(istima.adaptationNote, /bukan kutipan langsung/i, `Adaptation note missing ${id}`);

  for (const page of learning.pages) for (const vocabId of page.vocabIds ?? []) {
    assert.ok(VOCABULARY_REGISTRY[vocabId], `Missing vocabulary ${vocabId} referenced by ${id}`);
  }

  const chapter = CASES_CONFIG[id];
  const acceptedPuzzleSentence = chapter.puzzle.acceptedOrders[0].map((pieceId) => chapter.puzzle.pieces.find((piece) => piece.id === pieceId)?.textArabic).join(' ');
  assert.equal(acceptedPuzzleSentence, expectedPuzzleSentences[id], `Puzzle sentence mismatch ${id}`);
  assert.equal(new Set(chapter.puzzle.pieces.map((piece) => piece.id)).size, 4, `Puzzle piece IDs not unique ${id}`);
  assert.equal(chapter.evidence.length, 5, `${id} must retain five evidence items`);
  assert.equal(chapter.suspects.length, 3, `${id} must retain three suspects`);
  assert.equal(chapter.mastery.length, 10, `${id} must retain 10 checkpoint questions`);
  questionCount += chapter.mastery.length;
  for (const question of chapter.mastery) {
    assert.equal(question.options.length, 4, `${id}:${question.id} must have four options`);
    assert.deepEqual(validateAssessmentLanguage(question), [], `${id}:${question.id} language audit`);
    const rendered = arabicQuestion(question);
    const normalizedPrompt = rendered.prompt.trim().toLowerCase();
    assert.ok(!normalizedQuestionPrompts.has(normalizedPrompt), `Duplicate checkpoint prompt: ${id}:${question.id}`);
    normalizedQuestionPrompts.add(normalizedPrompt);
    assert.equal(rendered.id, question.id, `Question ID changed ${id}:${question.id}`);
    assert.equal(rendered.correctIndex, question.correctIndex, `Answer index changed ${id}:${question.id}`);
    assert.deepEqual(rendered.options, question.options, `Option order changed ${id}:${question.id}`);
    assert.ok(Number.isInteger(rendered.correctIndex));
    assert.ok(rendered.correctIndex >= 0 && rendered.correctIndex < rendered.options.length);
    if ((question.translationDirection ?? (question.mode === 'vocabulary' ? 'ar-id' : null)) === 'ar-id') {
      assert.match(rendered.prompt, /[\u0600-\u06FF]/, `Arabic vocabulary prompt missing ${id}:${question.id}`);
      assert.ok(rendered.options.every((option) => /[A-Za-z]/.test(option) && !/[\u0600-\u06FF]/.test(option)), `Arabic-to-Indonesian options have wrong language ${id}:${question.id}`);
    }
  }

  const deduction = DEDUCTION_CASES[id];
  assert.ok(deduction, `Missing deduction data ${id}`);
  assert.equal(Object.keys(deduction.evidence).length, 5, `Deduction facts missing ${id}`);
  assert.deepEqual(Object.keys(deduction.evidence).sort(), chapter.evidence.map((item) => item.id).sort(), `Evidence IDs changed ${id}`);
  assert.equal(Object.keys(deduction.suspects).length, 3, `Suspect statements missing ${id}`);
  const guilty = chapter.suspects.filter((item) => item.isGuilty);
  assert.equal(guilty.length, 1, `Guilty count invalid ${id}`);
  assert.equal(deduction.logic.culpritId, guilty[0].id, `Deduction culprit mismatch ${id}`);
  assert.equal(deduction.solution.culpritId, guilty[0].id, `Solution culprit mismatch ${id}`);
  assert.ok(deduction.logic.contradictionEvidenceIds.length >= 2, `Need two independent contradiction clues ${id}`);
  for (const evidenceId of deduction.logic.contradictionEvidenceIds) assert.ok(deduction.evidence[evidenceId], `Unknown contradiction evidence ${id}:${evidenceId}`);
  for (const evidenceId of deduction.puzzleContext.evidenceIds) assert.ok(deduction.evidence[evidenceId], `Unknown puzzle context evidence ${id}:${evidenceId}`);
  assert.equal(Object.keys(deduction.logic.exoneratingEvidence).length, 2, `Two alternative alibis not supported ${id}`);
  for (const suspect of chapter.suspects) {
    const statement = deduction.suspects[suspect.id];
    assert.ok(!Object.hasOwn(suspect, 'policeNote'), `Spoiler police note exposed ${id}:${suspect.id}`);
    assert.match(statement?.arabic ?? '', /[\u0600-\u06FF]/, `Arabic alibi missing ${id}:${suspect.id}`);
    assert.ok(statement?.translation?.trim(), `Indonesian alibi missing ${id}:${suspect.id}`);
    assert.ok(statement?.identityNote?.trim(), `Identity/access mapping missing ${id}:${suspect.id}`);
    if (!suspect.isGuilty) assert.ok(statement.wrongFeedback?.trim(), `Wrong-answer feedback missing ${id}:${suspect.id}`);
  }
}
assert.equal(questionCount, 60);
assert.equal(normalizedQuestionPrompts.size, 60);

for (const [id, word] of Object.entries(VOCABULARY_REGISTRY)) {
  assert.match(word.arabic, /[\u0600-\u06FF]/, `Arabic missing: ${id}`);
  assert.ok(word.transliteration?.trim(), `Transliteration missing: ${id}`);
  assert.ok(word.meaningIndo?.trim(), `Indonesian meaning missing: ${id}`);
  assert.match(word.exampleSentences?.[0]?.arabic ?? '', /[\u0600-\u06FF]/, `Example missing: ${id}`);
}

assert.ok(existsSync(new URL('../public/assets/basyir-agency-logo.jpg', import.meta.url)), 'Full supplied logo missing');
assert.ok(existsSync(new URL('../public/assets/detective-wasp-3d.png', import.meta.url)), '3D detective wasp mascot missing');
assert.ok(existsSync(new URL('../src/components/GameLobby.jsx', import.meta.url)), 'Game lobby component missing');
assert.ok(existsSync(new URL('../src/components/LearningRoom.jsx', import.meta.url)), 'Interactive learning room component missing');
assert.ok(existsSync(new URL('../src/components/PlayerProfile.jsx', import.meta.url)), 'Player profile component missing');
assert.ok(existsSync(new URL('../public/assets/basyir-agency-emblem.png', import.meta.url)), 'Derived emblem missing');
assert.ok(existsSync(new URL('../public/favicon.png', import.meta.url)), 'Favicon missing');

console.log('PASS campaign config: 6 chapters, 30 evidence objects, 18 suspects, six unique guilty IDs');
console.log('PASS learning content: six chapter titles, competency, grammar, examples, vocabulary, and summary');
console.log('PASS Istima: six Arabic TTS dialogues with Indonesian transcripts and adaptation notes');
console.log('PASS assessment: 60 questions, four options each, translation direction audited, IDs/index/order preserved');
console.log('PASS deduction: five fact-rich evidence items per case, two independent culprit contradictions, two supported alternative alibis');
console.log(`PASS vocabulary registry: ${Object.keys(VOCABULARY_REGISTRY).length} entries include Arabic, transliteration, meaning, example`);
console.log('PASS brand assets: supplied full logo, derived emblem, 3D detective wasp, and favicon');

let rewardState = createInitialGamificationState();
rewardState = awardReward(rewardState, { eventId: 'audit-case', xp: 120, coins: 50, reason: 'Audit reward' });
rewardState = awardReward(rewardState, { eventId: 'audit-case', xp: 120, coins: 50, reason: 'Duplicate must be ignored' });
assert.equal(Object.keys(rewardState.rewardLedger).length, 1, 'Reward ledger must reject duplicate event IDs');
const legacyRewardState = seedGamificationFromProgress(createInitialGamificationState(), { episodes: { audit: { caseCompleted: true, bestMasteryScore: 75 } } }, {});
const derived = derivePlayerStats(legacyRewardState, { episodes: {} }, { seen: 0, mastered: 0 });
assert.equal(derived.xp, 200, 'Legacy case and mastery rewards must migrate once');
console.log('PASS gamification engine: idempotent ledger, legacy progress migration, level derivation');
