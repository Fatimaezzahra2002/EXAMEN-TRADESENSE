import React from 'react';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin, isSuperAdmin } = useUser();
  const { t } = useTranslation();

  // Check if user has admin privileges
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('accessDenied')}</h2>
        <p className="text-slate-400 mb-8 max-w-md">{t('adminAccessRequired')}</p>
        <Link to="/" className="bg-emerald-600 px-6 py-3 rounded-xl font-bold">{t('backToHome')}</Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 w-full max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('adminDashboard')}</h1>
        <p className="text-slate-400">{t('welcomeAdmin')} {currentUser?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="modern-card">
          <h3 className="text-xl font-bold mb-2">{t('userManagement')}</h3>
          <p className="text-slate-400 text-sm mb-4">{t('manageUserAccounts')}</p>
          <Link to="/admin/users" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
            {t('viewUsers')} →
          </Link>
        </div>

        <div className="modern-card">
          <h3 className="text-xl font-bold mb-2">{t('challengesOverview')}</h3>
          <p className="text-slate-400 text-sm mb-4">{t('monitorTradingChallenges')}</p>
          <Link to="/admin/challenges" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
            {t('viewChallenges')} →
          </Link>
        </div>

        <div className="modern-card">
          <h3 className="text-xl font-bold mb-2">{t('tradingActivity')}</h3>
          <p className="text-slate-400 text-sm mb-4">{t('reviewRecentTrades')}</p>
          <Link to="/admin/trades" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
            {t('viewTrades')} →
          </Link>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span className="text-yellow-400">👑</span> {t('superAdminPanel')}
          </h3>
          <p className="text-slate-300 text-sm mb-4">{t('exclusiveSuperAdminFeatures')}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/system-settings" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {t('systemSettings')}
            </Link>
            <Link to="/admin/analytics" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {t('analytics')}
            </Link>
            <Link to="/admin/payments" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {t('paymentManagement')}
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="modern-card">
          <h3 className="text-lg font-bold mb-4">{t('recentActivity')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-300">New user registered</span>
              <span className="text-slate-500 text-sm">2 min ago</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-300">Challenge passed</span>
              <span className="text-slate-500 text-sm">15 min ago</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-300">Withdrawal requested</span>
              <span className="text-slate-500 text-sm">1 hour ago</span>
            </div>
          </div>
        </div>

        <div className="modern-card">
          <h3 className="text-lg font-bold mb-4">{t('quickStats')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">{t('totalUsers')}</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">{t('activeChallenges')}</p>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">{t('totalVolume')}</p>
              <p className="text-2xl font-bold">$2.4M</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">{t('successRate')}</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;