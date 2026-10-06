import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Fuel, 
  Clock, 
  ShieldCheck, 
  IndianRupee,
  Activity,
  Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await api.getAnalytics();
        if (res && res.data) {
          setMetrics(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const weeklyData = metrics?.weeklyTripTrend || [
    { day: "Mon", trips: 142, distanceKm: 1890, savingsINR: 15200 },
    { day: "Tue", trips: 158, distanceKm: 2110, savingsINR: 17400 },
    { day: "Wed", trips: 165, distanceKm: 2240, savingsINR: 19100 },
    { day: "Thu", trips: 149, distanceKm: 1980, savingsINR: 16800 },
    { day: "Fri", trips: 174, distanceKm: 2420, savingsINR: 20500 },
    { day: "Sat", trips: 130, distanceKm: 1650, savingsINR: 14100 },
    { day: "Sun", trips: 95, distanceKm: 1210, savingsINR: 10200 }
  ];

  const maxTrips = Math.max(...weeklyData.map(d => d.trips), 200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Fleet Telematics Analytics</span>
          <span className="badge badge-green">ESG Impact Verified</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Mobility & Operational Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Historical performance metrics, cost savings, trip throughput and emission abatements.
        </p>
      </div>

      {/* 4 Summary ESG / KPI Metric Cards */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Cumulative AI Savings
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
                ₹{metrics?.totalSavingsINR?.toLocaleString() || '18,450'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                ₹118 saved per dispatch leg
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={20} color="var(--accent-cyan)" />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                CO₂ Emissions Abated
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-emerald)', margin: '4px 0' }}>
                {metrics?.co2AbatementKg || '342.8'} kg
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Equivalent to 16 trees planted
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={20} color="var(--accent-emerald)" />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Fleet Utilization
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-purple)', margin: '4px 0' }}>
                {metrics?.fleetUtilizationPct || '78'}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                +14% vs traditional dispatch
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="var(--accent-purple)" />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                ETA Prediction Precision
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-amber)', margin: '4px 0' }}>
                ±{metrics?.averageEtaVarianceMin || '3.2'} min
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                98.6% on-time arrivals
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="var(--accent-amber)" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Charts Grid */}
      <div className="grid-2-1">
        {/* Weekly Trip Volume & Distance Traveled Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Weekly Trip Throughput & Distance</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Daily completed dispatches with predictive distance trends.
              </p>
            </div>
            <span className="badge badge-cyan">7-Day Rolling</span>
          </div>

          {/* SVG Bar Chart */}
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '10px 0 30px' }}>
            {weeklyData.map((item, idx) => {
              const heightPct = Math.round((item.trips / maxTrips) * 100);
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                    {item.trips}
                  </div>
                  <div 
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPct}%`,
                      background: 'var(--gradient-brand)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease',
                      boxShadow: '0 4px 12px rgba(0, 242, 254, 0.25)'
                    }} 
                    title={`${item.day}: ${item.trips} trips, ${item.distanceKm} km`}
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '600' }}>
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--accent-cyan)', borderRadius: '2px' }}></span>
              Completed Trips
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--accent-purple)', borderRadius: '2px' }}></span>
              Optimized Fuel Savings (Avg ₹16,800/day)
            </span>
          </div>
        </div>

        {/* Delay Risk Breakdown */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Delay Risk Distribution</h3>
              <ShieldCheck size={20} color="var(--accent-emerald)" />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Percentage of trips categorized by predictive corridor congestion exposure.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>● Low Risk (Free Flow)</span>
                  <strong>68%</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: '600' }}>● Moderate (Signal Throttle)</span>
                  <strong>24%</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '24%', height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#f43f5e', fontWeight: '600' }}>● High Risk (Bottlenecks)</span>
                  <strong>8%</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '8%', height: '100%', background: '#f43f5e', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            marginTop: '20px',
            fontSize: '0.8rem',
            color: '#cbd5e1'
          }}>
            <strong style={{ color: '#10b981' }}>AI Impact:</strong> Dynamic route rerouting prevented 92% of potential delays in high-risk zones over the last 48 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
