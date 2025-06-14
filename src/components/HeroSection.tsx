import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import RunnerSelection from './RunnerSelection';

const HeroSection = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Now');
  const [showRunnerSelection, setShowRunnerSelection] = useState(false);

  const handleFindRunner = () => {
    if (pickupLocation && dropoffLocation) {
      setShowRunnerSelection(true);
    }
  };

  const handleBackToForm = () => {
    setShowRunnerSelection(false);
  };

  const handleSelectRunner = (runner: any) => {
    console.log('Selected runner:', runner);
    // Here you would typically navigate to a confirmation page or handle the booking
    alert(`Runner ${runner.name} selected! This would proceed to booking confirmation.`);
  };

  if (showRunnerSelection) {
    return (
      <RunnerSelection
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onBack={handleBackToForm}
        onSelectRunner={handleSelectRunner}
      />
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Get your permits approved with{' '}
                <span className="text-blue-600">PermitRun</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Connect with professional permit runners who handle the paperwork, 
                approvals, and back-and-forth with city offices so you don't have to.
              </p>
            </div>

            {/* Permit Request Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 max-w-md">
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="City office location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Your project location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This week</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option>Now</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFindRunner}
                disabled={!pickupLocation || !dropoffLocation}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Find a Runner
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <p className="text-sm text-gray-500 text-center">
                <button className="text-blue-600 hover:underline">
                  Log in to see your recent activity
                </button>
              </p>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Professional Service</h3>
                    <p className="text-blue-100">Expert permit runners handle everything</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Save Time</h3>
                    <p className="text-blue-100">No more waiting in long city office lines</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Remote Management</h3>
                    <p className="text-blue-100">Manage projects from anywhere</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;