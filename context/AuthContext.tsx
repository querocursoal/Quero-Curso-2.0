
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthError, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  profile: { full_name?: string; avatar_url?: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  register: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: any }>;
  uploadAvatar: (file: File) => Promise<{ publicUrl: string | null; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  const fetchUserRole = async (userId: string, userEmail?: string) => {
    try {
      // Check if user is admin by email
      const isAdminUser = userEmail === 'querocurso.al@gmail.com';
      setIsAdmin(isAdminUser);

      // Fetch student profile for name and avatar
      const { data: profileData } = await supabase
        .from('student_profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching user role/profile:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRole(session.user.id, session.user.email);
      } else {
        setIsAdmin(false);
        setProfile(null);
      }
      setLoading(false);
    });

    // Check for initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRole(session.user.id, session.user.email);
      }
      setLoading(false);
    };
    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setUser(null);
      setIsAdmin(false);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    const { error } = await supabase
      .from('student_profiles')
      .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() });

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : updates);
    }

    return { error };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { publicUrl: null, error: new Error('Usuário não autenticado') };

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) return { publicUrl: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { publicUrl, error: null };
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    profile,
    loading,
    login,
    register,
    resetPassword,
    logout,
    updateProfile,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
