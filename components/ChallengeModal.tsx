import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, TrendingUp, Target, Wallet, Award } from 'lucide-react';
import { Challenge } from '../context/UserContext';

interface ChallengeModalProps {
  challenge: Challenge | null;
  action: string; // 'view' or 'manage'
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ challenge, action, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !challenge) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'passed':
        return 'text-blue-400 bg-blue-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const progressPercentage = Math.min(100, ((challenge.currentBalance - challenge.initialBalance) / challenge.profitTarget) * 100);
  const profit = challenge.currentBalance - challenge.initialBalance;
  const profitPercentage = (profit / challenge.initialBalance) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              {action === 'view' ? t('challengeDetails') : t('manageChallenge')}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">{t('challengeId')}:</span>
              <span className="text-white">{challenge.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">{t('status')}:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(challenge.status)}`}>
                {t(challenge.status.toLowerCase())}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">{t('initialBalance')}:</span>
              <span className="text-white">${challenge.initialBalance.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">{t('currentBalance')}:</span>
              <span className="text-white">${challenge.currentBalance.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">{t('profitTarget')}:</span>
              <span className="text-white">${challenge.profitTarget.toLocaleString()}</span>
            </div>

            {/* Profit information */}
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between mb-1">
                <div className="flex items-center text-slate-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {t('profit')}
                </div>
                <span className={`font-semibold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">{t('dailyDrawdown')}:</span>
              <span className="text-white">${challenge.maxDailyLoss.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">{t('totalDrawdown')}:</span>
              <span className="text-white">${challenge.maxTotalLoss.toLocaleString()}</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">{t('currentProgress')}:</span>
                <span className="text-white">{progressPercentage.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Manage actions if action is 'manage' */}
          {action === 'manage' && (
            <div className="mt-6 pt-4 border-t border-slate-700 space-y-3">
              <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                {t('adjustTargets')}
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Award className="h-4 w-4" />
                {t('awardBonus')}
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <X className="h-4 w-4" />
                {t('terminateChallenge')}
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;