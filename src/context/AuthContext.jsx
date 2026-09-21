import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

const DEMO_USER_KEY = 'senai_carometro_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            // Check local fallback
            checkLocalSession();
          }
        } catch (e) {
          console.warn('Erro ao checar sessão Supabase:', e);
          checkLocalSession();
        }
      } else {
        checkLocalSession();
      }
      setLoading(false);
    }

    function checkLocalSession() {
      try {
        const saved = localStorage.getItem(DEMO_USER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (e) {}
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  async function fetchProfile(userId, userEmail) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data);
      } else {
        setProfile({
          id: userId,
          nome: userEmail ? userEmail.split('@')[0] : 'Administrador SENAI',
          email: userEmail || 'admin@senai.br',
          role: 'admin',
          ativo: true
        });
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil:', e);
      setProfile({
        id: userId,
        nome: userEmail ? userEmail.split('@')[0] : 'Administrador SENAI',
        email: userEmail || 'admin@senai.br',
        role: 'admin',
        ativo: true
      });
    }
  }

  // Login
  async function signIn(email, password, forceLocal = false) {
    if (isSupabaseConfigured && supabase && !forceLocal) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email);
      return data;
    }

    // Modo Demonstração / Local
    const mockUser = {
      id: 'demo-admin-id',
      email: email || 'admin@senai.br',
      user_metadata: { nome: 'Administrador SENAI' }
    };
    const mockProfile = {
      id: 'demo-admin-id',
      nome: 'Administrador SENAI',
      email: email || 'admin@senai.br',
      role: 'admin',
      ativo: true
    };

    setUser(mockUser);
    setProfile(mockProfile);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
    return { user: mockUser };
  }

  // Logout
  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
    setProfile(null);
  }

  const value = {
    user,
    profile,
    isAdmin: profile?.role === 'admin' || Boolean(user?.email?.includes('admin')) || (!isSupabaseConfigured && Boolean(user)),
    loading,
    signIn,
    signOut,
    isAuthenticated: Boolean(user)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
