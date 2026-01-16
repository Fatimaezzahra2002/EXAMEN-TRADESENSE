import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import UserManagementTable from '../components/UserManagementTable';

const UserManagement: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useUser();
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
        <h1 className="text-3xl font-bold">{t('userManagement')}</h1>
        <p className="text-slate-400">{t('manageUserAccounts')}</p>
      </div>

      <div className="modern-card overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('usersList')}</h2>
          {isSuperAdmin && (
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg">
              {t('addNewUser')}
            </button>
          )}
        </div>

        <UserManagementTable />
      </div>
    </div>
  );
};

export default UserManagement;