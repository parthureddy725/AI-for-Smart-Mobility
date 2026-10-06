import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Truck, 
  Battery, 
  Fuel, 
  UserCheck, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Star,
  CheckCircle,
  Clock,
  Wrench
} from 'lucide-react';

export default function FleetManagementPage() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVeh, setNewVeh] = useState({
    vehicleNumber: '',
    name: '',
    type: 'Electric Van',
    capacityKg: '1000',
    driverName: '',
    zone: 'HITEC City'
  });

  const loadVehicles = async () => {
    try {
      const res = await api.getVehicles();
      if (res && res.vehicles) setVehicles(res.vehicles);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateVehicleStatus(id, newStatus);
      loadVehicles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addVehicle(newVeh);
      if (res && res.success) {
        setShowAddModal(false);
        setNewVeh({
          vehicleNumber: '',
          name: '',
          type: 'Electric Van',
          capacityKg: '1000',
          driverName: '',
          zone: 'HITEC City'
        });
        loadVehicles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = vehicles.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Fleet Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Real-time vehicle telemetry, payload capacities, driver allocations & status control.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="var(--text-subtle)" />
          <input 
            type="text" 
            placeholder="Search by vehicle ID, plate number, or driver..." 
            className="form-input"
            style={{ padding: '8px 12px', margin: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Active', 'Idle', 'Maintenance'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map((veh) => {
          const isEV = veh.fuelType === 'Electric';
          const payloadPct = Math.round((veh.currentPayloadKg / veh.capacityKg) * 100);

          return (
            <div key={veh.id} className="glass-card" style={{ padding: '22px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800' }}>{veh.name}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span><strong>{veh.id}</strong></span>
                    <span>•</span>
                    <span>{veh.vehicleNumber}</span>
                  </div>
                </div>

                <span className={`badge ${veh.status === 'Active' ? 'badge-green' : veh.status === 'Idle' ? 'badge-cyan' : 'badge-rose'}`}>
                  {veh.status}
                </span>
              </div>

              {/* Energy & Payload Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {/* Battery/Fuel */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isEV ? <Battery size={14} color="var(--accent-cyan)" /> : <Fuel size={14} color="var(--accent-amber)" />}
                      {isEV ? 'State of Charge (SoC)' : 'Fuel Level'}
                    </span>
                    <strong style={{ color: veh.batteryOrFuelPct > 40 ? 'var(--accent-cyan)' : '#f43f5e' }}>
                      {veh.batteryOrFuelPct}%
                    </strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${veh.batteryOrFuelPct}%`,
                      background: isEV ? 'var(--gradient-brand)' : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>

                {/* Payload */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payload Utilization</span>
                    <strong>{veh.currentPayloadKg} / {veh.capacityKg} kg ({payloadPct}%)</strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, payloadPct)}%`,
                      background: payloadPct > 85 ? '#f43f5e' : 'var(--gradient-success)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              </div>

              {/* Location & Current Assignment */}
              <div style={{
                background: 'rgba(13, 21, 39, 0.7)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '14px',
                fontSize: '0.8rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--text-main)' }}>
                  <MapPin size={14} color="var(--accent-cyan)" />
                  <span>{veh.location.zone}, {veh.location.city}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Trip: <strong style={{ color: '#cbd5e1' }}>{veh.currentTrip || 'Stationed at depot'}</strong>
                </div>
              </div>

              {/* Driver Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={16} color="var(--accent-emerald)" />
                  <div>
                    <span style={{ fontWeight: '600' }}>{veh.driver.name}</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{veh.driver.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: '700' }}>
                  <Star size={14} fill="#fbbf24" />
                  <span>{veh.driver.rating}</span>
                </div>
              </div>

              {/* Quick Status Control Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                <button
                  onClick={() => handleStatusChange(veh.id, 'Active')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, padding: '6px' }}
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleStatusChange(veh.id, 'Idle')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, padding: '6px' }}
                >
                  Set Idle
                </button>
                <button
                  onClick={() => handleStatusChange(veh.id, 'Maintenance')}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px', color: '#f43f5e' }}
                  title="Send to Maintenance"
                >
                  <Wrench size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '28px', background: '#0d1527' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Enroll Fleet Asset</h3>
            <form onSubmit={handleAddVehicle}>
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. TS-09-EV-9999"
                  value={newVeh.vehicleNumber}
                  onChange={e => setNewVeh({ ...newVeh, vehicleNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Model / Vehicle Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Tata Ace EV / Mahindra Treo"
                  value={newVeh.name}
                  onChange={e => setNewVeh({ ...newVeh, name: e.target.value })}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select 
                    className="form-select"
                    value={newVeh.type}
                    onChange={e => setNewVeh({ ...newVeh, type: e.target.value })}
                  >
                    <option value="Electric Van">Electric Van</option>
                    <option value="Diesel Light Truck">Diesel Light Truck</option>
                    <option value="Electric 3-Wheeler">Electric 3-Wheeler</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Payload (kg)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    value={newVeh.capacityKg}
                    onChange={e => setNewVeh({ ...newVeh, capacityKg: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Driver Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Rajesh Reddy"
                  value={newVeh.driverName}
                  onChange={e => setNewVeh({ ...newVeh, driverName: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Add to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
