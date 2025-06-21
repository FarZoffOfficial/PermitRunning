import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RunnerSelectionProps {
  pickupLocation: string;
  dropoffLocation: string;
  selectedDate: string;
  selectedTime: string;
  onBack: () => void;
  onSelectRunner: (runner: any) => void;
}

const RunnerSelection: React.FC<RunnerSelectionProps> = ({
  pickupLocation,
  dropoffLocation,
  selectedDate,
  selectedTime,
  onBack,
  onSelectRunner
}) => {
  const [isSearching, setIsSearching] = useState(true);
  const [searchProgress, setSearchProgress] = useState(0);
  const [availableRunners, setAvailableRunners] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    searchForAvailableRunners();
  }, []);

  const searchForAvailableRunners = async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      // Simulate search progress
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Query for available runners
      const { data: runners, error: runnersError } = await supabase
        .from('runner_profiles')
        .select(`
          *,
          user_profiles!runner_profiles_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('is_available', true)
        .eq('is_online', true)
        .eq('background_check_status', 'approved');

      if (runnersError) {
        throw runnersError;
      }

      clearInterval(progressInterval);
      setSearchProgress(100);

      setTimeout(() => {
        setAvailableRunners(runners || []);
        setIsSearching(false);
      }, 1000);

    } catch (err: any) {
      console.error('Error searching for runners:', err);
      setError('Failed to find available runners. Please try again.');
      setIsSearching(false);
    }
  };

  const createPermitRequest = async (runnerId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('permit_requests')
        .insert([
          {
            client_id: user.id,
            runner_id: runnerId,
            permit_type: 'building', // Default for now
            project_description: 'Permit running service request',
            pickup_location: pickupLocation,
            dropoff_location: dropoffLocation,
            requested_date: new Date().toISOString().split('T')[0],
            requested_time: '09:00:00',
            status: 'assigned',
            priority: 'standard'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Create assignment record
      const { error: assignmentError } = await supabase
        .from('permit_assignments')
        .insert([
          {
            permit_request_id: data.id,
            runner_id: runnerId,
            status: 'assigned'
          }
        ]);

      if (assignmentError) throw assignmentError;

      // Send notification to runner
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: runnerId,
            title: 'New Job Request',
            message: `You have a new permit running request from ${pickupLocation} to ${dropoffLocation}`,
            type: 'assignment',
            action_url: `/runner/jobs/${data.id}`
          }
        ]);

      if (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }

      return data;
    } catch (err: any) {
      console.error('Error creating permit request:', err);
      throw err;
    }
  };

  const handleSelectRunner = async (runner: any) => {
    try {
      const request = await createPermitRequest(runner.id);
      onSelectRunner({ ...runner, requestId: request.id });
    } catch (err) {
      setError('Failed to assign runner. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={searchForAvailableRunners}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {isSearching ? 'Finding available runners...' : 
                   availableRunners.length > 0 ? 'Available Runners' : 'No Runners Available'}
                </h1>
                <p className="text-sm text-gray-500">{selectedDate} at {selectedTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-96 lg:h-[600px] relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
                <div className="absolute inset-0 bg-gray-200 opacity-20"></div>
                
                {/* Location Markers */}
                <div className="absolute top-20 left-20 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="absolute bottom-20 right-20 bg-green-600 text-white p-2 rounded-full shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {/* Trip Info Overlay */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-white rounded-xl shadow-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{pickupLocation}</p>
                      <p className="text-xs text-gray-500">City Office</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{dropoffLocation}</p>
                      <p className="text-xs text-gray-500">Project Location</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Runner Selection Panel */}
          <div className="space-y-4">
            {isSearching ? (
              /* Searching State */
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="mb-6">
                  <Loader2 className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching for runners</h3>
                  <p className="text-gray-600 text-sm">Looking for available permit runners in your area</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${searchProgress}%` }}
                  ></div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <span>Checking runner availability</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <span>Verifying credentials</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span>Matching expertise</span>
                  </div>
                </div>
              </div>
            ) : availableRunners.length === 0 ? (
              /* No Runners Available */
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Runners Available</h3>
                <p className="text-gray-600 text-sm mb-6">
                  There are currently no permit runners available in your area. 
                  This could be due to high demand or time of day.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={searchForAvailableRunners}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Search Again
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Modify Request
                  </button>
                </div>
              </div>
            ) : (
              /* Available Runners List */
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {availableRunners.length} Runner{availableRunners.length !== 1 ? 's' : ''} Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select a runner to handle your permit request
                  </p>
                </div>

                {availableRunners.map((runner) => (
                  <div key={runner.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-600">
                            {runner.user_profiles?.full_name?.charAt(0) || 'R'}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {runner.user_profiles?.full_name || 'Runner'}
                        </h4>
                        <div className="text-sm text-gray-600 mb-2">
                          {runner.experience_years} years experience
                        </div>
                        {runner.specialties && runner.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {runner.specialties.slice(0, 2).map((specialty: string) => (
                              <span
                                key={specialty}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          {runner.completed_jobs} completed jobs
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Available now</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectRunner(runner)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        Select Runner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerSelection;