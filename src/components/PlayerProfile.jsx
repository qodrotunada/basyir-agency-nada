import React from 'react';

function initials(user) {
  const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Agent';
  return name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'BA';
}

export default function PlayerProfile({ user, stats, onBack, onOpenMissions, onOpenVocabulary }) {
  const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Detektif Tamu';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const rewards = [
    { id: 'frame', title: 'Field Agent Frame', detail: 'Bingkai profil detektif', unlockLevel: 3, icon: '◈' },
    { id: 'background', title: 'Neon HQ Background', detail: 'Latar profil markas', unlockLevel: 6, icon: '▧' },
    { id: 'mascot-skin', title: 'Detective Wasp Skin', detail: 'Efek skin elite otomatis aktif di lobby', unlockLevel: 12, icon: '♧' },
    { id: 'badge', title: 'Master Investigator Badge', detail: 'Lencana investigasi', unlockLevel: 10, icon: '✦' },
    { id: 'victory', title: 'Victory Pulse Effect', detail: 'Efek kemenangan', unlockLevel: 18, icon: '⚡' }
  ];

  return (
    <div className="ba-profile page-enter">
      <div className="ba-screen-topline"><button className="ba-back-button" onClick={onBack}>← Kembali ke lobby</button><span className="ba-screen-kicker">AGENT DOSSIER / PLAYER PROFILE</span></div>
      <section className={`ba-profile-hero ba-game-panel ${stats.level >= 6 ? 'has-hq-background' : ''}`}>
        <div className={`ba-profile-avatar ${stats.level >= 3 ? 'has-agent-frame' : ''}` }>{avatarUrl ? <img src={avatarUrl} alt="Foto profil" /> : initials(user)}<span className="ba-avatar-status" /></div>
        <div className="ba-profile-identity"><span className="ba-panel-kicker">BASYIR AGENCY FIELD AGENT</span><h1>{name}</h1><p>{stats.rank} · Level {stats.level}</p><div className="ba-profile-xp"><div><span>Experience points</span><strong>{stats.xp.toLocaleString('id-ID')} / {(stats.level * 300).toLocaleString('id-ID')} XP</strong></div><div className="ba-progress"><span style={{ width: `${stats.levelProgress}%` }} /></div></div></div>
        <div className={`ba-profile-rank ${stats.level >= 10 ? 'has-master-badge' : ''}`}><span>RANK</span><strong>{String(stats.level).padStart(2, '0')}</strong><small>{stats.rank}</small></div>
      </section>

      <section className="ba-profile-metrics">
        <article className="ba-game-panel"><span>DETECTIVE XP</span><strong>{stats.xp.toLocaleString('id-ID')}</strong><small>Total pengalaman</small></article>
        <article className="ba-game-panel"><span>KOIN ILMU</span><strong>{stats.coins.toLocaleString('id-ID')}</strong><small>Reward aktivitas belajar</small></article>
        <article className="ba-game-panel"><span>BINTANG</span><strong>{stats.stars}</strong><small>Bintang misi dan reward</small></article>
        <article className="ba-game-panel"><span>LEARNING STREAK</span><strong>{stats.streakDays} <small>hari</small></strong><small>Check-in berurutan</small></article>
      </section>

      <section className="ba-profile-content-grid">
        <article className="ba-game-panel ba-achievement-panel">
          <div className="ba-section-title"><div><span className="ba-panel-kicker">MILESTONES</span><h2>Achievements</h2></div><span className="ba-achievement-count">{stats.unlockedAchievements}/{stats.achievements.length} UNLOCKED</span></div>
          <div className="ba-achievement-grid">
            {stats.achievements.map((achievement, index) => (
              <div className={`ba-achievement ${achievement.unlocked ? 'is-unlocked' : 'is-locked'}`} key={achievement.id}>
                <span className="ba-achievement-symbol">{achievement.unlocked ? ['✦', 'Aa', 'م', '★', '♨', '♛'][index] : '⌑'}</span>
                <strong>{achievement.title}</strong>
                <small>{achievement.detail}</small>
                <em>{achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="ba-game-panel ba-reward-collection">
          <div className="ba-section-title"><div><span className="ba-panel-kicker">UNLOCKABLE ITEMS</span><h2>Reward Collection</h2></div></div>
          <p>Item koleksi terbuka berdasarkan level yang dicapai melalui aktivitas pembelajaran.</p>
          {rewards.map((reward) => {
            const unlocked = stats.level >= reward.unlockLevel;
            return <div className={`ba-collection-row ${unlocked ? 'is-unlocked' : 'is-locked'}`} key={reward.id}>
              <span className="ba-collection-icon">{unlocked ? reward.icon : '⌑'}</span>
              <div><strong>{reward.title}</strong><small>{reward.detail}</small></div>
              <b>{unlocked ? 'OWNED' : `LV ${reward.unlockLevel}`}</b>
            </div>;
          })}
        </article>
      </section>

      <section className="ba-profile-bottom-grid">
        <article className="ba-game-panel">
          <span className="ba-panel-kicker">LEARNING RECORD</span><h2>Perkembangan belajar</h2>
          <div className="ba-profile-record"><span>Investigasi selesai</span><strong>{stats.completedMissions}/{stats.totalMissions}</strong></div>
          <div className="ba-profile-record"><span>Kosakata ditemukan</span><strong>{stats.seenWords}</strong></div>
          <div className="ba-profile-record"><span>Kosakata dikuasai</span><strong>{stats.masteredWords}</strong></div>
          <div className="ba-profile-record"><span>Achievement terbuka</span><strong>{stats.unlockedAchievements}</strong></div>
          <div className="ba-profile-actions"><button onClick={onOpenMissions}>Lihat misi ↗</button><button onClick={onOpenVocabulary}>Latihan mufrodat ↗</button></div>
        </article>
        <article className="ba-game-panel ba-recent-rewards">
          <span className="ba-panel-kicker">REWARD HISTORY</span><h2>Reward terbaru</h2>
          {stats.recentRewards.length ? stats.recentRewards.map((reward, index) => (
            <div className="ba-reward-history-row" key={`${reward.reason}-${reward.at}-${index}`}>
              <span>✦</span><div><strong>{reward.reason}</strong><small>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(reward.at))}</small></div><b>+{reward.xp} XP</b>
            </div>
          )) : <p className="ba-empty-rewards">Belum ada reward. Selesaikan misi atau klaim daily check-in untuk memulai koleksi XP.</p>}
        </article>
      </section>
    </div>
  );
}
