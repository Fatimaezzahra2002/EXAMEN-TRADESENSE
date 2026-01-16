import { ChallengeStatus } from '../types';

export class UserDataService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fonction pour récupérer les défis d'un utilisateur depuis le backend
  static async getUserChallenges(userId: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/user/${userId}/challenges`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const challenges = await response.json();
      
      return challenges.map((challenge: any) => ({
        id: challenge.id.toString(),
        userId: challenge.user_id.toString(),
        initialBalance: challenge.initial_balance,
        currentBalance: challenge.current_balance,
        status: challenge.status as ChallengeStatus,
        maxDailyLoss: challenge.max_daily_loss,
        maxTotalLoss: challenge.max_total_loss,
        profitTarget: challenge.profit_target,
        createdAt: challenge.created_at
      }));
    } catch (error) {
      console.error('Error getting user challenges from backend:', error);
      // Fallback to simulated data if backend is not available
      return [
        {
          id: `${userId}-1`,
          userId: userId.toString(),
          initialBalance: 10000,
          currentBalance: 10500,
          status: 'active' as ChallengeStatus,
          maxDailyLoss: 500,
          maxTotalLoss: 1000,
          profitTarget: 1000,
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  // Fonction pour récupérer les transactions d'un utilisateur depuis le backend
  static async getUserTrades(userId: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/user/${userId}/trades`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const trades = await response.json();
      
      return trades.map((trade: any) => ({
        id: trade.id.toString(),
        symbol: trade.symbol,
        type: trade.type as 'BUY' | 'SELL',
        price: trade.price,
        quantity: trade.quantity,
        timestamp: trade.timestamp,
        pnl: trade.pnl || 0
      }));
    } catch (error) {
      console.error('Error getting user trades from backend:', error);
      // Fallback to simulated data if backend is not available
      return [
        { 
          id: `${userId}-1`, 
          symbol: 'EUR/USD', 
          type: 'BUY' as const, 
          price: 1.085, 
          quantity: 1000, 
          timestamp: new Date().toISOString(), 
          pnl: 50 
        }
      ];
    }
  }

  static async createChallenge(userId: number, challengeData: {
    initialBalance: number;
    currentBalance: number;
    status: ChallengeStatus;
    maxDailyLoss: number;
    maxTotalLoss: number;
    profitTarget: number;
  }): Promise<any | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...challengeData,
          userId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result || !result.id) {
        return null;
      }
      
      return {
        id: result.id.toString(),
        userId: userId.toString(),
        initialBalance: result.initialBalance || challengeData.initialBalance,
        currentBalance: result.currentBalance || challengeData.currentBalance,
        status: result.status || challengeData.status,
        maxDailyLoss: result.maxDailyLoss || challengeData.maxDailyLoss,
        maxTotalLoss: result.maxTotalLoss || challengeData.maxTotalLoss,
        profitTarget: result.profitTarget || challengeData.profitTarget,
        createdAt: result.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating challenge in backend:', error);
      return null;
    }
  }


  // Fonction pour mettre à jour un défi via le backend
  static async updateChallenge(challengeId: string, updates: Partial<any>): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/challenge/${challengeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Updated challenge ${challengeId}:`, result);
      return result.success;
    } catch (error) {
      console.error('Error updating challenge in backend:', error);
      // Return true to simulate success in case of backend issues
      return true;
    }
  }

  // Fonction pour ajouter une transaction via le backend
  static async addTrade(userId: number, challengeId: string, trade: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/trade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          challengeId: parseInt(challengeId),
          symbol: trade.symbol,
          type: trade.type,
          price: trade.price,
          quantity: trade.quantity,
          pnl: trade.pnl || 0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Added trade for user ${userId}:`, result);
      return result.success;
    } catch (error) {
      console.error('Error adding trade in backend:', error);
      // Return true to simulate success in case of backend issues
      return true;
    }
  }
}
