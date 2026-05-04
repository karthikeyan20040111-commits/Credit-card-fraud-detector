'use client';

import {
  Shield,
  LayoutDashboard,
  CreditCard,
  Bell,
  BarChart2,
  Settings,
  User,
  LogOut,
  Network,
  Radio,
  Users,
  GitMerge,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isLoggedIn: boolean;
  username: string;
  onLoginClick: () => void;
  onLogout: () => void;
}

const mainNavItems = [
  { id: 'home',        label: 'Home / Dashboard', icon: LayoutDashboard },
  { id: 'transactions',label: 'Transactions',      icon: CreditCard },
  { id: 'alerts',      label: 'Fraud Alerts',      icon: Bell },
  { id: 'analytics',   label: 'Analytics & ML',    icon: BarChart2 },
  { id: 'check-fraud', label: 'Check Fraud (API)', icon: Settings },
  { id: 'user-profile',label: 'User Profile',      icon: User },
  { id: 'settings',    label: 'Settings',           icon: Settings },
];

const advancedModules = [
  { id: 'graph',      label: 'Network Graph',     icon: Network },
  { id: 'streaming',  label: 'Stream Monitor',    icon: Radio },
  { id: 'federated',  label: 'Federated Learning',icon: GitMerge },
  { id: 'profiling',  label: 'User Profiling',    icon: Users },
];

export function Sidebar({
  activeSection,
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={20} color="#3b82f6" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-brand-line1">AI Fraud</span>
          <span className="sidebar-brand-line2">Detection</span>
        </div>
      </div>

      {/* Scrollable Nav Area */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Main Nav Items */}
        <nav className="sidebar-nav">
          {mainNavItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={16} className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{label}</span>
            </button>
          ))}
        </nav>

        {/* Advanced Modules Section */}
        <div className="sidebar-section-label">Advanced Modules</div>
        <nav className="sidebar-nav">
          {advancedModules.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar-nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={16} className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button className="sidebar-logout-item" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
