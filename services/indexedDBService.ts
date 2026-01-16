// Service de stockage IndexedDB pour simuler une base de données MySQL
export class IndexedDBService {
  private static dbName = 'TradeSenseDB';
  private static version = 1;
  private static db: IDBDatabase | null = null;

  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Database error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Créer la table users
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
          console.log('Users store created');
        }

        // Créer la table challenges
        if (!db.objectStoreNames.contains('challenges')) {
          const challengeStore = db.createObjectStore('challenges', { keyPath: 'id', autoIncrement: true });
          challengeStore.createIndex('user_id', 'user_id', { unique: false });
          console.log('Challenges store created');
        }

        // Créer la table trades
        if (!db.objectStoreNames.contains('trades')) {
          const tradeStore = db.createObjectStore('trades', { keyPath: 'id', autoIncrement: true });
          tradeStore.createIndex('user_id', 'user_id', { unique: false });
          tradeStore.createIndex('challenge_id', 'challenge_id', { unique: false });
          console.log('Trades store created');
        }

        // Créer la table user_sessions
        if (!db.objectStoreNames.contains('user_sessions')) {
          const sessionStore = db.createObjectStore('user_sessions', { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('user_id', 'user_id', { unique: false });
          console.log('User sessions store created');
        }

        // Créer la table challenge_history
        if (!db.objectStoreNames.contains('challenge_history')) {
          const historyStore = db.createObjectStore('challenge_history', { keyPath: 'id', autoIncrement: true });
          historyStore.createIndex('user_id', 'user_id', { unique: false });
          historyStore.createIndex('challenge_id', 'challenge_id', { unique: false });
          console.log('Challenge history store created');
        }

        // Créer la table user_preferences
        if (!db.objectStoreNames.contains('user_preferences')) {
          const prefStore = db.createObjectStore('user_preferences', { keyPath: 'id', autoIncrement: true });
          prefStore.createIndex('user_id', 'user_id', { unique: false });
          console.log('User preferences store created');
        }

        // Créer la table user_achievements
        if (!db.objectStoreNames.contains('user_achievements')) {
          const achievementStore = db.createObjectStore('user_achievements', { keyPath: 'id', autoIncrement: true });
          achievementStore.createIndex('user_id', 'user_id', { unique: false });
          console.log('User achievements store created');
        }

        console.log('Database schema created');
      };
    });
  }

  // Méthodes utilitaires pour accéder à la base de données
  private static async getObjectStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Opérations sur les utilisateurs
  static async addUser(userData: any): Promise<number> {
    const store = await this.getObjectStore('users', 'readwrite');
    const request = store.add(userData);
    
    return new Promise<number>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('User added successfully with id:', request.result);
        resolve(request.result as number);
      };
      request.onerror = () => {
        console.error('Error adding user:', request.error);
        reject(request.error);
      };
    });
  }

  static async getUserByEmail(email: string): Promise<any | null> {
    const store = await this.getObjectStore('users', 'readonly');
    const index = store.index('email');
    const request = index.get(email);
    
    return new Promise<any | null>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('User retrieved by email:', email, request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Error getting user by email:', request.error);
        reject(request.error);
      };
    });
  }

  static async getAllUsers(): Promise<any[]> {
    const store = await this.getObjectStore('users', 'readonly');
    const request = store.getAll();
    
    return new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('All users retrieved:', request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Error getting all users:', request.error);
        reject(request.error);
      };
    });
  }

  // Opérations sur les défis
  static async addChallenge(challengeData: any): Promise<number> {
    const store = await this.getObjectStore('challenges', 'readwrite');
    const request = store.add(challengeData);
    
    return new Promise<number>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Challenge added successfully with id:', request.result);
        resolve(request.result as number);
      };
      request.onerror = () => {
        console.error('Error adding challenge:', request.error);
        reject(request.error);
      };
    });
  }

  static async getChallengesByUserId(userId: number): Promise<any[]> {
    const store = await this.getObjectStore('challenges', 'readonly');
    const index = store.index('user_id');
    const request = index.getAll(IDBKeyRange.only(userId));
    
    return new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Challenges retrieved for user:', userId, request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Error getting challenges by user:', request.error);
        reject(request.error);
      };
    });
  }

  static async updateChallenge(challengeId: number, updates: any): Promise<boolean> {
    const store = await this.getObjectStore('challenges', 'readwrite');
    
    // Récupérer le challenge existant
    const getRequest = store.get(challengeId);
    
    return new Promise<boolean>((resolve, reject) => {
      getRequest.onsuccess = () => {
        const challenge = getRequest.result;
        if (!challenge) {
          console.log('Challenge not found:', challengeId);
          resolve(false);
          return;
        }
        
        // Mettre à jour avec les nouvelles données
        const updatedChallenge = { ...challenge, ...updates, updated_at: new Date() };
        
        const putRequest = store.put(updatedChallenge);
        putRequest.onsuccess = () => {
          console.log('Challenge updated successfully:', challengeId);
          resolve(true);
        };
        putRequest.onerror = () => {
          console.error('Error updating challenge:', putRequest.error);
          reject(putRequest.error);
        };
      };
      getRequest.onerror = () => {
        console.error('Error getting challenge for update:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  // Opérations sur les transactions
  static async addTrade(tradeData: any): Promise<number> {
    const store = await this.getObjectStore('trades', 'readwrite');
    const request = store.add(tradeData);
    
    return new Promise<number>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Trade added successfully with id:', request.result);
        resolve(request.result as number);
      };
      request.onerror = () => {
        console.error('Error adding trade:', request.error);
        reject(request.error);
      };
    });
  }

  static async getTradesByUserId(userId: number): Promise<any[]> {
    const store = await this.getObjectStore('trades', 'readonly');
    const index = store.index('user_id');
    const request = index.getAll(IDBKeyRange.only(userId));
    
    return new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Trades retrieved for user:', userId, request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Error getting trades by user:', request.error);
        reject(request.error);
      };
    });
  }

  static async getTradesByChallengeId(challengeId: number): Promise<any[]> {
    const store = await this.getObjectStore('trades', 'readonly');
    const index = store.index('challenge_id');
    const request = index.getAll(IDBKeyRange.only(challengeId));
    
    return new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Trades retrieved for challenge:', challengeId, request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Error getting trades by challenge:', request.error);
        reject(request.error);
      };
    });
  }
}