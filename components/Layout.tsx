import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import LogoutButton from './LogoutButton';

const Layout: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();

  // Pages that should show the sidebar
  const showSidebarPages = ['/dashboard', '/client', '/admin-space', '/admin', '/super-admin'];
  const showSidebar = showSidebarPages.some(page => location.pathname.startsWith(page));

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {showSidebar && <Sidebar />}

      <div className={showSidebar ? 'flex-1 md:ml-0 flex flex-col h-full min-w-0 transition-all duration-300' : 'flex-1 flex flex-col h-full min-w-0'}>
        <header className="flex-none bg-slate-800/80 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-700/50 shadow-lg">
          <div className="w-full max-w-full px-6 flex justify-between items-center">
            <a href="#/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent cursor-pointer">
              TradeSense AI
            </a>
            <nav className="flex gap-6 items-center">
              <LanguageSelector />
              <div className="hidden md:flex gap-6 items-center">
                <a href="#/pricing" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('challenge')}</a>
                <a href="#/leaderboard" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('leaderboard')}</a>
                <a href="#/masterclass" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('masterclassAcademy')}</a>
                {user && <a href="#/dashboard" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('traderPortal')}</a>}
                {user && <a href="#/client" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('clientSpace')}</a>}
                {user?.role === 'ADMIN' && (
                  <a href="#/admin-space" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('adminSpace')}</a>
                )}
                {user?.role === 'SUPER_ADMIN' && (
                  <a href="#/super-admin" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('superAdminSpace')}</a>
                )}
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <a href="#/admin" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('adminPanel')}</a>
                )}
              </div>
              {user ? (
                <LogoutButton />
              ) : (
                <a href="#/login" className="text-slate-300 hover:text-white transition-all duration-200 hover:scale-105">{t('login')}</a>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <div className="h-full w-full overflow-y-auto">
            <Outlet />
          </div>
        </main>

        <footer className="flex-none glass-effect border-t border-white/10 z-10">
          {user && (
            <div className="w-full max-w-full px-4 py-2 bg-black/20 backdrop-blur-sm border-b border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <div>
                  <span className="mr-2 opacity-70">{t('role')}:</span>
                  <span className="font-bold text-emerald-400 tracking-wide uppercase">{t(user.role || 'USER')}</span>
                </div>
                <div>
                  <span className="mr-2 opacity-70">{t('lastLogin')}:</span>
                  <span className="text-slate-200 font-mono">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          <div className="p-2 text-center text-xs text-slate-500">
            <p>&copy; 2024 TradeSense AI. {t('copyright')}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;