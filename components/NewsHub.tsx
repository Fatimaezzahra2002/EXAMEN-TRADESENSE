import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Newspaper, TrendingUp, Calendar, Bot } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  category: 'financial' | 'market' | 'economic' | 'crypto';
  impact: 'low' | 'medium' | 'high';
}

const NewsHub: React.FC = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: t('fedInterestRateUpdate'),
      summary: t('fedRateSummary'),
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      category: 'economic',
      impact: 'high'
    },
    {
      id: '2',
      title: t('btcSurges'),
      summary: t('btcSurgesSummary'),
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      category: 'crypto',
      impact: 'medium'
    },
    {
      id: '3',
      title: t('oilPricesStable'),
      summary: t('oilPricesSummary'),
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      category: 'market',
      impact: 'low'
    },
    {
      id: '4',
      title: t('techStocksRally'),
      summary: t('techStocksSummary'),
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      category: 'financial',
      impact: 'high'
    }
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Simulate real-time news updates
  useEffect(() => {
    const interval = setInterval(() => {
      const categories: ('financial' | 'market' | 'economic' | 'crypto')[] = ['financial', 'market', 'economic', 'crypto'];
      const impacts: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

      const newNews: NewsItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: t('newNewsTitle'),
        summary: t('newNewsSummary'),
        timestamp: new Date().toISOString(),
        category: categories[Math.floor(Math.random() * categories.length)],
        impact: impacts[Math.floor(Math.random() * impacts.length)]
      };

      setNews(prev => [newNews, ...prev.slice(0, 9)]);
    }, 15000); // New news item every 15 seconds

    return () => clearInterval(interval);
  }, [t]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'market': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'economic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'crypto': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredNews = activeCategory === 'all'
    ? news
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="modern-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-emerald-500" />
          {t('newsHub')}
        </h2>
        <div className="flex gap-2">
          {['all', 'financial', 'market', 'economic', 'crypto'].map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-xs capitalize ${activeCategory === category
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
              {t(category)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-slate-300 text-sm mb-3">{item.summary}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                  {t(item.category)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(item.impact)}`}>
                  {t('impact')} {t(item.impact)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Bot className="h-3 w-3" />
                <span>{t('aiSummary')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {t('marketEvents')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">{t('earnings')}</span>
            </div>
            <span className="text-xs text-slate-400">10:00 AM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">{t('fedMeeting')}</span>
            </div>
            <span className="text-xs text-slate-400">2:00 PM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm">{t('gdpRelease')}</span>
            </div>
            <span className="text-xs text-slate-400">8:30 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsHub;