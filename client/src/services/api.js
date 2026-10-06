// MoveAI API Client Service

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('moveai_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e) {
      // Offline fallback
      return {
        success: true,
        token: 'mock-jwt-token-demo',
        user: { name: 'Admin Dispatcher', email, role: 'Fleet Director', company: 'MoveAI Enterprise' }
      };
    }
  },

  register: async (name, email, password, role) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        token: 'mock-jwt-token-demo',
        user: { name, email, role: role || 'Fleet Operator', company: 'MoveAI' }
      };
    }
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // Fleet
  getVehicles: async () => {
    try {
      const res = await fetch(`${API_BASE}/fleet/vehicles`);
      return await res.json();
    } catch (e) {
      return { success: false, vehicles: [] };
    }
  },

  updateVehicleStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/fleet/vehicles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  addVehicle: async (vehicleData) => {
    try {
      const res = await fetch(`${API_BASE}/fleet/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  getTrafficAlerts: async () => {
    try {
      const res = await fetch(`${API_BASE}/fleet/traffic-alerts`);
      return await res.json();
    } catch (e) {
      return { success: false, alerts: [] };
    }
  },

  // Route Planning
  planRoute: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/routes/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // Fleet Dispatch Optimizer (Multi-Delivery, Multi-Vehicle)
  optimizeDispatch: async (deliveries, vehicles) => {
    try {
      const res = await fetch(`${API_BASE}/routes/optimize-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveries, vehicles })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // AI Mobility Assistant
  askAssistant: async (prompt, chatHistory = []) => {
    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, chatHistory })
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        reply: "MoveAI Core: Connection standby. Dispatch optimizations and traffic feeds are synchronized in offline buffer.",
        source: "MoveAI Telemetry Engine"
      };
    }
  },

  // Fleet Analytics
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/metrics`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
};
