import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingUp, Bell, CheckCircle, XCircle } from 'lucide-react';

interface RiskAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  timestamp: string;
  asset: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const RiskDetection: React.FC = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<RiskAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: t('highVolatilityDetected'),
      timestamp: new Date(Date.now() - 300000).toISOString(),
      asset: 'BTC/USD',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'danger',
      message: t('drawdownThresholdApproaching'),
      timestamp: new Date(Date.now() - 600000).toISOString(),
      asset: 'ETH/USD',
      severity: 'high'
    },
    {
      id: '3',
      type: 'info',
      message: t('marketNewsImpact'),
      timestamp: new Date(Date.now() - 900000).toISOString(),
      asset: 'AAPL',
      severity: 'low'
    }
  ]);
  const [showAlerts, setShowAlerts] = useState(true);

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: RiskAlert = {
        id: Math.random().toString(36).substr(2, 9),
        type: Math.random() > 0.5 ? 'warning' : 'info',
        message: Math.random() > 0.5 ? t('highVolatilityDetected') : t('positionSizeWarning'),
        timestamp: new Date().toISOString(),
        asset: ['BTC/USD', 'ETH/USD', 'AAPL', 'MSFT', 'EUR/USD'][Math.floor(Math.random() * 5)],
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }, 10000); // New alert every 10 seconds

    return () => clearInterval(interval);
  }, [t]);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'danger': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          {t('riskDetection')}
        </h2>
        <button 
          onClick={() => setShowAlerts(!showAlerts)}
          className="text-slate-400 hover:text-white text-sm"
        >
          {showAlerts ? t('hide') : t('show')}
        </button>
      </div>

      {showAlerts && (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} flex items-start gap-3`}
            >
              <div className="mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{alert.message}</p>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-400">{alert.asset}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                    {t(alert.severity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {t('smartFiltering')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-sm">{t('goodTrades')} +12.4%</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">{t('riskyTrades')} -3.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDetection;