import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import FleetDispatchOptimizerPage from './pages/FleetDispatchOptimizerPage';
import RoutePlannerPage from './pages/RoutePlannerPage';
import FleetManagementPage from './pages/FleetManagementPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'dispatch':
        return <FleetDispatchOptimizerPage />;
      case 'planner':
        return <RoutePlannerPage />;
      case 'fleet':
        return <FleetManagementPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="app-layout">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        
        <div className="app-main">
          <Navbar activePage={activePage} setActivePage={setActivePage} />
          
          <main className="page-container">
            {renderPage()}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
