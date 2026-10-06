import React, { useState } from 'react';
import { api } from '../services/api';
import MoveMap from '../components/MoveMap';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Zap, 
  Fuel, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Sliders,
  Leaf
} from 'lucide-react';

export default function RoutePlannerPage() {
  const [origin, setOrigin] = useState('HITEC City');
  const [destination, setDestination] = useState('Gachibowli');
  const [vehicleType, setVehicleType] = useState('Electric Van');
  const [departureTime, setDepartureTime] = useState('Now');
  const [priority, setPriority] = useState('Balanced');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);

  const handlePlanRoute = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.planRoute({
        origin,
        destination,
        vehicleType,
        departureTime,
        priority
      });
      if (res && res.success) {
        setResult(res);
        setSelectedRouteIdx(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">Dynamic Multi-Criteria Routing</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Smart Route Planner</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Evaluate alternative trajectory corridors with AI predictive traffic delay modeling and fuel burn estimation.
        </p>
      </div>

      <div className="grid-1-2">
        {/* Form Settings */}
        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Sliders size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem' }}>Trip Configuration</h3>
          </div>

          <form onSubmit={handlePlanRoute}>
            {/* Origin */}
            <div className="form-group">
              <label className="form-label">Starting Location</label>
              <input 
                type="text" 
                className="form-input" 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. HITEC City, Secunderabad"
                required
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['HITEC City', 'Kukatpally', 'Banjara Hills', 'Begumpet'].map(chip => (
                  <button 
                    type="button" 
                    key={chip} 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                    onClick={() => setOrigin(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination */}
            <div className="form-group">
              <label className="form-label">Destination</label>
              <input 
                type="text" 
                className="form-input" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Gachibowli, Shamshabad Airport"
                required
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['Gachibowli', 'Madhapur', 'Shamshabad Airport', 'Kondapur'].map(chip => (
                  <button 
                    type="button" 
                    key={chip} 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                    onClick={() => setDestination(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select 
                className="form-select"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="Electric Van">Electric Van (Tata Ace EV)</option>
                <option value="Diesel Light Truck">Diesel Light Truck (Ashok Leyland)</option>
                <option value="Electric 3-Wheeler">Electric 3-Wheeler (Treo Zor)</option>
                <option value="Hybrid Car">Hybrid Commuter Sedan</option>
                <option value="Electric Scooter">Electric Two-Wheeler (Ather/Ola)</option>
              </select>
            </div>

            {/* Departure Time */}
            <div className="form-group">
              <label className="form-label">Departure Time</label>
              <select 
                className="form-select"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              >
                <option value="Now">Now (Live Traffic)</option>
                <option value="9">Morning Peak Rush (09:00 AM)</option>
                <option value="14">Afternoon Lull (02:00 PM)</option>
                <option value="18">Evening Peak Congestion (06:00 PM)</option>
                <option value="23">Night Shift / Low Volume (11:00 PM)</option>
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Optimization Priority</label>
              <select 
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Balanced">Balanced (Time + Fuel Efficiency)</option>
                <option value="Speed">Maximum Speed (Express Corridors)</option>
                <option value="Cost">Minimum Operating Cost & Emissions</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Predicting Corridors...' : 'Generate AI Recommended Routes'}</span>
            </button>
          </form>
        </div>

        {/* Map & Route Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Map Preview */}
          <div className="glass-card" style={{ padding: '16px', height: '360px' }}>
            <MoveMap 
              routes={result ? result.routes : []} 
              selectedRouteIndex={selectedRouteIdx}
              center={result ? [result.origin.lat, result.origin.lng] : [17.4435, 78.3772]}
            />
          </div>

          {/* Alternative Routes Cards */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                AI Evaluated Trajectories ({result.routes.length})
              </div>

              {result.routes.map((rt, idx) => {
                const isSelected = idx === selectedRouteIdx;
                const isOptimal = idx === 0;

                return (
                  <div 
                    key={rt.id}
                    onClick={() => setSelectedRouteIdx(idx)}
                    className="glass-card"
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--card-border)',
                      background: isSelected ? 'rgba(20, 34, 62, 0.95)' : 'var(--card-bg)',
                      boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '1.1rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                            {rt.title}
                          </h4>
                          <span className={`badge ${isOptimal ? 'badge-cyan' : idx === 1 ? 'badge-green' : 'badge-amber'}`}>
                            {rt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Corridor: {rt.corridors}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                          {rt.estimatedTimeMin} min
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {rt.distanceKm} km
                        </div>
                      </div>
                    </div>

                    {/* Stats pills */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      margin: '12px 0',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '4px' }}>
                        Traffic: <strong style={{ color: rt.trafficLevel.includes('Heavy') ? '#f43f5e' : '#10b981' }}>{rt.trafficLevel}</strong>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '4px' }}>
                        Estimated Cost: <strong style={{ color: 'var(--accent-emerald)' }}>₹{rt.fuelCostINR}</strong>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '4px' }}>
                        Footprint: <strong>{rt.co2Kg} kg CO₂</strong>
                      </div>
                      {rt.savingsINR > 0 && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                          Saves ₹{rt.savingsINR}
                        </div>
                      )}
                    </div>

                    {/* Reasoning explanation */}
                    <div style={{
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      color: '#cbd5e1',
                      borderLeft: '3px solid var(--accent-cyan)',
                      paddingLeft: '10px',
                      marginTop: '8px'
                    }}>
                      <strong>Reason for Recommendation:</strong> {rt.reason}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
