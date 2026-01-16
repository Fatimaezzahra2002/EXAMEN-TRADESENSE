import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const AdminSpace: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  // Mock data for admin dashboard
  const stats = [
    { title: t('totalUsers'), value: '1,248', change: '+12%', icon: <Users className="h-6 w-6 text-blue-600" /> },
    { title: t('activeChallenges'), value: '86', change: '+3%', icon: <BarChart3 className="h-6 w-6 text-green-600" /> },
    { title: t('pendingVerifications'), value: '24', change: '-5%', icon: <AlertTriangle className="h-6 w-6 text-yellow-600" /> },
    { title: t('successfulTrades'), value: '1,542', change: '+18%', icon: <CheckCircle className="h-6 w-6 text-purple-600" /> },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: t('createdAccount'), time: '2 min ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: t('completedChallenge'), time: '15 min ago', status: 'success' },
    { id: 3, user: 'Bob Johnson', action: t('failedVerification'), time: '1 hour ago', status: 'warning' },
    { id: 4, user: 'Alice Williams', action: t('updatedProfile'), time: '2 hours ago', status: 'info' },
    { id: 5, user: 'Charlie Brown', action: t('withdrawalRequested'), time: '3 hours ago', status: 'pending' },
  ];

  const pendingActions = [
    { id: 1, type: t('verification'), user: 'Mike Tyson', date: '2023-05-15', priority: 'high' },
    { id: 2, type: t('withdrawal'), user: 'Sarah Connor', date: '2023-05-14', priority: 'medium' },
    { id: 3, type: t('dispute'), user: 'Tony Stark', date: '2023-05-13', priority: 'low' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-0">
      <div className="w-full max-w-full h-full p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('adminSpace')} - {user?.name || t('adminWelcome')}
          </h1>
          <p className="text-slate-400 mt-2">{t('adminDashboardOverview')}</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="modern-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-emerald-400 mt-1">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('recentActivity')}</h2>
              <div className="overflow-hidden">
                <ul className="divide-y divide-slate-700">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'success' ? 'bg-emerald-500/20' :
                          activity.status === 'warning' ? 'bg-yellow-500/20' :
                          activity.status === 'info' ? 'bg-blue-500/20' : 'bg-slate-700/20'
                        }`}>
                          {activity.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : activity.status === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          ) : activity.status === 'info' ? (
                            <div className="text-blue-400 text-sm">ℹ</div>
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">
                            {activity.user} <span className="font-normal text-slate-300">{activity.action}</span>
                          </p>
                          <p className="text-sm text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* User Management Quick Actions */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('userManagement')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors text-center">
                  <Users className="h-8 w-8 text-blue-400 mx-auto" />
                  <p className="mt-2 font-medium text-white">{t('viewAllUsers')}</p>
                </button>
                <button className="p-4 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto" />
                  <p className="mt-2 font-medium text-white">{t('pendingVerifications')}</p>
                </button>
                <button className="p-4 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors text-center">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="mt-2 font-medium text-white">{t('verifiedUsers')}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Pending Actions */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('pendingActions')}</h2>
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-4 py-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white">{action.type}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {t(action.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{t('forUser')} {action.user}</p>
                    <p className="text-xs text-slate-400">{action.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('quickStats')}</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('dailyActiveUsers')}</span>
                  <span className="font-medium text-white">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('monthlyGrowth')}</span>
                  <span className="font-medium text-emerald-400">+12.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('avgCompletionRate')}</span>
                  <span className="font-medium text-white">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('successRate')}</span>
                  <span className="font-medium text-emerald-400">92%</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('adminActions')}</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors">
                  {t('generateReport')}
                </button>
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors">
                  {t('sendAnnouncement')}
                </button>
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors">
                  {t('managePermissions')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSpace;