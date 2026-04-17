'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X, LayoutDashboard, CreditCard, ListChecks, Info, LogIn, User, LogOut } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

const navLinks = [
  { href: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { href: 'analyzer',      label: 'Analyzer',      icon: CreditCard },
  { href: 'transactions',  label: 'Transactions',  icon: ListChecks },
  { href: 'about',         label: 'About',         icon: Info },
];

export function Navbar({ onLoginClick, isLoggedIn, username, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <header className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <Shield size={20} color="white" />
          </div>
          <div>
            <div className="navbar-brand-name">FraudGuard AI</div>
            <div className="navbar-brand-sub">Real-Time Protection</div>
          </div>
        </div>

        {/* Center Links (hidden on mobile) */}
        <nav className="navbar-links">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={`#${href}`}
              onClick={(e) => scrollTo(e, href)}
              className="navbar-link"
            >
              <Icon size={15} className="navbar-link-icon" />
              {label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <div className="navbar-user-pill">
                <div className="navbar-avatar">
                  <User size={15} color="#4f46e5" />
                </div>
                <span className="navbar-username">{username}</span>
              </div>
              <button onClick={onLogout} className="btn btn-danger btn-sm">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="btn btn-primary btn-sm">
              <LogIn size={15} /> Login
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="navbar-mobile-btn btn btn-secondary btn-sm"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <>
          <div
            className="mobile-nav-overlay open"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-nav-panel">
            <button
              className="mobile-nav-close btn btn-secondary btn-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {navLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={`#${href}`}
                onClick={(e) => scrollTo(e, href)}
                className="navbar-link"
              >
                <Icon size={17} className="navbar-link-icon" />
                {label}
              </a>
            ))}

            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--color-border-light)' }}>
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="navbar-user-pill" style={{ justifyContent: 'center' }}>
                    <div className="navbar-avatar">
                      <User size={15} color="#4f46e5" />
                    </div>
                    <span className="navbar-username">{username}</span>
                  </div>
                  <button onClick={() => { onLogout(); setMobileOpen(false); }} className="btn btn-danger btn-full">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => { setMobileOpen(false); onLoginClick(); }} className="btn btn-primary btn-full">
                  <LogIn size={16} /> Login
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
