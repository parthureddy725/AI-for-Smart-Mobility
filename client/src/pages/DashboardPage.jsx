import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MoveMap from '../components/MoveMap';
import { 
  Truck, 
  Navigation2, 
  Activity, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  BatteryCharging
} from 'lucide-react';

export default function DashboardPage({ setActivePage }) {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [vehRes, alertRes] = await Promise.all([
          api.getVehicles(),
          api.getTrafficAlerts()
        ]);
        if (vehRes && vehRes.vehicles) setVehicles(vehRes.vehicles);
        if (alertRes && alertRes.alerts) setAlerts(alertRes.alerts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') return v.status === 'Active' || v.status === 'In-Transit';
    if (filterStatus === 'Idle') return v.status === 'Idle';
    if (filterStatus === 'Electric') return v.fuelType === 'Electric';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '4px' }}>
            Welcome back, <span className="text-gradient">{user ? user.name : 'Admin Dispatcher'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            MoveAI Telematics Operational Dashboard • Hyderabad Urban Grid
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('planner')}
          >
            Plan Commuter Route
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage('dispatch')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} />
            <span>Optimize Fleet Dispatch</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid-cols-4">
        {/* Vehicles */}
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Fleet Vehicles
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-main)' }}>
                24
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={13} />
                <span>6 Monitored in Live Sector</span>
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={22} color="var(--accent-blue)" />
            </div>
          </div>
        </div>

        {/* Trips */}
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Completed Trips
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-main)' }}>
                156
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={13} />
                <span>+18% from last week</span>
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Navigation2 size={22} color="var(--accent-cyan)" />
            </div>
          </div>
        </div>

        {/* Active Now */}
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Active In-Transit
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', margin: '4px 0', color: 'var(--accent-emerald)' }}>
                12
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot"></span>
                <span>Zero Stalled Corridors</span>
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={22} color="var(--accent-emerald)" />
            </div>
          </div>
        </div>

        {/* AI Savings */}
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderColor: 'rgba(0, 242, 254, 0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Fuel / Cost Savings
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '800', margin: '4px 0', color: 'var(--accent-cyan)' }}>
                ₹18,450
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={13} />
                <span>342.8 kg CO₂ Prevented</span>
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IndianRupee size={22} color="var(--accent-cyan)" />
            </div>
          </div>
        </div>
      </div>

      {/* LIVE MAP SECTION */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Live Urban Mobility Map</h2>
            <span className="badge badge-cyan">Real-Time GPS</span>
          </div>

          {/* Map Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Active', 'Idle', 'Electric'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter)}
                className={`btn btn-sm ${filterStatus === filter ? 'btn-primary' : 'btn-secondary'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Map Canvas */}
        <div style={{ height: '440px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
          <MoveMap 
            vehicles={filteredVehicles} 
            congestionZones={alerts}
            onVehicleClick={(veh) => setSelectedVehicle(veh)}
          />
        </div>
      </div>

      {/* Bottom Split: Traffic Prediction & AI Recommendations */}
      <div className="grid-cols-2">
        {/* Traffic Prediction */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.15rem' }}>Traffic Prediction & Disruptions</h3>
            </div>
            <span className="badge badge-amber">3 Corridors Flagged</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alt) => {
              const isHigh = alt.severity === 'High';
              const isMed = alt.severity === 'Medium';
              const badgeClass = isHigh ? 'badge-rose' : isMed ? 'badge-amber' : 'badge-green';

              return (
                <div 
                  key={alt.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(13, 21, 39, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.92rem' }}>{alt.zone}</span>
                    <span className={`badge ${badgeClass}`}>{alt.severity} Traffic (+{alt.delayMin}m)</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {alt.reason}
                  </p>
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(0, 242, 254, 0.08)',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Sparkles size={14} />
                    <span><strong>AI Mitigation:</strong> {alt.alternativeRoute}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem' }}>AI Mobility Recommendations</h3>
            </div>
            <span className="badge badge-cyan">Active Optimization</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Rec 1 */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05) 0%, rgba(16, 26, 48, 0.8) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                  Optimize Route • Vehicle VH-101 (Tata Ace EV)
                </span>
                <span className="badge badge-green">Save ₹120</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Bypassing Gachibowli flyover via Cable Bridge prevents 14 mins of low-speed regenerative drain, preserving 8% battery pack reserve.
              </p>
              <button 
                className="btn btn-outline-cyan btn-sm"
                onClick={() => setActivePage('planner')}
              >
                Inspect AI Route
              </button>
            </div>

            {/* Rec 2 */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(13, 21, 39, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                  Smart Re-allocation • Vehicle VH-102
                </span>
                <span className="badge badge-purple">Capacity 64%</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Combine Balanagar and Miyapur drops to eliminate duplicate return leg. Predicted distance reduction: 18.6 km.
              </p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setActivePage('dispatch')}
              >
                Apply Allocation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
