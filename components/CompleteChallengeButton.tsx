import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Calculator } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ChallengeStatus } from '../types';

const CompleteChallengeButton: React.FC = () => {
  const { t } = useTranslation();
  const { activeChallenge, updateChallenge, user } = useUser();
  const [calculating, setCalculating] = useState(false);

  const handleCompleteChallenge = async () => {
    if (!activeChallenge || calculating) return;

    setCalculating(true);
    
    try {
      // Calculer le profit automatiquement
      const profit = activeChallenge.currentBalance - activeChallenge.initialBalance;
      const profitPercentage = (profit / activeChallenge.initialBalance) * 100;
      
      // Déterminer le statut final basé sur le profit
      let finalStatus: ChallengeStatus = ChallengeStatus.FAILED;
      if (profit >= activeChallenge.profitTarget) {
        finalStatus = ChallengeStatus.PASSED;
      } else if (activeChallenge.currentBalance >= activeChallenge.initialBalance - activeChallenge.maxTotalLoss) {
        finalStatus = ChallengeStatus.ACTIVE; // Toujours actif si pas encore échoué
      }
      
      // Mettre à jour le challenge
      await updateChallenge({
        status: finalStatus,
        currentBalance: activeChallenge.currentBalance
      });
      
      alert(`${t('challengeCompletedSuccessfully')}!\n${t('profit')}: $${profit.toFixed(2)} (${profitPercentage.toFixed(2)}%)`);
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert(t('errorCompletingChallenge'));
    } finally {
      setCalculating(false);
    }
  };

  if (!activeChallenge) {
    return null;
  }

  return (
    <button
      onClick={handleCompleteChallenge}
      disabled={calculating || activeChallenge.status !== ChallengeStatus.ACTIVE}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeChallenge.status === ChallengeStatus.ACTIVE && !calculating
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
      }`}
    >
      {calculating ? (
        <>
          <Calculator className="h-4 w-4 animate-spin" />
          {t('calculating')}
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4" />
          {t('completeChallenge')}
        </>
      )}
    </button>
  );
};

export default CompleteChallengeButton;