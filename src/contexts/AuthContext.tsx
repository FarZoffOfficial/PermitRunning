import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, userType: 'client' | 'runner') => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Create user profile when user signs up
      if (event === 'SIGNED_UP' && session?.user) {
        const userType = session.user.user_metadata.user_type || 'client'
        
        const { error } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata.full_name || '',
              user_type: userType,
              is_verified: false,
            }
          ])
        
        if (error) {
          console.error('Error creating user profile:', error)
        }

        // If user is signing up as a runner, also create a runner profile
        if (userType === 'runner') {
          const { error: runnerError } = await supabase
            .from('runner_profiles')
            .insert([
              {
                user_id: session.user.id,
                experience_years: 0,
                specialties: [],
                hourly_rate: 0,
                service_radius: 10,
                rating: 0,
                total_reviews: 0,
                completed_jobs: 0,
                is_available: false,
                is_online: false,
                background_check_status: 'pending',
                insurance_verified: false,
              }
            ])
          
          if (runnerError) {
            console.error('Error creating runner profile:', runnerError)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string, userType: 'client' | 'runner') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        }
      }
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}