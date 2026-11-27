import React from 'react';
import { EPISODE_META } from '../data/campaign.js';

function displayName(user) {
  return user?.user_metadata?.display_name
    || user?.email?.split('@')[0]
    || 'Detektif';
}

function ProgressBar({ value = 0, max = 100, className = '' }) {
  const percent = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return <div className={`ba-progress ${className}`}><span style={{ width: `${percent}%` }} /></div>;
}

export default function GameLobby({
  user,
  playerStats,
  unlockedCount,
  completedCount,
  vocabularyStats,
  nextEpisode,
  dailyMissions,
  dailyRewardClaimed,
  dailyMissionClaimed,
  onPlay,
  onContinue,
  onOpenMissions,
  onOpenLearn,
  onOpenVocabulary,
  onClaimDailyReward,
  onClaimDailyMission,
  onOpenProfile,
  onOpenData
}) {
  const name = displayName(user);
  const allMissionsDone = dailyMissions.every((mission) => mission.done);
  const dailyMissionPercent = Math.round((dailyMissions.filter((mission) => mission.done).length / Math.max(1, dailyMissions.length)) * 100);
  const nextStreak = dailyRewardClaimed ? playerStats.streakDays : playerStats.streakDays + 1;
  const checkinMilestone = !dailyRewardClaimed && nextStreak > 0 && nextStreak % 7 === 0;
  const episode = nextEpisode ?? EPISODE_META[0];

  return (
    <div className="ba-lobby page-enter">
      <div className="ba-lobby-scene" aria-hidden="true" />
      <div className="ba-lobby-grid" aria-hidden="true" />
      <div className="ba-lobby-content">
        <section className="ba-lobby-stage">
          <aside className="ba-lobby-welcome ba-game-panel">
            <div className="ba-panel-kicker"><span className="ba-live-dot" /> DETECTIVE HQ · LOBBY</div>
            <p className="ba-welcome-small">WELCOME BACK, AGENT</p>
            <h1>{name}<span>!</span></h1>
            <div className="ba-rank-line">
              <span className="ba-rank-emblem"><i>✦</i></span>
              <div><strong>{playerStats.rank}</strong><small>LEVEL {playerStats.level} · FIELD OPERATIVE</small></div>
            </div>
            <div className="ba-lobby-divider" />
            <div className="ba-panel-stat">
              <div><span>Progress pembelajaran</span><strong>{Math.round((completedCount / Math.max(1, EPISODE_META.length)) * 100)}%</strong></div>
              <ProgressBar value={completedCount} max={EPISODE_META.length} />
            </div>
            <div className="ba-panel-stat">
              <div><span>Episode diselesaikan</span><strong>{completedCount}/{EPISODE_META.length}</strong></div>
              <ProgressBar value={completedCount} max={EPISODE_META.length} />
            </div>
            <div className="ba-panel-stat">
              <div><span>Mufrodat dikuasai</span><strong>{vocabularyStats.mastered}/{vocabularyStats.total}</strong></div>
              <ProgressBar value={vocabularyStats.mastered} max={vocabularyStats.total} />
            </div>
            <button className="ba-panel-link" onClick={onOpenProfile}>Lihat statistik detektif <span>↗</span></button>
          </aside>

          <div className={`ba-mascot-stage ${playerStats.level >= 12 ? 'has-elite-skin' : ''}`} aria-label="Maskot tawon detektif BASYIR AGENCY">
            <div className="ba-mascot-aura" />
            <div className="ba-mascot-ring ba-mascot-ring-one" />
            <div className="ba-mascot-ring ba-mascot-ring-two" />
            <div className="ba-mascot-floor" />
            <img className={`ba-lobby-mascot ${playerStats.level >= 12 ? 'has-elite-skin' : ''}`} src="/assets/detective-wasp-3d.png" alt="Tawon detektif dengan kaca pembesar" />
            <div className="ba-mascot-callout ba-callout-left"><span>CASE CLUE</span><strong>مِفْتَاحٌ</strong><small>Find the missing key</small></div>
            <div className="ba-mascot-callout ba-callout-right"><span>AGENT STATUS</span><strong>READY TO INVESTIGATE</strong><small>Arabic skills detected</small></div>
            <div className="ba-mascot-caption"><span>YOUR PARTNER</span><strong>AGENT BASYIR</strong><small>Curious mind. Sharp clues. Better Arabic.</small></div>
          </div>

          <aside className="ba-lobby-mission ba-game-panel">
            <div className="ba-panel-heading"><div><span className="ba-panel-kicker">ACTIVE CASE</span><h2>Misi berlanjut</h2></div><span className="ba-case-index">0{EPISODE_META.findIndex((item) => item.id === episode.id) + 1}/06</span></div>
            <div className={`ba-mission-art ba-art-${episode.accent}`}>
              <span className="ba-mission-art-icon">{episode.icon}</span>
              <span className="ba-mission-art-label">{episode.location}</span>
              <span className="ba-mission-art-stamp">CASE FILE</span>
            </div>
            <div className="ba-mission-details">
              <span className="ba-mission-episode">EPISODE {episode.label}</span>
              <h3>{episode.title}</h3>
              <p className="ba-mission-arabic" lang="ar" dir="rtl">{episode.titleArabic}</p>
              <div className="ba-mission-progress-head"><span>Case progress</span><strong>{completedCount}/{EPISODE_META.length}</strong></div>
              <ProgressBar value={completedCount} max={EPISODE_META.length} />
              <button className="ba-mission-open" onClick={onContinue}>CONTINUE MISSION <span>›</span></button>
            </div>
            <div className="ba-unlocked-note"><span>⌑</span> {unlockedCount} dari 6 episode terbuka</div>
          </aside>
        </section>

        <section className="ba-lobby-cta" aria-label="Aksi utama">
          <button className="ba-cta-secondary" onClick={onContinue}><span className="ba-cta-icon">◎</span><span><strong>CONTINUE MISSION</strong><small>Lanjutkan investigasi</small></span></button>
          <button className="ba-cta-play" onClick={onPlay}><span className="ba-play-triangle" /> <span>PLAY NOW</span><small>START YOUR NEXT CASE</small></button>
          <button className="ba-cta-secondary" onClick={onOpenMissions}><span className="ba-cta-icon">⚑</span><span><strong>MISSION SELECT</strong><small>Pilih episode investigasi</small></span></button>
        </section>

        <section className="ba-lobby-utility-grid">
          <article className="ba-daily-card ba-game-panel">
            <div className="ba-card-topline"><span className="ba-panel-kicker">TODAY'S OBJECTIVES</span><span className="ba-daily-percent">{dailyMissionPercent}%</span></div>
            <div className="ba-daily-heading"><div><h2>Daily Mission</h2><p>Selesaikan tantangan untuk memperoleh reward.</p></div><span className="ba-daily-emblem">✦</span></div>
            <ProgressBar value={dailyMissionPercent} max={100} />
            <div className="ba-daily-list">
              {dailyMissions.map((mission) => (
                <div className={`ba-daily-row ${mission.done ? 'is-done' : ''}`} key={mission.id}>
                  <span className="ba-daily-check">{mission.done ? '✓' : '○'}</span>
                  <div><strong>{mission.title}</strong><small>{mission.detail}</small></div>
                  <b>{mission.progress}/{mission.target}</b>
                </div>
              ))}
            </div>
            <button className="ba-daily-claim" onClick={onClaimDailyMission} disabled={!allMissionsDone || dailyMissionClaimed}>
              {dailyMissionClaimed ? 'REWARD CLAIMED' : allMissionsDone ? 'CLAIM DAILY REWARD · +60 XP · +30 KOIN · +1 ★' : 'MISSION IN PROGRESS'}
            </button>
          </article>

          <article className="ba-reward-card ba-game-panel">
            <div className="ba-panel-kicker">DAILY LOGIN BONUS</div>
            <div className="ba-reward-art"><span className="ba-reward-orbit" /><span className="ba-reward-crystal">✦</span><span className="ba-reward-rays" /></div>
            <h2>Daily Check-in</h2>
            <p>Jaga konsistensi belajar dan bangun streak detektifmu.</p>
            <div className="ba-reward-values"><span><b>+{checkinMilestone ? 50 : 20}</b><small>XP</small></span><span><b>+{checkinMilestone ? 30 : 10}</b><small>KOIN</small></span><span><b>{nextStreak}</b><small>STREAK</small></span></div>
            <button className="ba-reward-claim" onClick={onClaimDailyReward} disabled={dailyRewardClaimed}>{dailyRewardClaimed ? 'CHECKED IN TODAY' : 'CLAIM DAILY BONUS'}</button>
          </article>

          <article className="ba-quick-access ba-game-panel">
            <div className="ba-panel-kicker">TRAINING DECK</div>
            <h2>Upgrade your skills</h2>
            <button className="ba-quick-link" onClick={onOpenLearn}><span className="ba-quick-icon">▤</span><span><strong>Learning Materials</strong><small>Pelajari enam bab akademik</small></span><i>↗</i></button>
            <button className="ba-quick-link" onClick={onOpenVocabulary}><span className="ba-quick-icon">Aa</span><span><strong>Vocabulary Collection</strong><small>{vocabularyStats.seen} kata telah ditemukan</small></span><i>↗</i></button>
            <button className="ba-quick-link" onClick={onOpenProfile}><span className="ba-quick-icon">♙</span><span><strong>Agent Profile</strong><small>Lihat rank dan pencapaian</small></span><i>↗</i></button>
            <button className="ba-quick-link" onClick={onOpenData}><span className="ba-quick-icon">⚙</span><span><strong>Settings & Data</strong><small>Backup dan pemulihan progres</small></span><i>↗</i></button>
          </article>
        </section>

        <section className="ba-lobby-footer-stats">
          <div><span>MISSION CLEARED</span><strong>{completedCount} / 6</strong></div>
          <div><span>VOCABULARY MASTERED</span><strong>{vocabularyStats.mastered}</strong></div>
          <div><span>DETECTIVE XP</span><strong>{playerStats.xp.toLocaleString('id-ID')}</strong></div>
          <div><span>ACHIEVEMENTS</span><strong>{playerStats.unlockedAchievements} / {playerStats.achievements.length}</strong></div>
        </section>
      </div>
    </div>
  );
}
