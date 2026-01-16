import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';
import { useTranslation } from 'react-i18next';

interface ChartData {
  time: string | number;
  value: number;
}

interface LightweightChartProps {
  data: ChartData[];
  symbol: string;
  height?: number;
  width?: number;
}

const LightweightChart: React.FC<LightweightChartProps> = ({ 
  data, 
  symbol,
  height = 400,
  width 
}) => {
  const { t } = useTranslation();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Créer un nouveau graphique avec des options simples
    const chart = createChart(chartContainerRef.current, {
      width: width || chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: '#0f172a' }, // bg-slate-900
        textColor: '#cbd5e1', // slate-300
      },
      grid: {
        vertLines: {
          color: '#1e293b' // slate-800
        },
        horzLines: {
          color: '#1e293b' // slate-800
        }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Ajouter une série de ligne en utilisant le type correct
    const lineSeries = chart.addSeries(LineSeries, {
      color: 'rgba(75, 192, 192, 1)', // Couleur pour correspondre au thème existant
      lineWidth: 2,
    });

    // Ajouter les données au graphique
    if (data && data.length > 0) {
      lineSeries.setData(data);
    }

    // Gestion du redimensionnement
    const resizeHandler = () => {
      if (width === undefined && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', resizeHandler);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.remove();
    };
  }, [data, height, width]);

  return (
    <div className="w-full">
      <div className="mb-2 text-left">
        <span className="text-lg font-bold text-white">{symbol}</span>
        <span className="text-sm text-slate-400 ml-2">{t('realtimeFeed', { symbol })}</span>
      </div>
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-xl bg-slate-900 border border-slate-700 overflow-hidden"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default LightweightChart;