# 🚦 MoveAI – Intelligent Urban Mobility & Fleet Optimizer

> **Hackathon-Ready AI Urban Mobility Decision Engine & Autonomous Fleet Dispatch Platform**

MoveAI unifies predictive traffic intelligence, dynamic vehicle capacity, multi-parcel delivery priority, and energy cost optimization into one unified decision-making platform for logistics fleet operators and urban commuters.

---

## 🌟 Key Highlights & Differentiators

Unlike traditional GPS navigation systems that only draw lines between two points, MoveAI demonstrates multi-criteria **AI decision-making**:
$$\text{Input} \longrightarrow \text{Analyze} \longrightarrow \text{Predict} \longrightarrow \text{Optimize} \longrightarrow \text{Explain} \longrightarrow \text{Recommend}$$

1. **🧠 Constrained Fleet Dispatch Optimizer (Flagship Workflow)**:
   - Takes 5 delivery orders with custom weights (kg), urgency deadlines, and priorities.
   - Solves the Capacitated Vehicle Routing Problem (CVRP) across EV and Diesel fleets.
   - Outputs:
     - 🚚 **Vehicle 1 (Tata Ace EV)** $\rightarrow$ Deliveries A $\rightarrow$ C $\rightarrow$ D
     - 🚚 **Vehicle 2 (Ashok Leyland)** $\rightarrow$ Deliveries B $\rightarrow$ E
     - **Estimated Travel Time**: `2h 18m`
     - **Estimated Fuel Cost**: `₹420`
     - **Distance Saved**: `18.6 km`
     - **Delay Risk**: `Low`
2. **🗺️ Smart Multi-Criteria Route Planner**:
   - Generates 3 distinct corridors: **AI Recommended (Adaptive Bypass)**, **Eco/Low-Emission Corridor**, and **Direct Arterial**.
   - Compares transit duration, fuel burn, signal delay idle, and CO₂ footprint with an explicit "Reason for Recommendation".
3. **🚦 Real-Time Traffic & Disruption Forecast**:
   - Time-of-day rush hour multiplier & weather adjustment.
   - Live bottlenecks with automated AI mitigation advice (e.g. Gachibowli Cable Bridge bypass).
4. **💬 Gemini-Powered Conversational Mobility Copilot**:
   - Telemetry-grounded AI copilot answering dispatch questions like: *"Which vehicle should deliver the Hyderabad orders today?"*
   - Context-grounded recommendations referencing active vehicle capacity, fuel consumption, driver status, and traffic conditions.
5. **📊 Fleet Telematics & ESG Analytics**:
   - Real-time KPI counters: 24 Vehicles, 156 Trips, 12 Active In-Transit, ₹18,450 Fuel Savings.
   - Interactive charts: Daily throughput, distance trends, and delay risk distribution.

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────┐
                    │  React + Vite Frontend  │
                    │   (Port 5173 - Dark UI) │
                    └────────────┬────────────┘
                                 │
                            Axios / REST
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Node.js + Express API  │
                    │   (Port 5000 Backend)   │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼────────────────────────┐
         │                       │                        │
         ▼                       ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  MongoDB / Store │    │ Google Gemini AI │    │  Leaflet Vector  │
│  (Mongoose + M)  │    │  (1.5 / Flash)   │    │  Map Integration │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   MoveAI Decision Core  │
                    │  (CVRP & Traffic Engine)│
                    └─────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (verified on Node v24)
- **NPM**: v9+

### 1. Installation

Dependencies for both client and server are already pre-installed. If running in a fresh clone:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Environment Configuration
Create or edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/moveai
JWT_SECRET=moveai_ultra_secure_jwt_secret_token_2026
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note: If MongoDB is not active locally or no Gemini key is provided, MoveAI automatically activates its high-performance in-memory datastore and heuristic domain reasoning engine.*

### 3. Running the Application

Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# App opens at http://localhost:5173
```

---

## 🖥️ Application Modules & Pages

| # | Page / Module | Description |
|---|---|---|
| 1 | **Platform Overview** | Hero showcase, Problem vs Solution comparison, live KPI counters |
| 2 | **Main Dashboard** | Live Leaflet GPS map, KPI cards, real-time traffic feed, actionable AI recommendations |
| 3 | **Fleet Dispatch Optimizer** | 5 deliveries, 3 vehicles CVRP solver with sequence generation, ETA & fuel savings |
| 4 | **Smart Route Planner** | Origin/Destination planner with 3 alternative trajectories, waypoints & AI explanation |
| 5 | **Fleet Management** | Vehicle inventory, battery/fuel levels, payload utilization gauge & driver controls |
| 6 | **AI Mobility Copilot** | Conversational assistant powered by Google Gemini & MoveAI Decision Core |
| 7 | **Analytics & ESG** | 7-day trip throughput, distance traveled, delay risk breakdown, carbon abatement metrics |

---

## 🔒 Security Best Practices Implemented
- **Helmet**: Secures HTTP response headers.
- **Rate Limiting**: Protects against brute-force attacks (`express-rate-limit`).
- **JWT Authentication**: Stateless, signed token verification.
- **bcrypt Password Hashing**: Secure salted credential storage.
- **Zero Frontend Leaks**: API keys strictly isolated on the backend.
