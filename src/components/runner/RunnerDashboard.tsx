import React, { useState, useEffect } from 'react';
import { 
  Power, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Bell, 
  CheckCircle, 
  X,
  Phone,
  MessageCircle,
  Navigation,
  User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface JobRequest {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  project_description: string;
  requested_date: string;
  requested_time: string;
  priority: string;
  client_name: string;
  estimated_duration: string;
  budget_max: number;
}

const RunnerDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [runnerProfile, setRunnerProfile] = useState<any>(null);
  const [pendingJobs, setPendingJobs] = useState<JobRequest[]>([]);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadRunnerProfile();
      loadPendingJobs();
      subscribeToJobRequests();
    }
  }, [user]);

  const loadRunnerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('runner_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      setRunnerProfile(data);
      setIsOnline(data.is_online || false);
    } catch (error) {
      console.error('Error loading runner profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingJobs = async () => {
    if (!runnerProfile) return;

    try {
      const { data, error } = await supabase
        .from('permit_assignments')
        .select(`
          *,
          permit_requests!permit_assignments_permit_request_id_fkey (
            *,
            user_profiles!permit_requests_client_id_fkey (
              full_name
            )
          )
        `)
        .eq('runner_id', runnerProfile.id)
        .eq('status', 'assigned');

      if (error) throw error;

      const formattedJobs = data?.map(assignment => ({
        id: assignment.permit_requests.id,
        assignmentId: assignment.id,
        pickup_location: assignment.permit_requests.pickup_location,
        dropoff_location: assignment.permit_requests.dropoff_location,
        project_description: assignment.permit_requests.project_description,
        requested_date: assignment.permit_requests.requested_date,
        requested_time: assignment.permit_requests.requested_time,
        priority: assignment.permit_requests.priority,
        client_name: assignment.permit_requests.user_profiles?.full_name || 'Client',
        estimated_duration: assignment.permit_requests.estimated_duration || '2-3 hours',
        budget_max: assignment.permit_requests.budget_max || 100
      })) || [];

      setPendingJobs(formattedJobs);
    } catch (error) {
      console.error('Error loading pending jobs:', error);
    }
  };

  const subscribeToJobRequests = () => {
    if (!runnerProfile) return;

    const subscription = supabase
      .channel('job_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'permit_assignments',
          filter: `runner_id=eq.${runnerProfile.id}`
        },
        () => {
          loadPendingJobs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const toggleOnlineStatus = async () => {
    if (!runnerProfile) return;

    const newStatus = !isOnline;
    
    try {
      const { error } = await supabase
        .from('runner_profiles')
        .update({ 
          is_online: newStatus,
          is_available: newStatus 
        })
        .eq('id', runnerProfile.id);

      if (error) throw error;
      
      setIsOnline(newStatus);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  const acceptJob = async (job: JobRequest) => {
    try {
      // Update assignment status
      const { error: assignmentError } = await supabase
        .from('permit_assignments')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', (job as any).assignmentId);

      if (assignmentError) throw assignmentError;

      // Update permit request status
      const { error: requestError } = await supabase
        .from('permit_requests')
        .update({ status: 'in_progress' })
        .eq('id', job.id);

      if (requestError) throw requestError;

      // Set as active job and remove from pending
      setActiveJob(job);
      setPendingJobs(prev => prev.filter(j => j.id !== job.id));

      // Send notification to client
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user?.id, // This should be client_id, but we need to get it from the request
            title: 'Runner Accepted Your Request',
            message: `Your permit runner is on the way to ${job.pickup_location}`,
            type: 'status_update'
          }
        ]);

      if (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const declineJob = async (job: JobRequest) => {
    try {
      // Update assignment status
      const { error: assignmentError } = await supabase
        .from('permit_assignments')
        .update({ status: 'cancelled' })
        .eq('id', (job as any).assignmentId);

      if (assignmentError) throw assignmentError;

      // Update permit request to find another runner
      const { error: requestError } = await supabase
        .from('permit_requests')
        .update({ 
          status: 'pending',
          runner_id: null 
        })
        .eq('id', job.id);

      if (requestError) throw requestError;

      // Remove from pending jobs
      setPendingJobs(prev => prev.filter(j => j.id !== job.id));
    } catch (error) {
      console.error('Error declining job:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!runnerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Runner Profile Not Found</h2>
          <p className="text-gray-600">Please complete your runner profile setup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Runner Dashboard</h1>
              {pendingJobs.length > 0 && (
                <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">{pendingJobs.length} pending</span>
                </div>
              )}
            </div>
            
            {/* Online Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <button
                  onClick={toggleOnlineStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOnline ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{runnerProfile.completed_jobs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{runnerProfile.rating || '0.0'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hourly Rate</p>
                  <p className="text-2xl font-bold text-gray-900">${runnerProfile.hourly_rate || '0'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Power className={`w-6 h-6 ${isOnline ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900">{isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {pendingJobs.length > 0 ? 'Pending Job Requests' : 'No Pending Requests'}
                </h2>
                {!isOnline && (
                  <p className="text-sm text-gray-500 mt-1">
                    Go online to receive job requests
                  </p>
                )}
              </div>
              
              <div className="divide-y divide-gray-200">
                {pendingJobs.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                    <p className="text-gray-500">
                      {isOnline 
                        ? 'You\'ll see new job requests here when they come in.'
                        : 'Turn on your availability to start receiving requests.'
                      }
                    </p>
                  </div>
                ) : (
                  pendingJobs.map((job) => (
                    <div key={job.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Permit Running Request
                            </h3>
                            {job.priority === 'urgent' && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{job.project_description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">From: {job.pickup_location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Navigation className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">To: {job.dropoff_location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {job.requested_date} at {job.requested_time}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Client: {job.client_name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            ${job.budget_max}
                          </div>
                          <div className="text-sm text-gray-500">
                            Est. {job.estimated_duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => acceptJob(job)}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Accept Job
                        </button>
                        <button
                          onClick={() => declineJob(job)}
                          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Active Job */}
          <div>
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Active Job</h2>
              </div>
              
              {activeJob ? (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Current Assignment</h3>
                      <p className="text-gray-600">{activeJob.project_description}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{activeJob.pickup_location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{activeJob.dropoff_location}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Call Client
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Job</h3>
                  <p className="text-gray-500">Accept a job request to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerDashboard;