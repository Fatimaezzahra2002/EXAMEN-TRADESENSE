import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getAISignals } from '../services/geminiService';
import { Asset, AISignal, ChallengeStatus, Trade } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import RiskDetection from '../components/RiskDetection';
import NewsHub from '../components/NewsHub';
import CommunityZone from '../components/CommunityZone';
import TradingSignals from '../components/TradingSignals';
import { getInitialMarketData } from '../services/marketDataService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { activeChallenge, trades, addTrade, updateChallenge } = useUser();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [aiSignal, setAiSignal] = useState<AISignal | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadMarketData();
  }, []);

  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, selectedAsset]);

  useEffect(() => {
    if (selectedAsset) {
      fetchAISignal();
    }
  }, [selectedAsset]);

  const loadMarketData = async () => {
    setLoadingAssets(true);
    try {
      const marketData = await getInitialMarketData();
      // Convert MarketData to Asset type
      const convertedAssets: Asset[] = marketData.map(item => ({
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change: item.change,
        region: item.region
      }));
      setAssets(convertedAssets);
      if (!selectedAsset && convertedAssets.length > 0) {
        setSelectedAsset(convertedAssets[0]);
      }
    } catch (error) {
      console.error('Error loading market data:', error);
      // Fallback to mock data
      const mockAssets: Asset[] = [
        { symbol: 'BTC-USD', name: 'Bitcoin', price: 65230, change: 1.2, region: 'International' },
        { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: -0.5, region: 'International' },
        { symbol: 'IAM', name: 'Maroc Telecom', price: 92.5, change: 0.3, region: 'Morocco' },
        { symbol: 'ATW', name: 'Attijariwafa Bank', price: 465.2, change: 1.1, region: 'Morocco' },
      ];
      setAssets(mockAssets);
      if (!selectedAsset && mockAssets.length > 0) {
        setSelectedAsset(mockAssets[0]);
      }
    } finally {
      setLoadingAssets(false);
    }
  };

  const fetchAISignal = async () => {
    if (!selectedAsset) return;
    
    setAnalyzing(true);
    const signal = await getAISignals(selectedAsset.symbol, selectedAsset.price);
    setAiSignal(signal);
    setAnalyzing(false);
  };

  const generateMockChartData = (basePrice: number) => {
    // Generate 12 months of mock data based on the base price
    return Array.from({ length: 12 }, (_, i) => {
      // Add some random variation to the base price
      const variation = (Math.random() - 0.5) * basePrice * 0.1; // ±5% variation
      return basePrice + variation + (i * basePrice * 0.01); // Slight upward trend
    });
  };

  const executeTrade = (type: 'BUY' | 'SELL') => {
    if (!activeChallenge || activeChallenge.status !== ChallengeStatus.ACTIVE || !selectedAsset) return;

    const quantity = 0.1; // Simulated fixed lot
    const tradePrice = selectedAsset.price;

    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: selectedAsset.symbol,
      type,
      price: tradePrice,
      quantity,
      timestamp: new Date().toISOString()
    };

    addTrade(newTrade);

    // Virtual Risk Engine Logic
    const pnl = type === 'BUY' ? 10 : -10; // Simulated PnL change
    const newBalance = activeChallenge.currentBalance + pnl;

    let newStatus = ChallengeStatus.ACTIVE;
    const totalLoss = activeChallenge.initialBalance - newBalance;

    if (totalLoss >= activeChallenge.maxTotalLoss) newStatus = ChallengeStatus.FAILED;
    if (newBalance >= activeChallenge.initialBalance + activeChallenge.profitTarget) newStatus = ChallengeStatus.PASSED;

    updateChallenge({
      currentBalance: newBalance,
      status: newStatus
    });
  };

  if (!activeChallenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('noActiveChallenge')}</h2>
        <p className="text-slate-400 mb-8 max-w-md">{t('subscribeToTrade')}</p>
        <button onClick={() => window.location.hash = '#/pricing'} className="bg-emerald-600 px-6 py-3 rounded-xl font-bold">{t('seePlans')}</button>
      </div>
    );
  }

  if (loadingAssets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('loadingMarkets')}</h2>
        <p className="text-slate-400">{t('fetchingData')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 h-full w-full max-w-full">
      {/* Left Sidebar: Assets & Risk */}
      <div className="lg:w-1/4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('accountStatus')}
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-sm">{t('currentBalance')}</p>
              <p className="text-2xl font-mono font-bold">${activeChallenge.currentBalance.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-xs">{t('profitObjective')}</p>
                <p className="text-emerald-400 text-sm font-bold">+${activeChallenge.profitTarget}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">{t('maxLoss')}</p>
                <p className="text-red-400 text-sm font-bold">-${activeChallenge.maxTotalLoss}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${activeChallenge.status === ChallengeStatus.ACTIVE ? 'bg-blue-500/20 text-blue-400' :
                activeChallenge.status === ChallengeStatus.FAILED ? 'bg-red-500/20 text-red-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                {activeChallenge.status}
              </span>
            </div>
          </div>
        </div>

        <div className="modern-card overflow-hidden">
          <div className="p-4 border-b border-slate-700 font-bold">{t('markets')}</div>
          <div className="max-h-[300px] overflow-y-auto">
            {assets.map(asset => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`w-full p-4 flex justify-between items-center transition-all duration-200 rounded-xl ${selectedAsset?.symbol === asset.symbol ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 shadow-md' : 'hover:bg-white/5'} ${selectedAsset?.symbol === asset.symbol ? 'ring-1 ring-emerald-500/30' : ''}`}
              >
                <div className="text-left">
                  <p className="font-bold">{asset.symbol}</p>
                  <p className="text-xs text-slate-400">{asset.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">${asset.price}</p>
                  <p className={`text-xs ${asset.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Chart & Trading */}
      <div className="lg:w-1/2 flex flex-col gap-6">
        <div className="modern-card flex-grow min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedAsset?.symbol || 'Select Asset'}</h2>
              <p className="text-slate-400">{selectedAsset?.region} Market</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => executeTrade('BUY')} className="modern-button primary">
                <TrendingUp className="h-4 w-4" />
                {t('buy')}
              </button>
              <button onClick={() => executeTrade('SELL')} className="modern-button secondary bg-red-500/20 border-red-500/30 hover:bg-red-500/30">
                <TrendingDown className="h-4 w-4" />
                {t('sell')}
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div ref={chartContainerRef} className="w-full lg:w-2/3 h-[350px] rounded-xl p-4 bg-gradient-to-br from-slate-800 to-slate-900">
              <Line
                data={
                  {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: selectedAsset?.symbol || 'Asset',
                        data: selectedAsset ? generateMockChartData(selectedAsset.price) : [],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                      },
                    ],
                  }
                }
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: `${selectedAsset?.symbol || 'Asset'} Price Chart`,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                    },
                  },
                }}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <div className="modern-card h-full">
                <h3 className="font-bold mb-4">{t('tradingHistory')}</h3>
                <div className="overflow-x-auto h-[calc(100%-60px)]">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th className="text-left py-2 text-xs font-semibold text-slate-300">{t('symbol')}</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-300">{t('type')}</th>
                      </tr>
                    </thead>
                    <tbody className="max-h-60 overflow-y-auto">
                      {trades.length === 0 ? (
                        <tr><td colSpan={2} className="py-4 text-center text-slate-500 text-sm">{t('noTrades')}</td></tr>
                      ) : (
                        trades.map(t => (
                          <tr key={t.id}>
                            <td className="py-2 font-bold text-sm">{t.symbol}</td>
                            <td className={`py-2 text-sm ${t.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{t.type}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: AI Signals & New Features */}
      <div className="lg:w-1/4 space-y-6">
        <TradingSignals signal={aiSignal} isLoading={analyzing} onExecuteTrade={executeTrade} />

        <div className="modern-card">
          <RiskDetection />
        </div>

        <NewsHub />

        <CommunityZone />
      </div>
    </div>
  );
};

export default Dashboard;