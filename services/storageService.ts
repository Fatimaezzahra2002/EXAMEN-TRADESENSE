// Service de stockage persistant pour sauvegarder les données dans le localStorage
export class StorageService {
  private static readonly PREFIX = 'tradesense_';
  
  // Sauvegarder les données utilisateur
  static saveUserData(userId: number, data: any): void {
    try {
      const key = `${this.PREFIX}user_${userId}`;
      const userData = this.getUserData(userId) || {};
      
      // Fusionner les nouvelles données avec les anciennes
      const updatedData = { ...userData, ...data };
      
      localStorage.setItem(key, JSON.stringify(updatedData));
      console.log(`Saved user data for user ${userId}`, updatedData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }
  
  // Récupérer les données utilisateur
  static getUserData(userId: number): any {
    try {
      const key = `${this.PREFIX}user_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting user data:', error);
      return {};
    }
  }
  
  // Sauvegarder les défis d'un utilisateur
  static saveUserChallenges(userId: number, challenges: any[]): void {
    try {
      const key = `${this.PREFIX}challenges_${userId}`;
      localStorage.setItem(key, JSON.stringify(challenges));
      console.log(`Saved ${challenges.length} challenges for user ${userId}`);
    } catch (error) {
      console.error('Error saving user challenges:', error);
    }
  }
  
  // Récupérer les défis d'un utilisateur
  static getUserChallenges(userId: number): any[] {
    try {
      const key = `${this.PREFIX}challenges_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user challenges:', error);
      return [];
    }
  }
  
  // Sauvegarder les transactions d'un utilisateur
  static saveUserTrades(userId: number, trades: any[]): void {
    try {
      const key = `${this.PREFIX}trades_${userId}`;
      localStorage.setItem(key, JSON.stringify(trades));
      console.log(`Saved ${trades.length} trades for user ${userId}`);
    } catch (error) {
      console.error('Error saving user trades:', error);
    }
  }
  
  // Récupérer les transactions d'un utilisateur
  static getUserTrades(userId: number): any[] {
    try {
      const key = `${this.PREFIX}trades_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user trades:', error);
      return [];
    }
  }
  
  // Effacer toutes les données utilisateur
  static clearUserData(userId: number): void {
    try {
      const userDataKey = `${this.PREFIX}user_${userId}`;
      const challengesKey = `${this.PREFIX}challenges_${userId}`;
      const tradesKey = `${this.PREFIX}trades_${userId}`;
      
      localStorage.removeItem(userDataKey);
      localStorage.removeItem(challengesKey);
      localStorage.removeItem(tradesKey);
      
      console.log(`Cleared data for user ${userId}`);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}