import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LogoutButton: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useUser();

  const handleLogout = () => {
    if (confirm(t('confirmLogout'))) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>{t('logout')}</span>
    </button>
  );
};

export default LogoutButton;