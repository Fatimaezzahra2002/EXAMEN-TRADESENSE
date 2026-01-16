
export enum ChallengeStatus {
  ACTIVE = 'active',
  FAILED = 'failed',
  PASSED = 'passed'
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: string;
  pnl?: number;
}

export interface Challenge {
  id: string;
  userId: string;
  initialBalance: number;
  currentBalance: number;
  status: ChallengeStatus;
  maxDailyLoss: number;
  maxTotalLoss: number;
  profitTarget: number;
  createdAt: string;
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  region: 'International' | 'Morocco';
}

export interface AISignal {
  symbol: string;
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  reason: string;
  stopLoss?: number;
  takeProfit?: number;
  entryPoint?: number;
}
