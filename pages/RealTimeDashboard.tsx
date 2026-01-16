import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { getAISignals } from '../services/geminiService';
import { Asset, AISignal, ChallengeStatus, Trade } from '../types';
import { useTranslation } from 'react-i18next';
import RiskDetection from '../components/RiskDetection';
import NewsHub from '../components/NewsHub';
import CommunityZone from '../components/CommunityZone';
import ProfileProgress from '../components/ProfileProgress';
import LightweightChart from '../components/LightweightChart';
import { getInitialMarketData, simulateRealTimeUpdates, getAssetBySymbol, MarketData } from '../services/marketDataService';

const RealTimeDashboard: React.FC = () => {
  const { activeChallenge, trades, executeTrade, updateChallenge } = useUser();
  const [selectedAsset, setSelectedAsset] = useState<MarketData | null>(null);
  const [aiSignal, setAiSignal] = useState<AISignal | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [assets, setAssets] = useState<MarketData[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<Array<{time: string, value: number}>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  // Generate mock chart data based on selected asset
  const generateMockChartData = (asset: MarketData) => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now);
      time.setMinutes(time.getMinutes() - i);
      const baseValue = asset.price;
      // Add some realistic fluctuations
      const fluctuation = (Math.random() - 0.5) * 0.5; // ±0.25% fluctuation
      const value = baseValue * (1 + fluctuation / 100);
      data.push({
        time: time.toISOString().slice(0, 19).replace('T', ' '), // Format: YYYY-MM-DD HH:MM:SS
        value: parseFloat(value.toFixed(2))
      });
    }
    return data;
  };

  useEffect(() => {
    // Load initial data
    const initialData = getInitialMarketData();
    setAssets(initialData);
    setSelectedAsset(initialData[0]);
    
    // Start real-time updates
    const intervalId = simulateRealTimeUpdates((updatedData) => {
      setAssets(updatedData);
      // Update selected asset if it exists in the updated data
      if (selectedAsset) {
        const updatedSelectedAsset = updatedData.find(a => a.symbol === selectedAsset.symbol);
        if (updatedSelectedAsset) {
          setSelectedAsset(updatedSelectedAsset);
        }
      }
      setLastUpdateTime(new Date());
    });

    // Store interval ID in ref
    intervalRef.current = intervalId;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAsset) {
      fetchAISignal();
      setChartData(generateMockChartData(selectedAsset));
    }
  }, [selectedAsset]);

  const fetchAISignal = async () => {
    if (!selectedAsset) return;
    
    setAnalyzing(true);
    const signal = await getAISignals(selectedAsset.symbol, selectedAsset.price);
    setAiSignal(signal);
    setAnalyzing(false);
  };

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    if (!activeChallenge || activeChallenge.status !== ChallengeStatus.ACTIVE || !selectedAsset) return;

    const quantity = 0.1; // Simulated fixed lot
    const tradePrice = selectedAsset.price;

    // Appeler la fonction executeTrade du contexte
    executeTrade(selectedAsset.symbol, type, tradePrice, quantity);

    // Virtual Risk Engine Logic
    const pnl = type === 'BUY' ? (Math.random() * 20 - 10) : (Math.random() * -20 - 10); // Simulated PnL change
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 h-full w-full max-w-full">
      {/* Left Sidebar: Assets & Risk */}
      <div className="lg:w-1/4 space-y-6">
        <ProfileProgress />
        
        <div className="modern-card overflow-hidden">
          <div className="p-4 border-b border-slate-700 font-bold">{t('markets')} ({assets.length})</div>
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
                  <p className="font-mono text-sm">${asset.price.toFixed(2)}</p>
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
        <div className="modern-card flex-grow min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              {selectedAsset ? (
                <>
                  <h2 className="text-2xl font-bold">{selectedAsset.symbol}</h2>
                  <p className="text-slate-400">{selectedAsset.region} Market • ${selectedAsset.price.toFixed(2)} ({selectedAsset.change > 0 ? '+' : ''}{selectedAsset.change}%)</p>
                </>
              ) : (
                <h2 className="text-2xl font-bold">{t('selectAsset')}</h2>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExecuteTrade('BUY')} 
                className="modern-button primary"
                disabled={!selectedAsset}
              >
                {t('buy')}
              </button>
              <button 
                onClick={() => handleExecuteTrade('SELL')} 
                className="modern-button secondary bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                disabled={!selectedAsset}
              >
                {t('sell')}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full h-[400px]">
              {selectedAsset ? (
                <LightweightChart 
                  data={chartData} 
                  color={selectedAsset.change >= 0 ? '#26a69a' : '#ef5350'}
                  title={`${selectedAsset.symbol} Price Chart`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-xl">
                  <p className="text-slate-500">{t('selectAssetToViewChart')}</p>
                </div>
              )}
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
                        <th className="text-left py-2 text-xs font-semibold text-slate-300">{t('price')}</th>
                      </tr>
                    </thead>
                    <tbody className="max-h-60 overflow-y-auto">
                      {trades.length === 0 ? (
                        <tr><td colSpan={3} className="py-4 text-center text-slate-500 text-sm">{t('noTrades')}</td></tr>
                      ) : (
                        trades.slice(-10).map(t => (  // Show only last 10 trades
                          <tr key={t.id}>
                            <td className="py-2 font-bold text-sm">{t.symbol}</td>
                            <td className={`py-2 text-sm ${t.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{t.type}</td>
                            <td className="py-2 text-sm">${t.price.toFixed(2)}</td>
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
        <div className="modern-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-12 h-12 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="text-lg font-bold mb-4 text-emerald-400">{t('aiSignal')}</h3>
          {analyzing ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            </div>
          ) : aiSignal ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${aiSignal.direction === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                  aiSignal.direction === 'SELL' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>{aiSignal.direction}</span>
                <span className="text-xs text-slate-500">{t('confidence')}: {(aiSignal.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-sm italic text-slate-300">"{aiSignal.reason}"</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t('selectAsset')}</p>
          )}
        </div>

        <div className="modern-card">
          <RiskDetection />
        </div>

        <NewsHub />

        <CommunityZone />
      </div>
    </div>
  );
};

export default RealTimeDashboard;
