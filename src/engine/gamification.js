const SCHEMA_VERSION = 1;

export function createInitialGamificationState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    rewardLedger: {},
    activityLog: [],
    dailyCheckins: []
  };
}

export function toLocalDateKey(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return toLocalDateKey(new Date());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function safeInteger(value, fallback = 0) {
  return Number.isSafeInteger(value) && value >= 0 ? value : fallback;
}

export function normalizeGamificationState(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.schemaVersion !== SCHEMA_VERSION) {
    return createInitialGamificationState();
  }

  const rewardLedger = {};
  for (const [eventId, event] of Object.entries(input.rewardLedger ?? {})) {
    if (!eventId || !event || typeof event !== 'object') continue;
    rewardLedger[eventId] = {
      xp: safeInteger(event.xp),
      coins: safeInteger(event.coins),
      stars: safeInteger(event.stars),
      reason: typeof event.reason === 'string' ? event.reason.slice(0, 120) : 'Reward',
      at: typeof event.at === 'string' ? event.at : new Date(0).toISOString()
    };
  }

  const activityLog = Array.isArray(input.activityLog)
    ? input.activityLog
      .filter((item) => item && typeof item.id === 'string' && typeof item.type === 'string')
      .map((item) => ({
        id: item.id.slice(0, 180),
        type: item.type.slice(0, 48),
        at: typeof item.at === 'string' ? item.at : new Date(0).toISOString(),
        date: typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
          ? item.date
          : toLocalDateKey(item.at)
      }))
      .slice(-1000)
    : [];

  const dailyCheckins = Array.isArray(input.dailyCheckins)
    ? [...new Set(input.dailyCheckins.filter((date) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort().slice(-730)
    : [];

  return { schemaVersion: SCHEMA_VERSION, rewardLedger, activityLog, dailyCheckins };
}

export function awardReward(state, { eventId, xp = 0, coins = 0, stars = 0, reason = 'Reward', at = new Date().toISOString() }) {
  const current = normalizeGamificationState(state);
  if (!eventId || current.rewardLedger[eventId]) return current;
  const safeXp = safeInteger(xp);
  const safeCoins = safeInteger(coins);
  const safeStars = safeInteger(stars);
  if (safeXp + safeCoins + safeStars === 0) return current;

  return {
    ...current,
    rewardLedger: {
      ...current.rewardLedger,
      [eventId]: { xp: safeXp, coins: safeCoins, stars: safeStars, reason: String(reason).slice(0, 120), at }
    }
  };
}

export function recordDailyActivity(state, { id, type, at = new Date().toISOString() }) {
  const current = normalizeGamificationState(state);
  if (!id || !type) return current;
  if (current.activityLog.some((item) => item.id === id)) return current;
  const next = [...current.activityLog, { id, type, at, date: toLocalDateKey(at) }].slice(-1000);
  return { ...current, activityLog: next };
}

function shiftDate(dateKey, amount) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return toLocalDateKey(date);
}

export function calculateStreak(checkins = [], referenceDate = new Date()) {
  const dates = new Set(checkins);
  const today = toLocalDateKey(referenceDate);
  const anchor = dates.has(today) ? today : shiftDate(today, -1);
  if (!dates.has(anchor)) return 0;
  let streak = 0;
  let cursor = anchor;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

export function claimDailyReward(state, referenceDate = new Date()) {
  const current = normalizeGamificationState(state);
  const date = toLocalDateKey(referenceDate);
  if (current.dailyCheckins.includes(date)) {
    return { state: current, claimed: false, streak: calculateStreak(current.dailyCheckins, referenceDate) };
  }

  const dailyCheckins = [...current.dailyCheckins, date].sort().slice(-730);
  const streak = calculateStreak(dailyCheckins, referenceDate);
  let next = { ...current, dailyCheckins };
  next = awardReward(next, {
    eventId: `daily-checkin:${date}`,
    xp: 20 + (streak > 0 && streak % 7 === 0 ? 30 : 0),
    coins: 10 + (streak > 0 && streak % 7 === 0 ? 20 : 0),
    stars: streak > 0 && streak % 7 === 0 ? 1 : 0,
    reason: streak > 0 && streak % 7 === 0 ? `Daily reward · streak ${streak} hari` : 'Daily check-in',
    at: referenceDate.toISOString()
  });
  return { state: next, claimed: true, streak };
}

export function getDailyMissions(state, referenceDate = new Date()) {
  const current = normalizeGamificationState(state);
  const date = toLocalDateKey(referenceDate);
  const today = current.activityLog.filter((item) => item.date === date);
  const uniquePracticedWords = new Set(today.filter((item) => item.type === 'vocab-practice').map((item) => item.id.split(':')[1]));
  const casesCompleted = today.filter((item) => item.type === 'case-complete').length;
  const wordsMastered = today.filter((item) => item.type === 'vocab-mastered').length;

  return [
    { id: 'practice-five-words', title: 'Latih 5 mufrodat', detail: 'Jawab latihan dari lima kosakata berbeda', progress: Math.min(5, uniquePracticedWords.size), target: 5, done: uniquePracticedWords.size >= 5 },
    { id: 'complete-one-case', title: 'Selesaikan 1 investigasi', detail: 'Tuntaskan satu kasus investigasi', progress: Math.min(1, casesCompleted), target: 1, done: casesCompleted >= 1 },
    { id: 'master-one-word', title: 'Kuasai 1 mufrodat', detail: 'Capai status dikuasai pada satu kosakata baru', progress: Math.min(1, wordsMastered), target: 1, done: wordsMastered >= 1 }
  ];
}

export function claimDailyMissionReward(state, referenceDate = new Date()) {
  const current = normalizeGamificationState(state);
  const date = toLocalDateKey(referenceDate);
  const missions = getDailyMissions(current, referenceDate);
  const eventId = `daily-missions:${date}`;
  if (current.rewardLedger[eventId] || missions.some((mission) => !mission.done)) {
    return { state: current, claimed: false, missions };
  }
  const next = awardReward(current, {
    eventId,
    xp: 60,
    coins: 30,
    stars: 1,
    reason: 'Daily mission completed',
    at: referenceDate.toISOString()
  });
  return { state: next, claimed: true, missions };
}

export function mergeGamificationStates(...states) {
  const normalized = states.map(normalizeGamificationState);
  const rewardLedger = {};
  const activityMap = new Map();
  const dailyCheckins = new Set();

  normalized.forEach((state) => {
    Object.entries(state.rewardLedger).forEach(([id, event]) => {
      const existing = rewardLedger[id];
      if (!existing || Date.parse(event.at) >= Date.parse(existing.at)) rewardLedger[id] = event;
    });
    state.activityLog.forEach((item) => {
      const existing = activityMap.get(item.id);
      if (!existing || Date.parse(item.at) >= Date.parse(existing.at)) activityMap.set(item.id, item);
    });
    state.dailyCheckins.forEach((date) => dailyCheckins.add(date));
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    rewardLedger,
    activityLog: [...activityMap.values()].sort((a, b) => Date.parse(a.at) - Date.parse(b.at)).slice(-1000),
    dailyCheckins: [...dailyCheckins].sort().slice(-730)
  };
}


export function seedGamificationFromProgress(state, campaign = {}, vocabularyProgress = {}, referenceDate = new Date()) {
  let next = normalizeGamificationState(state);
  const today = toLocalDateKey(referenceDate);

  for (const [episodeId, row] of Object.entries(campaign?.episodes ?? {})) {
    if (row?.caseCompleted) {
      next = awardReward(next, {
        eventId: `case-complete:${episodeId}`,
        xp: 120,
        coins: 50,
        reason: `Investigasi selesai · ${episodeId}`,
        at: row.completedAt || new Date(0).toISOString()
      });
      if (row.completedAt && toLocalDateKey(row.completedAt) === today) {
        next = recordDailyActivity(next, { id: `case-complete:${episodeId}:${today}`, type: 'case-complete', at: row.completedAt });
      }
    }
    if ((row?.bestMasteryScore ?? 0) >= 70) {
      next = awardReward(next, {
        eventId: `mastery-passed:${episodeId}`,
        xp: 80,
        coins: 25,
        reason: `Checkpoint mastery lulus · ${episodeId}`,
        at: row.completedAt || new Date(0).toISOString()
      });
    }
  }

  for (const [vocabId, row] of Object.entries(vocabularyProgress ?? {})) {
    if ((row?.correctCount ?? 0) > 0) {
      next = awardReward(next, {
        eventId: `vocabulary-first-correct:${vocabId}`,
        xp: 5,
        reason: `Jawaban benar pertama · ${vocabId}`,
        at: row.lastPracticedAt || new Date(0).toISOString()
      });
    }
    if (row?.masteryStatus === 'mastered') {
      next = awardReward(next, {
        eventId: `vocabulary-mastered:${vocabId}`,
        xp: 15,
        coins: 5,
        reason: `Mufrodat dikuasai · ${vocabId}`,
        at: row.lastPracticedAt || new Date(0).toISOString()
      });
      if (row.lastPracticedAt && toLocalDateKey(row.lastPracticedAt) === today) {
        next = recordDailyActivity(next, { id: `vocab-mastered:${vocabId}:${today}`, type: 'vocab-mastered', at: row.lastPracticedAt });
      }
    }
    if ((row?.retrievalCount ?? 0) > 0 && row.lastPracticedAt && toLocalDateKey(row.lastPracticedAt) === today) {
      next = recordDailyActivity(next, { id: `vocab-practice:${vocabId}:${today}`, type: 'vocab-practice', at: row.lastPracticedAt });
    }
  }
  return next;
}

const RANKS = [
  { min: 1, label: 'Beginner Detective' },
  { min: 3, label: 'Junior Detective' },
  { min: 6, label: 'Advanced Detective' },
  { min: 10, label: 'Expert Detective' },
  { min: 15, label: 'Master Detective' },
  { min: 21, label: 'Legendary Detective' }
];

export function derivePlayerStats(state, campaign, vocabularyStats, referenceDate = new Date()) {
  const current = normalizeGamificationState(state);
  const rewards = Object.values(current.rewardLedger);
  const xp = rewards.reduce((sum, event) => sum + event.xp, 0);
  const coins = rewards.reduce((sum, event) => sum + event.coins, 0);
  const bonusStars = rewards.reduce((sum, event) => sum + event.stars, 0);
  const episodeRows = Object.values(campaign?.episodes ?? {});
  const stars = episodeRows.reduce((sum, row) => sum + safeInteger(row?.starsEarned), 0) + bonusStars;
  const level = Math.floor(xp / 300) + 1;
  const rank = [...RANKS].reverse().find((item) => level >= item.min)?.label ?? RANKS[0].label;
  const xpInLevel = xp % 300;
  const streakDays = calculateStreak(current.dailyCheckins, referenceDate);
  const completedMissions = episodeRows.filter((row) => row?.caseCompleted).length;
  const masteredWords = safeInteger(vocabularyStats?.mastered);
  const seenWords = safeInteger(vocabularyStats?.seen);
  const bestScores = episodeRows.map((row) => safeInteger(row?.bestScore));

  const achievements = [
    { id: 'first-investigation', title: 'First Investigation', detail: 'Selesaikan investigasi pertama', unlocked: completedMissions >= 1 },
    { id: 'vocabulary-hunter', title: 'Vocabulary Hunter', detail: 'Temui 10 kosakata berbeda', unlocked: seenWords >= 10 },
    { id: 'arabic-master', title: 'Arabic Master', detail: 'Kuasai 20 kosakata', unlocked: masteredWords >= 20 },
    { id: 'perfect-mission', title: 'Perfect Mission', detail: 'Raih skor sempurna 1.000', unlocked: bestScores.some((score) => score >= 1000) },
    { id: 'seven-days-streak', title: 'Seven Days Streak', detail: 'Check-in selama tujuh hari berturut-turut', unlocked: streakDays >= 7 },
    { id: 'detective-legend', title: 'Detective Legend', detail: 'Capai level 21', unlocked: level >= 21 }
  ];

  return {
    xp,
    coins,
    stars,
    level,
    rank,
    xpInLevel,
    xpForNextLevel: 300,
    levelProgress: Math.round((xpInLevel / 300) * 100),
    streakDays,
    completedMissions,
    totalMissions: episodeRows.length,
    seenWords,
    masteredWords,
    achievements,
    unlockedAchievements: achievements.filter((item) => item.unlocked).length,
    dailyMissions: getDailyMissions(current, referenceDate),
    dailyMissionClaimed: Boolean(current.rewardLedger[`daily-missions:${toLocalDateKey(referenceDate)}`]),
    dailyRewardClaimed: current.dailyCheckins.includes(toLocalDateKey(referenceDate)),
    recentRewards: rewards.sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, 5)
  };
}
