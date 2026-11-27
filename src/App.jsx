import AuthControls from './auth/AuthControls.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import GameLobby from './components/GameLobby.jsx';
import PlayerProfile from './components/PlayerProfile.jsx';
import GameAudioControls from './components/GameAudioControls.jsx';
import { supabase } from './lib/supabaseClient.js';
import { useAuth } from './auth/AuthContext.jsx';
import { fetchCloudProgress, saveCloudProgress, mergeCampaignProgress, mergeVocabularyProgress, mergeActiveSessions } from './services/progressSync.js';
import { fetchCloudGamification, loadLocalGamification, mergePlayerGamification, saveCloudGamification, saveLocalGamification } from './services/gamificationSync.js';
import { awardReward, claimDailyMissionReward, claimDailyReward, createInitialGamificationState, derivePlayerStats, recordDailyActivity, seedGamificationFromProgress, toLocalDateKey } from './engine/gamification.js';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ALL_EPISODE_IDS, CAMPAIGN_CONFIG, CASES_CONFIG, EPISODE_META, VOCABULARY_REGISTRY } from './data/campaign.js';
import { computeScore, getStars, masteryScore } from './engine/scoring.js';
import { gameReducer, createInitialState, validateSavedState, GAME_SCHEMA_VERSION } from './engine/game.js';
import { commitImport, createExportPayload, exportSessionFor, initialCampaignProgress, isEpisodeUnlocked, loadCampaign, loadSession, loadVocabularyProgress, resetSession, saveCampaign, saveSession, saveVocabularyProgress, sessionKey, validateImportPayload } from './engine/persistence.js';
import { getNextDictionaryPracticeBatch, recordVocabularyResponse, recordVocabularySeen, vocabularyStats } from './engine/vocabulary.js';
import { stopAudio } from './services/audioService.js';
import { initGameAudio, startGameMusic, stopGameMusic, playGameSound } from './services/gameAudio.js';
import ArabicText, { ArabicAudioButton } from './components/ArabicText.jsx';
import SceneArt from './components/SceneArt.jsx';
import LearningRoom from './components/LearningRoom.jsx';
import { arabicQuestion } from './engine/arabicAssessment.js';
import { DEDUCTION_CASES } from './data/deduction.js';

const formatDate = (value) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value)) : 'Belum selesai';
const isArabic = (value = '') => /[\u0600-\u06FF]/.test(value);
const modeLabels = { vocabulary: 'Kosakata', reading: 'Membaca', grammar: 'Tata bahasa' };
const statusLabels = { new: 'Belum dipelajari', learning: 'Sedang dipelajari', review: 'Perlu diulang', mastered: 'Dikuasai' };

function getRecoveryCopies() {
  const entries = [];
  try {
    for (const storageName of ['localStorage', 'sessionStorage']) {
      const storage = window[storageName];
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (key?.startsWith('basyir-agency:recovery:')) entries.push({ storage: storageName, key, raw: storage.getItem(key) });
      }
    }
  } catch { /* Browser storage may be disabled. */ }
  return entries;
}



const GUEST_MIGRATION_KEY = 'basyir-agency:guest:migrated-to-user';
const GUEST_SESSION_BACKUP_KEY = 'basyir-agency:guest:session-backup';

function getLocalSessionSnapshots() {
  const snapshots = {};
  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (!key?.startsWith('basyir-agency:') || !key.includes(':save:')) continue;
      try {
        const envelope = JSON.parse(window.sessionStorage.getItem(key) || 'null');
        if (!envelope?.caseId || !envelope?.state) continue;
        snapshots[envelope.caseId] = { caseId: envelope.caseId, key, envelope };
      } catch {
        // Snapshot yang rusak tidak ikut dimigrasikan.
      }
    }
  } catch {
    // Penyimpanan browser mungkin tidak tersedia.
  }
  return snapshots;
}

function clearLocalSessionSnapshots() {
  try {
    const keys = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith('basyir-agency:') && key.includes(':save:')) keys.push(key);
    }
    keys.forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Best effort. Cloud remains the authoritative account copy.
  }
}

function restoreSessionSnapshots(snapshots) {
  const restored = {};
  for (const [caseId, snapshot] of Object.entries(snapshots || {})) {
    try {
      const caseData = CASES_CONFIG[caseId];
      if (!caseData || !snapshot?.envelope) continue;
      const expectedKey = sessionKey(caseData);
      const envelope = snapshot.envelope;
      if (snapshot.key !== expectedKey) continue;
      if (envelope.schemaVersion !== GAME_SCHEMA_VERSION) continue;
      if (envelope.caseId !== caseId || envelope.contentVersion !== caseData.contentVersion) continue;
      const safeState = validateSavedState(envelope.state, caseData);
      const safeEnvelope = { ...envelope, state: safeState };
      window.sessionStorage.setItem(expectedKey, JSON.stringify(safeEnvelope));
      restored[caseId] = { caseId, key: expectedKey, envelope: safeEnvelope };
    } catch {
      // Snapshot dengan versi atau struktur yang tidak cocok dilewati.
    }
  }
  return restored;
}

function App() {
  const { user, loading: authLoading } = useAuth();
  const [cloudReady, setCloudReady] = useState(false);
  const [profileRole, setProfileRole] = useState(null);
  const [cloudOwnerId, setCloudOwnerId] = useState(null);
  const [cloudSessions, setCloudSessions] = useState({});
  const [screen, setScreen] = useState('lobby');
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [campaign, setCampaign] = useState(() => loadCampaign(ALL_EPISODE_IDS));
  const [vocabularyProgress, setVocabularyProgress] = useState(() => loadVocabularyProgress());
  const [gamification, setGamification] = useState(() => loadLocalGamification('guest'));
  const [gamificationCloudAvailable, setGamificationCloudAvailable] = useState(false);
  const [gamificationCloudReason, setGamificationCloudReason] = useState('local');
  const [notice, setNotice] = useState(null);
  const [activeSessionExport, setActiveSessionExport] = useState(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState('');
  const [dictionarySearch, setDictionarySearch] = useState('');
  const [showFullReset, setShowFullReset] = useState(false);
  const [viewZoom, setViewZoom] = useState(() => {
    try {
      const savedZoom = Number(window.localStorage.getItem('basyir-agency:view-zoom'));
      return Number.isFinite(savedZoom) && savedZoom >= 80 && savedZoom <= 125 && savedZoom % 5 === 0 ? savedZoom : 100;
    } catch {
      return 100;
    }
  });
  const fileInputRef = useRef(null);
  const gamificationOwnerRef = useRef('guest');

  useEffect(() => initGameAudio(), []);

  useEffect(() => {
    let cancelled = false;
    setProfileRole(null);
    if (authLoading || !user?.id) return undefined;

    const loadRole = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.warn('Peran pengguna belum dapat dibaca:', error.message);
        setProfileRole(null);
        return;
      }
      setProfileRole(data?.role ?? 'student');
    };

    loadRole();
    return () => { cancelled = true; };
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) saveCampaign(campaign);
  }, [campaign, user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) saveVocabularyProgress(vocabularyProgress);
  }, [vocabularyProgress, user, authLoading]);

  useEffect(() => {
    if (authLoading) return;
    if (!authLoading && !user && gamificationOwnerRef.current === 'guest') saveLocalGamification(gamification, 'guest');
    else if (user && cloudReady && cloudOwnerId === user.id && gamificationOwnerRef.current === user.id) saveLocalGamification(gamification, user.id);
  }, [gamification, user?.id, authLoading, cloudReady, cloudOwnerId]);
  useEffect(() => {
    if (authLoading) return undefined;

    let cancelled = false;

    const synchronize = async () => {
      if (!user) {
        gamificationOwnerRef.current = 'guest';
        setCloudReady(false);
        setCloudOwnerId(null);
        setCloudSessions({});
        setActiveSessionExport(null);
        setActiveCaseId(null);
        setScreen('lobby');
        setCampaign(loadCampaign(ALL_EPISODE_IDS));
        setVocabularyProgress(loadVocabularyProgress());
        setGamification(loadLocalGamification('guest'));
        setGamificationCloudAvailable(false);
        setGamificationCloudReason('local');
        clearLocalSessionSnapshots();
        try {
          const guestSnapshots = JSON.parse(
            window.localStorage.getItem(GUEST_SESSION_BACKUP_KEY) || '{}'
          );
          restoreSessionSnapshots(guestSnapshots);
        } catch {
          // Progres kampanye dan kamus tamu tetap tersedia meski backup sesi gagal.
        }
        return;
      }

      setCloudReady(false);
      setCloudOwnerId(null);
      setActiveCaseId(null);
      setActiveSessionExport(null);
      setScreen('lobby');

      // Ambil data tamu sebelum mengganti state tampilan ke data akun.
      const migrationOwner = window.localStorage.getItem(GUEST_MIGRATION_KEY);
      const importGuest = !migrationOwner || migrationOwner === user.id;
      const guestCampaign = importGuest
        ? loadCampaign(ALL_EPISODE_IDS)
        : initialCampaignProgress(ALL_EPISODE_IDS);
      const guestVocabulary = importGuest ? loadVocabularyProgress() : {};
      const guestSessions = importGuest ? getLocalSessionSnapshots() : {};
      const accountGamification = loadLocalGamification(user.id);
      const guestGamification = importGuest ? loadLocalGamification('guest') : createInitialGamificationState();
      gamificationOwnerRef.current = user.id;
      setGamification(accountGamification);

      setCampaign(initialCampaignProgress(ALL_EPISODE_IDS));
      setVocabularyProgress({});
      setCloudSessions({});
      clearLocalSessionSnapshots();

      try {
        const cloud = await fetchCloudProgress(
          user.id,
          ALL_EPISODE_IDS,
          Object.keys(VOCABULARY_REGISTRY)
        );
        let cloudGamification = { available: false, state: createInitialGamificationState(), reason: 'migration-required' };
        try {
          cloudGamification = await fetchCloudGamification(user.id);
        } catch (gamificationError) {
          console.warn('Sinkronisasi reward cloud belum tersedia:', gamificationError.message);
          cloudGamification = { available: false, state: createInitialGamificationState(), reason: 'cloud-error' };
        }
        if (cancelled) return;

        const mergedCampaign = mergeCampaignProgress(
          guestCampaign,
          cloud.campaignProgress,
          ALL_EPISODE_IDS
        );
        const mergedVocabulary = mergeVocabularyProgress(
          guestVocabulary,
          cloud.vocabularyProgress
        );
        const mergedSessions = mergeActiveSessions(
          guestSessions,
          cloud.activeSessions
        );
        const mergedGamification = seedGamificationFromProgress(
          mergePlayerGamification(guestGamification, accountGamification, cloudGamification.state),
          mergedCampaign,
          mergedVocabulary
        );

        // Backup sesi tamu tetap disimpan terpisah agar dapat dipulihkan saat logout.
        if (importGuest) {
          window.localStorage.setItem(
            GUEST_SESSION_BACKUP_KEY,
            JSON.stringify(guestSessions)
          );
        }

        const restoredSessions = restoreSessionSnapshots(mergedSessions);

        setCampaign(mergedCampaign);
        setVocabularyProgress(mergedVocabulary);
        setCloudSessions(restoredSessions);
        gamificationOwnerRef.current = user.id;
        setGamification(mergedGamification);
        saveLocalGamification(mergedGamification, user.id);
        setGamificationCloudAvailable(cloudGamification.available);
        setGamificationCloudReason(cloudGamification.reason ?? (cloudGamification.available ? 'synced' : 'migration-required'));

        await saveCloudProgress(user.id, {
          campaignProgress: mergedCampaign,
          vocabularyProgress: mergedVocabulary,
          activeSessions: restoredSessions
        });
        if (cloudGamification.available) {
          await saveCloudGamification(user.id, mergedGamification).catch((error) => {
            console.warn('Reward cloud belum berhasil disimpan:', error.message);
          });
        }
        if (cancelled) return;

        if (importGuest) {
          window.localStorage.setItem(GUEST_MIGRATION_KEY, user.id);
        }

        setCloudOwnerId(user.id);
        setCloudReady(true);
        setNotice({
          kind: 'success',
          message: 'Progres berhasil disinkronkan dengan akun.'
        });
      } catch (error) {
        console.error('Sinkronisasi BASYIR AGENCY gagal:', error);
        if (!cancelled) {
          setCloudReady(false);
          setCloudOwnerId(null);
          setGamificationCloudAvailable(false);
          setGamificationCloudReason('cloud-error');
          // Jika migrasi pertama gagal, tampilkan kembali progres tamu.
          // Data lokal tidak dihapus dan tidak ditandai sudah dimigrasikan.
          if (importGuest) {
            gamificationOwnerRef.current = 'guest';
            setCampaign(guestCampaign);
            setVocabularyProgress(guestVocabulary);
            setCloudSessions(restoreSessionSnapshots(guestSessions));
            setGamification(guestGamification);
          }
          setNotice({
            kind: 'warning',
            message: `Sinkronisasi cloud gagal. Progres lokal tetap dipertahankan: ${error?.message || 'Kesalahan tidak diketahui'}`
          });
        }
      }
    };

    synchronize();
    return () => { cancelled = true; };
  }, [authLoading, user?.id]);

  useEffect(() => {
    if (!user?.id || !cloudReady || cloudOwnerId !== user.id) return undefined;
    const timer = window.setTimeout(() => {
      saveCloudProgress(user.id, {
        campaignProgress: campaign,
        vocabularyProgress,
        activeSessions: cloudSessions
      }).catch((error) => {
        console.error('Gagal menyimpan progres cloud:', error);
        setNotice({
          kind: 'warning',
          message: 'Penyimpanan cloud gagal. Periksa koneksi internet lalu coba lagi.'
        });
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [user?.id, cloudReady, cloudOwnerId, campaign, vocabularyProgress, cloudSessions]);

  useEffect(() => {
    if (!user?.id || !cloudReady || cloudOwnerId !== user.id) return undefined;
    const timer = window.setTimeout(() => {
      saveCloudGamification(user.id, gamification).then((result) => {
        setGamificationCloudAvailable(result.available);
        setGamificationCloudReason(result.reason ?? (result.available ? 'synced' : 'migration-required'));
        if (result.state && JSON.stringify(result.state) !== JSON.stringify(gamification)) {
          setGamification(mergePlayerGamification(gamification, result.state));
        }
      }).catch((error) => {
        console.error('Gagal menyimpan reward cloud:', error);
        setGamificationCloudAvailable(false);
        setGamificationCloudReason('cloud-error');
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [user?.id, cloudReady, cloudOwnerId, gamification]);

  useEffect(() => {
    if (!user?.id || !cloudReady || cloudOwnerId !== user.id || !activeSessionExport) return;
    const snapshot = activeSessionExport;
    setCloudSessions((previous) => {
      const next = { ...previous };
      const state = snapshot.envelope?.state;
      const isCleanIntro = state?.phase === 'intro'
        && (state.foundEvidenceIds?.length ?? 0) === 0
        && (state.hintsUsed ?? 0) === 0;
      if (isCleanIntro) delete next[snapshot.caseId];
      else next[snapshot.caseId] = snapshot;
      return next;
    });
  }, [activeSessionExport, user?.id, cloudReady, cloudOwnerId]);

  useEffect(() => {
    document.documentElement.style.zoom = `${viewZoom}%`;
    try { window.localStorage.setItem('basyir-agency:view-zoom', String(viewZoom)); } catch { /* Zoom remains active for this session. */ }
  }, [viewZoom]);
  const changeViewZoom = (amount) => setViewZoom((current) => Math.min(125, Math.max(80, current + amount)));
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 4800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const handleAudioStatus = (event) => {
      if (event.detail?.message) setNotice({ kind: event.detail.kind || 'warning', message: event.detail.message });
    };
    window.addEventListener('basyir-audio-status', handleAudioStatus);
    return () => window.removeEventListener('basyir-audio-status', handleAudioStatus);
  }, []);

  const stats = useMemo(() => vocabularyStats(vocabularyProgress, VOCABULARY_REGISTRY), [vocabularyProgress]);
  const playerStats = useMemo(() => derivePlayerStats(gamification, campaign, stats), [gamification, campaign, stats]);
  const completedChapterIds = useMemo(() => Object.keys(gamification.rewardLedger ?? {}).filter((eventId) => eventId.startsWith('learning-complete:')).map((eventId) => eventId.replace('learning-complete:', '')), [gamification]);
  const nextEpisode = useMemo(() => EPISODE_META.find((item) => isEpisodeUnlocked(CASES_CONFIG[item.id], ALL_EPISODE_IDS, campaign) && !campaign.episodes[item.id]?.caseCompleted)
    ?? EPISODE_META.find((item) => isEpisodeUnlocked(CASES_CONFIG[item.id], ALL_EPISODE_IDS, campaign))
    ?? EPISODE_META[0], [campaign]);
  const unlockedCount = useMemo(() => EPISODE_META.filter((item) => isEpisodeUnlocked(CASES_CONFIG[item.id], ALL_EPISODE_IDS, campaign)).length, [campaign]);
  const completedCount = useMemo(() => EPISODE_META.filter((item) => campaign.episodes[item.id]?.caseCompleted).length, [campaign]);
  const recoveryCount = getRecoveryCopies().length;

  const openEpisode = (id) => {
    const caseData = CASES_CONFIG[id];
    if (!isEpisodeUnlocked(caseData, ALL_EPISODE_IDS, campaign)) {
      setNotice({ kind: 'warning', message: 'Episode masih terkunci. Selesaikan kasus sebelumnya dan capai mastery minimal 70/100.' });
      return;
    }
    stopGameMusic();
    stopAudio();
    startGameMusic();
    setActiveCaseId(id);
    setScreen('game');
    setActiveSessionExport(null);
  };

  const recordAttempt = useCallback((id) => {
    setCampaign((previous) => ({
      ...previous,
      episodes: {
        ...previous.episodes,
        [id]: { ...previous.episodes[id], attemptCount: (previous.episodes[id]?.attemptCount ?? 0) + 1 }
      }
    }));
  }, []);

  const recordCaseCompletion = useCallback((id, score, stars) => {
    const now = new Date().toISOString();
    const dateKey = toLocalDateKey(now);
    setCampaign((previous) => {
      const old = previous.episodes[id] ?? initialCampaignProgress(ALL_EPISODE_IDS).episodes[id];
      const bestScore = Math.max(old.bestScore ?? 0, score);
      return {
        ...previous,
        episodes: {
          ...previous.episodes,
          [id]: {
            ...old,
            caseCompleted: true,
            latestScore: score,
            bestScore,
            starsEarned: getStars(bestScore, true),
            completedAt: now
          }
        }
      };
    });
    setGamification((previous) => {
      let next = awardReward(previous, { eventId: `case-complete:${id}`, xp: 120, coins: 50, reason: `Investigasi selesai · ${id}`, at: now });
      next = recordDailyActivity(next, { id: `case-complete:${id}:${dateKey}`, type: 'case-complete', at: now });
      return next;
    });
  }, []);

  const recordMastery = useCallback((id, score) => {
    const now = new Date().toISOString();
    setCampaign((previous) => {
      const old = previous.episodes[id];
      return {
        ...previous,
        episodes: {
          ...previous.episodes,
          [id]: {
            ...old,
            latestMasteryScore: score,
            bestMasteryScore: Math.max(old.bestMasteryScore ?? 0, score)
          }
        }
      };
    });
    if (score >= 70) {
      setGamification((previous) => awardReward(previous, { eventId: `mastery-passed:${id}`, xp: 80, coins: 25, reason: `Checkpoint mastery lulus · ${id}`, at: now }));
    }
    const nextIndex = ALL_EPISODE_IDS.indexOf(id) + 1;
    if (score >= 70 && nextIndex < ALL_EPISODE_IDS.length) {
      setNotice({ kind: 'success', message: 'Checkpoint selesai. Progres penguasaan terbaik diperbarui, dan episode berikutnya dapat terbuka jika kasus ini juga sudah selesai.' });
    } else if (score < 70) {
      setNotice({ kind: 'info', message: 'Mastery masih di bawah 70. Ulangi checkpoint untuk latihan terarah. Kasus tidak perlu dimainkan dari awal.' });
    }
  }, []);

  const recordVocabSeen = useCallback((vocabId, episodeId) => {
    setVocabularyProgress((previous) => recordVocabularySeen(previous, vocabId, episodeId));
  }, []);

  const recordVocabResponse = useCallback((vocabId, episodeId, correct, mode) => {
    const now = new Date().toISOString();
    const dateKey = toLocalDateKey(now);
    const currentRow = vocabularyProgress[vocabId] ?? {};
    const nextRow = recordVocabularyResponse({ [vocabId]: currentRow }, vocabId, episodeId, correct, mode)[vocabId];
    setVocabularyProgress((previous) => recordVocabularyResponse(previous, vocabId, episodeId, correct, mode));
    setGamification((current) => {
      let updated = recordDailyActivity(current, { id: `vocab-practice:${vocabId}:${dateKey}`, type: 'vocab-practice', at: now });
      if (correct && (currentRow.correctCount ?? 0) < 1) {
        updated = awardReward(updated, { eventId: `vocabulary-first-correct:${vocabId}`, xp: 5, reason: `Jawaban benar pertama · ${vocabId}`, at: now });
      }
      if (currentRow.masteryStatus !== 'mastered' && nextRow.masteryStatus === 'mastered') {
        updated = awardReward(updated, { eventId: `vocabulary-mastered:${vocabId}`, xp: 15, coins: 5, reason: `Mufrodat dikuasai · ${vocabId}`, at: now });
        updated = recordDailyActivity(updated, { id: `vocab-mastered:${vocabId}:${dateKey}`, type: 'vocab-mastered', at: now });
      }
      return updated;
    });
  }, [vocabularyProgress]);

  const recordLearningCompletion = (chapterId) => {
    const now = new Date().toISOString();
    setGamification((previous) => awardReward(previous, { eventId: `learning-complete:${chapterId}`, xp: 40, coins: 10, reason: `Materi bab diselesaikan · ${chapterId}`, at: now }));
    setNotice({ kind: 'success', message: 'Materi bab selesai. +40 XP dan +10 Koin Ilmu.' });
  };

  const handleClaimDailyReward = () => {
    const result = claimDailyReward(gamification);
    if (!result.claimed) {
      setNotice({ kind: 'info', message: 'Daily reward hari ini sudah diklaim.' });
      return;
    }
    setGamification(result.state);
    const milestone = result.streak > 0 && result.streak % 7 === 0;
    setNotice({ kind: 'success', message: `Daily reward berhasil diklaim: +${milestone ? 50 : 20} XP, +${milestone ? 30 : 10} Koin Ilmu${milestone ? ', +1 bintang' : ''}. Streak ${result.streak} hari.` });
  };

  const handleClaimDailyMission = () => {
    const result = claimDailyMissionReward(gamification);
    if (!result.claimed) {
      setNotice({ kind: 'info', message: 'Selesaikan semua daily mission terlebih dahulu atau reward hari ini sudah diklaim.' });
      return;
    }
    setGamification(result.state);
    setNotice({ kind: 'success', message: 'Daily mission selesai! +60 XP, +30 Koin Ilmu, dan +1 bintang.' });
  };

  const handleExportRecovery = () => {
    const copies = getRecoveryCopies();
    if (!copies.length) { setNotice({ kind: 'info', message: 'Tidak ada salinan pemulihan yang ditemukan.' }); return; }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), recoveryCopies: copies }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `basyir-agency-recovery-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    setNotice({ kind: 'success', message: 'Salinan pemulihan diekspor. Simpan file ini sebelum melakukan reset penuh.' });
  };

  const handleExport = () => {
    let activeSession = activeSessionExport;
    const payload = createExportPayload(campaign, vocabularyProgress, activeSession, gamification);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `basyir-agency-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setNotice({ kind: 'success', message: 'File backup JSON disiapkan. Simpan di tempat yang aman.' });
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImportError('');
    try {
      const payload = JSON.parse(await file.text());
      const imported = validateImportPayload(payload, ALL_EPISODE_IDS, new Set(Object.keys(VOCABULARY_REGISTRY)));
      if (imported.activeSession) {
        const caseData = CASES_CONFIG[imported.activeSession.caseId];
        if (!caseData || imported.activeSession.envelope.schemaVersion !== 1 || imported.activeSession.envelope.contentVersion !== caseData.contentVersion) {
          throw new Error('Snapshot sesi memiliki versi yang tidak cocok. Progres aktif tidak diubah.');
        }
        validateSavedState(imported.activeSession.envelope.state, caseData);
        if (typeof imported.activeSession.key !== 'string' || imported.activeSession.key !== sessionKey(caseData)) {
          throw new Error('Kunci snapshot sesi tidak valid.');
        }
      }
      setPendingImport({ imported, fileName: file.name });
    } catch (error) {
      setImportError(error?.message ?? 'Berkas tidak dapat dibaca.');
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    try {
      commitImport(pendingImport.imported, campaign, vocabularyProgress, gamification);
      setCampaign(pendingImport.imported.campaignProgress);
      setVocabularyProgress(pendingImport.imported.vocabularyProgress);
      if (pendingImport.imported.gamificationState) {
        setGamification(pendingImport.imported.gamificationState);
        if (user?.id) saveLocalGamification(pendingImport.imported.gamificationState, user.id);
        else saveLocalGamification(pendingImport.imported.gamificationState, 'guest');
      }
      setPendingImport(null);
      setActiveCaseId(null);
      setActiveSessionExport(null);
      setScreen('lobby');
      setNotice({ kind: 'success', message: 'Impor berhasil. Progres lama telah dicadangkan sebelum data diganti.' });
    } catch (error) {
      setImportError(error?.message ?? 'Impor gagal. Progres aktif dipertahankan.');
      setPendingImport(null);
    }
  };

  const resetCampaignOnly = () => {
    if (!window.confirm('Reset seluruh hasil kampanye? Kamus Detektif tetap dipertahankan.')) return;
    setCampaign(initialCampaignProgress(ALL_EPISODE_IDS));
    setActiveCaseId(null);
    setScreen('lobby');
    setNotice({ kind: 'info', message: 'Hasil kampanye direset. Progres Kamus Detektif tetap tersimpan.' });
  };

  const resetDictionaryOnly = () => {
    if (!window.confirm('Reset seluruh progres Kamus Detektif? Hasil episode tidak akan dihapus.')) return;
    setVocabularyProgress({});
    setNotice({ kind: 'info', message: 'Progres kamus direset. Hasil kampanye tetap tersimpan.' });
  };

  const resetEverything = () => {
    try {
      Object.keys(localStorage).filter((key) => key.startsWith('basyir-agency:')).forEach((key) => localStorage.removeItem(key));
      Object.keys(sessionStorage).filter((key) => key.startsWith('basyir-agency:')).forEach((key) => sessionStorage.removeItem(key));
    } catch { /* State will still reset in memory. */ }
    setCampaign(initialCampaignProgress(ALL_EPISODE_IDS));
    setVocabularyProgress({});
    setGamification(createInitialGamificationState());
    if (user?.id) saveLocalGamification(createInitialGamificationState(), user.id);
    else saveLocalGamification(createInitialGamificationState(), 'guest');
    setActiveCaseId(null);
    setActiveSessionExport(null);
    setScreen('lobby');
    setShowFullReset(false);
    setNotice({ kind: 'info', message: 'Reset penuh selesai. Semua progres lokal dihapus. Gunakan ekspor JSON sebelum reset jika ingin menyimpan cadangan.' });
  };

  const nav = (next) => {
    if (next !== 'dictionary') stopGameMusic();
    stopAudio();
    if (next === 'dictionary') startGameMusic();
    setScreen(next);
    setActiveCaseId(null);
    setPendingImport(null);
  };

  const bottomNavItems = [
    { id: 'lobby', label: 'LOBBY', symbol: '⌂' },
    { id: 'campaign', label: 'MISSION', symbol: '◎' },
    { id: 'materials', label: 'LEARN', symbol: '▤' },
    { id: 'dictionary', label: 'VOCABULARY', symbol: 'Aa' },
    { id: 'profile', label: 'PROFILE', symbol: '♙' }
  ];

  return (
    <div className="app-root ba-app-root">
      <Header screen={screen} onNavigate={nav} onExport={handleExport} onOpenData={() => nav('data')} isAdmin={profileRole === 'admin'} playerStats={playerStats} user={user} />
      {notice && <div className={`toast toast-${notice.kind}`} role="status"><span>{notice.kind === 'success' ? '✓' : notice.kind === 'warning' ? '!' : 'i'}</span>{notice.message}<button className="toast-close" onClick={() => setNotice(null)} aria-label="Tutup pemberitahuan">×</button></div>}
      <main id="main-content" className={`main-shell ba-main-shell ${screen === 'lobby' ? 'is-lobby' : ''}`}>
        {screen === 'lobby' && <GameLobby user={user} playerStats={playerStats} unlockedCount={unlockedCount} completedCount={completedCount} vocabularyStats={stats} nextEpisode={nextEpisode} dailyMissions={playerStats.dailyMissions} dailyRewardClaimed={playerStats.dailyRewardClaimed} dailyMissionClaimed={playerStats.dailyMissionClaimed} onPlay={() => openEpisode(nextEpisode.id)} onContinue={() => openEpisode(nextEpisode.id)} onOpenMissions={() => nav('campaign')} onOpenLearn={() => nav('materials')} onOpenVocabulary={() => nav('dictionary')} onClaimDailyReward={handleClaimDailyReward} onClaimDailyMission={handleClaimDailyMission} onOpenProfile={() => nav('profile')} onOpenData={() => nav('data')} />}
        {screen === 'campaign' && <CampaignScreen campaign={campaign} unlockedCount={unlockedCount} completedCount={completedCount} vocabularyStats={stats} onOpenEpisode={openEpisode} onGoDictionary={() => nav('dictionary')} onGoData={() => nav('data')} onGoMaterials={() => nav('materials')} />}
        {screen === 'materials' && <LearningRoom onBack={() => nav('lobby')} onCompleteChapter={recordLearningCompletion} onOpenMission={openEpisode} completedChapterIds={completedChapterIds} vocabularyProgress={vocabularyProgress} />}
        {screen === 'game' && activeCaseId && <GameView key={activeCaseId} caseData={CASES_CONFIG[activeCaseId]} campaign={campaign} playerStats={playerStats} onBack={() => nav('lobby')} hasNextMission={Boolean(ALL_EPISODE_IDS[ALL_EPISODE_IDS.indexOf(activeCaseId) + 1] && isEpisodeUnlocked(CASES_CONFIG[ALL_EPISODE_IDS[ALL_EPISODE_IDS.indexOf(activeCaseId) + 1]], ALL_EPISODE_IDS, campaign))} onNextMission={() => { const nextId = ALL_EPISODE_IDS[ALL_EPISODE_IDS.indexOf(activeCaseId) + 1]; if (nextId && isEpisodeUnlocked(CASES_CONFIG[nextId], ALL_EPISODE_IDS, campaign)) openEpisode(nextId); else nav('lobby'); }} onAttempt={recordAttempt} onCaseComplete={recordCaseCompletion} onMasteryComplete={recordMastery} onVocabularySeen={recordVocabSeen} onVocabularyResponse={recordVocabResponse} onSessionChange={setActiveSessionExport} onNotice={setNotice} />}
        {screen === 'dictionary' && <DictionaryScreen progress={vocabularyProgress} search={dictionarySearch} setSearch={setDictionarySearch} onBack={() => nav('lobby')} onSeen={recordVocabSeen} onResponse={recordVocabResponse} />}
        {screen === 'profile' && <PlayerProfile user={user} stats={playerStats} onBack={() => nav('lobby')} onOpenMissions={() => nav('campaign')} onOpenVocabulary={() => nav('dictionary')} />}
        {screen === 'data' && <DataScreen campaign={campaign} vocabularyStats={stats} recoveryCount={recoveryCount} cloudEnabled={Boolean(user)} cloudReady={cloudReady && cloudOwnerId === user?.id} gamificationCloudAvailable={gamificationCloudAvailable} gamificationCloudReason={gamificationCloudReason} onBack={() => nav('lobby')} onExport={handleExport} onExportRecovery={handleExportRecovery} onChooseImport={() => fileInputRef.current?.click()} onResetCampaign={resetCampaignOnly} onResetDictionary={resetDictionaryOnly} onResetFull={() => setShowFullReset(true)} importError={importError} />}
        {screen === 'admin' && user && profileRole === 'admin' && <AdminDashboard user={user} onBack={() => nav('lobby')} />}
      </main>
      {screen !== 'game' && <nav className="ba-bottom-nav" aria-label="Navigasi utama">{bottomNavItems.map((item) => <button key={item.id} className={screen === item.id ? 'is-active' : ''} onClick={() => nav(item.id)} aria-current={screen === item.id ? 'page' : undefined}><span>{item.symbol}</span><small>{item.label}</small></button>)}{profileRole === 'admin' && <button className={screen === 'admin' ? 'is-active' : ''} onClick={() => nav('admin')}><span>⌑</span><small>ADMIN</small></button>}</nav>}
      <input ref={fileInputRef} type="file" accept="application/json,.json" className="visually-hidden" onChange={handleFile} />
      {pendingImport && createPortal(<div className="modal-backdrop" role="presentation"><section className="modal-card import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title"><div className="modal-eyebrow">Pemulihan data</div><h2 id="import-title">Konfirmasi impor backup</h2><p>File <strong>{pendingImport.fileName}</strong> lolos pemeriksaan struktur. Impor akan mengganti hasil kampanye dan progres kamus. Reward ikut diganti jika file memiliki gamification state.</p><div className="import-summary"><div><strong>{Object.values(pendingImport.imported.campaignProgress.episodes).filter((row) => row.caseCompleted).length}</strong><span>kasus selesai</span></div><div><strong>{Object.keys(pendingImport.imported.vocabularyProgress).length}</strong><span>entri kamus</span></div><div><strong>{pendingImport.imported.activeSession ? 'Ada' : 'Tidak'}</strong><span>sesi aktif</span></div><div><strong>{Object.keys(pendingImport.imported.gamificationState?.rewardLedger ?? {}).length}</strong><span>event reward</span></div></div><p className="muted small">Sistem akan membuat backup progres aktif sebelum menggantinya. Penggabungan data tidak tersedia pada versi ini.</p><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setPendingImport(null)}>Batal</button><button className="btn btn-primary" onClick={confirmImport}>Buat backup dan impor</button></div></section></div>, document.body)}
      {showFullReset && createPortal(<div className="modal-backdrop" role="presentation"><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="reset-title"><div className="modal-eyebrow danger-text">Tindakan permanen</div><h2 id="reset-title">Reset seluruh data lokal?</h2><p>Hasil kampanye, progres kamus, reward, dan snapshot sesi akan dihapus. Aplikasi akan mencoba membuat salinan lokal sebelum reset. Untuk cadangan yang lebih aman, ekspor JSON terlebih dahulu.</p><div className="modal-actions"><button className="btn btn-secondary" onClick={() => setShowFullReset(false)}>Batalkan</button><button className="btn btn-danger" onClick={resetEverything}>Ya, reset penuh</button></div></section></div>, document.body)}
      {screen !== 'lobby' && screen !== 'game' && <Footer />}
      <GameAudioControls />
      <div className="view-zoom-controls" role="group" aria-label="Kontrol pembesaran tampilan">
        <button type="button" onClick={() => changeViewZoom(-5)} disabled={viewZoom <= 80} aria-label="Perkecil tampilan" title="Perkecil tampilan">−</button>
        <output aria-live="polite" aria-label={`Pembesaran ${viewZoom} persen`}>{viewZoom}%</output>
        <button type="button" onClick={() => changeViewZoom(5)} disabled={viewZoom >= 125} aria-label="Perbesar tampilan" title="Perbesar tampilan">+</button>
        <button type="button" className="zoom-reset" onClick={() => setViewZoom(100)} disabled={viewZoom === 100} title="Kembalikan ke 100 persen">Reset</button>
      </div>
    </div>
  );
}

function Header({ screen, onNavigate, onExport, onOpenData, isAdmin = false, playerStats, user }) {
  const agentName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Guest Agent';
  const avatarInitials = agentName.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'BA';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const hasDailyNotice = !playerStats?.dailyRewardClaimed || (playerStats?.dailyMissions?.every((mission) => mission.done) && !playerStats?.dailyMissionClaimed);
  return (
    <header className="ba-topbar">
      <button className="ba-brand" onClick={() => onNavigate('lobby')} aria-label="Kembali ke lobby BASYIR AGENCY">
        <span className="ba-brand-emblem"><img src="/assets/basyir-agency-emblem.png" alt="" /></span>
        <span><strong>BASYIR <em>AGENCY</em></strong><small>ARABIC LEARNING BATTLE ACADEMY</small></span>
      </button>
      <div className="ba-player-hud">
        <div className="ba-player-avatar">{avatarUrl ? <img src={avatarUrl} alt="Foto profil" /> : avatarInitials}</div>
        <div className="ba-player-hud-copy"><div><strong>LV {playerStats?.level ?? 1} · {playerStats?.rank ?? 'Beginner Detective'}</strong><span>{agentName}</span></div><div className="ba-hud-xp"><span style={{ width: `${playerStats?.levelProgress ?? 0}%` }} /></div><small>{(playerStats?.xpInLevel ?? 0).toLocaleString('id-ID')} / 300 XP</small></div>
      </div>
      <div className="ba-currency-hud"><div className="ba-currency ba-coin"><span>◉</span><strong>{(playerStats?.coins ?? 0).toLocaleString('id-ID')}</strong></div><div className="ba-currency ba-star"><span>✦</span><strong>{playerStats?.stars ?? 0}</strong></div><button className="ba-icon-button ba-notification-button" onClick={() => onNavigate('lobby')} aria-label="Buka misi harian" title="Misi harian">♧{hasDailyNotice && <i className="ba-notification-dot" />}</button><button className="ba-icon-button" onClick={onOpenData} aria-label="Buka pengaturan" title="Pengaturan">⚙</button><AuthControls /></div>
    </header>
  );
}

function CampaignScreen({ campaign, unlockedCount, completedCount, vocabularyStats: vStats, onOpenEpisode, onGoDictionary, onGoData, onGoMaterials }) {
  const totalBestScore = EPISODE_META.reduce((sum, item) => sum + (campaign.episodes[item.id]?.bestScore ?? 0), 0);
  const bestMastery = Math.max(0, ...EPISODE_META.map((item) => campaign.episodes[item.id]?.bestMasteryScore ?? 0));
  return <div className="campaign-screen page-enter">
    <section className="hero-panel">
      <div className="hero-text">
        <div className="eyebrow"><span className="eyebrow-dot" /> KAMPANYE INVESTIGASI BAHASA ARAB</div>
        <h1>Setiap kata menyimpan <span>petunjuk.</span></h1>
        <p>Masuk ke ruang kasus, kumpulkan bukti, baca petunjuk berbahasa Arab, dan susun kembali cerita yang tersembunyi.</p>
        <div className="hero-actions"><button className="btn btn-primary btn-large" onClick={() => onOpenEpisode('ch01-shopping')}>Mulai investigasi <span>↗</span></button><button className="btn btn-ghost" onClick={onGoMaterials}>Baca Materi Bab</button><button className="btn btn-ghost" onClick={onGoDictionary}>Buka Kamus Detektif</button></div>
        <div className="hero-footnote"><span className="mini-shield">✦</span> Enam bab. Satu jejak bulan sabit. Banyak kata untuk ditemukan.</div>
      </div>
      <div className="hero-art" aria-label="Identitas Basyir Agency dan ilustrasi investigasi">
        <img className="hero-brand-logo" src="/assets/basyir-agency-logo.jpg" alt="Basyir Agency — Arabic Learning Battle Academy" />
        <div className="hero-art-grid" />
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="hero-folder"><div className="folder-tab" /><div className="folder-label">CASE FILE <strong>06 / 06</strong></div><div className="folder-stamp">CLASSIFIED</div><div className="folder-lines"><i /><i /><i /></div><div className="folder-crescent">☾</div></div>
        <div className="hero-pin pin-a"><ArabicText text="مِفْتَاحٌ" /></div><div className="hero-pin pin-b"><ArabicText text="رِسَالَةٌ" /></div><div className="hero-pin pin-c"><ArabicText text="سِجِلٌّ" /></div>
        <div className="hero-note note-a"><span>CASE NOTE</span><strong>Compare the clues.</strong><small>05 pieces of evidence</small></div>
        <div className="hero-note note-b"><span>LEAD FOUND</span><strong>☾ Crescent mark</strong><small>Follow the transfer record</small></div>
      </div>
    </section>

    <section className="stat-row" aria-label="Ringkasan progres">
      <StatCard icon="◈" label="Kasus selesai" value={`${completedCount}/${EPISODE_META.length}`} detail="Penyelesaian investigasi" />
      <StatCard icon="✦" label="Episode terbuka" value={`${unlockedCount}/${EPISODE_META.length}`} detail="Berdasarkan mastery" />
      <StatCard icon="▤" label="Kosakata ditemui" value={`${vStats.seen}/${vStats.total}`} detail={`${vStats.mastered} kata dikuasai`} />
      <StatCard icon="◎" label="Skor terbaik" value={totalBestScore.toLocaleString('id-ID')} detail={`Mastery tertinggi ${bestMastery}/100`} />
    </section>

    <section className="section-heading"><div><div className="eyebrow">THE CASE FILES</div><h2>Pilih kasus berikutnya</h2><p>Episode terbuka mengikuti hasil investigasi dan checkpoint Bahasa Arab.</p></div><button className="text-link" onClick={onGoData}>Kelola progres <span>↗</span></button></section>
    <div className="episode-grid">{EPISODE_META.map((meta, index) => {
      const caseData = CASES_CONFIG[meta.id];
      const progress = campaign.episodes[meta.id];
      const unlocked = isEpisodeUnlocked(caseData, ALL_EPISODE_IDS, campaign);
      const completed = progress?.caseCompleted;
      const percent = progress?.bestMasteryScore ?? 0;
      return <article key={meta.id} className={`episode-card accent-${meta.accent} ${!unlocked ? 'episode-locked' : ''}`}>
        <div className="episode-card-top"><span className="episode-number">EPISODE {meta.label}</span><span className={`episode-status ${completed ? 'status-complete' : unlocked ? 'status-open' : 'status-locked'}`}>{completed ? '✓ Selesai' : unlocked ? 'Terbuka' : 'Terkunci'}</span></div>
        <div className="episode-art-mini"><div className="mini-art-glow" /><div className="mini-art-icon">{unlocked ? meta.icon : '🔒'}</div><div className="mini-art-location">{meta.location}</div><span className="mini-art-index">{meta.label}</span></div>
        <div className="episode-card-body"><div className="episode-academic-title"><span lang="ar" dir="rtl">{meta.titleArabic}</span><h3>{meta.title}</h3><small>Kasus: {meta.caseTitle}</small></div><p>{caseData.caseInfo.description}</p><div className="episode-meta"><span><i /> {caseData.curriculum.level}</span><span>{caseData.evidence.length} bukti</span></div>
          <div className="episode-progress-label"><span>Mastery terbaik</span><strong>{percent}/100</strong></div><div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
          <div className="episode-card-bottom"><div className="episode-score"><span>Skor terbaik</span><strong>{(progress?.bestScore ?? 0).toLocaleString('id-ID')} <small>/ 1.000</small></strong></div><button className={`icon-action ${unlocked ? '' : 'disabled'}`} onClick={() => onOpenEpisode(meta.id)} aria-label={`${unlocked ? 'Buka' : 'Episode terkunci'} ${meta.title}`} disabled={!unlocked}>{unlocked ? '↗' : '⌑'}</button></div>
        </div>
      </article>;
    })}</div>
    <section className="learning-note"><div className="note-icon">✦</div><div><strong>Catatan pembelajaran</strong><p>Materi Bahasa Arab pada versi ini masih berstatus draf implementasi. Harakat, transliterasi, struktur, dan rekaman perlu mendapat validasi guru atau penutur sebelum digunakan sebagai asesmen resmi.</p></div><button onClick={onGoDictionary} className="note-link">Latihan kosakata ↗</button></section>
  </div>;
}

function StatCard({ icon, label, value, detail }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

function DetectiveMascot({ className = '' }) {
  return <img className={`detective-mascot ${className}`.trim()} src="/assets/detective-mascot.svg" alt="Ilustrasi maskot detektif Basyir Agency" loading="lazy" />;
}

function getSpeakerStatement(chapterId, speakerId) {
  return DEDUCTION_CASES[chapterId]?.suspects?.[speakerId] ?? null;
}

function GameView({ caseData, campaign, playerStats, onBack, hasNextMission, onNextMission, onAttempt, onCaseComplete, onMasteryComplete, onVocabularySeen, onVocabularyResponse, onSessionChange, onNotice }) {
  const [hydrated] = useState(() => loadSession(caseData));
  const reducer = useCallback((state, action) => gameReducer(state, action, caseData), [caseData]);
  const [state, dispatch] = useReducer(reducer, hydrated.state);
  const [storageStatus, setStorageStatus] = useState(hydrated.status);
  const recoveryBlocked = useRef(hydrated.blocked);
  const completionRecorded = useRef(false);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const overlayDialogRef = useRef(null);
  const overlayTriggerRef = useRef(null);
  const [gameView, setGameView] = useState('game');
  const [masteryResult, setMasteryResult] = useState(null);
  const [showChronologyTranslation, setShowChronologyTranslation] = useState(false);
  const score = useMemo(() => computeScore(state, caseData.evidence.length), [state, caseData.evidence.length]);
  const stars = getStars(score.total, state.phase === 'case_solved');
  const foundCount = state.foundEvidenceIds.length;
  const activeEvidence = activeOverlay?.type === 'evidence' ? caseData.evidence.find((item) => item.id === activeOverlay.id) : null;
  const selectedSuspect = caseData.suspects.find((item) => item.id === state.selectedSuspectId);
  const episodeProgress = campaign.episodes[caseData.caseInfo.id];
  const chapterMeta = EPISODE_META.find((item) => item.id === caseData.caseInfo.id) ?? EPISODE_META[0];
  const deduction = DEDUCTION_CASES[caseData.caseInfo.id];
  const lastSoundFeedbackSeq = useRef(state.feedbackSeq ?? 0);

  useEffect(() => { setShowChronologyTranslation(false); }, [caseData.caseInfo.id]);

  useEffect(() => {
    const sequence = state.feedbackSeq ?? 0;
    if (sequence <= lastSoundFeedbackSeq.current) return;
    lastSoundFeedbackSeq.current = sequence;
    if (!state.feedback) return;
    if (state.phase === 'case_solved') playGameSound('victory');
    else if (state.feedback.kind === 'success') playGameSound('correct');
    else if (state.feedback.kind === 'warning') playGameSound('wrong');
  }, [state.feedbackSeq, state.feedback, state.phase]);

  useEffect(() => {
    if (!recoveryBlocked.current) {
      const result = saveSession(state, caseData, false);
      setStorageStatus(result.status);
    }
    onSessionChange(exportSessionFor(caseData, state));
  }, [state, caseData, onSessionChange]);

  useEffect(() => {
    if (state.phase === 'case_solved' && !completionRecorded.current) {
      completionRecorded.current = true;
      onCaseComplete(caseData.caseInfo.id, score.total, stars);
    }
  }, [state.phase, score.total, stars, caseData.caseInfo.id, onCaseComplete]);

  useEffect(() => {
    if (!state.hintTargetId) return undefined;
    const timer = window.setTimeout(() => dispatch({ type: 'CLEAR_HINT' }), 3000);
    return () => window.clearTimeout(timer);
  }, [state.hintTargetId]);

  useEffect(() => {
    if (!state.hintCooldownActive) return undefined;
    const timer = window.setTimeout(() => dispatch({ type: 'HINT_COOLDOWN_END' }), 5000);
    return () => window.clearTimeout(timer);
  }, [state.hintCooldownActive]);

  useEffect(() => {
    if (!activeOverlay) {
      if (overlayTriggerRef.current?.isConnected) overlayTriggerRef.current.focus();
      return undefined;
    }
    const dialog = overlayDialogRef.current;
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = dialog ? [...dialog.querySelectorAll(focusableSelector)] : [];
    (focusables[0] ?? dialog)?.focus?.();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); setActiveOverlay(null); return; }
      if (event.key !== 'Tab' || !dialog) return;
      const items = [...dialog.querySelectorAll(focusableSelector)];
      if (!items.length) { event.preventDefault(); dialog.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeOverlay]);

  const openOverlay = (payload) => { overlayTriggerRef.current = document.activeElement; setActiveOverlay(payload); };
  const openEvidence = (item) => {
    openOverlay({ type: 'evidence', id: item.id });
    onVocabularySeen(item.vocabularyId, caseData.caseInfo.id);
  };
  const findEvidence = () => {
    if (!activeEvidence) return;
    dispatch({ type: 'FIND_EVIDENCE', id: activeEvidence.id });
    setActiveOverlay(null);
  };
  const resetCurrent = () => {
    if (!window.confirm('Reset sesi episode ini? Hasil terbaik dan Kamus Detektif tetap tersimpan.')) return;
    stopAudio();
    const resetResult = resetSession(caseData);
    recoveryBlocked.current = false;
    completionRecorded.current = false;
    dispatch({ type: 'RESET_GAME' });
    setActiveOverlay(null);
    setGameView('game');
    setMasteryResult(null);
    setStorageStatus(resetResult.ok ? 'ready' : 'storage-failed');
    onNotice({ kind: 'info', message: 'Sesi episode direset. Hasil terbaik dan kamus tetap dipertahankan.' });
  };

  const startMastery = () => {
    if (state.phase !== 'case_solved') return;
    stopAudio();
    setMasteryResult(null);
    setGameView('mastery');
  };

  const completeMastery = (result) => {
    setMasteryResult(result);
    onMasteryComplete(caseData.caseInfo.id, result.score);
    setGameView('mastery-result');
  };

  const closeMastery = () => {
    setGameView('game');
    if (masteryResult?.score >= 70) onNotice({ kind: 'success', message: `Mastery ${masteryResult.score}/100 tersimpan. Periksa peta kampanye untuk melihat status episode berikutnya.` });
  };

  const submitVerdict = () => {
    const statement = deduction?.suspects?.[state.selectedSuspectId];
    dispatch({ type: 'SUBMIT_VERDICT', feedbackMessage: statement?.wrongFeedback });
  };

  const statusText = storageStatus === 'saved' ? 'Progres sesi tersimpan' : storageStatus === 'storage-failed' ? 'Penyimpanan gagal' : storageStatus === 'recovery-needed' ? 'Penyimpanan diblokir' : storageStatus === 'version-incompatible' ? 'Versi data tidak cocok' : 'Sesi belum disimpan';
  const phaseIndex = ['intro', 'investigation', 'puzzle', 'suspect_selection', 'case_solved'].indexOf(state.phase);

  if (gameView === 'mastery') return <MasteryRunner caseData={caseData} onBack={closeMastery} onComplete={completeMastery} onVocabularyResponse={onVocabularyResponse} />;
  if (gameView === 'mastery-result') return <MasteryResult caseData={caseData} result={masteryResult} bestScore={Math.max(episodeProgress?.bestMasteryScore ?? 0, masteryResult?.score ?? 0)} onRetry={() => setGameView('mastery')} onBack={closeMastery} onBackToLobby={onBack} hasNextMission={hasNextMission} onNextMission={onNextMission} />;

  return <div className={`game-screen page-enter ${playerStats?.level >= 18 ? 'has-victory-pulse' : ''}`}>
    <div className="game-topbar"><button className="back-link" onClick={onBack}><span>←</span> Peta kampanye</button><div className="game-top-title"><span className="case-number">BAB {caseData.curriculum.chapter}</span><span className="game-top-title-arabic" lang="ar" dir="rtl">{chapterMeta.titleArabic}</span><strong>{chapterMeta.title}</strong><small>Kasus: {caseData.caseInfo.title}</small></div><div className={`storage-pill ${storageStatus === 'saved' ? 'is-saved' : storageStatus.includes('failed') || storageStatus.includes('needed') || storageStatus.includes('incompatible') ? 'is-warning' : ''}`}><i />{statusText}</div><button className="game-reset-link" onClick={resetCurrent}>Reset sesi</button></div>
    <section className="game-progress-header"><div><div className="chapter-heading-inline"><span lang="ar" dir="rtl">{chapterMeta.titleArabic}</span><strong>{chapterMeta.title}</strong><small>Kasus investigasi · {caseData.caseInfo.title}</small></div><div className="eyebrow">{caseData.caseInfo.location.toUpperCase()}</div><h1>{state.phase === 'intro' ? 'Buka berkas kasus' : state.phase === 'investigation' ? 'Periksa tempat kejadian' : state.phase === 'puzzle' ? 'Susun potongan kalimat' : state.phase === 'suspect_selection' ? 'Analisis dan pilih tersangka' : 'Aktivitas selesai'}</h1><p>{state.phase === 'intro' ? 'Baca briefing sebelum memulai investigasi.' : state.phase === 'investigation' ? 'Temukan lima objek dengan mengamati lokasi dan mencocokkannya dengan daftar target.' : state.phase === 'puzzle' ? 'Susun empat potongan sesuai struktur kalimat Bahasa Arab.' : state.phase === 'suspect_selection' ? 'Hubungkan fakta bukti, makna kalimat, dan alibi sebelum menentukan pilihan.' : 'Lihat rangkaian deduksi, lalu selesaikan checkpoint Bahasa Arab.'}</p></div><div className="game-score-card"><span>SKOR SAAT INI</span><strong>{score.total.toLocaleString('id-ID')}</strong><small>/ 1.000 poin</small></div></section>
    <div className="phase-track" aria-label="Tahapan kasus">{[{label:'Briefing',phase:'intro'},{label:'Investigasi',phase:'investigation'},{label:'Puzzle',phase:'puzzle'},{label:'Tokoh',phase:'suspect_selection'},{label:'Rekap',phase:'case_solved'}].map((item,index)=><div key={item.phase} className={`phase-step ${index < phaseIndex ? 'step-done' : index === phaseIndex ? 'step-current' : ''}`}><span>{index < phaseIndex ? '✓' : `0${index+1}`}</span><small>{item.label}</small></div>)}</div>

    {state.phase === 'intro' && <section className="briefing-layout"><div className="briefing-card"><div className="briefing-card-top"><span className="case-tag">FILE TERBATAS</span><span className="case-index">{caseData.caseInfo.number} / {String(EPISODE_META.length).padStart(2, '0')}</span></div><div className="briefing-emblem">{({shopping:'🛒',health:'🏥',travel:'✈️','hajj-umrah':'🕋',technology:'💻',religions:'🤝'})[caseData.sceneType] ?? '🔎'}</div><div className="briefing-academic-title"><span lang="ar" dir="rtl">{chapterMeta.titleArabic}</span><h2>{chapterMeta.title}</h2><small>Kasus investigasi · {caseData.caseInfo.title}</small></div><p>{caseData.caseInfo.description}</p><div className="briefing-location"><span>⌖</span><div><small>LOKASI</small><strong>{caseData.caseInfo.location}</strong></div></div><div className="briefing-divider" /><h3>Instruksi kasus</h3><ol className="briefing-list">{caseData.caseInfo.briefing.map((line,i)=><li key={line}><span>{String(i+1).padStart(2,'0')}</span>{line}</li>)}</ol><button className="btn btn-primary btn-full" onClick={() => { dispatch({ type: 'START_GAME' }); onAttempt(caseData.caseInfo.id); }}>Mulai investigasi <span>↗</span></button></div><div className="briefing-side"><div className="side-art"><SceneArt sceneType={caseData.sceneType} /><div className="scene-label">GAMBAR ILUSTRASI TKP</div></div><div className="side-objectives"><h3>Target pembelajaran</h3><div className="objective-row"><span>01</span><div><strong>Temukan 5 bukti</strong><small>Amati gambar dan daftar target.</small></div></div><div className="objective-row"><span>02</span><div><strong>Pahami kosakata</strong><small>Arab, transliterasi, dan arti.</small></div></div><div className="objective-row"><span>03</span><div><strong>Susun kesimpulan</strong><small>Bandingkan minimal dua petunjuk.</small></div></div></div></div></section>}

    {state.phase === 'investigation' && <section className="investigation-layout">
      <div className="scene-panel">
        <div className="panel-heading"><div><span className="panel-kicker">SCENE 01 · LIVE INVESTIGATION</span><h2>Tempat kejadian</h2></div><button className="btn btn-small btn-outline" onClick={() => openOverlay({ type: 'how-to' })}>Cara bermain</button></div>
        <div className="scene-wrap" onClick={() => onNotice({ kind: 'info', message: 'Belum ada objek target di titik tersebut. Amati kembali daftar benda dan periksa lokasi dengan teliti.' })}>
          <SceneArt sceneType={caseData.sceneType} />
          {caseData.evidence.map((item) => <button key={item.id} type="button" className="scene-object-hitbox" style={{ left: `${item.hotspot.left}%`, top: `${item.hotspot.top}%`, width: `${item.hotspot.width ?? 11}%`, height: `${item.hotspot.height ?? 14}%` }} onClick={(event) => { event.stopPropagation(); openEvidence(item); }} aria-label={`Periksa objek ${item.meaningIndo}`} title={`Objek: ${item.meaningIndo}`} />)}
        </div>
        <div className="scene-caption"><span><i className="legend-dot legend-found" /> {foundCount} objek ditemukan</span><span className="scene-caption-note">Tidak ada penanda lokasi. Klik langsung pada benda di dalam scene.</span></div>
        <div className="investigation-actions"><button className="btn btn-secondary" onClick={() => openOverlay({ type: 'board' })}>▦ Papan bukti <span className="counter-pill">{foundCount}/5</span></button><button className="btn btn-secondary" disabled={state.hintsUsed >= 3 || state.hintCooldownActive || Boolean(state.hintTargetId)} onClick={() => dispatch({ type: 'USE_HINT' })}>✦ Petunjuk teks <span className="counter-pill">{3-state.hintsUsed} tersisa</span></button></div>
      </div>
      <div className="targets-panel">
        <div className="panel-heading"><div><span className="panel-kicker">OBJECTIVE LIST</span><h2>Daftar benda</h2></div><span className="target-count">{foundCount}<small> / 5</small></span></div>
        <div className="target-progress"><div className="progress-track"><span style={{ width: `${foundCount / 5 * 100}%` }} /></div><small>{foundCount === 5 ? 'Semua objek berhasil ditemukan' : `Temukan ${5-foundCount} objek yang masih tersembunyi`}</small></div>
        <div className="target-list">{caseData.evidence.map((item,index) => { const found = state.foundEvidenceIds.includes(item.id); return <div key={item.id} className={`target-item ${found ? 'target-found' : ''}`}><span className="target-glyph">{found ? '✓' : '⌕'}</span><span className="target-copy"><strong>{found ? <ArabicText text={item.nameAr} /> : `Cari: ${item.meaningIndo}`}</strong><small>{found ? `${item.transliteration} · ${item.meaningIndo}` : `Objek ${String(index+1).padStart(2,'0')} · belum ditemukan`}</small></span><span className="target-status">{found ? 'Ditemukan' : 'Cari'}</span></div>; })}</div>
        <div className="target-footer"><span className="score-mini"><strong>{score.total}</strong> poin</span><span className="hint-mini">Petunjuk terpakai: {state.hintsUsed}/3</span></div>
        <button className="btn btn-primary btn-full" disabled={foundCount !== 5} onClick={() => dispatch({ type: 'OPEN_PUZZLE' })}>Susun surat <span>→</span></button>{foundCount !== 5 && <p className="button-help">Tombol aktif setelah lima objek ditemukan melalui scene.</p>}
      </div>
    </section>}

    {state.phase === 'puzzle' && <section className="puzzle-layout"><div className="puzzle-intro-card"><div className="puzzle-icon">✉</div><span className="panel-kicker">FRAGMENT ANALYSIS</span><h2>Surat yang terpotong</h2><p>Susun potongan dari atas ke bawah. Gunakan arti dan transliterasi untuk membantu memahami urutan kalimat.</p><div className="puzzle-tip"><span>✦</span><div><strong>Petunjuk tata bahasa</strong><p>{caseData.puzzle.grammarNote}</p><ArabicAudioButton text={caseData.puzzle.grammarNote} compact={false} /></div></div><div className="puzzle-stats"><div><span>Pengiriman susunan</span><strong>{state.puzzleAttempts}</strong></div><div><span>Nilai puzzle</span><strong>{score.puzzle}/200</strong></div></div></div><div className="puzzle-board"><div className="panel-heading"><div><span className="panel-kicker">LETTER PUZZLE</span><h2>Atur urutan kalimat</h2></div><span className="puzzle-count">4 fragmen</span></div><div className="puzzle-instruction-row"><div className="puzzle-instruction">Susun potongan dari atas ke bawah hingga membentuk satu kalimat Arab yang benar. Gunakan panah untuk memindahkan potongan.</div><button className="puzzle-reset-button" onClick={() => dispatch({type:'RESET_PUZZLE_ORDER'})} disabled={state.isPuzzleSolved}>Atur ulang</button></div><div className="puzzle-piece-list">{state.puzzleOrder.map((pieceId,index)=>{const item=caseData.puzzle.pieces.find((pieceItem)=>pieceItem.id===pieceId);return <div className={`puzzle-piece ${state.isPuzzleSolved ? 'piece-solved' : ''}`} key={pieceId}><span className="piece-number">{String(index+1).padStart(2,'0')}</span><div className="piece-text"><strong><ArabicText text={item.textArabic} /></strong><span>{item.transliteration} <i>·</i> {item.translation}</span></div><div className="piece-controls"><button onClick={() => dispatch({type:'MOVE_PIECE',index,direction:-1})} disabled={index===0 || state.isPuzzleSolved} aria-label={`Pindahkan fragmen ${index+1} ke atas`}>↑</button><button onClick={() => dispatch({type:'MOVE_PIECE',index,direction:1})} disabled={index===state.puzzleOrder.length-1 || state.isPuzzleSolved} aria-label={`Pindahkan fragmen ${index+1} ke bawah`}>↓</button></div></div>;})}</div>{state.isPuzzleSolved ? <div className="sentence-reveal"><span className="success-check">✓</span><div><small>KALIMAT UTUH</small><strong><ArabicText text={caseData.puzzle.pieces.filter((pieceItem)=>caseData.puzzle.acceptedOrders[0].includes(pieceItem.id)).sort((a,b)=>caseData.puzzle.acceptedOrders[0].indexOf(a.id)-caseData.puzzle.acceptedOrders[0].indexOf(b.id)).map((item)=>item.textArabic).join(' ')} /></strong><p>{caseData.puzzle.fullTranslation}</p></div></div> : <button className="btn btn-primary btn-full" onClick={() => dispatch({type:'SUBMIT_PUZZLE'})}>Periksa susunan <span>✓</span></button>}{state.isPuzzleSolved && <button className="btn btn-primary btn-full" onClick={() => dispatch({type:'CONTINUE_TO_SUSPECTS'})}>Lanjut ke pemilihan tersangka <span>→</span></button>}<p className="button-help">Setiap pengiriman susunan lengkap dihitung sebagai satu percobaan. Memindahkan fragmen tidak menambah percobaan.</p></div></section>}

    {state.phase === 'suspect_selection' && <section className="suspect-screen suspect-screen-vnext7">
      <div className="suspect-intro suspect-intro-vnext7">
        <div className="suspect-intro-heading">
          <div>
            <div className="panel-kicker">مَهَمَّةُ التَّحْقِيقِ · CASE FILE {caseData.caseInfo.number}</div>
            <h2>Rekonstruksi kronologi</h2>
            <small>بَيَانَاتُ التَّحْقِيقِ · Baca kronologi sebelum memilih tokoh</small>
          </div>
          <DetectiveMascot className="suspect-mascot" />
        </div>
        {deduction?.selectionGuidanceArabic && <aside className="suspect-selection-guidance suspect-chronology-card" aria-label="Kronologi investigasi dalam Bahasa Arab">
          <div className="chronology-card-top"><span>KRONOLOGI · BAB {caseData.curriculum.chapter}</span><span className="chronology-status">CASE TIMELINE</span></div>
          <p className="chronology-arabic" lang="ar" dir="rtl">{deduction.selectionGuidanceArabic}</p>
          <div className="chronology-actions">
            <ArabicAudioButton text={deduction.selectionGuidanceArabic} label="Dengarkan kronologi investigasi dalam Bahasa Arab" compact={false} />
            <button type="button" className="btn btn-outline chronology-translation-toggle" onClick={() => setShowChronologyTranslation((visible) => !visible)} aria-expanded={showChronologyTranslation}>
              {showChronologyTranslation ? 'Sembunyikan arti' : 'Tampilkan arti Indonesia'}
            </button>
          </div>
          {showChronologyTranslation && <p className="chronology-translation" lang="id">{deduction.selectionGuidance}</p>}
        </aside>}
      </div>

      <section className="suspect-selection-section" aria-labelledby="suspect-selection-title">
        <div className="suspect-selection-heading">
          <div><span className="panel-kicker">THREE PERSONS OF INTEREST</span><h3 id="suspect-selection-title">Pilih satu dari tiga tersangka</h3><p>Bandingkan pernyataan setiap tokoh dengan kronologi dan bukti yang sudah Anda temukan.</p></div>
          <DetectiveMascot className="suspect-heading-mascot" />
        </div>
        <div className="suspect-grid vnext7-suspect-grid">
          {caseData.suspects.map((item, index) => {
            const statement = getSpeakerStatement(caseData.caseInfo.id, item.id);
            return <button key={item.id} type="button" className={`suspect-card vnext7-suspect-card ${state.selectedSuspectId === item.id ? 'suspect-selected' : ''}`} onClick={() => dispatch({ type: 'SELECT_SUSPECT', id: item.id })} aria-pressed={state.selectedSuspectId === item.id}>
              <div className="suspect-card-top"><span className="suspect-index">TERSANGKA 0{index + 1}</span><span className="radio-mark">{state.selectedSuspectId === item.id ? '✓' : ''}</span></div>
              <div className="suspect-avatar"><span>{item.initials}</span><i /></div>
              <h3>{item.name}</h3>
              <strong className="suspect-arabic"><span lang="ar" dir="rtl">{item.nameAr}</span></strong>
              <span className="suspect-role">{item.role}</span>
              {statement?.identityNote && <div className="suspect-identity-note"><small>IDENTITAS / AKSES</small><p>{statement.identityNote}</p></div>}
              <div className="suspect-card-divider" />
              <div className="suspect-detail"><small>PERNYATAAN DAN ALIBI</small><p>{statement?.statement ?? item.alibi}</p></div>
              {statement?.arabic && <div className="speaker-utterance vnext7-speaker-utterance">
                <span>الْبَيَانُ بِاللُّغَةِ الْعَرَبِيَّةِ</span>
                <strong lang="ar" dir="rtl">{statement.arabic}</strong>
              </div>}
              <small className="speaker-task">{state.selectedSuspectId === item.id ? 'Tokoh dipilih untuk dianalisis' : 'Pilih tokoh ini'}</small>
            </button>;
          })}
        </div>
      </section>

      <div className="verdict-bottom vnext7-verdict-bottom">
        <div><span className="panel-kicker">HASIL ANALISIS</span><strong>{selectedSuspect ? `Tokoh yang dipilih: ${selectedSuspect.name}` : 'Belum ada tokoh dipilih'}</strong><small>Pastikan pilihan Anda sesuai dengan dua jejak bukti yang saling menguatkan.</small></div>
        <button className="btn btn-primary" disabled={!state.selectedSuspectId} onClick={submitVerdict}>Kirim kesimpulan <span>→</span></button>
      </div>
    </section>}

    {state.phase === 'case_solved' && <section className="summary-layout"><div className="summary-main"><div className="summary-seal">✓</div><div className="eyebrow">CASE CLOSED · {caseData.caseInfo.number}</div><div className="summary-academic-title"><span lang="ar" dir="rtl">{chapterMeta.titleArabic}</span><strong>{chapterMeta.title}</strong></div><small className="summary-case-title">Kasus: {caseData.caseInfo.title}</small><h2>Aktivitas pembelajaran selesai.</h2><p>{caseData.storyHook}</p><div className="summary-score-block"><div><span>SKOR KASUS</span><strong>{score.total.toLocaleString('id-ID')}</strong><small>dari 1.000 poin</small></div><div className="stars-row" aria-label={`${stars} bintang`}>{[1,2,3].map((n)=><span key={n} className={n<=stars?'star-filled':'star-empty'}>★</span>)}</div></div><div className="summary-breakdown"><div><span>Bukti</span><strong>{score.evidence}/500</strong></div><div><span>Puzzle</span><strong>{score.puzzle}/200</strong></div><div><span>Vonis</span><strong>{score.verdict}/300</strong></div><div><span>Penalti hint</span><strong className="penalty">−{score.hintPenalty}</strong></div></div><button className="btn btn-primary btn-full btn-large" onClick={startMastery}>Mulai checkpoint Bahasa Arab <span>↗</span></button><p className="button-help">Checkpoint berisi 10 item. Mastery minimal 70/100 diperlukan untuk membuka episode berikutnya.</p><button className="btn btn-secondary btn-full" onClick={resetCurrent}>PLAY AGAIN ↻</button><button className="btn btn-ghost btn-full" onClick={onBack}>BACK TO LOBBY</button></div><div className="summary-side"><div className="summary-suspect"><div className="panel-kicker">TOKOH YANG SESUAI DENGAN KONTEKS</div><div className="suspect-avatar suspect-avatar-large"><span>{caseData.suspects.find((item)=>item.isGuilty)?.initials}</span><i /></div><h3>{caseData.suspects.find((item)=>item.isGuilty)?.name}</h3><strong><ArabicText text={caseData.suspects.find((item)=>item.isGuilty)?.nameAr} /></strong><p>{caseData.suspects.find((item)=>item.isGuilty)?.role}</p><div className="summary-proof"><span>✓</span><div><strong>Deduksi terverifikasi</strong><small>Seluruh fakta dan pernyataan telah dibandingkan.</small></div></div></div>
      {deduction?.solution && <section className="deduction-solution">
        <div className="panel-kicker">RANGKAIAN KESIMPULAN</div>
        <h3>Mengapa kesimpulan ini benar?</h3>
        <ol>{deduction.solution.steps.map((step, index) => <li key={`${caseData.caseInfo.id}-solution-${index}`}><strong>{step.heading}</strong><p>{step.explanation}</p><small>Bukti terkait: {step.evidenceIds.map((id) => caseData.evidence.find((item) => item.id === id)?.meaningIndo ?? id).join(' · ')}</small></li>)}</ol>
        <h4>Eliminasi dua tersangka lainnya</h4>
        <div className="deduction-elimination-list">{deduction.solution.eliminations.map((item) => {
          const suspect = caseData.suspects.find((candidate) => candidate.id === item.suspectId);
          return <div key={item.suspectId}><strong>{suspect?.name} · {suspect?.role}</strong><p>{item.reason}</p></div>;
        })}</div>
        <p className="deduction-conclusion">{deduction.solution.conclusion}</p>
      </section>}
      <div className="mastery-card"><div className="mastery-card-icon">◉</div><div><strong>Mastery Bahasa Arab</strong><p>Skor game tidak menggantikan hasil checkpoint bahasa.</p><span>Hasil terbaik saat ini: {episodeProgress?.bestMasteryScore ?? 0}/100</span></div></div></div></section>}

    {state.feedback && <div className={`game-feedback feedback-${state.feedback.kind}`} role="status" aria-live="polite"><span>{state.feedback.kind==='success'?'✓':state.feedback.kind==='warning'?'!':'i'}</span>{state.feedback.message}<button onClick={()=>dispatch({type:'CLEAR_FEEDBACK'})} aria-label="Tutup pesan">×</button></div>}

    {activeOverlay && createPortal(<div className="modal-backdrop" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)setActiveOverlay(null);}}>
      {activeOverlay.type === 'evidence' && activeEvidence && <section ref={overlayDialogRef} className="modal-card evidence-modal" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="evidence-title">
        <button className="modal-close" onClick={()=>setActiveOverlay(null)} aria-label="Tutup detail bukti">×</button>
        <div className="evidence-modal-layout">
          <div className="evidence-modal-visual">
            <div className="evidence-zoom-window">
              <SceneArt sceneType={caseData.sceneType} focusId={activeEvidence.id} evidence={caseData.evidence} zoomScale={2.7} />
              <span className="evidence-zoom-label">OBJECT DETAIL · ZOOM</span>
            </div>
          </div>
          <div className="evidence-modal-content">
            <div className="modal-eyebrow">BUKTI {String(caseData.evidence.findIndex((item)=>item.id===activeEvidence.id)+1).padStart(2,'0')} · {state.foundEvidenceIds.includes(activeEvidence.id)?'TELAH DICATAT':'OBJEK TERIDENTIFIKASI'}</div>
            <h2 id="evidence-title"><ArabicText text={activeEvidence.nameAr} /></h2>
            <div className="vocab-reading"><span>{activeEvidence.transliteration}</span><i>·</i><strong>{activeEvidence.meaningIndo}</strong></div>
            <div className="evidence-clue"><span>PETUNJUK OBJEK</span><p>{activeEvidence.clue}</p></div>
            {deduction?.evidence?.[activeEvidence.id] && <div className="evidence-investigative-fact">
              <div><small>LOKASI PENEMUAN</small><p>{deduction.evidence[activeEvidence.id].location}</p></div>
              <div><small>WAKTU / URUTAN</small><p>{deduction.evidence[activeEvidence.id].time}</p></div>
              <div><small>KONDISI</small><p>{deduction.evidence[activeEvidence.id].condition}</p></div>
              <div className="evidence-investigative-main"><small>FAKTA INVESTIGATIF</small><p>{deduction.evidence[activeEvidence.id].fact}</p><span>{deduction.evidence[activeEvidence.id].deductionUse}</span></div>
            </div>}
          </div>
        </div>
        <div className="evidence-modal-foot"><p>Perhatikan bentuk kata, harakat, transliterasi, dan arti sebelum menghubungkan bukti dengan petunjuk lain.</p>{state.foundEvidenceIds.includes(activeEvidence.id) ? <button className="btn btn-secondary" onClick={()=>setActiveOverlay(null)}>Kembali ke TKP</button> : <button className="btn btn-primary" onClick={findEvidence}>Catat temuan <span>✓</span></button>}</div>
      </section>}
      {activeOverlay.type==='board' && <section ref={overlayDialogRef} className="modal-card board-modal" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="board-title"><button className="modal-close" onClick={()=>setActiveOverlay(null)} aria-label="Tutup papan bukti">×</button><div className="modal-eyebrow">CASE EVIDENCE BOARD</div><h2 id="board-title">Papan bukti</h2><p className="muted">Petunjuk yang ditemukan dapat dibaca kembali sebelum menyusun surat.</p><div className="board-evidence-list">{caseData.evidence.filter((item)=>state.foundEvidenceIds.includes(item.id)).map((item,index)=><button key={item.id} onClick={()=>setActiveOverlay({type:'evidence',id:item.id})}><span>{item.glyph}</span><div><strong><ArabicText text={item.nameAr} /></strong><small>{item.meaningIndo} · {deduction?.evidence?.[item.id]?.fact ?? item.clue}</small></div><i>↗</i></button>)}{foundCount===0&&<div className="empty-state">Belum ada bukti. Mulai dengan memeriksa salah satu target.</div>}</div><div className="modal-actions"><button className="btn btn-primary" onClick={()=>setActiveOverlay(null)}>Kembali ke TKP</button></div></section>}
      {activeOverlay.type==='how-to' && <section ref={overlayDialogRef} className="modal-card" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="howto-title"><button className="modal-close" onClick={()=>setActiveOverlay(null)} aria-label="Tutup cara bermain">×</button><div className="modal-eyebrow">QUICK GUIDE</div><h2 id="howto-title">Cara bermain</h2><ol className="howto-list"><li><span>01</span><div><strong>Amati lokasi</strong><p>Perhatikan seluruh ruangan. Tidak ada lingkaran, panah, atau penanda yang menunjukkan posisi target.</p></div></li><li><span>02</span><div><strong>Temukan benda</strong><p>Baca daftar benda, lalu klik langsung objek yang sesuai di dalam scene. Klik yang keliru tidak mengurangi progres.</p></div></li><li><span>03</span><div><strong>Pelajari kosakata</strong><p>Objek yang benar akan diperbesar. Pelajari tulisan Arab berharakat, transliterasi, arti, dan penjelasannya.</p></div></li><li><span>04</span><div><strong>Selesaikan investigasi</strong><p>Temukan lima objek, susun kalimat, lalu bandingkan alibi tersangka.</p></div></li></ol><button className="btn btn-primary btn-full" onClick={()=>setActiveOverlay(null)}>Mengerti</button></section>}
    </div>, document.body)}
  </div>;
}

function MasteryRunner({ caseData, onBack, onComplete, onVocabularyResponse }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [results, setResults] = useState([]);
  const question = arabicQuestion(caseData.mastery[index]);
  const chapterMeta = EPISODE_META.find((item) => item.id === caseData.caseInfo.id) ?? EPISODE_META[0];

  const next = useCallback(() => {
    if (index < caseData.mastery.length - 1) {
      setIndex((current) => current + 1);
      setSelected(null);
      setFeedbackState(null);
      return;
    }
    const resultScore = masteryScore(correctCount, caseData.mastery.length);
    setFinalScore(resultScore);
    setComplete(true);
    onComplete({ score: resultScore, correctCount, total: caseData.mastery.length, results });
  }, [index, caseData.mastery.length, correctCount, results, onComplete]);

  useEffect(() => {
    if (!feedbackState?.correct) return undefined;
    const timer = window.setTimeout(next, 850);
    return () => window.clearTimeout(timer);
  }, [feedbackState, next]);

  const submit = () => {
    if (feedbackState || !question) return;
    const correct = selected === question.correctIndex;
    playGameSound(correct ? 'correct' : 'wrong');
    setFeedbackState({ correct, explanation: question.explanation });
    setAnsweredCount((n) => n + 1);
    setCorrectCount((n) => n + (correct ? 1 : 0));
    setResults((previous) => [...previous, { id: question.id, correct, selected }]);
    onVocabularyResponse(question.vocabularyId, caseData.caseInfo.id, correct, question.mode);
  };

  if (complete) return <section className="mastery-screen page-enter"><button className="back-link" onClick={onBack}>← Kembali ke rekap kasus</button><div className="mastery-result-card"><div className="mastery-result-seal">{finalScore >= 70 ? '✓' : '↻'}</div><div className="eyebrow">CHECKPOINT SELESAI</div><h1>{finalScore >= 70 ? 'Target mastery tercapai.' : 'Perlu latihan tambahan.'}</h1><div className="mastery-big-score">{finalScore}<small>/100</small></div><p>{correctCount} dari {caseData.mastery.length} jawaban benar. {finalScore >= 70 ? 'Syarat penguasaan untuk episode ini terpenuhi.' : 'Ulangi checkpoint untuk mencoba lagi. Kamu tidak perlu mengulang investigasi.'}</p><div className="mastery-result-bar"><span style={{ width: `${finalScore}%` }} /></div><div className="mastery-result-details"><span><strong>{correctCount}</strong> benar</span><span><strong>{caseData.mastery.length-correctCount}</strong> perlu diperbaiki</span><span><strong>{finalScore >= 70 ? 'LULUS' : 'REMEDIAL'}</strong> status checkpoint</span></div><button className="btn btn-primary btn-large btn-full" onClick={onBack}>Kembali ke rekap <span>→</span></button></div></section>;

  return <section className="mastery-screen page-enter"><div className="mastery-top"><button className="back-link" onClick={onBack}>← Keluar dari checkpoint</button><span className="checkpoint-tag">LANGUAGE CHECKPOINT</span></div><div className="mastery-layout"><div className="mastery-side-card"><div className="mastery-side-icon">م</div><div className="eyebrow">{caseData.caseInfo.number} / {String(EPISODE_META.length).padStart(2, '0')} · {caseData.curriculum.level}</div><div className="mastery-chapter-heading"><span lang="ar" dir="rtl">{chapterMeta.titleArabic}</span><strong>{chapterMeta.title}</strong><small>Kasus: {caseData.caseInfo.title}</small></div><h1>Checkpoint Bahasa Arab</h1><p>Jawab sepuluh pertanyaan. Setiap item bernilai 10 poin. Jawaban kosong dihitung salah.</p><div className="mastery-progress-label"><span>Progres</span><strong>{index+1} / {caseData.mastery.length}</strong></div><div className="progress-track"><span style={{width:`${(index+1)/caseData.mastery.length*100}%`}} /></div><div className="mastery-mode-list"><span>▦ Kosakata dan konteks</span><span>◉ Membaca dan memahami</span><span>⌘ Tata bahasa</span></div><div className="mastery-side-note">Ambang pembukaan bab berikutnya: <strong>70/100</strong></div></div><div className="question-card"><div className="question-card-head"><span className="question-number">PERTANYAAN {String(index+1).padStart(2,'0')}</span><span className="question-mode">{modeLabels[question.mode]}</span></div><div className="question-prompt-row"><h2 className={question.arabicPrompt ? 'question-prompt prompt-arabic' : 'question-prompt'}>{question.prompt}</h2><ArabicAudioButton text={question.prompt} compact={false} /></div><div className="answer-options">{question.options.map((option,optionIndex)=><button key={option} className={`answer-option ${selected===optionIndex?'answer-selected':''} ${feedbackState && optionIndex===question.correctIndex?'answer-correct':''} ${feedbackState && selected===optionIndex && !feedbackState.correct?'answer-wrong':''}`} onClick={()=>!feedbackState&&setSelected(optionIndex)} disabled={Boolean(feedbackState)}><span className="option-letter">{String.fromCharCode(65+optionIndex)}</span><span className={isArabic(option)?'option-arabic':''}>{option}</span>{isArabic(option) && <ArabicAudioButton text={option} compact /> }<i>{feedbackState&&optionIndex===question.correctIndex?'✓':selected===optionIndex?'●':''}</i></button>)}</div>{feedbackState && <div className={`question-feedback ${feedbackState.correct?'q-correct':'q-wrong'}`} role="status"><strong>{feedbackState.correct?'Tepat.':'Belum tepat.'}</strong><p>{feedbackState.explanation}</p><ArabicAudioButton text={feedbackState.explanation} compact={false} /></div>}<div className="question-card-bottom"><span>{answeredCount} jawaban dikirim</span>{feedbackState?.correct ? <span className="auto-next-note" aria-live="polite">Jawaban benar. Lanjut otomatis…</span> : feedbackState ? <button className="btn btn-primary" onClick={next}>Soal berikutnya <span>→</span></button> : <button className="btn btn-primary" onClick={submit}>{selected===null?'Lewati pertanyaan':'Periksa jawaban'} <span>✓</span></button>}</div></div></div></section>;
}

function MasteryResult({ caseData, result, bestScore, onRetry, onBack, onBackToLobby, hasNextMission, onNextMission }) {
  const chapterMeta = EPISODE_META.find((item) => item.id === caseData.caseInfo.id) ?? EPISODE_META[0];
  return <section className="mastery-screen page-enter"><button className="back-link" onClick={onBack}>← Kembali ke rekap kasus</button><div className="mastery-result-card"><div className="mastery-result-seal">{result?.score >= 70 ? '✓' : '↻'}</div><div className="eyebrow">CHECKPOINT SELESAI</div><div className="mastery-chapter-heading"><span lang="ar" dir="rtl">{chapterMeta.titleArabic}</span><strong>{chapterMeta.title}</strong><small>Kasus: {caseData.caseInfo.title}</small></div><h1>{result?.score >= 70 ? 'Target mastery tercapai.' : 'Perlu latihan tambahan.'}</h1><div className="mastery-big-score">{result?.score ?? 0}<small>/100</small></div><p>{result?.correctCount ?? 0} dari {result?.total ?? 10} jawaban benar. Skor terbaik yang tersimpan: {bestScore}/100.</p><div className="mastery-result-bar"><span style={{ width: `${result?.score ?? 0}%` }} /></div><div className="mastery-result-details"><span><strong>{result?.correctCount ?? 0}</strong> benar</span><span><strong>{(result?.total ?? 10)-(result?.correctCount ?? 0)}</strong> perlu diperbaiki</span><span><strong>{result?.score >= 70 ? 'LULUS' : 'REMEDIAL'}</strong> status checkpoint</span></div><div className="mastery-result-actions">{result?.score >= 70 && hasNextMission ? <button className="btn btn-primary" onClick={onNextMission}>NEXT MISSION <span>↗</span></button> : result?.score < 70 ? <button className="btn btn-primary" onClick={onRetry}>RETRY CHECKPOINT <span>↻</span></button> : null}<button className="btn btn-secondary" onClick={onBackToLobby}>BACK TO LOBBY</button><button className="btn btn-ghost" onClick={onBack}>Lihat rekap kasus</button></div><p className="button-help">Hasil checkpoint mengukur mastery Bahasa Arab. Skor kasus dan bintang dihitung secara terpisah.</p></div></section>;
}

function DictionaryScreen({ progress, search, setSearch, onBack, onSeen, onResponse }) {
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [chapterFilter, setChapterFilter] = useState('all');
  const [partFilter, setPartFilter] = useState('all');
  const [masteryFilter, setMasteryFilter] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});

  const posGroup = (partOfSpeech = '') => {
    const value = partOfSpeech.toLowerCase();
    if (value === 'sifat') return 'adjective';
    if (value.includes('fiil') || value.includes("fi'il") || value.includes('verba')) return 'verb';
    if (value.includes('isim') || value.includes('nama') || value.includes('istilah')) return 'noun';
    return 'other';
  };

  const rows = useMemo(() => vocabularyStats(progress, VOCABULARY_REGISTRY).rows.filter((row) => {
    const currentStatus = progress[row.vocabId]?.masteryStatus ?? 'new';
    const matchesSearch = `${row.arabic} ${row.transliteration} ${row.meaningIndo}`.toLowerCase().includes(search.toLowerCase());
    const matchesChapter = chapterFilter === 'all' || row.sourceEpisodeIds?.includes(chapterFilter);
    const matchesPart = partFilter === 'all' || posGroup(row.partOfSpeech) === partFilter;
    const matchesMastery = masteryFilter === 'all' || currentStatus === masteryFilter;
    return matchesSearch && matchesChapter && matchesPart && matchesMastery;
  }), [progress, search, chapterFilter, partFilter, masteryFilter]);

  const toggleFlip = (id) => setFlippedCards((previous) => ({ ...previous, [id]: !previous[id] }));
  const resetFilters = () => { setChapterFilter('all'); setPartFilter('all'); setMasteryFilter('all'); setSearch(''); };

  return <div className="dictionary-screen page-enter">
    <div className="page-topline"><button className="back-link" onClick={onBack}>← Kembali ke lobby</button><span className="checkpoint-tag">VOCABULARY COLLECTION</span></div>
    <section className="dictionary-hero">
      <div><div className="eyebrow">DETECTIVE'S DICTIONARY</div><h1>Vocabulary Collection</h1><p>Kumpulkan kartu kosakata dari enam bab. Dengarkan pengucapan, pahami konteks, dan tingkatkan mastery melalui latihan retrieval.</p><small className="audio-engine-note">Audio memakai Nabra Neural TTS Bahasa Arab Fusha dan mempertahankan harakat. Pemutaran pertama dapat memerlukan waktu untuk memuat model suara.</small><button className="btn btn-primary" onClick={() => setPracticeOpen(true)}>Mulai latihan 5 kata <span>↗</span></button></div>
      <div className="dictionary-emblem">م<span>✦</span></div>
    </section>
    <div className="dictionary-stats">
      <StatCard icon="▤" label="Kosakata tersedia" value={Object.keys(VOCABULARY_REGISTRY).length} detail="Registry enam episode" />
      <StatCard icon="◉" label="Pernah ditemui" value={Object.values(progress).filter((row) => row.seenCount > 0).length} detail="Kartu pernah dibuka" />
      <StatCard icon="✦" label="Dikuasai" value={Object.values(progress).filter((row) => row.masteryStatus === 'mastered').length} detail="Minimal tiga retrieval" />
      <StatCard icon="↻" label="Perlu diulang" value={Object.values(progress).filter((row) => row.masteryStatus === 'review').length} detail="Akurasi terbaru rendah" />
    </div>
    <div className="dictionary-toolbar">
      <div><h2>Vocabulary registry</h2><p>{rows.length} kartu ditampilkan dari {Object.keys(VOCABULARY_REGISTRY).length} kosakata.</p></div>
      <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari Arab, transliterasi, atau arti..." aria-label="Cari kosakata" /><kbd>⌘ K</kbd></label>
    </div>
    <div className="ba-vocab-filters" aria-label="Filter kosakata">
      <label>Bab<select value={chapterFilter} onChange={(event) => setChapterFilter(event.target.value)}><option value="all">Semua bab</option>{EPISODE_META.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.title}</option>)}</select></label>
      <label>Jenis kata<select value={partFilter} onChange={(event) => setPartFilter(event.target.value)}><option value="all">Semua jenis</option><option value="noun">Kata benda / isim</option><option value="verb" disabled>Fi'il / kata kerja (belum tersedia)</option><option value="adjective">Kata sifat</option><option value="other">Istilah dan nama khusus</option></select></label>
      <label>Penguasaan<select value={masteryFilter} onChange={(event) => setMasteryFilter(event.target.value)}><option value="all">Semua status</option><option value="new">Belum dipelajari</option><option value="learning">Sedang dipelajari</option><option value="review">Perlu diulang</option><option value="mastered">Sudah dikuasai</option></select></label>
      <button className="ba-vocab-reset" onClick={resetFilters}>Reset filter ↺</button>
    </div>
    <div className="vocab-grid ba-vocab-collection-grid">
      {rows.map((row) => {
        const current = progress[row.vocabId] ?? {};
        const flipped = Boolean(flippedCards[row.vocabId]);
        return <article key={row.vocabId} className={`vocab-card ba-vocab-card ${flipped ? 'is-flipped' : ''}`}>
          <div className="vocab-card-art"><SceneArt sceneType={CASES_CONFIG[row.sourceEpisodeIds?.[0]]?.sceneType ?? 'shopping'} /></div>
          <div className="vocab-card-top"><span className={`vocab-status vocab-${current.masteryStatus ?? 'new'}`}>{statusLabels[current.masteryStatus ?? 'new']}</span><span className="ba-vocab-category">{row.partOfSpeech}</span></div>
          <div className="ba-vocab-card-inner">
            <div className="ba-vocab-card-face ba-vocab-card-front">
              <strong className="vocab-arabic"><ArabicText text={row.arabic} /></strong>
              <span className="vocab-translit">{row.transliteration}</span>
              <h3>{row.meaningIndo}</h3>
              <ArabicAudioButton text={row.arabic} compact label={`Dengarkan pengucapan ${row.meaningIndo}`} />
            </div>
            <div className="ba-vocab-card-face ba-vocab-card-back">
              <span className="ba-vocab-back-label">CONTOH PENGGUNAAN</span>
              <strong><ArabicText text={row.exampleSentences[0]?.arabic} /></strong>
              <p>{row.exampleSentences[0]?.meaningIndo}</p>
              <div className="ba-vocab-card-stats"><span>Latihan <b>{current.retrievalCount ?? 0}×</b></span><span>Benar <b>{current.correctCount ?? 0}</b></span></div>
            </div>
          </div>
          <div className="vocab-card-foot"><span>Ditampilkan <strong>{current.seenCount ?? 0}×</strong></span><span>{row.level}</span><button onClick={() => toggleFlip(row.vocabId)}>{flipped ? 'KEMBALI ↶' : 'DETAIL ↻'}</button></div>
        </article>;
      })}
    </div>
    {rows.length === 0 && <div className="empty-state">Tidak ada kosakata yang cocok dengan filter atau pencarian.</div>}
    {practiceOpen && <DictionaryPractice progress={progress} onClose={() => setPracticeOpen(false)} onSeen={onSeen} onResponse={onResponse} />}
  </div>;
}

function DictionaryPractice({ progress = {}, onClose, onSeen, onResponse }) {
  const [words, setWords] = useState(() => getNextDictionaryPracticeBatch(progress, VOCABULARY_REGISTRY, 5));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(() => getNextDictionaryPracticeBatch(progress, VOCABULARY_REGISTRY, 5).length === 0);
  const [round, setRound] = useState(1);
  const dialogRef = useRef(null);
  const row = words[index];
  const nextBatch = useMemo(
    () => getNextDictionaryPracticeBatch(progress, VOCABULARY_REGISTRY, 5),
    [progress]
  );
  const allComplete = done && nextBatch.length === 0;

  const options = useMemo(() => {
    if (!row) return [];
    const meanings = [...new Set(Object.values(VOCABULARY_REGISTRY).map((item) => item.meaningIndo))];
    const others = meanings.filter((meaning) => meaning !== row.meaningIndo)
      .slice((index * 3) % Math.max(1, meanings.length - 3), (index * 3) % Math.max(1, meanings.length - 3) + 3);
    return [row.meaningIndo, ...others].sort((a, b) => ((a.charCodeAt(0) + index) % 7) - ((b.charCodeAt(0) + index) % 7));
  }, [row, index]);
  const correctIndex = options.indexOf(row?.meaningIndo);

  const next = useCallback(() => {
    if (index === words.length - 1) {
      setDone(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
    setFeedbackState(null);
  }, [index, words.length]);

  const startNextRound = useCallback(() => {
    if (!nextBatch.length) return;
    setWords(nextBatch);
    setIndex(0);
    setSelected(null);
    setFeedbackState(null);
    setCorrectCount(0);
    setDone(false);
    setRound((current) => current + 1);
  }, [nextBatch]);

  useEffect(() => {
    if (!feedbackState?.correct) return undefined;
    const timer = window.setTimeout(next, 750);
    return () => window.clearTimeout(timer);
  }, [feedbackState, next]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 0);
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    if (row) onSeen(row.vocabId, row.sourceEpisodeIds[0]);
  }, [row, onSeen]);

  const submit = () => {
    if (feedbackState || !row) return;
    const correct = selected === correctIndex;
    setFeedbackState({ correct });
    playGameSound(correct ? 'correct' : 'wrong');
    setCorrectCount((count) => count + (correct ? 1 : 0));
    onResponse(row.vocabId, row.sourceEpisodeIds[0], correct, 'dictionary-practice');
  };

  if (!row && !done) return null;

  return createPortal(
    <div className="modal-backdrop practice-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="modal-card practice-modal" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="practice-title">
        <button className="modal-close" onClick={onClose} aria-label="Tutup latihan">Ã—</button>
        {done ? (
          <div className="practice-result">
            <div className="summary-seal">{allComplete ? 'âœ“' : 'â†»'}</div>
            <div className="eyebrow">{allComplete ? 'SEMUA KOSAKATA DIKUASAI' : `PUTARAN ${round} SELESAI`}</div>
            <h2 id="practice-title">{allComplete ? 'Luar biasa! Semua mufradat selesai.' : 'Putaran latihan selesai.'}</h2>
            <p>{allComplete
              ? 'Semua kosakata dalam Kamus Detektif sudah berhasil dijawab benar.'
              : `${correctCount} dari ${words.length} kosakata dijawab benar.`}</p>
            {!allComplete && words.length > correctCount && (
              <p>{words.length - correctCount} kosakata yang belum benar akan masuk antrean pengulangan.</p>
            )}
            {nextBatch.length > 0
              ? <button className="btn btn-primary btn-full" onClick={startNextRound}>Lanjut latihan {Math.min(5, nextBatch.length)} kata <span>â†’</span></button>
              : <button className="btn btn-primary btn-full" onClick={onClose}>Kembali ke kamus <span>âœ“</span></button>}
          </div>
        ) : (
          <>
            <div className="modal-eyebrow">KAMUS DETEKTIF Â· PUTARAN {round}</div>
            <div className="practice-progress">
              <span>PERTANYAAN {index + 1} / {words.length}</span>
              <div className="progress-track"><span style={{ width: `${(index + 1) / words.length * 100}%` }} /></div>
            </div>
            <div className="practice-word-wrap">
              <div className="practice-word"><ArabicText text={row.arabic} /></div>
              <div className="practice-translit">{row.transliteration}</div>
            </div>
            <div className="answer-options practice-options">
              {options.map((option, optionIndex) => (
                <button
                  key={`${round}-${index}-${option}`}
                  className={`answer-option ${selected === optionIndex ? 'answer-selected' : ''} ${feedbackState && option === row.meaningIndo ? 'answer-correct' : ''} ${feedbackState && selected === optionIndex && !feedbackState.correct ? 'answer-wrong' : ''}`}
                  disabled={Boolean(feedbackState)}
                  onClick={() => setSelected(optionIndex)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                  <span>{option}</span>
                  <i>{feedbackState && option === row.meaningIndo ? 'âœ“' : ''}</i>
                </button>
              ))}
            </div>
            {feedbackState && (
              <div className={`question-feedback ${feedbackState.correct ? 'q-correct' : 'q-wrong'}`} role="status">
                {feedbackState.correct ? 'Tepat.' : 'Belum tepat.'} Arti kata ini adalah {row.meaningIndo}.
              </div>
            )}
            <div className="modal-actions">
              {feedbackState?.correct
                ? <span className="auto-next-note" aria-live="polite">Benar. Otomatis ke kosakata berikutnyaâ€¦</span>
                : feedbackState
                  ? <button className="btn btn-primary btn-full" onClick={next}>{index === words.length - 1 ? 'Lihat hasil' : 'Kata berikutnya'} â†’</button>
                  : <button className="btn btn-primary btn-full" onClick={submit} disabled={selected === null}>Periksa jawaban</button>}
            </div>
          </>
        )}
      </section>
    </div>,
    document.body
  );
}

function DataScreen({ campaign, vocabularyStats: vStats, recoveryCount, cloudEnabled, cloudReady, gamificationCloudAvailable, gamificationCloudReason, onBack, onExport, onExportRecovery, onChooseImport, onResetCampaign, onResetDictionary, onResetFull, importError }) {
  return <div className="data-screen page-enter"><div className="page-topline"><button className="back-link" onClick={onBack}>← Kembali ke lobby</button><span className="checkpoint-tag">DATA MANAGEMENT</span></div><section className="data-hero"><div><div className="eyebrow">SAVE FILES & RECOVERY</div><h1>Data dan pemulihan</h1><p>{cloudEnabled ? (cloudReady ? 'Akun terhubung. Progres kampanye dan kamus disinkronkan ke cloud. Sesi permainan yang kompatibel juga dicadangkan.' : 'Akun aktif, tetapi sinkronisasi cloud belum siap atau sedang berlangsung. Periksa koneksi sebelum melanjutkan.') : 'Mode tamu aktif. Progres tersimpan pada browser dan perangkat ini. Login untuk menyinkronkan progres ke cloud.'} Ekspor backup JSON tetap disarankan sebagai cadangan tambahan.</p><p className="data-gamification-sync">{cloudEnabled ? (gamificationCloudAvailable ? 'Reward, XP, koin, streak, dan daily mission tersinkronisasi ke cloud.' : gamificationCloudReason === 'migration-required' ? 'Reward tetap tersimpan lokal. Jalankan supabase/gamification_setup.sql untuk mengaktifkan sinkronisasi reward antarperangkat.' : 'Sinkronisasi reward belum berhasil. Periksa koneksi, izin RLS, dan log Supabase; reward lokal tetap aman.') : 'Reward tersimpan lokal bersama progres mode tamu.'}</p></div><div className="data-lock-icon">▣<span>{cloudEnabled && cloudReady ? 'CLOUD' : 'LOCAL'}</span></div></section><div className="data-stat-grid"><div className="data-stat"><span>Kasus selesai</span><strong>{EPISODE_META.filter((meta)=>campaign.episodes[meta.id]?.caseCompleted).length}/{EPISODE_META.length}</strong></div><div className="data-stat"><span>Kosakata pernah ditemui</span><strong>{vStats.seen}/{vStats.total}</strong></div><div className="data-stat"><span>Checkpoint terbaik</span><strong>{Math.max(0,...EPISODE_META.map((meta)=>campaign.episodes[meta.id]?.bestMasteryScore??0))}/100</strong></div></div><div className="data-action-grid"><article className="data-action-card"><div className="data-action-icon">↥</div><span className="panel-kicker">BACKUP</span><h2>Ekspor progres</h2><p>Unduh file JSON berisi hasil kampanye, progres kamus, reward ledger, XP, koin, streak, dan snapshot sesi aktif jika tersedia.</p><button className="btn btn-primary btn-full" onClick={onExport}>Ekspor backup JSON <span>↗</span></button></article><article className="data-action-card"><div className="data-action-icon">↧</div><span className="panel-kicker">RESTORE</span><h2>Impor progres</h2><p>Pilih backup JSON. Sistem memvalidasi struktur, menampilkan pratinjau, lalu membuat backup progres saat ini sebelum mengganti data.</p><button className="btn btn-secondary btn-full" onClick={onChooseImport}>Pilih file JSON <span>↗</span></button>{importError&&<p className="import-error" role="alert">{importError}</p>}</article></div>{recoveryCount > 0 && <section className="recovery-notice"><div><strong>{recoveryCount} salinan pemulihan tersedia</strong><p>Data yang tidak dapat dibaca atau memiliki versi berbeda dipertahankan tanpa ditimpa. Ekspor salinan ini sebelum menghapus data situs.</p></div><button className="btn btn-secondary" onClick={onExportRecovery}>Ekspor salinan pemulihan <span>↗</span></button></section>}<section className="reset-section"><div><div className="eyebrow danger-text">RESET CONTROLS</div><h2>Atur ulang progres</h2><p>Setiap operasi memiliki cakupan berbeda. Ekspor backup terlebih dahulu jika ingin mempertahankan data.</p></div><div className="reset-actions"><button className="reset-row" onClick={onResetCampaign}><span className="reset-row-icon">↻</span><span><strong>Reset kampanye</strong><small>Hapus hasil episode. Kamus tetap.</small></span><i>→</i></button><button className="reset-row" onClick={onResetDictionary}><span className="reset-row-icon">▤</span><span><strong>Reset Kamus Detektif</strong><small>Hapus riwayat kosakata. Kampanye tetap.</small></span><i>→</i></button><button className="reset-row reset-row-danger" onClick={onResetFull}><span className="reset-row-icon">!</span><span><strong>Reset penuh</strong><small>Hapus progres kampanye, kamus, reward, dan sesi.</small></span><i>→</i></button></div></section><div className="storage-disclaimer"><span>i</span><p><strong>Catatan penyimpanan.</strong> localStorage dan sessionStorage hanya berlaku di browser/perangkat yang sama. Menghapus data situs dapat menghapus progres. Impor versi ini menggunakan mode replace, bukan merge. Data yang tidak cocok dengan versi aplikasi akan ditolak. Reward pada backup vNext8.0 ikut dipulihkan bila tersedia.</p></div></div>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-brand"><img src="/assets/basyir-agency-emblem.png" alt="Emblem Basyir Agency" /><span><strong>BASYIR AGENCY</strong><small>ARABIC LEARNING BATTLE ACADEMY</small></span></div><p>vNext8.0 · Arabic Learning Battle Academy</p><span className="footer-copyright">© 2026</span></footer>;
}

export default App;
