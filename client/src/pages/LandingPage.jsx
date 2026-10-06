import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  ShieldAlert, 
  Cpu, 
  MapPin, 
  Clock, 
  Fuel, 
  Bot, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          fontSize: '0.85rem',
          color: 'var(--accent-cyan)',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          <Sparkles size={16} />
          <span>Next-Generation AI Urban Mobility Decision Engine</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          lineHeight: 1.12,
          marginBottom: '20px',
          fontWeight: '800'
        }}>
          Smarter Urban Routes. <br />
          <span className="text-gradient">Zero Bottlenecks.</span> 24% Lower Costs.
        </h1>

        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '750px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Traditional navigation systems only show lines on a map. 
          <strong style={{ color: '#fff' }}> MoveAI</strong> unifies predictive traffic intelligence, 
          dynamic vehicle capacity, multi-parcel delivery priority, and energy cost optimization into 
          one autonomous dispatch brain.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setActivePage('dispatch')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span>Run Fleet Optimizer Demo</span>
            <ArrowRight size={20} />
          </button>
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => setActivePage('dashboard')}
          >
            View Live Urban Telematics
          </button>
        </div>

        {/* Floating KPI Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '60px'
        }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>18.6 km</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Distance Saved per Dispatch</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>₹18,450</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Fleet Cost Optimization</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-purple)' }}>3.2 min</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Arrival ETA Precision</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-amber)' }}>-38%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Congestion Idle Emissions Cut</div>
          </div>
        </div>
      </section>

      {/* Problem vs MoveAI Solution Comparison */}
      <section style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>
            Why Standard GPS Route Planners Fail Urban Fleets
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Single-point routing tools ignore vehicle capacities, package deadlines, and ripple congestion delays.
          </p>
        </div>

        <div className="grid-cols-2">
          {/* Legacy System */}
          <div className="glass-card" style={{ padding: '30px', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} color="#f43f5e" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fca5a5' }}>Standard Navigation Tools</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <span style={{ color: '#f43f5e' }}>✕</span>
                Provides static shortest paths without predicting 30-minute congestion build-ups.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <span style={{ color: '#f43f5e' }}>✕</span>
                No understanding of vehicle weight capacity, EV battery range, or payload limits.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <span style={{ color: '#f43f5e' }}>✕</span>
                Dispatches vehicles haphazardly, resulting in overlapping routes and wasted fuel.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <span style={{ color: '#f43f5e' }}>✕</span>
                Manual dispatcher guesswork during sudden urban corridor roadblocks.
              </li>
            </ul>
          </div>

          {/* MoveAI Platform */}
          <div className="glass-card" style={{ padding: '30px', borderColor: 'rgba(0, 242, 254, 0.4)', background: 'rgba(16, 26, 48, 0.95)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} color="#00f2fe" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#7dd3fc' }}>MoveAI Autonomous Platform</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <strong>Predictive Traffic Modeling:</strong> Accounts for rush-hour trends, weather multipliers, and arterial choke points.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <strong>Constrained Vehicle Allocation:</strong> Automatically matches package weights to EV vs Diesel truck payload limits.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <strong>Multi-Stop Sequence Solver:</strong> Clusters deliveries geographically, saving up to 24% fuel per shift.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#10b981', fontSize: '0.9rem' }}>
                <span style={{ color: '#10b981' }}>✓</span>
                <strong>Gemini Conversational Copilot:</strong> Natural language mobility assistant grounded in live telemetry.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core AI Capabilities Showcase */}
      <section style={{ maxWidth: '1200px', margin: '50px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Full-Stack AI Mobility Modules</h2>
          <p style={{ color: 'var(--text-muted)' }}>Explore the comprehensive suite of intelligent mobility microservices.</p>
        </div>

        <div className="grid-cols-4">
          <div className="glass-card glass-card-interactive" style={{ padding: '24px' }} onClick={() => setActivePage('planner')}>
            <Cpu size={28} color="var(--accent-cyan)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Smart Route Optimizer</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Computes multi-criteria optimal trajectories balancing travel duration, fuel efficiency, and signal idle times.
            </p>
          </div>

          <div className="glass-card glass-card-interactive" style={{ padding: '24px' }} onClick={() => setActivePage('dashboard')}>
            <TrendingUp size={28} color="var(--accent-emerald)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Traffic Prediction</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Neural forecast engine that flags potential bottlenecks and corridor speed reductions before departure.
            </p>
          </div>

          <div className="glass-card glass-card-interactive" style={{ padding: '24px' }} onClick={() => setActivePage('dispatch')}>
            <Layers size={28} color="var(--accent-purple)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Vehicle Allocation</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Assigns packages to EV vans and light trucks respecting payload limits, driving range, and driver schedules.
            </p>
          </div>

          <div className="glass-card glass-card-interactive" style={{ padding: '24px' }} onClick={() => setActivePage('assistant')}>
            <Bot size={28} color="var(--accent-amber)" style={{ marginBottom: '14px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Gemini AI Assistant</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Conversational fleet copilot answering dispatcher questions with live grounded telemetry and routing rationale.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Banner */}
      <section style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div className="glass-card" style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(16, 26, 48, 0.9) 0%, rgba(30, 41, 75, 0.8) 100%)',
          border: '1px solid var(--accent-cyan)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
            Ready to test the Multi-Delivery Fleet Dispatch Workflow?
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 24px' }}>
            Simulate 5 real-world deliveries with varying weights and deadlines across 3 fleet vehicles, 
            and see how MoveAI clusters routes, minimizes fuel, and eliminates delays in under 1 second.
          </p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setActivePage('dispatch')}
          >
            Launch Fleet Dispatch Optimizer Now
          </button>
        </div>
      </section>
    </div>
  );
}
