import React, { useMemo, useState } from 'react';
import { EPISODE_META } from '../data/campaign.js';
import { getLearningChapter, getLearningVocabulary } from '../data/learningMaterials.js';
import { ArabicAudioButton } from './ArabicText.jsx';

function Arabic({ children, className = '' }) {
  return <span className={className} lang="ar" dir="rtl">{children}</span>;
}

export default function LearningFlipbook({ onBack, onCompleteChapter = () => {} }) {
  const [chapterId, setChapterId] = useState(EPISODE_META[0].id);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const learning = useMemo(() => getLearningChapter(chapterId), [chapterId]);
  const pages = learning?.pages ?? [];
  const page = pages[pageIndex] ?? pages[0];

  const move = (next) => {
    const target = Math.max(0, Math.min(pages.length - 1, next));
    setDirection(target >= pageIndex ? 'next' : 'prev');
    setPageIndex(target);
  };
  const goChapter = (id) => {
    setChapterId(id);
    setPageIndex(0);
    setDirection('next');
  };

  if (!learning || !page) return <section className="learning-library"><button className="back-link" onClick={onBack}>← Kembali</button><p>Materi bab belum tersedia.</p></section>;

  const percent = Math.round(((pageIndex + 1) / pages.length) * 100);
  const vocabIds = page.vocabIds ?? [];

  return <section className="learning-library page-enter">
    <div className="page-topline">
      <button className="back-link" onClick={onBack}>← Kembali ke kampanye</button>
      <span className="checkpoint-tag">MATERI AKADEMIK · DIGITAL FLIPBOOK</span>
    </div>

    <header className="library-heading">
      <div>
        <div className="eyebrow">BAHASA ARAB MA KELAS XI · KEMENAG RI 2020</div>
        <h1>Perpustakaan Materi</h1>
        <p>Enam bab akademik, dengan materi keterampilan dan kaidah yang dipisahkan dari cerita investigasi.</p>
      </div>
      <div className="library-book-mark"><Arabic>كِتَابٌ</Arabic></div>
    </header>

    <div className="library-chapters" aria-label="Pilih bab">
      {EPISODE_META.map((item) => {
        const selected = item.id === chapterId;
        const data = getLearningChapter(item.id);
        return <button key={item.id} className={`library-chapter ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={() => goChapter(item.id)}>
          <span>باب {data?.chapter.curriculum.chapter}</span>
          <Arabic className="library-chapter-arabic">{item.titleArabic}</Arabic>
          <strong>{item.title}</strong>
          <small>Kasus: {item.caseTitle}</small>
          <small>Hal. {data?.chapter.curriculum.sourcePages}</small>
        </button>;
      })}
    </div>

    <div className="flipbook-layout">
      <aside className="flipbook-toc">
        <div className="panel-kicker"><Arabic>فِهْرِسُ الْمَوْضُوعَاتِ</Arabic></div>
        <h2>Daftar isi</h2>
        <div className="toc-chapter-heading">
          <Arabic>{learning.meta.titleArabic}</Arabic>
          <strong>{learning.meta.title}</strong>
        </div>
        <p>Kasus investigasi: {learning.meta.caseTitle}</p>
        <div className="flipbook-toc-list">
          {pages.map((item, index) => <button key={`${chapterId}-${item.type}`} className={index === pageIndex ? 'toc-active' : ''} aria-current={index === pageIndex ? 'page' : undefined} onClick={() => move(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span><span>{item.title}</span>
          </button>)}
        </div>
      </aside>

      <div className="flipbook-stage">
        <article className={`flipbook-page flip-${direction}`} key={`${chapterId}-${pageIndex}`}>
          <div className="book-page-top">
            <span>BASYIR AGENCY · BAB {learning.chapter.curriculum.chapter}</span>
            <span className="book-page-top-academic"><Arabic>{learning.meta.titleArabic}</Arabic> · {learning.meta.title}</span>
            <span>{learning.chapter.curriculum.semester.toUpperCase()}</span>
          </div>
          <div className="book-page-content">
            <div className="book-page-kicker"><Arabic>{page.label}</Arabic></div>
            {page.type === 'cover' ? <div className="book-chapter-title-lockup">
              <Arabic className="book-chapter-title-arabic">{learning.meta.titleArabic}</Arabic>
              <h2>{learning.meta.title}</h2>
              <small>Kasus investigasi: {page.caseTitle}</small>
            </div> : <h2>{page.title}</h2>}
            {page.arabic && page.type !== 'cover' && <div className="book-arabic-title"><Arabic>{page.arabic}</Arabic></div>}
            {page.body && <p className="book-page-body">{page.body}</p>}

            {page.objective && <div className="book-learning-objective"><strong>Tujuan pembelajaran</strong><p>{page.objective}</p></div>}

            {page.bullets?.length > 0 && <div className="book-indicator-list">
              <h3>Indikator pembelajaran</h3>
              <ol>{page.bullets.map((item, i) => <li key={i}>{item}</li>)}</ol>
            </div>}

            {page.istima && <section className="istima-audio-card" aria-labelledby={`istima-title-${chapterId}`}>
              <div className="istima-audio-heading">
                <div>
                  <span className="panel-kicker">مَادَّةُ الِاسْتِمَاعِ · AUDIO ISTIMA'</span>
                  <h3 id={`istima-title-${chapterId}`}>{page.istima.title}</h3>
                </div>
                <span className="adaptation-badge">Adaptasi pembelajaran</span>
              </div>
              <p className="istima-adaptation-note">{page.istima.adaptationNote}</p>
              <div className="istima-audio-player">
                <ArabicAudioButton text={page.istima.audioText} compact={false} className="istima-play-button" label="Putar audio Istima' Bahasa Arab Fusha menggunakan TTS" />
                <p>Audio menggunakan Nabra Neural TTS Bahasa Arab Fusha dengan fallback suara Arab pada perangkat. Ini adalah audio TTS, bukan rekaman penutur manusia. Tekan kembali untuk memutar ulang.</p>
              </div>
              <div className="istima-transcript">
                <h3>Transkrip dan terjemahan</h3>
                {page.istima.turns.map((turn, i) => <article key={`${chapterId}-istima-${i}`}>
                  <div className="istima-speaker"><Arabic>{turn.speaker}</Arabic><span>{turn.speakerIndo}</span></div>
                  <strong className="istima-arabic-line"><Arabic>{turn.arabic}</Arabic></strong>
                  <p>{turn.translation}</p>
                </article>)}
              </div>
            </section>}

            {page.grammar?.length > 0 && <div className="book-grammar-list">
              {page.grammar.map((item, i) => <article key={i}>
                <h3>{item.heading}</h3>
                <div className="book-arabic-example"><Arabic>{item.arabic}</Arabic></div>
                <p>{item.detail}</p>
              </article>)}
            </div>}

            {page.examples?.length > 0 && <div className="book-examples">
              {page.examples.map((example, i) => <article key={i}>
                <strong><Arabic>{example.arabic}</Arabic></strong>
                <p>{example.meaning}</p>
                {example.note && <small>{example.note}</small>}
              </article>)}
            </div>}

            {vocabIds.length > 0 && <div className="book-vocab-grid">
              {vocabIds.map((id) => {
                const word = getLearningVocabulary(id);
                if (!word) return null;
                return <article key={id}>
                  <strong><Arabic>{word.arabic}</Arabic></strong>
                  <span>{word.transliteration}</span>
                  <small>{word.meaningIndo}</small>
                  {word.exampleSentences?.[0]?.arabic && <p><Arabic>{word.exampleSentences[0].arabic}</Arabic></p>}
                </article>;
              })}
            </div>}

            {page.type === 'summary' && <div className="book-summary-list">
              <div><b>Judul bab</b><span><Arabic>{learning.meta.titleArabic}</Arabic> · {learning.meta.title}</span></div>
              <div><b>Fokus bab</b><span>{learning.chapter.curriculum.focus}</span></div>
              <div><b>Jenis teks</b><span>{learning.chapter.curriculum.textGenre}</span></div>
              <div><b>Kaidah</b><span>{learning.chapter.curriculum.grammar}</span></div>
            </div>}
          </div>
          <div className="book-page-foot">
            <span>Sumber: Bahasa Arab MA Kelas XI, Kemenag RI (2020) · hlm. {page.sourcePages ?? learning.chapter.curriculum.sourcePages}</span>
            <strong>{pageIndex + 1}</strong>
          </div>
        </article>

        <div className="flipbook-controls">
          <button className="btn btn-secondary" onClick={() => move(pageIndex - 1)} disabled={pageIndex === 0}>← Halaman sebelumnya</button>
          <div className="book-progress" aria-live="polite">
            <strong>{pageIndex + 1} / {pages.length}</strong>
            <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
            <small>{percent}% dibaca</small>
          </div>
          {pageIndex === pages.length - 1
            ? <button className="btn btn-primary" onClick={() => onCompleteChapter(chapterId)}>Selesaikan bab ✦</button>
            : <button className="btn btn-primary" onClick={() => move(pageIndex + 1)}>Halaman berikutnya →</button>}
        </div>
      </div>
    </div>
    <p className="library-source-note">Flipbook memuat materi akademik, kosakata, kaidah, contoh, audio simakan adaptasi, dan rangkuman. Dialog Istima' merupakan adaptasi pembelajaran, bukan kutipan langsung dari buku. Misi, puzzle, dan checkpoint tetap berada di area permainan. Validasi akhir oleh guru Bahasa Arab tetap disarankan.</p>
  </section>;
}
