'use client';

import { User, Mail, Shield, Key } from 'lucide-react';
import { useState } from 'react';

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@fraudguard.ai',
    role: 'System Administrator',
    department: 'Risk Management',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save logic could go here
    }
    setIsEditing(!isEditing);
  };

  return (
    <div id="user-profile">
      <div className="section-header">
        <div>
          <h2 className="section-title">User Profile</h2>
          <p className="section-subtitle">Manage your personal information and account security</p>
        </div>
        <button 
          className={`btn ${isEditing ? 'btn-primary' : 'btn-outline'}`}
          onClick={toggleEdit}
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--color-border)', background: isEditing ? 'var(--color-indigo-600)' : 'transparent', color: isEditing ? 'white' : 'inherit' }}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
        {/* Profile Card */}
        <div className="section-card" style={{ flex: '1', minWidth: '300px' }}>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--color-indigo-100)', color: 'var(--color-indigo-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>{profile.name}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{profile.role}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <span className="badge badge-primary">Active</span>
              <span className="badge" style={{ background: 'var(--color-slate-100)' }}>Pro Plan</span>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="section-card" style={{ flex: '2', minWidth: '400px' }}>
          <div className="section-card-header">
            <h3 className="section-title">Personal Information</h3>
          </div>
          <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Full Name</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0 12px', height: '40px' }}>
                  <User size={16} color="var(--color-text-muted)" style={{ marginRight: '10px' }} />
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', opacity: isEditing ? 1 : 0.7 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Email Address</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0 12px', height: '40px' }}>
                  <Mail size={16} color="var(--color-text-muted)" style={{ marginRight: '10px' }} />
                  <input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', opacity: isEditing ? 1 : 0.7 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Role</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0 12px', height: '40px' }}>
                  <Shield size={16} color="var(--color-text-muted)" style={{ marginRight: '10px' }} />
                  <input
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', opacity: isEditing ? 1 : 0.7 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Department</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0 12px', height: '40px' }}>
                  <Key size={16} color="var(--color-text-muted)" style={{ marginRight: '10px' }} />
                  <input
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', opacity: isEditing ? 1 : 0.7 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
