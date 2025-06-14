import { supabase } from './supabase';
import type { UserProfile } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  profile?: UserProfile;
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: {
    full_name: string;
    phone?: string;
    user_type: 'client' | 'runner';
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: userData.full_name,
            phone: userData.phone,
            user_type: userData.user_type,
          });

        if (profileError) throw profileError;

        // If user is signing up as a runner, create runner profile
        if (userData.user_type === 'runner') {
          const { error: runnerError } = await supabase
            .from('runner_profiles')
            .insert({
              user_id: data.user.id,
              experience_years: 0,
              hourly_rate: 0,
              service_radius: 10,
            });

          if (runnerError) throw runnerError;
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email!,
        profile: profile || undefined,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}