import React, { useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RunnerSelection from './RunnerSelection';
import AuthModal from './auth/AuthModal';

const HeroSection = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Now');
  const [showRunnerSelection, setShowRunnerSelection] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const { user } = useAuth();

  const handleFindRunner = () => {
    if (!pickupLocation || !dropoffLocation) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // User is authenticated, proceed to runner selection
    setShowRunnerSelection(true);
  };

  const handleBackToForm = () => {
    setShowRunnerSelection(false);
  };

  const handleSelectRunner = (runner: any) => {
    console.log('Selected runner:', runner);
    // Here you would typically navigate to a confirmation page or handle the booking
    alert(`Runner ${runner.name} selected! This would proceed to booking confirmation.`);
  };

  const handleAuthSuccess = () => {
    // Close auth modal and proceed to runner selection
    setShowAuthModal(false);
    setShowRunnerSelection(true);
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
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
    <>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default HeroSection;