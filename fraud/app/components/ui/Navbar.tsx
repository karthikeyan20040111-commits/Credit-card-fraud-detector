'use client';

import { useState } from 'react';
import { Shield, Menu, X, LogIn, User } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

export function Navbar({ onLoginClick, isLoggedIn, username, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#analyzer', label: 'Analyzer' },
    { href: '#transactions', label: 'Transactions' },
    { href: '#about', label: 'About' },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 p-4 flex justify-between items-center w-full">
        <a href="#hero" onClick={e => scrollToSection(e, '#hero')} className="flex items-center gap-2">
          <Shield size={24} className="text-indigo-600" />
          <span className="font-bold text-lg text-slate-900">FraudGuard AI</span>
        </a>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col transform transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen shrink-0 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex-1 flex flex-col">
          {/* Logo Desktop */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <a href="#hero" onClick={e => scrollToSection(e, '#hero')} className="flex items-center gap-3">
              <div className="bg-indigo-600 rounded-lg p-2 shrink-0">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-slate-900">FraudGuard AI</div>
                <div className="text-xs text-slate-500">Real-Time Protection</div>
              </div>
            </a>
          </div>
          
          {/* Logo Mobile Header in Sidebar */}
          <div className="flex items-center justify-between mb-8 md:hidden">
            <div className="font-bold text-xl text-slate-900">Menu</div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-2 flex-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => scrollToSection(e, link.href)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* User / Login */}
          <div className="pt-6 border-t border-slate-200 mt-auto">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 shrink-0">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium text-slate-900 truncate">{username}</div>
                    <div className="text-xs text-slate-500">Logged in</div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <LogIn size={18} /> Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
