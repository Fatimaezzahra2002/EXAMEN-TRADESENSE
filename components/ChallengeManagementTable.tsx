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

interface ChallengeManagementTableProps {
  onChallengeUpdate?: () => void;
}

const ChallengeManagementTable: React.FC<ChallengeManagementTableProps> = ({ onChallengeUpdate }) => {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<Challenge[]>([
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
      user_id: 2,
      initial_balance: 10000,
      current_balance: 12000,
      status: 'passed',
      max_daily_loss: 500,
      max_total_loss: 1000,
      profit_target: 1000,
      created_at: new Date(Date.now() - 86400000),
      updated_at: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      user_id: 1,
      initial_balance: 10000,
      current_balance: 8000,
      status: 'failed',
      max_daily_loss: 500,
      max_total_loss: 1000,
      profit_target: 1000,
      created_at: new Date(Date.now() - 172800000),
      updated_at: new Date(Date.now() - 172800000)
    },
    {
      id: 4,
      user_id: 3,
      initial_balance: 25000,
      current_balance: 23000,
      status: 'active',
      max_daily_loss: 1250,
      max_total_loss: 2500,
      profit_target: 2500,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
  const [users, setUsers] = useState<Record<number, User>>({
    1: {
      id: 1,
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    },
    2: {
      id: 2,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    },
    3: {
      id: 3,
      email: 'superadmin@example.com',
      name: 'Super Admin User',
      role: 'super_admin',
      created_at: new Date(),
      updated_at: new Date()
    }
  });
  const [loading, setLoading] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState<string>('');
  const [editedBalance, setEditedBalance] = useState<number>(0);

  const updateChallenge = async (challengeId: number) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, status: editedStatus, current_balance: editedBalance, updated_at: new Date() } 
          : challenge
      )
    );
    setEditingChallenge(null);
    onChallengeUpdate?.();
  };

  const deleteChallenge = async (challengeId: number) => {
    if (window.confirm(t('confirmDeleteChallenge'))) {
      setChallenges(prevChallenges => prevChallenges.filter(challenge => challenge.id !== challengeId));
      onChallengeUpdate?.();
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
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('challengeId')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('challengeUser')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('challengeInitialBalance')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('challengeCurrentBalance')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('status')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('profitTarget')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {challenges.map(challenge => (
            <tr key={challenge.id} className="hover:bg-slate-700/30">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{challenge.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {users[challenge.user_id]?.name || `User ${challenge.user_id}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${challenge.initial_balance.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {editingChallenge === challenge.id ? (
                  <input
                    type="number"
                    value={editedBalance}
                    onChange={(e) => setEditedBalance(parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white w-32"
                  />
                ) : (
                  `$${challenge.current_balance.toFixed(2)}`
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingChallenge === challenge.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                    >
                      <option value="active">{t('active')}</option>
                      <option value="passed">{t('passed')}</option>
                      <option value="failed">{t('failed')}</option>
                    </select>
                    <button
                      onClick={() => updateChallenge(challenge.id)}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingChallenge(null);
                        setEditedStatus(challenge.status);
                        setEditedBalance(challenge.current_balance);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    challenge.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    challenge.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                    challenge.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {t(challenge.status)}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">${challenge.profit_target.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingChallenge(challenge.id);
                      setEditedStatus(challenge.status);
                      setEditedBalance(challenge.current_balance);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteChallenge(challenge.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChallengeManagementTable;