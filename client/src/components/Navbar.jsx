import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, ShieldCheck, User, LogOut, Radio } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout, demoLogin } = useAuth();

  return (
    <header className="navbar">
      {/* Brand */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => setActivePage('landing')}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Zap size={22} color="#051329" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              Move<span className="text-gradient">AI</span>
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '2px 7px' }}>v2.4 PRO</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: '500' }}>
            Intelligent Urban Mobility & Fleet Optimizer
          </div>
        </div>
      </div>

      {/* Live System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem'
        }}>
          <span className="pulse-dot" style={{ background: '#10b981' }}></span>
          <span style={{ color: '#10b981', fontWeight: '600' }}>AI Decision Engine Online</span>
          <span style={{ color: 'var(--text-subtle)' }}>• 99.4% Telemetry Uptime</span>
        </div>

        {/* User Profile / Auth State */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--gradient-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px 10px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => demoLogin('Commuter')}
            >
              Commuter Demo
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => demoLogin('Fleet Director')}
            >
              Admin Demo
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
