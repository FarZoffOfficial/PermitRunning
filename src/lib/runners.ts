import { supabase } from './supabase';
import type { RunnerProfile, PermitRequest, PermitAssignment } from './supabase';

export class RunnerService {
  // Get available runners in a specific radius
  static async getAvailableRunners(
    latitude?: number,
    longitude?: number,
    radius: number = 25,
    permitType?: string
  ) {
    try {
      let query = supabase
        .from('runner_profiles')
        .select(`
          *,
          user_profile:user_profiles(*)
        `)
        .eq('is_available', true)
        .eq('is_online', true)
        .eq('background_check_status', 'approved');

      // Filter by specialties if permit type is specified
      if (permitType) {
        query = query.contains('specialties', [permitType]);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If coordinates provided, filter by distance
      if (latitude && longitude && data) {
        // In a real app, you'd use PostGIS for spatial queries
        // For now, we'll return all available runners
        return { data, error: null };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Auto-assign a runner to a permit request
  static async autoAssignRunner(permitRequestId: string) {
    try {
      // Get the permit request details
      const { data: request, error: requestError } = await supabase
        .from('permit_requests')
        .select('*')
        .eq('id', permitRequestId)
        .single();

      if (requestError) throw requestError;

      // Find available runners with matching specialties
      const { data: runners, error: runnersError } = await this.getAvailableRunners(
        undefined,
        undefined,
        25,
        request.permit_type
      );

      if (runnersError) throw runnersError;

      if (!runners || runners.length === 0) {
        throw new Error('No available runners found');
      }

      // Sort runners by rating and completed jobs (best first)
      const sortedRunners = runners.sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return b.completed_jobs - a.completed_jobs;
      });

      const selectedRunner = sortedRunners[0];

      // Create assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from('permit_assignments')
        .insert({
          permit_request_id: permitRequestId,
          runner_id: selectedRunner.id,
          status: 'assigned',
          estimated_completion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      // Update permit request status and assign runner
      const { error: updateError } = await supabase
        .from('permit_requests')
        .update({
          status: 'assigned',
          runner_id: selectedRunner.id,
        })
        .eq('id', permitRequestId);

      if (updateError) throw updateError;

      // Create notification for runner
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedRunner.user_id,
          title: 'New Permit Assignment',
          message: `You've been assigned a new ${request.permit_type} permit request.`,
          type: 'assignment',
          action_url: `/assignments/${assignment.id}`,
        });

      return { data: { assignment, runner: selectedRunner }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update runner profile
  static async updateRunnerProfile(runnerId: string, updates: Partial<RunnerProfile>) {
    try {
      const { data, error } = await supabase
        .from('runner_profiles')
        .update(updates)
        .eq('id', runnerId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update runner location
  static async updateRunnerLocation(
    runnerId: string,
    latitude: number,
    longitude: number,
    accuracy?: number
  ) {
    try {
      const { data, error } = await supabase
        .from('runner_locations')
        .upsert({
          runner_id: runnerId,
          latitude,
          longitude,
          accuracy,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get runner assignments
  static async getRunnerAssignments(runnerId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_assignments')
        .select(`
          *,
          permit_request:permit_requests(*,
            client_profile:user_profiles(*)
          )
        `)
        .eq('runner_id', runnerId)
        .order('assigned_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Accept assignment
  static async acceptAssignment(assignmentId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_assignments')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;

      // Update permit request status
      await supabase
        .from('permit_requests')
        .update({ status: 'assigned' })
        .eq('id', data.permit_request_id);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Start assignment
  static async startAssignment(assignmentId: string) {
    try {
      const { data, error } = await supabase
        .from('permit_assignments')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;

      // Update permit request status
      await supabase
        .from('permit_requests')
        .update({ status: 'in_progress' })
        .eq('id', data.permit_request_id);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Complete assignment
  static async completeAssignment(assignmentId: string, notes?: string) {
    try {
      const { data, error } = await supabase
        .from('permit_assignments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          actual_completion: new Date().toISOString(),
          runner_notes: notes,
        })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;

      // Update permit request status
      await supabase
        .from('permit_requests')
        .update({ status: 'completed' })
        .eq('id', data.permit_request_id);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}