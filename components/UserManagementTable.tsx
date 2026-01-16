import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

interface Challenge {
  id: number;
  user_id: number;
  initial_balance: number;
  current_balance: number;
  status: string;
  max_daily_loss: number;
  max_total_loss: number;
  profit_target: number;
  created_at: Date;
  updated_at: Date;
}

interface UserManagementTableProps {
  onUserUpdate?: () => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ onUserUpdate }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      email: 'superadmin@example.com',
      name: 'Super Admin User',
      role: 'super_admin',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
  const [challenges, setChallenges] = useState<Record<number, Challenge[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingChallenge, setEditingChallenge] = useState<{ userId: number; challengeId: number } | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockChallenges: Record<number, Challenge[]> = {
        1: [
          {
            id: 1,
            user_id: 1,
            initial_balance: 10000,
            current_balance: 10500,
            status: 'active',
            max_daily_loss: 500,
            max_total_loss: 1000,
            profit_target: 1000,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            user_id: 1,
            initial_balance: 10000,
            current_balance: 12000,
            status: 'passed',
            max_daily_loss: 500,
            max_total_loss: 1000,
            profit_target: 1000,
            created_at: new Date(Date.now() - 86400000),
            updated_at: new Date(Date.now() - 86400000)
          }
        ],
        2: [
          {
            id: 3,
            user_id: 2,
            initial_balance: 10000,
            current_balance: 8000,
            status: 'failed',
            max_daily_loss: 500,
            max_total_loss: 1000,
            profit_target: 1000,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        3: [
          {
            id: 4,
            user_id: 3,
            initial_balance: 10000,
            current_balance: 15000,
            status: 'active',
            max_daily_loss: 500,
            max_total_loss: 1000,
            profit_target: 1000,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      };
      setChallenges(mockChallenges);
      setLoading(false);
    }, 500);
  }, []);

  const updateUserRole = async (userId: number, newRole: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    onUserUpdate?.();
  };

  const updateChallengeStatus = async (challengeId: number, userId: number, status: string) => {
    setChallenges(prevChallenges => {
      const updatedChallenges = { ...prevChallenges };
      if (updatedChallenges[userId]) {
        updatedChallenges[userId] = updatedChallenges[userId].map(challenge =>
          challenge.id === challengeId ? { ...challenge, status } : challenge
        );
      }
      return updatedChallenges;
    });
    setEditingChallenge(null);
    setNewStatus('');
    onUserUpdate?.();
  };

  const deleteUser = async (userId: number) => {
    if (window.confirm(t('confirmDeleteUser'))) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setChallenges(prevChallenges => {
        const updated = { ...prevChallenges };
        delete updated[userId];
        return updated;
      });
      onUserUpdate?.();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('id')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('name')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('email')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('role')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('challenges')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-slate-700/30">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value="user">{t('user')}</option>
                  <option value="admin">{t('admin')}</option>
                  <option value="super_admin">{t('superAdmin')}</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                <div className="space-y-1">
                  {challenges[user.id]?.map(challenge => (
                    <div key={challenge.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">#{challenge.id}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          challenge.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          challenge.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                          challenge.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {t(challenge.status)}
                        </span>
                      </div>
                      {editingChallenge?.userId === user.id && editingChallenge?.challengeId === challenge.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newStatus || challenge.status}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-xs text-white"
                          >
                            <option value="active">{t('active')}</option>
                            <option value="passed">{t('passed')}</option>
                            <option value="failed">{t('failed')}</option>
                          </select>
                          <button
                            onClick={() => updateChallengeStatus(challenge.id, user.id, newStatus)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingChallenge(null);
                              setNewStatus('');
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingChallenge({ userId: user.id, challengeId: challenge.id });
                            setNewStatus(challenge.status);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-400 hover:text-red-300 mr-3"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;