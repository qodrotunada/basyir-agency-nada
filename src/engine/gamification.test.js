import { describe, expect, it } from 'vitest';
import {
  awardReward,
  calculateStreak,
  claimDailyMissionReward,
  claimDailyReward,
  createInitialGamificationState,
  derivePlayerStats,
  getDailyMissions,
  mergeGamificationStates,
  recordDailyActivity,
  seedGamificationFromProgress
} from './gamification.js';

const date = (value) => new Date(`${value}T12:00:00`);

describe('gamification reward ledger', () => {
  it('awards a reward only once for the same event id', () => {
    const initial = createInitialGamificationState();
    const first = awardReward(initial, { eventId: 'case:1', xp: 100, coins: 20, reason: 'Case complete' });
    const second = awardReward(first, { eventId: 'case:1', xp: 100, coins: 20, reason: 'Duplicate' });
    expect(Object.keys(second.rewardLedger)).toHaveLength(1);
    expect(second.rewardLedger['case:1'].xp).toBe(100);
  });

  it('claims daily check-in only once per local date', () => {
    const initial = createInitialGamificationState();
    const first = claimDailyReward(initial, date('2026-11-26'));
    const second = claimDailyReward(first.state, date('2026-11-26'));
    expect(first.claimed).toBe(true);
    expect(second.claimed).toBe(false);
    expect(Object.keys(second.state.rewardLedger)).toHaveLength(1);
  });

  it('calculates consecutive check-in streaks', () => {
    expect(calculateStreak(['2026-11-24', '2026-11-25', '2026-11-26'], date('2026-11-26'))).toBe(3);
    expect(calculateStreak(['2026-11-23', '2026-11-25'], date('2026-11-26'))).toBe(1);
  });

  it('adds a milestone bonus on the seventh consecutive daily check-in', () => {
    const initial = { ...createInitialGamificationState(), dailyCheckins: ['2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25'] };
    const result = claimDailyReward(initial, date('2026-11-26'));
    const reward = result.state.rewardLedger['daily-checkin:2026-11-26'];
    expect(result.streak).toBe(7);
    expect(reward).toMatchObject({ xp: 50, coins: 30, stars: 1 });
  });

  it('deduplicates activities and unlocks daily mission rewards only when complete', () => {
    let state = createInitialGamificationState();
    for (let index = 1; index <= 5; index += 1) {
      state = recordDailyActivity(state, { id: `vocab:${index}:2026-11-26`, type: 'vocab-practice', at: date('2026-11-26').toISOString() });
    }
    state = recordDailyActivity(state, { id: 'case:ch01:2026-11-26', type: 'case-complete', at: date('2026-11-26').toISOString() });
    state = recordDailyActivity(state, { id: 'mastered:word1:2026-11-26', type: 'vocab-mastered', at: date('2026-11-26').toISOString() });
    expect(getDailyMissions(state, date('2026-11-26')).every((item) => item.done)).toBe(true);
    const result = claimDailyMissionReward(state, date('2026-11-26'));
    expect(result.claimed).toBe(true);
    expect(claimDailyMissionReward(result.state, date('2026-11-26')).claimed).toBe(false);
  });

  it('merges local and cloud rewards without duplicating event ids', () => {
    const local = awardReward(createInitialGamificationState(), { eventId: 'shared', xp: 10 });
    const cloud = awardReward(createInitialGamificationState(), { eventId: 'shared', xp: 10 });
    const merged = mergeGamificationStates(local, cloud);
    expect(Object.keys(merged.rewardLedger)).toHaveLength(1);
  });

  it('migrates legacy episode and vocabulary progress into one-time reward events', () => {
    const migrated = seedGamificationFromProgress(createInitialGamificationState(), { episodes: { caseA: { caseCompleted: true, bestMasteryScore: 75 } } }, { wordA: { correctCount: 1, masteryStatus: 'mastered' } });
    const totalXp = Object.values(migrated.rewardLedger).reduce((sum, reward) => sum + reward.xp, 0);
    expect(totalXp).toBe(220);
    expect(Object.keys(migrated.rewardLedger)).toHaveLength(4);
  });

  it('derives level and rank from the persisted ledger', () => {
    let state = createInitialGamificationState();
    state = awardReward(state, { eventId: 'xp', xp: 650, coins: 40 });
    const stats = derivePlayerStats(state, { episodes: {} }, { seen: 0, mastered: 0 });
    expect(stats.level).toBe(3);
    expect(stats.rank).toBe('Junior Detective');
    expect(stats.xp).toBe(650);
  });
});
