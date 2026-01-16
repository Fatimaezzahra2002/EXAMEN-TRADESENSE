import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, User, Users, Settings, Shield, BarChart3, TrendingUp, Wallet, Target, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 glass-effect h-full min-h-screen p-4 hidden md:block border-r border-white/10">
      <div className="mb-8">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          TradeSense AI
        </h2>
        <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {/* User Spaces */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2 px-2">{t('userSpaces')}</h3>
          
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive('/dashboard') ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white shadow-lg' : 'hover:bg-white/5 text-slate-300 hover:translate-x-1'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>{t('traderPortal')}</span>
          </Link>
          
          <Link 
            to="/client" 
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive('/client') ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white shadow-lg' : 'hover:bg-white/5 text-slate-300 hover:translate-x-1'
            }`}
          >
            <User className="h-5 w-5" />
            <span>{t('clientSpace')}</span>
          </Link>
        </div>

        {/* Admin Spaces */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2 px-2">{t('adminSpaces')}</h3>
            
            <Link 
              to="/admin-space" 
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin-space') ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white shadow-lg' : 'hover:bg-white/5 text-slate-300 hover:translate-x-1'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>{t('adminSpace')}</span>
            </Link>
            
            <Link 
              to="/admin" 
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin') ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white shadow-lg' : 'hover:bg-white/5 text-slate-300 hover:translate-x-1'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>{t('adminPanel')}</span>
            </Link>
          </div>
        )}

        {/* Super Admin Spaces */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2 px-2">{t('superAdminSpaces')}</h3>
            
            <Link 
              to="/super-admin" 
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive('/super-admin') ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white shadow-lg' : 'hover:bg-white/5 text-slate-300 hover:translate-x-1'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>{t('superAdminSpace')}</span>
            </Link>
          </div>
        )}

        {/* Client Space Items */}
        {location.pathname.startsWith('/client') && (
          <div className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2 px-2">{t('clientOptions')}</h3>
            <Link 
              to="/client" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/client') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span>{t('portfolio')}</span>
            </Link>
            <Link 
              to="/client/challenges" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/client/challenges') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Target className="h-5 w-5" />
              <span>{t('myChallenges')}</span>
            </Link>
            <Link 
              to="/client/performance" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/client/performance') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span>{t('performance')}</span>
            </Link>
          </div>
        )}

        {/* Admin Space Items */}
        {location.pathname.startsWith('/admin-space') && (
          <div className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2 px-2">{t('adminOptions')}</h3>
            <Link 
              to="/admin-space" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin-space') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>{t('overview')}</span>
            </Link>
            <Link 
              to="/admin-space/users" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/admin-space/users') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>{t('userManagement')}</span>
            </Link>
          </div>
        )}

        {/* Super Admin Space Items */}
        {location.pathname.startsWith('/super-admin') && (
          <div className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2 px-2">{t('superAdminOptions')}</h3>
            <Link 
              to="/super-admin" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/super-admin') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>{t('overview')}</span>
            </Link>
            <Link 
              to="/super-admin/platforms" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/super-admin/platforms') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>{t('platformManagement')}</span>
            </Link>
            <Link 
              to="/super-admin/security" 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive('/super-admin/security') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>{t('security')}</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-700 p-3 rounded-lg">
          <p className="text-xs text-slate-400">{t('role')}: <span className="text-emerald-400">{t(user?.role || 'USER')}</span></p>
          <p className="text-xs text-slate-400 mt-1">{t('lastLogin')}: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;