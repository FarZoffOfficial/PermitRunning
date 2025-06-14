import React from 'react';
import { Search, Globe, HelpCircle, LogIn, UserPlus, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">PermitRun</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Services
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Become a Runner
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Business
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
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
              <button className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                <LogIn className="w-4 h-4 mr-1 inline" />
                Log in
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                <UserPlus className="w-4 h-4 mr-1 inline" />
                Sign up
              </button>
            </div>

            <button className="md:hidden p-2 text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;