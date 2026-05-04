'use client';

import { useState } from 'react';
import { LoginPage }                from './components/auth/LoginPage';
import { Sidebar }                  from './components/layout/Sidebar';
import { FraudDetectionDashboard }  from './components/dashboard/FraudDetectionDashboard';
import { RecentTransactions }       from './components/dashboard/RecentTransactions';
import { CheckFraudAPI }            from './components/dashboard/CheckFraudAPI';
import { FraudAlerts }              from './components/dashboard/FraudAlerts';
import { Settings }                 from './components/dashboard/Settings';
import { UserProfile }              from './components/dashboard/UserProfile';
import { AIChatbox }                from './components/ui/AIChatbox';
import { MLModelInfo }              from './components/sections/MLModelInfo';
import GraphAnalysisPage            from './modules/graph-analysis/page';
import StreamingMonitorPage         from './modules/streaming-monitor/page';
import FederatedLearningPage        from './modules/federated-learning/page';
import UserProfilingPage            from './modules/user-profiling/page';
import { Search, Bell }             from 'lucide-react';

// Page title for each section
const PAGE_TITLES: Record<string, string> = {
  home:          'Home / Dashboard',
  transactions:  'Transactions Directory',
  alerts:        'Real-time Fraud Alerts 🔔',
  analytics:     'Analytics & ML',
  'check-fraud': 'Real-Time Fraud Detection API',
  'user-profile':'User Profile',
  settings:      'Settings',
  graph:         'Network Graph Analysis 🕸️',
  streaming:     'Live Streaming Monitor 📡',
  federated:     'Federated Learning Panel 🤝',
  profiling:     'User Behavioral Profiling 👤',
};

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [username, setUsername]           = useState('');

  /* ── Auth handlers ── */
  const handleLogin = (email: string) => {
    setUsername(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setActiveSection('home');
  };

  /* ── Show login page if not authenticated ── */
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  /* ── Render dashboard section ── */
  const renderContent = () => {
    switch (activeSection) {
      case 'home':         return <FraudDetectionDashboard />;
      case 'transactions': return <RecentTransactions />;
      case 'alerts':       return <FraudAlerts />;
      case 'analytics':    return <MLModelInfo />;
      case 'check-fraud':  return <CheckFraudAPI />;
      case 'user-profile': return <UserProfile />;
      case 'settings':     return <Settings />;
      case 'graph':        return <GraphAnalysisPage />;
      case 'streaming':    return <StreamingMonitorPage />;
      case 'federated':    return <FederatedLearningPage />;
      case 'profiling':    return <UserProfilingPage />;
      default:
        return <FraudDetectionDashboard />;
    }
  };

  const pageTitle = PAGE_TITLES[activeSection] ?? 'Dashboard';
  const initials  = username
    ? username.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="app-shell">
      {/* Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isLoggedIn={isLoggedIn}
        username={username}
        onLoginClick={() => {}}
        onLogout={handleLogout}
      />

      {/* Main area */}
      <div className="main-shell">
        {/* Top Header */}
        <header className="top-header">
          <h1 className="top-header-title">{pageTitle}</h1>

          <div className="top-header-right">
            {/* Search */}
            <div className="header-search-wrap">
              <Search size={15} className="header-search-icon" />
              <input
                className="header-search-input"
                placeholder="Search globally..."
              />
            </div>

            {/* Bell */}
            <div className="header-bell-wrap">
              <Bell size={20} className="header-bell-icon" />
              <span className="header-bell-dot" />
            </div>

            {/* User chip */}
            <div className="header-user-chip">
              <div className="header-user-avatar">{initials}</div>
              <span className="header-user-email">{username}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="page-body">
          {renderContent()}
        </main>
      </div>

      {/* Floating AI Chatbox */}
      <AIChatbox />
    </div>
  );
}
