import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingPage: React.FC = () => {
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureInfo, setFeatureInfo] = useState<{ title: string, desc: string } | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const showFeatureDetails = (title: string, desc: string) => {
    setFeatureInfo({ title, desc });
    setShowFeatureModal(true);
  };

  // Modal component for feature details
  const FeatureModal = () => {
    if (!showFeatureModal || !featureInfo) return null;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={() => setShowFeatureModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold mb-4">{featureInfo.title}</h3>
          <p className="text-slate-300 mb-6">{featureInfo.desc}</p>
          <button
            onClick={() => setShowFeatureModal(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  };

  const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => {
    const handleClick = () => {
      if (title === 'Moteur de Risque IA') {
        // Navigate to risk engine section in dashboard
        navigate('/dashboard');
      } else if (title === 'Marchés Locaux & US') {
        // Navigate to markets section in dashboard
        navigate('/dashboard');
      } else if (title === 'Paiements Flexibles') {
        // Navigate to pricing page
        navigate('/pricing');
      }
    };

    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition cursor-pointer" onClick={handleClick}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400">{desc}</p>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="w-full max-w-full px-6 py-16 relative z-10 h-full">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 mb-6 text-sm font-semibold tracking-wide text-emerald-400 uppercase bg-emerald-400/10 rounded-full">
            {t('slogan')}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {t('heading')}
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105">
              {t('startChallenge')}
            </Link>
            <Link to="/leaderboard" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all">
              {t('viewRankings')}
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-row-3 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title={t('riskEngine')}
              desc={t('riskEngineDesc')}
              icon="🛡️"
            />
            <FeatureCard
              title={t('localMarkets')}
              desc={t('localMarketsDesc')}
              icon="🌍"
            />
            <FeatureCard
              title={t('flexiblePayments')}
              desc={t('flexiblePaymentsDesc')}
              icon="💳"
            />
          </div>
        </div>
      </div>
      <FeatureModal />
    </div>
  );
};

export default LandingPage;