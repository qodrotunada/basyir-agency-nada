
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return;

        setSession(nextSession);
        setLoading(false);
      }
    );

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          console.error('Gagal mengambil sesi:', error.message);
        }

        setSession(data?.session ?? null);
        setLoading(false);
      })
      .catch((error) => {
        if (!active) return;

        console.error('Kesalahan autentikasi:', error);
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({
    displayName,
    email,
    password
  }) => {
    return await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim()
        },
        emailRedirectTo: window.location.origin
      }
    });
  };

  const signIn = async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    isAuthenticated: Boolean(session?.user),
    signUp,
    signIn,
    signOut
  }), [session, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth harus digunakan di dalam AuthProvider.'
    );
  }

  return context;
}
