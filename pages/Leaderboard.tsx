
import React from 'react';
import { useTranslation } from 'react-i18next';

const TOP_TRADERS = [
  { rank: 1, name: "Amine K.", profit: "+24.5%", funded: true, country: "MA" },
  { rank: 2, name: "Sarah B.", profit: "+18.2%", funded: true, country: "NG" },
  { rank: 3, name: "Youssef D.", profit: "+15.9%", funded: false, country: "MA" },
  { rank: 4, name: "Kwame O.", profit: "+12.1%", funded: false, country: "GH" },
  { rank: 5, name: "Fatima Z.", profit: "+10.5%", funded: false, country: "MA" },
];

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-20 px-6 w-full max-w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">{t('leaderboard')}</h2>
        <p className="text-slate-400">{t('topPerformers')}</p>
      </div>

      <div className="modern-card overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm">
              <th className="p-6 text-left">{t('rank')}</th>
              <th className="p-6 text-left">{t('trader')}</th>
              <th className="p-6 text-left">{t('status')}</th>
              <th className="p-6 text-right">{t('profit')} (%)</th>
            </tr>
          </thead>
          <tbody>
            {TOP_TRADERS.map((trader) => (
              <tr key={trader.rank} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                <td className="p-6 font-bold text-slate-500">#{trader.rank}</td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                      {trader.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{trader.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        🌍 {trader.country}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  {trader.funded ? (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full font-bold">{t('funded')}</span>
                  ) : (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">{t('challenge')}</span>
                  )}
                </td>
                <td className="p-6 text-right font-mono font-bold text-emerald-400">
                  {trader.profit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 text-center text-slate-500 text-sm">
        {t('updateNote')}
      </div>
    </div>
  );
};

export default Leaderboard;
