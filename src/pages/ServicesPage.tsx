import React from 'react';
import { FileText, Clock, Shield, CheckCircle, Star, Users, Building, Zap, Wrench, Settings } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      title: 'Building Permits',
      description: 'Complete handling of building permit applications for new construction, renovations, and structural modifications.',
      icon: Building,
      features: [
        'Plan review coordination',
        'Code compliance verification',
        'Inspection scheduling',
        'Permit status tracking'
      ],
      pricing: 'Starting at $85',
      duration: '2-5 business days'
    },
    {
      title: 'Electrical Permits',
      description: 'Professional management of electrical permit applications for installations, upgrades, and repairs.',
      icon: Zap,
      features: [
        'Load calculation review',
        'Code compliance check',
        'Inspector coordination',
        'Final approval handling'
      ],
      pricing: 'Starting at $65',
      duration: '1-3 business days'
    },
    {
      title: 'Plumbing Permits',
      description: 'Expert handling of plumbing permit applications for installations, repairs, and modifications.',
      icon: Wrench,
      features: [
        'System design review',
        'Fixture approval',
        'Pressure test coordination',
        'Final inspection'
      ],
      pricing: 'Starting at $70',
      duration: '1-3 business days'
    },
    {
      title: 'Mechanical Permits',
      description: 'Comprehensive HVAC permit services for installations, modifications, and repairs.',
      icon: Settings,
      features: [
        'Equipment specifications',
        'Ductwork approval',
        'Energy compliance',
        'System commissioning'
      ],
      pricing: 'Starting at $75',
      duration: '2-4 business days'
    }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Submit Request',
      description: 'Provide project details and required documents through our platform.'
    },
    {
      step: '2',
      title: 'Runner Assignment',
      description: 'We match you with a qualified permit runner in your area.'
    },
    {
      step: '3',
      title: 'Application Processing',
      description: 'Your runner handles all city office visits and paperwork.'
    },
    {
      step: '4',
      title: 'Permit Delivery',
      description: 'Receive your approved permits and all documentation.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Professional Permit Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Skip the lines, avoid the hassle. Our expert permit runners handle all your 
              construction permit needs with speed and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started Today
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Permit Types We Handle
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From simple repairs to complex construction projects, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{service.pricing}</div>
                      <div className="text-sm text-gray-500">{service.duration}</div>
                    </div>
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Request Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes getting permits simple and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Permits Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2.5 Days</div>
              <div className="text-gray-600">Average Processing</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Runners</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of contractors and homeowners who trust PermitRun 
            for their permit needs.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Request Your First Permit
          </button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;