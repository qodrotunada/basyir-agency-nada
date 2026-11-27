import React, { useMemo, useState } from 'react';
import { CASES_CONFIG, EPISODE_META } from '../data/campaign.js';
import { getLearningChapter, getLearningVocabulary } from '../data/learningMaterials.js';
import { ArabicAudioButton } from './ArabicText.jsx';
import SceneArt from './SceneArt.jsx';

const TABS = [
  { id: 'overview', label: 'OVERVIEW', caption: 'Ringkasan bab' },
  { id: 'lesson', label: 'LEARNING', caption: 'Materi akademik' },
  { id: 'vocabulary', label: 'VOCABULARY', caption: 'Koleksi mufrodat' },
  { id: 'audio', label: 'ISTIMA’', caption: 'Audio dan transkrip' },
  { id: 'practice', label: 'PRACTICE', caption: 'Latihan pemahaman' }
];

function Arabic({ children, className = '' }) {
  return <span className={className} lang="ar" dir="rtl">{children}</span>;
}

function PageContent({ page }) {
  return (
    <article className="ba-learning-topic">
      <div className="ba-learning-topic-head"><span>{page.type?.replaceAll('-', ' ').toUpperCase()}</span><h3>{page.title}</h3></div>
      {page.arabic && <div className="ba-learning-topic-arabic"><Arabic>{page.arabic}</Arabic></div>}
      {page.body && <p className="ba-learning-topic-body">{page.body}</p>}
      {page.objective && <div className="ba-learning-objective"><strong>Tujuan pembelajaran</strong><p>{page.objective}</p></div>}
      {page.bullets?.length > 0 && <ol className="ba-learning-bullets">{page.bullets.map((item, index) => <li key={`${page.title}-${index}`}>{item}</li>)}</ol>}
      {page.grammar?.length > 0 && <div className="ba-learning-grammar">{page.grammar.map((item, index) => <section key={`${page.title}-grammar-${index}`}><h4>{item.heading}</h4><div><Arabic>{item.arabic}</Arabic></div><p>{item.detail}</p></section>)}</div>}
      {page.examples?.length > 0 && <div className="ba-learning-examples">{page.examples.map((item, index) => <section key={`${page.title}-example-${index}`}><strong><Arabic>{item.arabic}</Arabic></strong><p>{item.meaning}</p>{item.note && <small>{item.note}</small>}</section>)}</div>}
      {page.type === 'summary' && <div className="ba-learning-summary"><div><span>Fokus bab</span><strong>{page.focus}</strong></div><div><span>Target akhir</span><strong>{page.outcome}</strong></div></div>}
    </article>
  );
}

export default function LearningRoom({ onBack, onCompleteChapter = () => {}, onOpenMission = () => {}, completedChapterIds = [], vocabularyProgress = {} }) {
  const [chapterId, setChapterId] = useState(EPISODE_META[0].id);
  const [activeTab, setActiveTab] = useState('overview');
  const [visitedTabs, setVisitedTabs] = useState(['overview']);
  const learning = useMemo(() => getLearningChapter(chapterId), [chapterId]);
  const pages = learning?.pages ?? [];
  const chapterCase = CASES_CONFIG[chapterId];
  const completed = completedChapterIds.includes(chapterId);
  const allVocabularyIds = [...new Set(pages.flatMap((page) => page.vocabIds ?? []))];
  const vocabulary = allVocabularyIds.map((id) => { const word = getLearningVocabulary(id); return word ? { ...word, vocabId: id } : null; }).filter(Boolean);
  const masteredInChapter = allVocabularyIds.filter((id) => vocabularyProgress[id]?.masteryStatus === 'mastered').length;
  const audioPages = pages.filter((page) => page.istima);
  const contentPages = pages.filter((page) => page.type !== 'cover' && page.type !== 'istima');
  const coverPage = pages.find((page) => page.type === 'cover');
  const competencyPage = pages.find((page) => page.type === 'competency');
  const selectedMeta = learning?.meta ?? EPISODE_META[0];
  const canComplete = ['overview', 'lesson', 'vocabulary', 'audio'].every((tab) => visitedTabs.includes(tab));
  const selectTab = (tabId) => { setActiveTab(tabId); setVisitedTabs((previous) => [...new Set([...previous, tabId])]); };

  const chooseChapter = (id) => {
    setChapterId(id);
    setActiveTab('overview');
    setVisitedTabs(['overview']);
  };

  if (!learning || !chapterCase) return <section className="ba-learning-room"><button className="ba-back-button" onClick={onBack}>← Kembali</button><p>Materi bab belum tersedia.</p></section>;

  return (
    <section className="ba-learning-room page-enter">
      <div className="ba-screen-topline"><button className="ba-back-button" onClick={onBack}>← Kembali ke lobby</button><span className="ba-screen-kicker">ACADEMY / INTERACTIVE LEARNING ROOM</span></div>
      <header className="ba-learning-header ba-game-panel">
        <div><span className="ba-panel-kicker">TRAINING DECK · BAHASA ARAB MA KELAS XI</span><h1>Interactive Learning Room</h1><p>Masuk ke ruang belajar, pelajari konsep, dengarkan contoh, kumpulkan mufrodat, lalu uji pemahaman melalui misi investigasi.</p></div>
        <div className="ba-learning-header-stats"><span><strong>06</strong><small>CHAPTERS</small></span><span><strong>{vocabulary.length}</strong><small>VOCAB IN CHAPTER</small></span><span><strong>{completedChapterIds.length}/6</strong><small>COMPLETED</small></span></div>
      </header>

      <div className="ba-learning-chapter-grid" aria-label="Pilih bab pembelajaran">
        {EPISODE_META.map((meta, index) => {
          const selected = meta.id === chapterId;
          const done = completedChapterIds.includes(meta.id);
          const data = getLearningChapter(meta.id);
          const chapterWords = [...new Set((data?.pages ?? []).flatMap((page) => page.vocabIds ?? []))];
          const chapterMastered = chapterWords.filter((id) => vocabularyProgress[id]?.masteryStatus === 'mastered').length;
          return (
            <button key={meta.id} className={`ba-learning-chapter ${selected ? 'is-selected' : ''} ${done ? 'is-complete' : ''}`} onClick={() => chooseChapter(meta.id)} aria-pressed={selected}>
              <div className="ba-learning-chapter-art"><SceneArt sceneType={CASES_CONFIG[meta.id].sceneType} /><span className="ba-learning-chapter-number">0{index + 1}</span><span className="ba-learning-chapter-state">{done ? '✓ COMPLETED' : 'OPEN'}</span></div>
              <div className="ba-learning-chapter-copy"><span>BAB {data?.chapter.curriculum.chapter} · {data?.chapter.curriculum.level}</span><Arabic>{meta.titleArabic}</Arabic><strong>{meta.title}</strong><small>{meta.caseTitle}</small><div className="ba-learning-chapter-progress"><span>{chapterMastered}/{chapterWords.length} dikuasai</span><div><span style={{ width: `${chapterWords.length ? chapterMastered / chapterWords.length * 100 : 0}%` }} /></div></div></div>
            </button>
          );
        })}
      </div>

      <section className="ba-learning-selected">
        <div className="ba-learning-selected-intro ba-game-panel">
          <div className="ba-learning-selected-art"><SceneArt sceneType={chapterCase.sceneType} /></div>
          <div className="ba-learning-selected-copy"><span className="ba-panel-kicker">CHAPTER {selectedMeta.label} · {selectedMeta.semester.toUpperCase()} SEMESTER</span><Arabic className="ba-learning-selected-arabic">{selectedMeta.titleArabic}</Arabic><h2>{selectedMeta.title}</h2><p>{coverPage?.body ?? chapterCase.caseInfo.description}</p><div className="ba-learning-meta"><span>Level: {learning.chapter.curriculum.level}</span><span>Halaman sumber: {learning.chapter.curriculum.sourcePages}</span><span>{masteredInChapter}/{vocabulary.length} mufrodat dikuasai</span></div><button className="ba-learning-mission-button" onClick={() => onOpenMission(chapterId)}>START CHAPTER MISSION ↗</button></div>
          <div className="ba-learning-status">{completed ? <><strong>✓</strong><span>CHAPTER COMPLETED</span></> : <><strong>01</strong><span>IN PROGRESS</span></>}</div>
        </div>

        <div className="ba-learning-tabs" role="tablist" aria-label="Bagian materi">
          {TABS.map((tab) => <button key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} onClick={() => selectTab(tab.id)} role="tab" aria-selected={activeTab === tab.id}><strong>{tab.label}</strong><small>{tab.caption}</small></button>)}
        </div>

        <div className="ba-learning-tab-content">
          {activeTab === 'overview' && <div className="ba-learning-overview-grid">
            <article className="ba-game-panel ba-learning-overview-main"><span className="ba-panel-kicker">CHAPTER BRIEFING</span><h2>{coverPage?.title ?? selectedMeta.title}</h2><p>{coverPage?.body ?? chapterCase.caseInfo.description}</p><div className="ba-learning-focus"><span>FOKUS PEMBELAJARAN</span><strong>{learning.chapter.curriculum.focus}</strong></div><div className="ba-learning-focus"><span>JENIS TEKS</span><strong>{learning.chapter.curriculum.textGenre}</strong></div><div className="ba-learning-focus"><span>KAIDAH BAHASA</span><strong>{learning.chapter.curriculum.grammar}</strong></div></article>
            <article className="ba-game-panel ba-learning-overview-objectives"><span className="ba-panel-kicker">LEARNING OBJECTIVES</span><h2>Target kompetensi</h2>{(competencyPage?.bullets ?? []).map((item, index) => <div className="ba-learning-objective-row" key={`${chapterId}-objective-${index}`}><span>0{index + 1}</span><p>{item}</p></div>)}<button className="ba-learning-tab-link" onClick={() => selectTab('lesson')}>Mulai pelajari materi →</button></article>
          </div>}

          {activeTab === 'lesson' && <div className="ba-learning-topic-grid">{contentPages.map((page, index) => <PageContent page={page} key={`${chapterId}-${page.type}-${index}`} />)}</div>}

          {activeTab === 'vocabulary' && <div className="ba-learning-vocab-grid">{vocabulary.map((word) => <article className="ba-learning-vocab-card" key={word.vocabId}><div className="ba-learning-vocab-art"><SceneArt sceneType={CASES_CONFIG[word.sourceEpisodeIds?.[0]]?.sceneType ?? 'shopping'} /></div><div className="ba-learning-vocab-top"><span>{word.partOfSpeech}</span><small>{word.level}</small></div><strong><Arabic>{word.arabic}</Arabic></strong><span className="ba-learning-translit">{word.transliteration}</span><h3>{word.meaningIndo}</h3>{word.exampleSentences?.[0] && <div className="ba-learning-vocab-example"><Arabic>{word.exampleSentences[0].arabic}</Arabic><small>{word.exampleSentences[0].meaningIndo}</small></div>}</article>)}</div>}

          {activeTab === 'audio' && <div className="ba-learning-audio-list">{audioPages.length ? audioPages.map((page, index) => <article className="ba-game-panel ba-learning-audio-card" key={`${chapterId}-audio-${index}`}><div className="ba-learning-audio-heading"><div><span className="ba-panel-kicker">AUDIO ISTIMA’</span><h2>{page.istima.title}</h2></div><span className="ba-learning-audio-badge">TTS FUSHA</span></div><p>{page.istima.adaptationNote}</p><div className="ba-learning-audio-player"><ArabicAudioButton text={page.istima.audioText} compact={false} label="Putar audio Bahasa Arab" /><span>Putar audio, dengarkan pengucapan, lalu ikuti transkrip.</span></div><div className="ba-learning-transcript">{page.istima.turns.map((turn, turnIndex) => <div key={`${chapterId}-turn-${turnIndex}`}><span>{turn.speakerIndo}</span><strong><Arabic>{turn.arabic}</Arabic></strong><p>{turn.translation}</p></div>)}</div></article>) : <p className="ba-learning-empty">Audio untuk bab ini belum tersedia.</p>}</div>}

          {activeTab === 'practice' && <div className="ba-learning-practice-grid"><article className="ba-game-panel"><span className="ba-panel-kicker">KNOWLEDGE CHECK</span><h2>Uji pemahamanmu</h2><p>Latihan pemahaman dan checkpoint terhubung dengan sistem investigasi bab ini. Selesaikan briefing, kumpulkan bukti, susun puzzle, dan capai mastery minimal 70.</p><div className="ba-learning-practice-stats"><span><strong>{chapterCase.evidence.length}</strong><small>BUKTI</small></span><span><strong>{chapterCase.mastery.length}</strong><small>CHECKPOINT</small></span><span><strong>{chapterCase.suspects.length}</strong><small>TERSANGKA</small></span></div><button className="ba-learning-mission-button" onClick={() => onOpenMission(chapterId)}>MULAI LATIHAN INVESTIGASI ↗</button></article><article className="ba-game-panel ba-learning-complete-card"><span className="ba-panel-kicker">CHAPTER COMPLETION</span><div className="ba-learning-complete-symbol">✦</div><h2>{completed ? 'Bab sudah diselesaikan' : 'Selesaikan ruang belajar'}</h2><p>{completed ? 'Reward penyelesaian bab telah tercatat pada profilmu.' : 'Setelah membaca materi dan mendengarkan audio, tandai bab ini selesai untuk memperoleh XP.'}</p><button className="ba-learning-complete-button" onClick={() => onCompleteChapter(chapterId)} disabled={completed || !canComplete}>{completed ? 'COMPLETED' : canComplete ? 'COMPLETE CHAPTER · +40 XP' : 'OPEN ALL LEARNING TABS FIRST'}</button></article></div>}
        </div>
      </section>
    </section>
  );
}
