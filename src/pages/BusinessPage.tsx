import React from 'react';
import { Building2, Users, Clock, Shield, CheckCircle, BarChart3, FileText, Headphones } from 'lucide-react';

const BusinessPage = () => {
  const features = [
    {
      title: 'Bulk Permit Management',
      description: 'Handle multiple permits simultaneously with dedicated account management.',
      icon: FileText
    },
    {
      title: 'Priority Processing',
      description: 'Fast-track your permits with priority queue and dedicated runners.',
      icon: Clock
    },
    {
      title: 'Team Collaboration',
      description: 'Multiple team members can track and manage permits from one dashboard.',
      icon: Users
    },
    {
      title: 'Advanced Reporting',
      description: 'Detailed analytics and reporting for project management and compliance.',
      icon: BarChart3
    },
    {
      title: 'Dedicated Support',
      description: '24/7 dedicated support team for enterprise clients.',
      icon: Headphones
    },
    {
      title: 'Compliance Tracking',
      description: 'Automated compliance monitoring and renewal notifications.',
      icon: Shield
    }
  ];

  const plans = [
    {
      name: 'Startup',
      price: '$299',
      period: '/month',
      description: 'Perfect for small construction companies',
      features: [
        'Up to 20 permits per month',
        'Basic dashboard access',
        'Email support',
        'Standard processing time',
        '2 team member accounts'
      ],
      popular: false
    },
    {
      name: 'Growth',
      price: '$599',
      period: '/month',
      description: 'Ideal for growing construction businesses',
      features: [
        'Up to 50 permits per month',
        'Advanced dashboard & reporting',
        'Priority phone support',
        'Expedited processing',
        '5 team member accounts',
        'Dedicated account manager'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large construction companies',
      features: [
        'Unlimited permits',
        'Custom integrations',
        '24/7 dedicated support',
        'Priority processing',
        'Unlimited team accounts',
        'Custom reporting',
        'API access'
      ],
      popular: false
    }
  ];

  const stats = [
    { number: '500+', label: 'Business Clients' },
    { number: '50,000+', label: 'Permits Processed' },
    { number: '99.2%', label: 'Success Rate' },
    { number: '2.1 Days', label: 'Avg Processing Time' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Enterprise Permit Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Streamline your construction business with our comprehensive permit management 
              platform. Built for contractors, developers, and construction companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Schedule Demo
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Enterprise Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage permits at scale with complete visibility and control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Business Pricing Plans
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business size and permit volume.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular ? 'border-purple-500' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  "PermitRun transformed our permit process"
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  "Before PermitRun, our team spent 15-20 hours per week dealing with permits. 
                  Now we focus on what we do best - building great projects. The time savings 
                  and reduced stress have been incredible."
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                    alt="Client"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-gray-600">CEO, Johnson Construction</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Saved</span>
                    <span className="font-bold text-purple-600">80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Permits Processed</span>
                    <span className="font-bold text-purple-600">2,400+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-bold text-purple-600">99.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Savings</span>
                    <span className="font-bold text-purple-600">$50K+/year</span>
                  </div>
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
            Ready to Scale Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading construction companies who trust PermitRun to handle 
            their permit needs efficiently and reliably.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Schedule a Demo
            </button>
            <button className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:border-gray-500 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPage;