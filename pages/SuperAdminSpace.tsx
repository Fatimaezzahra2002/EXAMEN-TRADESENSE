import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BarChart3, Shield, Settings, Globe, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext';

const SuperAdminSpace: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  // Mock data for super admin dashboard
  const stats = [
    { title: t('totalPlatforms'), value: '24', change: '+2', icon: <Globe className="h-6 w-6 text-blue-600" /> },
    { title: t('totalUsers'), value: '12,480', change: '+12%', icon: <Users className="h-6 w-6 text-green-600" /> },
    { title: t('revenue'), value: '$245K', change: '+18%', icon: <BarChart3 className="h-6 w-6 text-purple-600" /> },
    { title: t('systemUptime'), value: '99.9%', change: '+0.1%', icon: <Activity className="h-6 w-6 text-yellow-600" /> },
  ];

  const platformStats = [
    { name: 'Platform A', users: 3420, revenue: '$89K', status: 'active' },
    { name: 'Platform B', users: 2890, revenue: '$76K', status: 'active' },
    { name: 'Platform C', users: 1920, revenue: '$45K', status: 'maintenance' },
    { name: 'Platform D', users: 4250, revenue: '$120K', status: 'active' },
  ];

  const systemStatus = [
    { service: t('database'), status: 'operational', response: '12ms' },
    { service: t('api'), status: 'operational', response: '45ms' },
    { service: t('cache'), status: 'operational', response: '3ms' },
    { service: t('paymentGateway'), status: 'operational', response: '120ms' },
  ];

  const recentAudits = [
    { id: 1, user: 'Admin User 1', action: t('updatedPermissions'), time: '2 min ago', severity: 'medium' },
    { id: 2, user: 'Super Admin', action: t('systemConfiguration'), time: '15 min ago', severity: 'high' },
    { id: 3, user: 'Admin User 2', action: t('userDeletion'), time: '1 hour ago', severity: 'low' },
    { id: 4, user: 'System', action: t('automaticBackup'), time: '2 hours ago', severity: 'info' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-0">
      <div className="w-full max-w-full h-full p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('superAdminSpace')} - {user?.name || t('superAdminWelcome')}
          </h1>
          <p className="text-slate-400 mt-2">{t('superAdminDashboardOverview')}</p>
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
            {/* Platform Overview */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('platformOverview')}</h2>
              <div className="overflow-x-auto">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('platform')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('users')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('revenue')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformStats.map((platform, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{platform.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {platform.users}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {platform.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            platform.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {t(platform.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Status */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('systemStatus')}</h2>
              <div className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-emerald-500/20 rounded-full">
                        <div className="text-emerald-400 text-sm">✅</div>
                      </div>
                      <span className="ml-3 font-medium text-white">{service.service}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-400">{service.response}</span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                        {t('operational')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Super Admin Actions */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('superAdminActions')}</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                  <Shield className="h-5 w-5 text-blue-400 mr-3" />
                  {t('managePermissions')}
                </button>
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                  <Settings className="h-5 w-5 text-emerald-400 mr-3" />
                  {t('systemConfiguration')}
                </button>
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                  <Globe className="h-5 w-5 text-purple-400 mr-3" />
                  {t('platformManagement')}
                </button>
                <button className="w-full text-left p-3 border border-slate-700 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                  <Users className="h-5 w-5 text-yellow-400 mr-3" />
                  {t('userManagement')}
                </button>
              </div>
            </div>

            {/* Recent Audits */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('recentAudits')}</h2>
              <div className="space-y-4">
                {recentAudits.map((audit) => (
                  <div key={audit.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white">{audit.user}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        audit.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        audit.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        audit.severity === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {t(audit.severity)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{audit.action}</p>
                    <p className="text-xs text-slate-400">{audit.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Status */}
            <div className="modern-card">
              <h2 className="text-lg font-semibold text-white mb-4">{t('securityStatus')}</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('lastSecurityScan')}</span>
                  <span className="font-medium text-emerald-400">{t('24hAgo')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('vulnerabilities')}</span>
                  <span className="font-medium text-emerald-400">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('sslCertificates')}</span>
                  <span className="font-medium text-emerald-400">{t('valid')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('backupStatus')}</span>
                  <span className="font-medium text-emerald-400">{t('completed')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSpace;