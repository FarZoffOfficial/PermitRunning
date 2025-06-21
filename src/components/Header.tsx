import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Globe, HelpCircle, LogIn, UserPlus, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const isRunner = userProfile?.user_type === 'runner';

  return (
    <>
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                  PermitRun
                </Link>
              </div>
              <nav className="hidden md:flex space-x-6">
                {/* Show Services and Become a Runner only when user is signed in */}
                {user && (
                  <>
                    {!isRunner && (
                      <Link 
                        to="/services" 
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          isActivePage('/services') 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        Services
                      </Link>
                    )}
                    {isRunner && (
                      <Link 
                        to="/runner/dashboard" 
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          isActivePage('/runner/dashboard') 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        Dashboard
                      </Link>
                    )}
                    {!isRunner && (
                      <Link 
                        to="/become-runner" 
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          isActivePage('/become-runner') 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        Become a Runner
                      </Link>
                    )}
                  </>
                )}
                <Link 
                  to="/business" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActivePage('/business') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Business
                </Link>
                <Link 
                  to="/about" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActivePage('/about') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Search and User Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 max-w-xs">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search PermitRun.com"
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <Globe className="w-5 h-5" />
                  <span className="ml-1 text-sm font-medium">EN</span>
                </button>
                <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                  <span className="ml-1 text-sm font-medium hidden sm:inline">Help</span>
                </button>
                
                {user ? (
                  /* Authenticated User Menu */
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">
                        {userProfile?.full_name || user.email?.split('@')[0]}
                      </span>
                      {isRunner && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Runner
                        </span>
                      )}
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {isRunner && (
                            <p className="text-xs text-green-600 font-medium">Runner Account</p>
                          )}
                        </div>
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        {!isRunner && (
                          <Link 
                            to="/my-requests" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            My Requests
                          </Link>
                        )}
                        {isRunner && (
                          <Link 
                            to="/runner/dashboard" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Runner Dashboard
                          </Link>
                        )}
                        <Link 
                          to="/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Settings
                        </Link>
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Unauthenticated User Buttons */
                  <>
                    <button 
                      onClick={handleLoginClick}
                      className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                      <LogIn className="w-4 h-4 mr-1 inline" />
                      Log in
                    </button>
                    <button 
                      onClick={handleSignUpClick}
                      className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 mr-1 inline" />
                      Sign up
                    </button>
                  </>
                )}
              </div>

              <button className="md:hidden p-2 text-gray-700">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;