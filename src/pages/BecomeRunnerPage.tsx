import React from 'react';
import { DollarSign, Clock, Users, Shield, CheckCircle, Star, Calendar, MapPin, TrendingUp } from 'lucide-react';

const BecomeRunnerPage = () => {
  const benefits = [
    {
      title: 'Flexible Schedule',
      description: 'Work when you want, where you want. Set your own hours and availability.',
      icon: Clock
    },
    {
      title: 'Competitive Earnings',
      description: 'Earn $25-50+ per hour based on your expertise and efficiency.',
      icon: DollarSign
    },
    {
      title: 'Growing Demand',
      description: 'Join a rapidly expanding market with consistent work opportunities.',
      icon: TrendingUp
    },
    {
      title: 'Professional Support',
      description: 'Get training, resources, and ongoing support from our team.',
      icon: Shield
    }
  ];

  const requirements = [
    'Valid driver\'s license and reliable transportation',
    'Smartphone with camera for document handling',
    'Professional communication skills',
    'Basic knowledge of construction permits (training provided)',
    'Background check and verification process',
    'Insurance coverage (we can help arrange)'
  ];

  const earnings = [
    {
      type: 'Building Permits',
      rate: '$35-50/hour',
      description: 'Complex permits requiring expertise'
    },
    {
      type: 'Electrical Permits',
      rate: '$30-45/hour',
      description: 'Specialized electrical knowledge'
    },
    {
      type: 'Plumbing Permits',
      rate: '$25-40/hour',
      description: 'Standard plumbing applications'
    },
    {
      type: 'Express Services',
      rate: '+50% bonus',
      description: 'Rush jobs and same-day service'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Become a <span className="text-green-600">PermitRun</span> Runner
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Turn your knowledge of construction permits into a flexible, 
                well-paying career. Help contractors and homeowners while earning 
                great money on your own schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Apply Now
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Earning Potential</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Part-time (20 hrs/week)</span>
                  <span className="text-2xl font-bold text-green-600">$2,000+/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Full-time (40 hrs/week)</span>
                  <span className="text-2xl font-bold text-green-600">$5,000+/month</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>Top runners earn $8,000+/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PermitRun?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a platform that values your expertise and supports your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Earnings Breakdown */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Earnings by Service Type
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Different permit types offer different earning opportunities based on complexity and expertise required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {earnings.map((earning, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{earning.type}</h3>
                  <span className="text-2xl font-bold text-green-600">{earning.rate}</span>
                </div>
                <p className="text-gray-600">{earning.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Runner Requirements
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We maintain high standards to ensure quality service for our clients. 
                Don't worry if you're new to permits - we provide comprehensive training!
              </p>
              
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Application Process</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span>Submit application and documents</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span>Background check and verification</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span>Complete training program</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <span>Start earning with your first job</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful permit runners who are building flexible, 
            profitable careers with PermitRun.
          </p>
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Apply to Become a Runner
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Application takes less than 10 minutes
          </p>
        </div>
      </section>
    </div>
  );
};

export default BecomeRunnerPage;