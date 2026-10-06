import React, { useState } from 'react';
import { api } from '../services/api';
import MoveMap from '../components/MoveMap';
import { 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const INITIAL_DELIVERIES = [
  { id: "DEL-A", label: "Delivery A (Kondapur Pharma Hub)", destination: "Kondapur", weightKg: 180, deadlineMin: 90, priority: "Urgent" },
  { id: "DEL-B", label: "Delivery B (Madhapur E-Commerce Hub)", destination: "Madhapur", weightKg: 120, deadlineMin: 120, priority: "High" },
  { id: "DEL-C", label: "Delivery C (Gachibowli Tech Park)", destination: "Gachibowli", weightKg: 240, deadlineMin: 150, priority: "Standard" },
  { id: "DEL-D", label: "Delivery D (Jubilee Hills Retail Center)", destination: "Jubilee Hills", weightKg: 95, deadlineMin: 180, priority: "Standard" },
  { id: "DEL-E", label: "Delivery E (Banjara Hills Medical Logistics)", destination: "Banjara Hills", weightKg: 140, deadlineMin: 110, priority: "High" }
];

const INITIAL_VEHICLES = [
  { id: "VH-101", name: "Tata Ace EV (Urban Cargo)", type: "Electric Van", capacityKg: 1000, fuelType: "Electric", efficiencyKmPerUnit: 4.8, unitCost: 8.5, startLocation: "HITEC City" },
  { id: "VH-102", name: "Ashok Leyland BADA DOST", type: "Diesel Light Truck", capacityKg: 1850, fuelType: "Diesel", efficiencyKmPerUnit: 12.5, unitCost: 92.0, startLocation: "Kukatpally" },
  { id: "VH-103", name: "Mahindra Treo Zor", type: "Electric 3-Wheeler", capacityKg: 550, fuelType: "Electric", efficiencyKmPerUnit: 6.2, unitCost: 8.5, startLocation: "Banjara Hills" }
];

export default function FleetDispatchOptimizerPage() {
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await api.optimizeDispatch(deliveries, vehicles);
      if (res && res.success) {
        setResult(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDeliveries(INITIAL_DELIVERIES);
    setResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Flagship AI Workflow</span>
          <span className="badge badge-purple">Constrained Optimization</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Multi-Delivery & Fleet Allocation Optimizer
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '850px', fontSize: '0.95rem' }}>
          Solves the Capacitated Vehicle Routing Problem (CVRP) with real-time traffic multipliers, package weight limits, 
          and delivery urgency windows.
        </p>
      </div>

      {/* AI Decision Pipeline Visualization */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {[
            { step: '1', title: '5 Deliveries', desc: 'Weights & Deadlines' },
            { step: '2', title: '3 Vehicles', desc: 'EV & Diesel Pool' },
            { step: '3', title: 'Traffic Model', desc: 'Congestion Index' },
            { step: '4', title: 'Payload Limits', desc: 'Constraint Check' },
            { step: '5', title: 'Sequence TSP', desc: 'Geographic Cluster' },
            { step: '6', title: 'Optimal Dispatch', desc: 'Minimized Fuel' }
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                color: '#051329',
                fontSize: '11px',
                fontWeight: '800',
                margin: '0 auto 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.step}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Deliveries Input & Available Vehicles */}
      <div className="grid-cols-2">
        {/* Deliveries Pool */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem' }}>Active Delivery Orders ({deliveries.length})</h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleReset} title="Reset to default 5 deliveries">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deliveries.map((del, idx) => (
              <div 
                key={del.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(13, 21, 39, 0.8)',
                  border: '1px solid var(--card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {del.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                    <span>Dest: <strong style={{ color: '#fff' }}>{del.destination}</strong></span>
                    <span>Weight: <strong style={{ color: 'var(--accent-cyan)' }}>{del.weightKg} kg</strong></span>
                    <span>Deadline: <strong style={{ color: '#fff' }}>{del.deadlineMin} min</strong></span>
                  </div>
                </div>

                <span className={`badge ${del.priority === 'Urgent' ? 'badge-rose' : del.priority === 'High' ? 'badge-amber' : 'badge-cyan'}`}>
                  {del.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Vehicle Pool */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.15rem' }}>Available Fleet Vehicles ({vehicles.length})</h3>
            </div>
            <span className="badge badge-green">Ready for Dispatch</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {vehicles.map((veh) => {
              const isEV = veh.fuelType === 'Electric';
              return (
                <div 
                  key={veh.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(13, 21, 39, 0.8)',
                    border: '1px solid var(--card-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{veh.name}</span>
                    <span className={`badge ${isEV ? 'badge-cyan' : 'badge-amber'}`}>
                      {isEV ? '⚡ 100% Electric' : '⛽ Diesel'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', marginTop: '4px' }}>
                    <span>Max Capacity: <strong style={{ color: '#fff' }}>{veh.capacityKg} kg</strong></span>
                    <span>Start: <strong style={{ color: '#fff' }}>{veh.startLocation}</strong></span>
                    <span>Efficiency: <strong style={{ color: 'var(--accent-emerald)' }}>{veh.efficiencyKmPerUnit} km/u</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Sparkles size={20} />
              <span>{loading ? 'Solving Route Constraints...' : 'Run MoveAI Autonomous Dispatch Optimizer'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* OPTIMIZATION RESULTS SECTION */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Result Highlights Banner */}
          <div className="glass-card" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
            borderColor: 'var(--accent-cyan)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle2 size={24} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '1.4rem' }}>Recommended Autonomous Fleet Plan</h2>
            </div>

            {/* 4 Outcome Metrics */}
            <div className="grid-cols-4">
              <div style={{ background: 'rgba(13, 21, 39, 0.7)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Travel Time</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
                  {result.summary.estimatedTravelTimeFormatted || '2h 18m'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Multi-vehicle parallel routing</div>
              </div>

              <div style={{ background: 'rgba(13, 21, 39, 0.7)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Fuel Cost</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-emerald)', margin: '4px 0' }}>
                  ₹{result.summary.estimatedFuelCostINR || 420}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Saved ₹{result.summary.costSavingsINR} vs unoptimized</div>
              </div>

              <div style={{ background: 'rgba(13, 21, 39, 0.7)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distance Saved</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-purple)', margin: '4px 0' }}>
                  {result.summary.distanceSavedKm || 18.6} km
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>{result.summary.co2ReductionKg} kg CO₂ prevented</div>
              </div>

              <div style={{ background: 'rgba(13, 21, 39, 0.7)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delay Risk</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', margin: '4px 0' }}>
                  {result.summary.delayRisk || 'Low'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Traffic multiplier: {result.summary.trafficMultiplier.toFixed(2)}x</div>
              </div>
            </div>
          </div>

          {/* Allocation Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {result.vehiclePlans.map((plan, idx) => (
              <div 
                key={plan.vehicleId}
                className="glass-card"
                style={{
                  padding: '22px',
                  borderTop: `4px solid ${idx === 0 ? 'var(--accent-cyan)' : idx === 1 ? 'var(--accent-purple)' : 'var(--accent-emerald)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🚚 Vehicle {idx + 1}: {plan.vehicleName}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Type: {plan.vehicleType} • {plan.fuelType}
                    </div>
                  </div>
                  <span className="badge badge-cyan">{plan.assignedDeliveries.length} Stops</span>
                </div>

                {/* Delivery sequence arrows */}
                <div style={{
                  padding: '12px',
                  background: 'rgba(13, 21, 39, 0.85)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Optimized Delivery Sequence:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>Depot</span>
                    {plan.assignedDeliveries.map((del, dIdx) => (
                      <React.Fragment key={del.id}>
                        <ArrowRight size={14} color="var(--text-subtle)" />
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(0, 242, 254, 0.1)',
                          color: '#fff',
                          border: '1px solid rgba(0, 242, 254, 0.25)'
                        }}>
                          {del.id} ({del.destination})
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Telemetry Stats for this vehicle leg */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem' }}>Total Distance</div>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{plan.totalDistanceKm} km</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem' }}>Payload Load</div>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{plan.currentLoadKg} / {plan.capacityKg} kg</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem' }}>Trip Fuel Cost</div>
                    <div style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>₹{plan.fuelCostINR}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
