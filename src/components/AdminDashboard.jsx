import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import './admin-dashboard.css';

const dateTime = (value) => {
  if (!value) return 'Belum ada aktivitas';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Waktu tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short'
  }).format(date);
};

const shortId = (value = '') => value ? `${value.slice(0, 8)}…${value.slice(-4)}` : '—';

function summarizeProgress(progress = {}) {
  const episodes = progress?.campaign_progress?.episodes ?? {};
  const vocabulary = progress?.vocabulary_progress ?? {};
  const completedEpisodes = Object.values(episodes).filter((item) => item?.caseCompleted === true).length;
  const learnedWords = Object.values(vocabulary).filter((item) => Number(item?.seenCount ?? 0) > 0).length;
  const bestScore = Math.max(0, ...Object.values(episodes).map((item) => Number(item?.bestScore ?? 0)).filter(Number.isFinite));
  return { completedEpisodes, learnedWords, bestScore, updatedAt: progress?.updated_at ?? null };
}

export default function AdminDashboard({ user, onBack }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) {
      setStatus('denied');
      return;
    }
    setStatus('loading');
    setError('');

    const { data: ownProfile, error: ownError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (ownError) {
      setError(ownError.message.includes('role')
        ? 'Kolom role belum tersedia. Jalankan SQL setup dashboard admin terlebih dahulu.'
        : `Tidak dapat memeriksa hak akses: ${ownError.message}`);
      setStatus('error');
      return;
    }
    if (ownProfile?.role !== 'admin') {
      setStatus('denied');
      return;
    }

    const [profilesResult, progressResult] = await Promise.all([
      supabase.from('profiles').select('id, display_name, role, created_at').order('created_at', { ascending: false }),
      supabase.from('player_progress').select('user_id, campaign_progress, vocabulary_progress, active_sessions, updated_at')
    ]);

    if (profilesResult.error || progressResult.error) {
      const issue = profilesResult.error ?? progressResult.error;
      setError(`Data dashboard tidak dapat dimuat: ${issue.message}`);
      setStatus('error');
      return;
    }

    setUsers(profilesResult.data ?? []);
    setProgressRows(progressResult.data ?? []);
    setLastRefresh(new Date());
    setStatus('ready');
  }, [user?.id]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const progressByUser = useMemo(() => {
    const map = new Map();
    progressRows.forEach((row) => map.set(row.user_id, summarizeProgress(row)));
    return map;
  }, [progressRows]);

  const rows = useMemo(() => users.map((profile) => ({
    ...profile,
    progress: progressByUser.get(profile.id) ?? summarizeProgress()
  })), [users, progressByUser]);

  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !needle || `${row.display_name ?? ''} ${row.id}`.toLowerCase().includes(needle);
      const matchesFilter = filter === 'all' || (filter === 'active' ? Boolean(row.progress.updatedAt) : !row.progress.updatedAt);
      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filter]);

  const activeUsers = rows.filter((row) => {
    const updated = Date.parse(row.progress.updatedAt ?? '');
    return Number.isFinite(updated) && Date.now() - updated <= 30 * 24 * 60 * 60 * 1000;
  }).length;
  const totalCompleted = rows.reduce((sum, row) => sum + row.progress.completedEpisodes, 0);
  const totalWords = rows.reduce((sum, row) => sum + row.progress.learnedWords, 0);

  if (status === 'denied') {
    return <section className="ba-admin-state"><div className="ba-admin-lock">⌑</div><p className="ba-admin-eyebrow">AREA TERBATAS</p><h1>Akses khusus admin</h1><p>Akun ini tidak memiliki hak akses dashboard administrator.</p><button className="ba-admin-primary" onClick={onBack}>Kembali ke pembelajaran</button></section>;
  }

  if (status === 'loading') {
    return <section className="ba-admin-state"><div className="ba-admin-spinner" /><h2>Memuat dashboard...</h2><p>Mengambil ringkasan pengguna dan progres belajar.</p></section>;
  }

  if (status === 'error') {
    return <section className="ba-admin-state"><div className="ba-admin-lock">!</div><p className="ba-admin-eyebrow">DASHBOARD ADMIN</p><h1>Data belum dapat dimuat</h1><p>{error}</p><div className="ba-admin-state-actions"><button className="ba-admin-secondary" onClick={onBack}>Kembali</button><button className="ba-admin-primary" onClick={loadDashboard}>Coba lagi</button></div></section>;
  }

  return (
    <div className="ba-admin page-enter">
      <div className="ba-admin-topline"><button className="ba-admin-back" onClick={onBack}>← Kembali ke pembelajaran</button><span className="ba-admin-secure">⌑ ADMIN ONLY</span></div>
      <section className="ba-admin-hero">
        <div><p className="ba-admin-eyebrow">BASYIR AGENCY / CONTROL CENTER</p><h1>Dashboard <em>Administrator</em></h1><p>Pantau akun dan perkembangan belajar dari satu tempat.</p></div>
        <div className="ba-admin-hero-actions"><span>Masuk sebagai <strong>{user.email ?? 'Administrator'}</strong></span><button className="ba-admin-secondary" onClick={loadDashboard}>↻ Perbarui data</button></div>
      </section>

      <section className="ba-admin-metrics" aria-label="Ringkasan statistik">
        <article className="ba-admin-metric"><span>Total pengguna</span><strong>{users.length}</strong><small>Profil terdaftar</small><b>01</b></article>
        <article className="ba-admin-metric"><span>Aktif 30 hari</span><strong>{activeUsers}</strong><small>Memiliki progres terbaru</small><b>02</b></article>
        <article className="ba-admin-metric"><span>Kasus diselesaikan</span><strong>{totalCompleted}</strong><small>Akumulasi seluruh pengguna</small><b>03</b></article>
        <article className="ba-admin-metric"><span>Kosakata dipelajari</span><strong>{totalWords}</strong><small>Akumulasi entri per pengguna</small><b>04</b></article>
      </section>

      <section className="ba-admin-panel">
        <div className="ba-admin-panel-head"><div><p className="ba-admin-eyebrow">USER DIRECTORY</p><h2>Data pengguna</h2><p>Nama profil dan ringkasan progres yang tersimpan di cloud.</p></div><span className="ba-admin-count">{filteredRows.length} pengguna</span></div>
        <div className="ba-admin-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau ID pengguna..." aria-label="Cari pengguna"/><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter aktivitas"><option value="all">Semua pengguna</option><option value="active">Ada progres cloud</option><option value="inactive">Belum ada progres cloud</option></select></div>
        <div className="ba-admin-table-wrap"><table className="ba-admin-table"><thead><tr><th>Pengguna</th><th>Peran</th><th>Kasus selesai</th><th>Kosakata</th><th>Skor terbaik</th><th>Aktivitas terakhir</th></tr></thead><tbody>
          {filteredRows.map((row) => <tr key={row.id}><td><strong>{row.display_name || 'Pengguna'}</strong><small>{shortId(row.id)}</small></td><td><span className={`ba-admin-role ${row.role === 'admin' ? 'is-admin' : ''}`}>{row.role || 'student'}</span></td><td>{row.progress.completedEpisodes}</td><td>{row.progress.learnedWords}</td><td>{row.progress.bestScore}</td><td>{dateTime(row.progress.updatedAt)}</td></tr>)}
          {!filteredRows.length && <tr><td colSpan="6" className="ba-admin-empty">Tidak ada pengguna yang cocok dengan pencarian.</td></tr>}
        </tbody></table></div>
        <div className="ba-admin-footnote">Waktu ditampilkan dalam WIB (Asia/Jakarta). Aktivitas dihitung dari pembaruan progres cloud, bukan status online langsung.</div>
      </section>
      <div className="ba-admin-refresh-note">{lastRefresh ? `Data diperbarui ${dateTime(lastRefresh.toISOString())}` : 'Belum diperbarui'}</div>
    </div>
  );
}
