import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  user_type: 'client' | 'runner' | 'admin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface RunnerProfile {
  id: string;
  user_id: string;
  experience_years: number;
  specialties: string[];
  hourly_rate: number;
  service_radius: number;
  rating: number;
  total_reviews: number;
  completed_jobs: number;
  is_available: boolean;
  is_online: boolean;
  background_check_status: 'pending' | 'approved' | 'rejected' | 'expired';
  license_number?: string;
  insurance_verified: boolean;
  profile_image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile;
}

export interface PermitRequest {
  id: string;
  client_id: string;
  runner_id?: string;
  permit_type: 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'zoning' | 'other';
  project_description: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_coordinates?: { x: number; y: number };
  dropoff_coordinates?: { x: number; y: number };
  requested_date: string;
  requested_time: string;
  estimated_duration?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'standard' | 'urgent' | 'express';
  budget_min?: number;
  budget_max?: number;
  final_price?: number;
  special_instructions?: string;
  documents_required: string[];
  created_at: string;
  updated_at: string;
  client_profile?: UserProfile;
  runner_profile?: RunnerProfile;
}

export interface PermitAssignment {
  id: string;
  permit_request_id: string;
  runner_id: string;
  assigned_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  runner_notes?: string;
  estimated_completion?: string;
  actual_completion?: string;
}

export interface Review {
  id: string;
  permit_request_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  review_type: 'client_to_runner' | 'runner_to_client';
  created_at: string;
}

export interface RunnerLocation {
  id: string;
  runner_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'assignment' | 'status_update' | 'payment' | 'review' | 'system';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  permit_request_id: string;
  client_id: string;
  runner_id: string;
  amount: number;
  platform_fee: number;
  runner_earnings: number;
  payment_method?: string;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  processed_at?: string;
  created_at: string;
}