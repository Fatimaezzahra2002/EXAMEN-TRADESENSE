import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, XCircle, Play, Pause } from 'lucide-react';
import { AISignal } from '../types';

interface TradingSignalsProps {
  signal: AISignal | null;
  isLoading: boolean;
  onExecuteTrade?: (direction: 'BUY' | 'SELL') => void;
}

const TradingSignals: React.FC<TradingSignalsProps> = ({ signal, isLoading, onExecuteTrade }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="modern-card p-6">
        <h3 className="text-lg font-bold mb-4 text-emerald-400">{t('aiSignal')}</h3>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="modern-card p-6">
        <h3 className="text-lg font-bold mb-4 text-emerald-400">{t('aiSignal')}</h3>
        <p className="text-slate-400 text-sm">{t('selectAsset')}</p>
      </div>
    );
  }

  return (
    <div className="modern-card p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-emerald-400">{t('aiSignal')}</h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          signal.direction === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
          signal.direction === 'SELL' ? 'bg-red-500/20 text-red-400' :
          'bg-slate-700 text-slate-400'
        }`}>
          {signal.direction}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{t('confidence')}</span>
          <span className="text-sm font-bold">{(signal.confidence * 100).toFixed(0)}%</span>
        </div>

        <div className="pt-3 border-t border-slate-700">
          <p className="text-sm italic text-slate-300">"{signal.reason}"</p>
        </div>

        {/* Entry Point */}
        {signal.entryPoint && (
          <div className="mt-4 pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Play className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">{t('entryPoint')}</span>
            </div>
            <div className="text-sm font-mono">${signal.entryPoint.toFixed(2)}</div>
          </div>
        )}

        {/* Stop Loss */}
        {signal.stopLoss && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-slate-400">{t('stopLoss')}</span>
            </div>
            <div className="text-sm font-mono text-red-400">${signal.stopLoss.toFixed(2)}</div>
          </div>
        )}

        {/* Take Profit */}
        {signal.takeProfit && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-slate-400">{t('takeProfit')}</span>
            </div>
            <div className="text-sm font-mono text-emerald-400">${signal.takeProfit.toFixed(2)}</div>
          </div>
        )}

        {/* Action Buttons */}
        {onExecuteTrade && (
          <div className="mt-6 pt-4 border-t border-slate-700 flex gap-3">
            <button
              onClick={() => onExecuteTrade('BUY')}
              disabled={signal.direction !== 'BUY'}
              className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                signal.direction === 'BUY'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              {t('buy')}
            </button>
            <button
              onClick={() => onExecuteTrade('SELL')}
              disabled={signal.direction !== 'SELL'}
              className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                signal.direction === 'SELL'
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              {t('sell')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingSignals;