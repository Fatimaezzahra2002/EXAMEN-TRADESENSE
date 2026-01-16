import { User } from '../models/UserModel';
import { IndexedDBService } from './indexedDBService';

export class AuthService {
  // Fonction de login qui interagit avec la base de données
  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log(`Attempting login for email: ${email}`);
      
      // Trouver l'utilisateur dans IndexedDB
      const user = await IndexedDBService.getUserByEmail(email);
      
      if (!user) {
        console.log(`No user found with email: ${email}`);
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Pour la simulation, on suppose que le mot de passe est "password"
      // En production, on utiliserait bcrypt.compare
      if (password === 'password') {
        // Mettre à jour le champ updated_at
        // Pour simplifier, on ne met pas à jour ici car on ne veut pas modifier l'utilisateur
        
        console.log(`Successfully logged in user: ${user.email}`);
        
        return { 
          success: true, 
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            password_hash: '',
            role: user.role,
            created_at: new Date(user.created_at),
            updated_at: new Date(user.updated_at || user.created_at)
          }
        };
      } else {
        console.log(`Invalid password for user: ${email}`);
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  }

  // Fonction d'enregistrement qui crée un nouvel utilisateur dans la base de données
  static async register(name: string, email: string, password: string): Promise<{ success: boolean; userId?: number; error?: string }> {
    try {
      console.log(`Attempting registration for email: ${email}`);
      
      // Vérifier si l'email existe déjà dans IndexedDB
      const existingUser = await IndexedDBService.getUserByEmail(email);
      
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }
      
      // Pour la simulation, on crée un hash de mot de passe factice
      // En production, on utiliserait bcrypt.hash
      const passwordHash = '$2b$10$abcdefghijklmnopqrstuvwxyz'; // Hash factice
      
      // Créer le nouvel utilisateur dans IndexedDB
      const userData = {
        email,
        name,
        password_hash: passwordHash,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const userId = await IndexedDBService.addUser(userData);
      
      console.log(`Successfully registered new user: ${email}, userId: ${userId}`);
      
      return { success: true, userId: userId };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration' };
    }
  }
}
