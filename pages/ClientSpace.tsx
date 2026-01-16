import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Wallet, Target, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ChallengeModal from '../components/ChallengeModal';
import CompleteChallengeButton from '../components/CompleteChallengeButton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

const ClientSpace: React.FC = () => {
  const { t } = useTranslation();
  const { user, activeChallenge, allChallenges, trades, updateChallenge } = useUser();
  const [stats, setStats] = useState({
    portfolioValue: 0,
    totalProfit: 0,
    activeChallenges: 0,
    completedChallenges: 0,
  });
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{
      label: t('portfolioValue'),
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 2,
      tension: 0.4,
    }],
  });

  const [selectedChallenge, setSelectedChallenge] = useState<{ challenge: any; action: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Update stats based on user data
    const calculateStats = () => {
      let portfolioValue = 0;
      let totalProfit = 0;
      let activeChallenges = 0;
      let completedChallenges = 0;

      // Calculate based on active challenge
      if (activeChallenge) {
        portfolioValue = activeChallenge.currentBalance;
        totalProfit = activeChallenge.currentBalance - activeChallenge.initialBalance;
        if (activeChallenge.status === 'passed') {
          completedChallenges = 1;
        } else if (activeChallenge.status === 'active') {
          activeChallenges = 1;
        }
      }

      // Count all challenges from the allChallenges array
      if (allChallenges && allChallenges.length > 0) {
        activeChallenges = allChallenges.filter(c => c.status === 'active').length;
        completedChallenges = allChallenges.filter(c => c.status === 'passed').length;
        
        // Use the first active challenge for portfolio value if available
        const activeChallengeFromList = allChallenges.find(c => c.status === 'active');
        if (activeChallengeFromList) {
          portfolioValue = activeChallengeFromList.currentBalance;
          totalProfit = activeChallengeFromList.currentBalance - activeChallengeFromList.initialBalance;
        }
      }

      // Update state
      setStats({
        portfolioValue,
        totalProfit,
        activeChallenges,
        completedChallenges,
      });

      // Generate dynamic chart data based on trades
      const generateChartData = () => {
        if (trades.length === 0) {
          // Default data if no trades
          return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: t('portfolioValue'),
              data: [10000, 10500, 11000, 10800, 11500, portfolioValue],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 2,
              tension: 0.4,
            }]
          };
        }

        // Use actual trade data to generate chart
        const labels = trades.slice(-6).map((_, index) => `Trade ${index + 1}`);
        const dataValues = trades.slice(-6).map(trade => trade.price * trade.quantity);

        return {
          labels,
          datasets: [{
            label: t('portfolioValue'),
            data: [...dataValues, portfolioValue],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            tension: 0.4,
          }]
        };
      };

      setChartData(generateChartData());
    };

    calculateStats();
  }, [user, activeChallenge, allChallenges, trades, t]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1', // slate-300
        }
      },
      title: {
        display: true,
        color: '#e2e8f0', // slate-200
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.2)', // slate-400 with opacity
        },
        ticks: {
          color: '#94a3b8', // slate-400
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.2)', // slate-400 with opacity
        },
        ticks: {
          color: '#94a3b8', // slate-400
        }
      }
    }
  };

  // Recent activities based on user actions
  const recentActivities = [
    { id: 1, type: 'profit', amount: '+$240', description: t('profitMade') },
    { id: 2, type: 'challenge', name: t('advancedChallenge'), description: t('challengeCompleted') },
    { id: 3, type: 'achievement', name: t('topTrader'), description: t('achievementUnlocked') },
  ];

  // Add activities based on user's actual trades and challenges
  if (trades.length > 0) {
    recentActivities.unshift({
      id: 0,
      type: 'trade',
      amount: `$${trades[trades.length - 1].price}`,
      description: `${t('executedTrade')} ${trades[trades.length - 1].symbol}`
    });
  }

  return (
    <div className="min-h-screen bg-slate-900 p-0">
      <div className="w-full max-w-full h-full p-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t('clientSpace')} - {user?.name || t('welcomeBack')}
          </h1>
          <p className="text-slate-400 mt-2">{t('clientDashboardOverview')}</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="modern-card mb-8">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">{t('portfolioValue')}</p>
                <p className="text-2xl font-semibold text-white">${stats.portfolioValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="modern-card mb-8">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">{t('totalProfit')}</p>
                <p className={`text-2xl font-semibold ${stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="modern-card mb-8">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">{t('activeChallenges')}</p>
                <p className="text-2xl font-semibold text-white">{stats.activeChallenges}</p>
              </div>
            </div>
          </div>

          <div className="modern-card mb-8">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">{t('completedChallenges')}</p>
                <p className="text-2xl font-semibold text-white">{stats.completedChallenges}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="modern-card mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">{t('portfolioPerformance')}</h2>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="modern-card mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">{t('recentActivity')}</h2>
            <div className="space-y-4">
              {recentActivities.slice(0, 3).map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'profit' ? 'bg-emerald-500/20' : 
                      activity.type === 'challenge' ? 'bg-blue-500/20' : 
                      activity.type === 'achievement' ? 'bg-purple-500/20' : 'bg-slate-500/20'
                    }`}>
                      {activity.type === 'profit' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                      {activity.type === 'challenge' && <Target className="h-4 w-4 text-blue-400" />}
                      {activity.type === 'achievement' && <Award className="h-4 w-4 text-purple-400" />}
                      {activity.type === 'trade' && <BarChart3 className="h-4 w-4 text-slate-400" />}
                    </div>
                    <span className="ml-3 font-medium text-white">{activity.description}</span>
                  </div>
                  <span className={`font-semibold ${
                    activity.type === 'profit' ? 'text-emerald-400' : 
                    activity.type === 'challenge' ? 'text-blue-400' : 
                    activity.type === 'achievement' ? 'text-purple-400' : 'text-slate-400'
                  }`}>
                    {activity.amount || activity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        <div className="modern-card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">{t('myChallenges')}</h2>
            {activeChallenge && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  {t('activeChallenge')}: {activeChallenge.id}
                </span>
                <CompleteChallengeButton />
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('challenge')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('profitTarget')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('currentProgress')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {allChallenges && allChallenges.length > 0 ? (
                  allChallenges.map(challenge => (
                    <tr key={challenge.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{challenge.id} - {t('currentChallenge')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          challenge.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          challenge.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                          challenge.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {t(challenge.status.toLowerCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        ${challenge.profitTarget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">${(challenge.currentBalance - challenge.initialBalance).toFixed(2)}</div>
                        <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min(100, ((challenge.currentBalance - challenge.initialBalance) / challenge.profitTarget) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <button 
                          onClick={() => {
                            setSelectedChallenge({ challenge, action: 'view' });
                            setIsModalOpen(true);
                          }}
                          className="text-emerald-400 hover:text-emerald-300 mr-3"
                        >
                          {t('view')}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedChallenge({ challenge, action: 'manage' });
                            setIsModalOpen(true);
                          }}
                          className="text-slate-400 hover:text-slate-300"
                        >
                          {t('manage')}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 text-center">
                      {t('noChallengesFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Challenge Modal */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge.challenge}
          action={selectedChallenge.action}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientSpace;