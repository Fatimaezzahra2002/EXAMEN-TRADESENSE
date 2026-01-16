import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ChallengeStatus } from '../types';
import { useTranslation } from 'react-i18next';
import { UserDataService } from '../services/userDataService';

const PricingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto' | null>(null);
  const { setActiveChallenge, currentUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePayment = async (plan: string, amount: number) => {
    if (!currentUser) {
      return;
    }

    setLoading(true);
    await new Promise(res => setTimeout(res, 2000));

    const virtualBalance = amount * 10;

    let newChallenge;

    try {
      const createdChallenge = await UserDataService.createChallenge(currentUser.id, {
        initialBalance: virtualBalance,
        currentBalance: virtualBalance,
        status: ChallengeStatus.ACTIVE,
        maxDailyLoss: virtualBalance * 0.05,
        maxTotalLoss: virtualBalance * 0.1,
        profitTarget: virtualBalance * 0.1
      });

      if (createdChallenge) {
        newChallenge = createdChallenge;
      }
    } catch (e) {
    }

    if (!newChallenge) {
      newChallenge = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id.toString(),
        initialBalance: virtualBalance,
        currentBalance: virtualBalance,
        status: ChallengeStatus.ACTIVE,
        maxDailyLoss: virtualBalance * 0.05,
        maxTotalLoss: virtualBalance * 0.1,
        profitTarget: virtualBalance * 0.1,
        createdAt: new Date().toISOString()
      };
    }

    setActiveChallenge(newChallenge);
    setIsPaymentModalOpen(false);
    setPaymentMethod(null);
    setSelectedPlan(null);
    setLoading(false);
    navigate('/dashboard');
  };

  const openPaymentModal = (name: string, amount: number) => {
    setSelectedPlan({ name, amount });
    setPaymentMethod(null);
    setIsPaymentModalOpen(true);
  };

  const PlanCard = ({ name, price, capital, popular, onSelect, loading }: {
    name: string;
    price: string;
    capital: string;
    popular?: boolean;
    onSelect: () => void;
    loading: boolean;
  }) => (
    <div className={`relative p-8 modern-card ${popular ? 'border-emerald-500 shadow-emerald-500/20 shadow-2xl scale-105 z-10' : ''}`}>
      {popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">{t('popular')}</span>}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="text-4xl font-extrabold mb-6">{price}</div>
      <ul className="space-y-4 mb-8 text-slate-300">
        <li className="flex items-center gap-2">✅ {t('capital')} : <span className="text-white font-bold">{capital}</span></li>
        <li className="flex items-center gap-2">✅ {t('dailyDrawdown')} : 5%</li>
        <li className="flex items-center gap-2">✅ {t('totalDrawdown')} : 10%</li>
        <li className="flex items-center gap-2">✅ {t('profitTarget')} : 10%</li>
      </ul>
      <button
        onClick={onSelect}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold transition ${popular ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-700 hover:bg-slate-600 text-white'} disabled:opacity-50`}
      >
        {loading ? t('processing') : t('begin')}
      </button>
    </div>
  );

  return (
    <div className="py-20 px-6 w-full max-w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">{t('chooseChallenge')}</h2>
        <p className="text-slate-400">{t('proveSkills')}</p>
      </div>

      <div className="w-full grid md:grid-cols-3 gap-8">
        <PlanCard
          name={t('starter')}
          price="200 DH"
          capital="2 000 $"
          onSelect={() => openPaymentModal('Starter', 2000)}
          loading={loading}
        />
        <PlanCard
          name={t('pro')}
          price="500 DH"
          capital="5 000 $"
          popular
          onSelect={() => openPaymentModal('Pro', 5000)}
          loading={loading}
        />
        <PlanCard
          name={t('elite')}
          price="1000 DH"
          capital="10 000 $"
          onSelect={() => openPaymentModal('Elite', 10000)}
          loading={loading}
        />
      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto modern-card p-8">
        <h3 className="text-xl font-bold mb-4">{t('securePayment')}</h3>
        <div className="flex flex-wrap justify-center gap-6 opacity-60">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" alt="BTC" className="h-6" />
        </div>
      </div>

      {isPaymentModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full mx-4 p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-white">
              {t('choosePaymentMethod')}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {selectedPlan.name} • {selectedPlan.amount} DH
            </p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full px-4 py-3 rounded-xl text-left border ${
                  paymentMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <span className="block text-white font-medium">
                  {t('paymentCard')}
                </span>
                <span className="block text-xs text-slate-400">
                  {t('paymentCardDesc')}
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full px-4 py-3 rounded-xl text-left border ${
                  paymentMethod === 'paypal'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <span className="block text-white font-medium">
                  {t('paymentPaypal')}
                </span>
                <span className="block text-xs text-slate-400">
                  {t('paymentPaypalDesc')}
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`w-full px-4 py-3 rounded-xl text-left border ${
                  paymentMethod === 'crypto'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <span className="block text-white font-medium">
                  {t('paymentCrypto')}
                </span>
                <span className="block text-xs text-slate-400">
                  {t('paymentCryptoDesc')}
                </span>
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setPaymentMethod(null);
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 text-sm"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  if (selectedPlan && paymentMethod && !loading) {
                    handlePayment(selectedPlan.name, selectedPlan.amount);
                  }
                }}
                disabled={!paymentMethod || loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  paymentMethod && !loading
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:opacity-90'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? t('processing') : t('confirmPayment')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
