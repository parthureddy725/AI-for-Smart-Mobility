import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Truck, 
  Navigation, 
  Layers, 
  Bot, 
  BarChart3,
  Sparkles,
  Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'landing', label: 'Platform Overview', icon: Home },
  { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard, badge: 'Live' },
  { id: 'dispatch', label: 'Fleet Optimizer', icon: Truck, highlight: true, badge: 'AI Core' },
  { id: 'planner', label: 'Smart Route Planner', icon: Navigation },
  { id: 'fleet', label: 'Fleet Management', icon: Layers },
  { id: 'assistant', label: 'AI Mobility Copilot', icon: Bot, badge: 'Gemini' },
  { id: 'analytics', label: 'Analytics & ESG', icon: BarChart3 }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      {/* Navigation Links */}
      <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{
          padding: '0 20px 8px',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-subtle)'
        }}>
          Navigation Modules
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={{
                width: 'calc(100% - 24px)',
                border: 'none',
                textAlign: 'left',
                justifyContent: 'flex-start'
              }}
            >
              <Icon size={19} color={isActive ? '#051329' : 'currentColor'} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="sidebar-text" style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span 
                  className={`badge ${isActive ? 'badge-purple' : item.highlight ? 'badge-cyan' : 'badge-green'}`} 
                  style={{ fontSize: '9px', padding: '1px 6px', marginLeft: 'auto' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Decision Engine Callout */}
      <div style={{
        margin: '16px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(0, 242, 254, 0.2)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            Real-Time AI Telematics
          </span>
        </div>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Predictive multi-criteria traffic solver active. Congestion index: 1.18x (Nominal).
        </p>
      </div>
    </aside>
  );
}
