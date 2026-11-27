import { describe, expect, it } from 'vitest';
import { CASES_CONFIG, EPISODE_META } from './campaign.js';
import { DEDUCTION_CASES } from './deduction.js';

describe('six-case deduction audit', () => {
  it('provides a unique culprit and at least two independent contradictions per case', () => {
    expect(Object.keys(DEDUCTION_CASES)).toEqual(EPISODE_META.map((item) => item.id));
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      const caseData = CASES_CONFIG[chapterId];
      const guilty = caseData.suspects.filter((suspect) => suspect.isGuilty);
      expect(guilty, chapterId).toHaveLength(1);
      expect(deduction.logic.culpritId, chapterId).toBe(guilty[0].id);
      expect(deduction.solution.culpritId, chapterId).toBe(guilty[0].id);
      caseData.suspects.forEach((suspect) => expect(suspect).not.toHaveProperty('policeNote'));
      expect(deduction.logic.contradictionEvidenceIds, chapterId).toHaveLength(2);
      expect(new Set(deduction.logic.contradictionEvidenceIds).size, chapterId).toBe(2);
      deduction.logic.contradictionEvidenceIds.forEach((evidenceId) => {
        expect(deduction.evidence[evidenceId], `${chapterId}:${evidenceId}`).toBeTruthy();
      });
    }
  });

  it('supports both non-culprit alibis with evidence and targeted feedback', () => {
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      const falseSuspects = CASES_CONFIG[chapterId].suspects.filter((suspect) => !suspect.isGuilty);
      expect(Object.keys(deduction.logic.exoneratingEvidence), chapterId).toHaveLength(2);
      expect(deduction.solution.eliminations, chapterId).toHaveLength(2);
      falseSuspects.forEach((suspect) => {
        const evidenceIds = deduction.logic.exoneratingEvidence[suspect.id];
        expect(evidenceIds?.length, `${chapterId}:${suspect.id}`).toBeGreaterThan(0);
        evidenceIds.forEach((evidenceId) => {
          expect(deduction.evidence[evidenceId], `${chapterId}:${suspect.id}:${evidenceId}`).toBeTruthy();
        });
        expect(deduction.suspects[suspect.id].wrongFeedback, `${chapterId}:${suspect.id}`).toMatch(/bukti|catatan|log|denah|metadata|struk/i);
      });
    }
  });

  it('provides five fact-rich objects and an investigative use for every object', () => {
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      expect(Object.keys(deduction.evidence), chapterId).toHaveLength(5);
      expect(Object.keys(deduction.evidence).sort(), chapterId).toEqual(CASES_CONFIG[chapterId].evidence.map((item) => item.id).sort());
      Object.entries(deduction.evidence).forEach(([evidenceId, fact]) => {
        expect(fact.location, `${chapterId}:${evidenceId}`).toBeTruthy();
        expect(fact.condition, `${chapterId}:${evidenceId}`).toBeTruthy();
        expect(fact.time, `${chapterId}:${evidenceId}`).toBeTruthy();
        expect(fact.fact, `${chapterId}:${evidenceId}`).toBeTruthy();
        expect(fact.deductionUse, `${chapterId}:${evidenceId}`).toBeTruthy();
      });
      expect(deduction.puzzleContext.focus, chapterId).toBeTruthy();
      expect(deduction.puzzleContext.investigativeReading, chapterId).toBeTruthy();
      expect(deduction.solution.steps.length, chapterId).toBeGreaterThanOrEqual(2);
      expect(deduction.solution.conclusion, chapterId).toBeTruthy();
    }
  });

  it('keeps every solution and elimination tied to existing case evidence', () => {
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      const caseData = CASES_CONFIG[chapterId];
      deduction.solution.steps.forEach((step) => step.evidenceIds.forEach((evidenceId) => {
        expect(deduction.evidence[evidenceId], `${chapterId}:${step.heading}:${evidenceId}`).toBeTruthy();
      }));
      deduction.solution.eliminations.forEach((item) => {
        expect(caseData.suspects.find((suspect) => suspect.id === item.suspectId)?.isGuilty, `${chapterId}:${item.suspectId}`).toBe(false);
        expect(item.evidenceIds.length, `${chapterId}:${item.suspectId}`).toBeGreaterThan(0);
        item.evidenceIds.forEach((evidenceId) => expect(deduction.evidence[evidenceId], `${chapterId}:${evidenceId}`).toBeTruthy());
      });
    }
  });

  it('provides one chronological selection-guidance paragraph for each of the six chapters', () => {
    expect(Object.keys(DEDUCTION_CASES)).toHaveLength(6);
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      expect(deduction.selectionGuidance, chapterId).toBeTruthy();
      expect(deduction.selectionGuidance, chapterId).not.toMatch(/[\r\n]/);
      expect(deduction.selectionGuidance.trim().split(/\s+/).length, chapterId).toBeGreaterThan(65);
      expect(deduction.selectionGuidance, chapterId).toMatch(/pukul|catatan|log|slip|riwayat|indeks/i);
    }
  });

  it('provides a fully vocalized Arabic chronology for each chapter', () => {
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      expect(deduction.selectionGuidanceArabic, chapterId).toMatch(/[\u0600-\u06FF]/);
      expect(deduction.selectionGuidanceArabic, chapterId).not.toMatch(/[\r\n]/);
      expect(deduction.selectionGuidanceArabic, chapterId).toMatch(/[\u064B-\u065F\u0670]/);
    }
  });

  it('closes the Zahra timeline gap in chapter 4 without changing the five-evidence scoring structure', () => {
    const chapter = DEDUCTION_CASES['ch04-hajj-umrah'];
    expect(Object.keys(chapter.evidence)).toHaveLength(5);
    expect(chapter.evidence.sai.time).toContain('14.27–14.48');
    expect(chapter.evidence.sai.fact).toMatch(/CCTV.*ZH-05|ZH-05.*CCTV/i);
    expect(chapter.suspects.zahra.statement).toContain('14.48');
    expect(chapter.solution.eliminations.find((item) => item.suspectId === 'zahra').evidenceIds).toContain('sai');
  });

  it('provides Arabic and Indonesian statements for all eighteen suspects', () => {
    for (const [chapterId, deduction] of Object.entries(DEDUCTION_CASES)) {
      expect(Object.keys(deduction.suspects), chapterId).toHaveLength(3);
      CASES_CONFIG[chapterId].suspects.forEach((suspect) => {
        const statement = deduction.suspects[suspect.id];
        expect(statement?.arabic, `${chapterId}:${suspect.id}`).toMatch(/[\u0600-\u06FF]/);
        expect(statement?.translation, `${chapterId}:${suspect.id}`).toMatch(/[A-Za-z]/);
        expect(statement?.identityNote, `${chapterId}:${suspect.id}`).toMatch(/[A-Za-z]/);
      });
    }
  });
});
