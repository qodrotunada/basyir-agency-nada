
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from './AuthContext.jsx';
import './auth.css';

export default function AuthControls() {
  const { user, signIn, signUp, signOut } = useAuth();

  const [mode, setMode] = useState('login');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  const update = (event) => {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setFeedback(null);
    setForm(previous => ({
      ...previous,
      password: '',
      confirmPassword: ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setFeedback(null);

    try {
      if (mode === 'register') {
        if (!form.displayName.trim()) {
          throw new Error('Nama harus diisi.');
        }

        if (form.password.length < 8) {
          throw new Error('Password minimal 8 karakter.');
        }

        if (form.password !== form.confirmPassword) {
          throw new Error('Konfirmasi password tidak cocok.');
        }

        const { data, error } = await signUp({
          displayName: form.displayName,
          email: form.email,
          password: form.password
        });

        if (error) throw error;

        if (data?.session) {
          setFeedback({
            type: 'success',
            text: 'Registrasi berhasil. Akun sudah aktif.'
          });
        } else {
          setFeedback({
            type: 'success',
            text: 'Registrasi berhasil. Periksa email untuk verifikasi sebelum login.'
          });
        }
      } else {
        const { error } = await signIn({
          email: form.email,
          password: form.password
        });

        if (error) throw error;
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.message || 'Terjadi kesalahan. Silakan coba lagi.'
      });
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (busy) return;

    setBusy(true);

    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error) {
      setMode('login');
      setOpen(true);
      setFeedback({
        type: 'error',
        text: error.message || 'Logout gagal.'
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="auth-header-actions">
        {user ? (
          <>
            <span className="auth-user-label" title={user.email}>
              {user.user_metadata?.display_name || user.email}
            </span>
            <button
              className="auth-logout-button"
              onClick={handleLogout}
              disabled={busy}
            >
              Keluar
            </button>
          </>
        ) : (
          <>
            <span className="auth-guest-badge">Mode Tamu</span>
            <button
              className="auth-open-button"
              onClick={() => {
                changeMode('login');
                setOpen(true);
              }}
            >
              Masuk / Daftar
            </button>
          </>
        )}
      </div>

      {open && createPortal(
        <div
          className="modal-backdrop auth-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <section
            className="modal-card auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
            >
              ×
            </button>

            <div className="auth-visual" aria-hidden="true">
              <img src="/assets/detective-wasp-3d.png" alt="" />
              <span>YOUR NEXT CASE STARTS HERE</span>
              <strong>ARABIC LEARNING<br />BATTLE ACADEMY</strong>
              <small>Learn · Investigate · Level Up</small>
            </div>

            <div className="auth-content">
              <div className="modal-eyebrow">
                BASYIR AGENCY · AGENT ACCOUNT
              </div>

              <h2 id="auth-title">
                {mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}
              </h2>

              <p className="auth-description">
                {mode === 'login'
                  ? 'Masuk untuk menyimpan dan menyinkronkan progres pembelajaran.'
                  : 'Daftar untuk memiliki akun dan menyimpan progres pembelajaran secara online.'}
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label className="auth-field">
                  Nama lengkap
                  <input
                    name="displayName"
                    value={form.displayName}
                    onChange={update}
                    placeholder="Masukkan nama"
                    autoComplete="name"
                    required
                  />
                </label>
              )}

              <label className="auth-field">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="auth-field">
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={update}
                  placeholder="Minimal 8 karakter"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={8}
                  required
                />
              </label>

              {mode === 'register' && (
                <label className="auth-field">
                  Konfirmasi password
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={update}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </label>
              )}

              {feedback && (
                <div
                  className={`auth-feedback auth-feedback-${feedback.type}`}
                  role={feedback.type === 'error' ? 'alert' : 'status'}
                >
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={busy}
              >
                {busy
                  ? 'Memproses...'
                  : mode === 'login'
                    ? 'Masuk ke akun'
                    : 'Buat akun'}
              </button>
            </form>

            <div className="auth-switch">
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                type="button"
                onClick={() => changeMode(
                  mode === 'login' ? 'register' : 'login'
                )}
              >
                {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
              </button>
            </div>

              <button
                className="auth-guest-link"
                onClick={() => setOpen(false)}
              >
                Lanjutkan bermain sebagai tamu
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}
