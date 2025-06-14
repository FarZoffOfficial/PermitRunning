import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Clock, User, Shield, CheckCircle, Phone, MessageCircle, Navigation } from 'lucide-react';

interface Runner {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  experience: string;
  estimatedTime: string;
  price: number;
  distance: string;
  profileImage: string;
  specialties: string[];
  completedJobs: number;
  isVerified: boolean;
  isOnline: boolean;
}

interface RunnerSelectionProps {
  pickupLocation: string;
  dropoffLocation: string;
  selectedDate: string;
  selectedTime: string;
  onBack: () => void;
  onSelectRunner: (runner: Runner) => void;
}

const RunnerSelection: React.FC<RunnerSelectionProps> = ({
  pickupLocation,
  dropoffLocation,
  selectedDate,
  selectedTime,
  onBack,
  onSelectRunner
}) => {
  const [assignedRunner, setAssignedRunner] = useState<Runner | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchProgress, setSearchProgress] = useState(0);
  const [runnerFound, setRunnerFound] = useState(false);

  const dummyRunners: Runner[] = [
    {
      id: '1',
      name: 'Michael Rodriguez',
      rating: 4.9,
      reviewCount: 127,
      experience: '5 years',
      estimatedTime: '8 min',
      price: 85,
      distance: '0.8 mi',
      profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      specialties: ['Building Permits', 'Electrical'],
      completedJobs: 342,
      isVerified: true,
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      rating: 4.8,
      reviewCount: 89,
      experience: '3 years',
      estimatedTime: '12 min',
      price: 75,
      distance: '0.5 mi',
      profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      specialties: ['Plumbing', 'Mechanical'],
      completedJobs: 198,
      isVerified: true,
      isOnline: true
    },
    {
      id: '3',
      name: 'David Thompson',
      rating: 4.7,
      reviewCount: 156,
      experience: '7 years',
      estimatedTime: '15 min',
      price: 95,
      distance: '1.2 mi',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      specialties: ['Building Permits', 'Zoning'],
      completedJobs: 445,
      isVerified: true,
      isOnline: true
    }
  ];

  useEffect(() => {
    // Simulate the search and auto-assignment process
    const searchInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(searchInterval);
          // Auto-assign the best available runner (closest with highest rating)
          const bestRunner = dummyRunners
            .filter(runner => runner.isOnline)
            .sort((a, b) => {
              // Sort by distance first, then by rating
              const distanceA = parseFloat(a.distance);
              const distanceB = parseFloat(b.distance);
              if (distanceA !== distanceB) {
                return distanceA - distanceB;
              }
              return b.rating - a.rating;
            })[0];
          
          setTimeout(() => {
            setAssignedRunner(bestRunner);
            setRunnerFound(true);
            setIsSearching(false);
          }, 500);
          
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(searchInterval);
  }, []);

  const handleConfirmRunner = () => {
    if (assignedRunner) {
      onSelectRunner(assignedRunner);
    }
  };

  const handleFindNewRunner = () => {
    setIsSearching(true);
    setRunnerFound(false);
    setSearchProgress(0);
    setAssignedRunner(null);
    
    // Simulate finding a different runner
    setTimeout(() => {
      const availableRunners = dummyRunners.filter(r => r.id !== assignedRunner?.id && r.isOnline);
      const newRunner = availableRunners[Math.floor(Math.random() * availableRunners.length)];
      setAssignedRunner(newRunner);
      setRunnerFound(true);
      setIsSearching(false);
    }, 2000);
  };

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
                  {isSearching ? 'Finding your runner...' : 'Runner assigned'}
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
              {/* Mock Map */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
                <div className="absolute inset-0 bg-gray-200 opacity-20"></div>
                
                {/* Location Markers */}
                <div className="absolute top-20 left-20 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="absolute bottom-20 right-20 bg-green-600 text-white p-2 rounded-full shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Assigned Runner Location */}
                {assignedRunner && (
                  <div className="absolute top-32 left-32 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white rounded-full p-1 shadow-lg border-2 border-blue-500 animate-pulse">
                      <img
                        src={assignedRunner.profileImage}
                        alt={assignedRunner.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                      {assignedRunner.name}
                    </div>
                  </div>
                )}

                {/* Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 100 100 Q 200 150 300 250"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    fill="none"
                    opacity="0.7"
                  />
                </svg>
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

          {/* Runner Assignment Panel */}
          <div className="space-y-4">
            {isSearching ? (
              /* Searching State */
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Finding your runner</h3>
                  <p className="text-gray-600 text-sm">We're matching you with the best available runner in your area</p>
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
                    <span>Calculating optimal routes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span>Matching expertise to your needs</span>
                  </div>
                </div>
              </div>
            ) : assignedRunner ? (
              /* Runner Assigned State */
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Runner Assigned</h3>
                  </div>
                  
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative">
                      <img
                        src={assignedRunner.profileImage}
                        alt={assignedRunner.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-xl font-bold text-gray-900">{assignedRunner.name}</h4>
                        {assignedRunner.isVerified && (
                          <Shield className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{assignedRunner.rating}</span>
                          <span>({assignedRunner.reviewCount} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {assignedRunner.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {assignedRunner.completedJobs} completed jobs • {assignedRunner.experience} experience
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Arrival time</span>
                      </div>
                      <span className="font-semibold text-gray-900">{assignedRunner.estimatedTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Distance</span>
                      </div>
                      <span className="font-semibold text-gray-900">{assignedRunner.distance} away</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">${assignedRunner.price}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmRunner}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Runner
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleFindNewRunner}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        Find Different Runner
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerSelection;