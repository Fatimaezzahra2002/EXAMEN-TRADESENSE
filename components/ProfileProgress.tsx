import React from 'react';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

const ProfileProgress: React.FC = () => {
  const { user, trades, activeChallenge } = useUser();
  const { t } = useTranslation();

  // Calculer les points d'activité basés sur les actions
  const calculateActivityPoints = () => {
    let points = 0;
    
    // Points pour les trades effectués
    points += trades.length * 10;
    
    // Points pour les challenges complétés
    if (activeChallenge) {
      const progressPercentage = ((activeChallenge.currentBalance - activeChallenge.initialBalance) / activeChallenge.profitTarget) * 100;
      points += Math.min(progressPercentage, 100); // Maximum 100 points par challenge
      
      // Bonus si le challenge est complété
      if (activeChallenge.status === 'PASSED') {
        points += 50;
      }
    }
    
    // Points pour avoir visité le centre MasterClass
    // Dans une implémentation complète, cela serait basé sur des données réelles
    points += 20; // Point de base pour avoir accédé à la formation
    
    return Math.min(points, 1000); // Limite à 1000 points pour le calcul de pourcentage
  };

  const activityPoints = calculateActivityPoints();
  const level = Math.floor(activityPoints / 100) + 1;
  const progressPercentage = (activityPoints % 100); // Pourcentage pour le niveau actuel

  // Déterminer le grade basé sur les points
  const getGrade = (points: number) => {
    if (points < 100) return t('noviceTrader');
    if (points < 250) return t('apprenticeTrader');
    if (points < 500) return t('skilledTrader');
    if (points < 750) return t('expertTrader');
    return t('masterTrader');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-emerald-400">{t('profileProgress')}</h3>
        <span className="text-sm font-bold text-slate-300">{getGrade(activityPoints)}</span>
      </div>
      
      <div className="flex items-center mb-2">
        <span className="text-sm text-slate-400 mr-2">{t('level')} {level}</span>
        <span className="text-sm text-slate-400 ml-auto">{activityPoints} {t('points')}</span>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">{trades.length}</div>
          <div className="text-xs text-slate-400">{t('tradesExecuted')}</div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">
            {activeChallenge ? ((activeChallenge.currentBalance - activeChallenge.initialBalance) / activeChallenge.initialBalance * 100).toFixed(2) : '0.00'}%
          </div>
          <div className="text-xs text-slate-400">{t('profitGain')}</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <h4 className="font-bold text-slate-300 mb-2">{t('recentActivities')}</h4>
        <ul className="text-sm space-y-1">
          <li className="flex items-center text-slate-400">
            <span className="text-emerald-400 mr-2">✓</span>
            {t('completedFirstTrade')}
          </li>
          <li className="flex items-center text-slate-400">
            <span className="text-emerald-400 mr-2">✓</span>
            {t('visitedMasterClass')}
          </li>
          <li className="flex items-center text-slate-400">
            <span className="text-emerald-400 mr-2">✓</span>
            {t('checkedSignals')}
          </li>
          <li className="flex items-center text-slate-300">
            <span className="text-slate-500 mr-2">○</span>
            {t('completedChallenge')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileProgress;