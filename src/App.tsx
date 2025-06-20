import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;