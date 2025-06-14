import React from 'react';
import { FileText, Users, Clock, ArrowRight, Building, CheckCircle } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      title: 'Permit Running',
      description: 'Professional permit runners handle all city office visits, document submissions, and follow-ups for your construction projects.',
      icon: FileText,
      features: ['Document submission', 'City office visits', 'Follow-up handling'],
      action: 'Request Runner',
      primary: true
    },
    {
      title: 'Become a Runner',
      description: 'Join our network of professional permit runners and earn money helping construction projects get approved.',
      icon: Users,
      features: ['Flexible schedule', 'Competitive pay', 'Professional support'],
      action: 'Sign Up',
      primary: false
    }
  ];

  const permitTypes = [
    {
      title: 'Building Permits',
      description: 'New construction, renovations, and structural modifications',
      icon: Building
    },
    {
      title: 'Electrical Permits',
      description: 'Electrical installations, upgrades, and repairs',
      icon: CheckCircle
    },
    {
      title: 'Plumbing Permits',
      description: 'Plumbing installations, repairs, and modifications',
      icon: CheckCircle
    },
    {
      title: 'Mechanical Permits',
      description: 'HVAC installations, modifications, and repairs',
      icon: CheckCircle
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you need permits processed or want to earn money as a permit runner, 
            we've got you covered.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className={`relative p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${
                  service.primary 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200' 
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {service.primary && (
                  <div className="absolute -top-3 left-8 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    service.primary ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                      service.primary
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                      {service.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Permit Types */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Permit Types We Handle</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {permitTypes.map((permit, index) => {
              const IconComponent = permit.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors">
                  <IconComponent className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">{permit.title}</h4>
                  <p className="text-sm text-gray-600">{permit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;