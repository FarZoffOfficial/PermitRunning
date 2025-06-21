export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          user_type: 'client' | 'runner' | 'admin'
          is_verified: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          user_type?: 'client' | 'runner' | 'admin'
          is_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          user_type?: 'client' | 'runner' | 'admin'
          is_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      runner_profiles: {
        Row: {
          id: string
          user_id: string
          experience_years: number | null
          specialties: string[] | null
          hourly_rate: number | null
          service_radius: number | null
          rating: number | null
          total_reviews: number | null
          completed_jobs: number | null
          is_available: boolean | null
          is_online: boolean | null
          background_check_status: 'pending' | 'approved' | 'rejected' | 'expired' | null
          license_number: string | null
          insurance_verified: boolean | null
          profile_image_url: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          experience_years?: number | null
          specialties?: string[] | null
          hourly_rate?: number | null
          service_radius?: number | null
          rating?: number | null
          total_reviews?: number | null
          completed_jobs?: number | null
          is_available?: boolean | null
          is_online?: boolean | null
          background_check_status?: 'pending' | 'approved' | 'rejected' | 'expired' | null
          license_number?: string | null
          insurance_verified?: boolean | null
          profile_image_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          experience_years?: number | null
          specialties?: string[] | null
          hourly_rate?: number | null
          service_radius?: number | null
          rating?: number | null
          total_reviews?: number | null
          completed_jobs?: number | null
          is_available?: boolean | null
          is_online?: boolean | null
          background_check_status?: 'pending' | 'approved' | 'rejected' | 'expired' | null
          license_number?: string | null
          insurance_verified?: boolean | null
          profile_image_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type_enum: 'client' | 'runner' | 'admin'
      permit_type_enum: 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'zoning' | 'other'
      request_status_enum: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
      priority_enum: 'standard' | 'urgent' | 'express'
      assignment_status_enum: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
      review_type_enum: 'client_to_runner' | 'runner_to_client'
      notification_type_enum: 'assignment' | 'status_update' | 'payment' | 'review' | 'system'
      payment_status_enum: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
      background_check_enum: 'pending' | 'approved' | 'rejected' | 'expired'
    }
  }
}