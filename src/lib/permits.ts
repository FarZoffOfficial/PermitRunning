import { supabase } from './supabase';
import { RunnerService } from './runners';
import type { PermitRequest } from './supabase';

export class PermitService {
  // Create a new permit request
  static async createPermitRequest(requestData: {
    client_id: string;
    permit_type: 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'zoning' | 'other';
    project_description: string;
    pickup_location: string;
    dropoff_location: string;
    requested_date: string;
    requested_time: string;
    priority?: 'standard' | 'urgent' | 'express';
    budget_min?: number;
    budget_max?: number;
    special_instructions?: string;
    documents_required?: string[];
  }) {
    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .insert({
          ...requestData,
          status: 'pending',
          documents_required: requestData.documents_required || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-assign a runner
      const assignmentResult = await RunnerService.autoAssignRunner(data.id);
      
      if (assignmentResult.error) {
        console.warn('Failed to auto-assign runner:', assignmentResult.error);
        // Don't throw error here, the request was created successfully
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get permit requests for a client
  static async getClientPermitRequests(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .select(`
          *,
          runner_profile:runner_profiles(*,
            user_profile:user_profiles(*)
          )
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get a specific permit request
  static async getPermitRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .select(`
          *,
          client_profile:user_profiles!permit_requests_client_id_fkey(*),
          runner_profile:runner_profiles(*,
            user_profile:user_profiles(*)
          )
        `)
        .eq('id', requestId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update permit request
  static async updatePermitRequest(requestId: string, updates: Partial<PermitRequest>) {
    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .update(updates)
        .eq('id', requestId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Cancel permit request
  static async cancelPermitRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      // Cancel any active assignments
      await supabase
        .from('permit_assignments')
        .update({ status: 'cancelled' })
        .eq('permit_request_id', requestId)
        .in('status', ['assigned', 'accepted']);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get permit request with assignment details
  static async getPermitRequestWithAssignment(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .select(`
          *,
          client_profile:user_profiles!permit_requests_client_id_fkey(*),
          runner_profile:runner_profiles(*,
            user_profile:user_profiles(*)
          ),
          assignments:permit_assignments(*,
            runner_profile:runner_profiles(*,
              user_profile:user_profiles(*)
            )
          )
        `)
        .eq('id', requestId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Search permit requests (for admin/system use)
  static async searchPermitRequests(filters: {
    status?: string;
    permit_type?: string;
    priority?: string;
    date_from?: string;
    date_to?: string;
  }) {
    try {
      let query = supabase
        .from('permit_requests')
        .select(`
          *,
          client_profile:user_profiles!permit_requests_client_id_fkey(*),
          runner_profile:runner_profiles(*,
            user_profile:user_profiles(*)
          )
        `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.permit_type) {
        query = query.eq('permit_type', filters.permit_type);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}