import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FrontendAuthService } from '../services/frontendAuthService';
import { UserDataService } from '../services/userDataService';
import { ChallengeStatus } from '../types';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
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

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: string;
  pnl?: number;
}

interface UserContextType {
  currentUser: User | null;
  user: User | null; // Alias pour currentUser
  activeChallenge: Challenge | null;
  allChallenges: Challenge[];
  trades: Trade[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveChallenge: (challenge: Challenge) => void;
  updateChallenge: (updates: Partial<Challenge>) => Promise<void>;
  addTrade: (trade: Trade) => void;
  executeTrade: (symbol: string, type: 'BUY' | 'SELL', price: number, quantity: number) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChallenge, setActiveChallengeState] = useState<Challenge | null>(null);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Récupérer l'utilisateur depuis le localStorage au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', parsedUser);
        setCurrentUser(parsedUser);
        
        // Charger les données spécifiques à l'utilisateur
        loadUserData(parsedUser.id);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  const loadUserData = async (userId: number) => {
    try {
      console.log('Loading data for user:', userId);
      
      // Charger les défis de l'utilisateur
      const userChallenges = await UserDataService.getUserChallenges(userId);
      console.log('Loaded challenges:', userChallenges);
      setAllChallenges(userChallenges);
      
      // Charger les transactions de l'utilisateur
      const userTrades = await UserDataService.getUserTrades(userId);
      console.log('Loaded trades:', userTrades);
      setTrades(userTrades);
      
      // Définir le défi actif s'il y en a un
      const active = userChallenges.find((challenge: Challenge) => challenge.status === 'active');
      if (active) {
        console.log('Setting active challenge:', active);
        setActiveChallengeState(active);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    
    // Vérifier avec le service d'authentification
    const result = await FrontendAuthService.login(email, password);
    
    console.log('Login result:', result);
    
    if (result.success && result.user) {
      console.log('Login successful, setting user:', result.user);
      setCurrentUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Charger les données spécifiques à l'utilisateur connecté
      await loadUserData(result.user.id);
      
      return true;
    } else {
      console.log('Login failed:', result.error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email);
      const response = await FrontendAuthService.register(username, email, password);
      
      if (response.success) {
        console.log('Registration successful, logging in user');
        const loginResult = await FrontendAuthService.login(email, password);
        
        if (loginResult.success && loginResult.user) {
          setCurrentUser(loginResult.user);
          localStorage.setItem('user', JSON.stringify(loginResult.user));
          await loadUserData(loginResult.user.id);
          return true;
        }
        
        return false;
      } else {
        console.log('Registration failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    // Effacer correctement toutes les données utilisateur
    setCurrentUser(null);
    setActiveChallengeState(null);
    setAllChallenges([]);
    setTrades([]);
    localStorage.removeItem('user');
  };

  const setActiveChallenge = (challenge: Challenge) => {
    console.log('Setting active challenge:', challenge);
    setActiveChallengeState(challenge);
    setAllChallenges(prev => {
      const exists = prev.some(c => c.id === challenge.id);
      if (exists) {
        return prev.map(c => (c.id === challenge.id ? challenge : c));
      }
      return [challenge, ...prev];
    });
  };

  const updateChallenge = async (updates: Partial<Challenge>) => {
    if (activeChallenge && currentUser) {
      try {
        console.log('Updating challenge:', activeChallenge.id, 'with:', updates);
        // Mettre à jour dans la base de données
        const success = await UserDataService.updateChallenge(activeChallenge.id, updates);
        
        if (success) {
          // Mettre à jour localement
          const updatedChallenge = {
            ...activeChallenge,
            ...updates
          };
          
          setActiveChallengeState(updatedChallenge);
          
          // Also update in the allChallenges array
          setAllChallenges(prev => prev.map(c => 
            c.id === updatedChallenge.id ? updatedChallenge : c
          ));
        }
      } catch (error) {
        console.error('Error updating challenge:', error);
        // Fallback to local state update
        if (activeChallenge) {
          const updatedChallenge = {
            ...activeChallenge,
            ...updates
          };
          setActiveChallengeState(updatedChallenge);
          
          // Also update in the allChallenges array
          setAllChallenges(prev => prev.map(c => 
            c.id === activeChallenge.id ? updatedChallenge : c
          ));
        }
      }
    }
  };

  const addTrade = async (trade: Trade) => {
    if (currentUser && activeChallenge) {
      try {
        console.log('Adding trade:', trade);
        // Ajouter à la base de données
        const success = await UserDataService.addTrade(currentUser.id, activeChallenge.id, trade);
        
        if (success) {
          // Mettre à jour localement
          setTrades(prev => [...prev, trade]);
        }
      } catch (error) {
        console.error('Error adding trade:', error);
        // Fallback to local state update
        setTrades(prev => [...prev, trade]);
      }
    }
  };

  const executeTrade = (symbol: string, type: 'BUY' | 'SELL', price: number, quantity: number) => {
    if (currentUser && activeChallenge) {
      const trade: Trade = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID unique
        symbol,
        type,
        price,
        quantity,
        timestamp: new Date().toISOString(),
        pnl: type === 'BUY' ? (Math.random() * 100 - 50) : (Math.random() * -100 + 50) // P&L simulé
      };
      
      addTrade(trade);
    }
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  const value: UserContextType = {
    currentUser,
    user: currentUser,  // Alias for currentUser
    activeChallenge,
    allChallenges, // Add all challenges to the context
    trades,
    login,
    register,
    logout,
    setActiveChallenge,
    updateChallenge,
    addTrade,
    executeTrade,
    isAdmin,
    isSuperAdmin
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
