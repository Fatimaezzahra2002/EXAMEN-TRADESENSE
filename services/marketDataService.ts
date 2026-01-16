export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  region: 'International' | 'Morocco';
  timestamp: Date;
}

import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchInternationalData = async (): Promise<MarketData[]> => {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: -0.5, region: 'International', timestamp: new Date() },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.5, change: 2.3, region: 'International', timestamp: new Date() },
    { symbol: 'BTC-USD', name: 'Bitcoin USD', price: 65230.5, change: 1.2, region: 'International', timestamp: new Date() },
  ];
};

export const fetchMoroccanData = async (): Promise<MarketData[]> => {
  try {
    await axios.get('https://www.casablanca-bourse.ma/fr/marches/indices/bvc20');

    const moroccanData: MarketData[] = [];
    moroccanData.push(
      { symbol: 'IAM', name: 'Maroc Telecom', price: 92.5, change: 0.3, region: 'Morocco', timestamp: new Date() },
      { symbol: 'ATW', name: 'Attijariwafa Bank', price: 465.2, change: 1.1, region: 'Morocco', timestamp: new Date() }
    );

    return moroccanData;
  } catch (error) {
    return [
      { symbol: 'IAM', name: 'Maroc Telecom', price: 92.5, change: 0.3, region: 'Morocco', timestamp: new Date() },
      { symbol: 'ATW', name: 'Attijariwafa Bank', price: 465.2, change: 1.1, region: 'Morocco', timestamp: new Date() },
    ];
  }
};

export const simulateRealTimeUpdates = (callback: (data: MarketData[]) => void) => {
  setInterval(() => {
    const internationalData = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: -0.5, region: 'International', timestamp: new Date() },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.5, change: 2.3, region: 'International', timestamp: new Date() },
      { symbol: 'BTC-USD', name: 'Bitcoin USD', price: 65230.5, change: 1.2, region: 'International', timestamp: new Date() },
    ];

    const moroccanData = [
      { symbol: 'IAM', name: 'Maroc Telecom', price: 92.5, change: 0.3, region: 'Morocco', timestamp: new Date() },
      { symbol: 'ATW', name: 'Attijariwafa Bank', price: 465.2, change: 1.1, region: 'Morocco', timestamp: new Date() },
    ];

    const allAssets = [...internationalData, ...moroccanData].map(asset => {
      const changeAmount = (Math.random() - 0.5) * 0.5;
      const newPrice = asset.price * (1 + changeAmount / 100);
      const newChange = parseFloat((changeAmount + asset.change).toFixed(2));

      return {
        ...asset,
        price: parseFloat(newPrice.toFixed(2)),
        change: newChange,
        timestamp: new Date()
      };
    });

    callback(allAssets);
  }, 10000);
};

export const getInitialMarketData = async (): Promise<MarketData[]> => {
  const internationalData = await fetchInternationalData();
  const moroccanData = await fetchMoroccanData();

  return [...internationalData, ...moroccanData];
};

export const getAssetBySymbol = async (symbol: string): Promise<MarketData | undefined> => {
  const allAssets = await getInitialMarketData();
  return allAssets.find(asset => asset.symbol === symbol);
};

export const getAssetsByRegion = async (region: 'International' | 'Morocco'): Promise<MarketData[]> => {
  const allAssets = await getInitialMarketData();
  return allAssets.filter(asset => asset.region === region);
};
