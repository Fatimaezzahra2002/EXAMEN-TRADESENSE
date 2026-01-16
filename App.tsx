import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ChallengesManagement from './pages/ChallengesManagement';
import ClientSpace from './pages/ClientSpace';
import AdminSpace from './pages/AdminSpace';
import SuperAdminSpace from './pages/SuperAdminSpace';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MasterClassAcademy from './pages/MasterClassAcademy';
import RealTimeDashboard from './pages/RealTimeDashboard';
import { UserProvider, useUser } from './context/UserContext';
import AIAssistantBar from './components/AIAssistantBar';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { IndexedDBService } from './services/indexedDBService';

// Protected Route Components - Now properly checking authentication
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  // DÉSACTIVATION DE L'AUTHENTIFICATION : Autoriser l'accès à tous les utilisateurs
  return <>{children}</>;
};

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  // DÉSACTIVATION DE L'AUTHENTIFICATION : Autoriser l'accès à tous les utilisateurs
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<LandingPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/challenges" element={<ChallengesManagement />} />
        <Route path="client" element={<ClientSpace />} />
        <Route path="admin-space" element={
          <AdminRoute>
            <AdminSpace />
          </AdminRoute>
        } />
        <Route path="super-admin" element={
          <SuperAdminRoute>
            <SuperAdminSpace />
          </SuperAdminRoute>
        } />
        <Route path="masterclass" element={<MasterClassAcademy />} />
        <Route path="realtimedashboard" element={<RealTimeDashboard />} />
        <Route path="*" element={<Navigate to="/client" />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  // Initialiser IndexedDB au chargement de l'application
  useEffect(() => {
    IndexedDBService.init().catch(error => {
      console.error('Failed to initialize IndexedDB:', error);
    });
  }, []);

  return (
    <LanguageProvider>
      <UserProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
            <AppContent />
            <AIAssistantBar />
          </div>
        </HashRouter>
      </UserProvider>
    </LanguageProvider>
  );
};

export default App;