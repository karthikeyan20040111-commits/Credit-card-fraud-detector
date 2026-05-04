'use client';

import { Settings as SettingsIcon, Bell, Shield, Sliders, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function Settings() {
  const { theme: currentTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    language: 'en',
    emailAlerts: true,
    smsAlerts: false,
    twoFactorAuth: true,
    apiKey: 'sk_live_51M...',
  });
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div id="settings-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">Settings</h2>
          <p className="section-subtitle">Manage your platform preferences and configurations</p>
        </div>
        <button 
          className="btn btn-primary"
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'var(--color-indigo-600)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
        {/* Settings Sidebar */}
        <div className="section-card" style={{ flex: '1', minWidth: '250px', height: 'fit-content' }}>
          <div className="section-card-body" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('general')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                  background: activeTab === 'general' ? 'var(--color-indigo-50)' : 'transparent',
                  color: activeTab === 'general' ? 'var(--color-indigo-600)' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === 'general' ? '600' : '500',
                  textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%'
                }}
              >
                <Sliders size={18} /> General Preferences
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                  background: activeTab === 'notifications' ? 'var(--color-indigo-50)' : 'transparent',
                  color: activeTab === 'notifications' ? 'var(--color-indigo-600)' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === 'notifications' ? '600' : '500',
                  textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%'
                }}
              >
                <Bell size={18} /> Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                  background: activeTab === 'security' ? 'var(--color-indigo-50)' : 'transparent',
                  color: activeTab === 'security' ? 'var(--color-indigo-600)' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === 'security' ? '600' : '500',
                  textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%'
                }}
              >
                <Shield size={18} /> Security & API
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="section-card" style={{ flex: '3', minWidth: '400px' }}>
          <div className="section-card-header">
            <h3 className="section-title">
              {activeTab === 'general' && 'General Preferences'}
              {activeTab === 'notifications' && 'Notification Settings'}
              {activeTab === 'security' && 'Security & API'}
            </h3>
          </div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {activeTab === 'general' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Theme Preference</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Choose your preferred dashboard appearance</p>
                  </div>
                  <select 
                    value={mounted ? currentTheme : 'system'} 
                    onChange={(e) => setTheme(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', outline: 'none' }}
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Language</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Select the primary language for the interface</p>
                  </div>
                  <select 
                    value={settings.language} 
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', outline: 'none' }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Email Alerts</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Receive daily summaries and high-risk fraud alerts via email</p>
                  </div>
                  <div 
                    onClick={() => handleToggle('emailAlerts')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', background: settings.emailAlerts ? 'var(--color-indigo-600)' : 'var(--color-slate-300)', 
                      position: 'relative', cursor: 'pointer', transition: 'background 0.2s' 
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', 
                      left: settings.emailAlerts ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' 
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>SMS Alerts</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Get text messages for critical security events immediately</p>
                  </div>
                  <div 
                    onClick={() => handleToggle('smsAlerts')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', background: settings.smsAlerts ? 'var(--color-indigo-600)' : 'var(--color-slate-300)', 
                      position: 'relative', cursor: 'pointer', transition: 'background 0.2s' 
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', 
                      left: settings.smsAlerts ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' 
                    }} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Two-Factor Authentication (2FA)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Require an extra security code when logging in</p>
                  </div>
                  <div 
                    onClick={() => handleToggle('twoFactorAuth')}
                    style={{ 
                      width: '44px', height: '24px', borderRadius: '12px', background: settings.twoFactorAuth ? 'var(--color-indigo-600)' : 'var(--color-slate-300)', 
                      position: 'relative', cursor: 'pointer', transition: 'background 0.2s' 
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', 
                      left: settings.twoFactorAuth ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' 
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ flex: '1' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Live API Key</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Your secret key for integrating with the fraud detection API</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="password" 
                      value={settings.apiKey} 
                      disabled 
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text-secondary)', width: '150px' }}
                    />
                    <button style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: '500' }}>
                      Reveal
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
