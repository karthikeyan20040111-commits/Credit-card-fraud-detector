'use client';

import { useState } from 'react';
import { Navbar }                   from './components/layout/Navbar';
import { Footer }                   from './components/layout/Footer';
import { HeroSection }              from './components/sections/HeroSection';
import { AboutSection }             from './components/sections/AboutSection';
import { MLModelInfo }              from './components/sections/MLModelInfo';
import { FraudDetectionDashboard }  from './components/dashboard/FraudDetectionDashboard';
import { RecentTransactions }       from './components/dashboard/RecentTransactions';
import { TransactionChecker }       from './components/forms/TransactionChecker';
import { LoginModal }               from './components/forms/LoginModal';

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername]   = useState('');

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={() => { setIsLoggedIn(false); setUsername(''); }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* Main Content — single column */}
      <main className="main-content">
        {/* Hero Banner */}
        <HeroSection />

        {/* Page Body */}
        <div className="page-content">
          <FraudDetectionDashboard />
          <TransactionChecker />
          <RecentTransactions />
          <MLModelInfo />
        </div>

        {/* Dark About Section */}
        <AboutSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
